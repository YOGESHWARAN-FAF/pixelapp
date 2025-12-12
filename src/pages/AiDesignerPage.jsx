import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Save, Trash2, Play, Square } from 'lucide-react';
import MatrixCanvas from '../components/MatrixCanvas';
import { createEmptyMatrix } from '../utils/matrixUtils';

const MODELS = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
];

const AiDesignerPage = () => {
    const {
        matrixWidth, matrixHeight,
        addCustomPattern, customPatterns, deleteCustomPattern,
        startAnimation, stopAnimation, isSending, animationMode,
        updateMatrix
    } = useContext(AppContext);

    const [apiKey, setApiKey] = useState(() => localStorage.getItem('openRouterApiKey') || '');
    const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedMatrix, setGeneratedMatrix] = useState(null);
    const [patternName, setPatternName] = useState('');
    const [error, setError] = useState('');

    const handleSaveKey = () => {
        localStorage.setItem('openRouterApiKey', apiKey);
        alert('API Key saved!');
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            setError('Please enter your OpenRouter API Key first.');
            return;
        }
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }

        setIsGenerating(true);
        setError('');
        setGeneratedMatrix(null);
        stopAnimation();

        try {
            const systemPrompt = `
You are a pixel art generator for a ${matrixWidth}x${matrixHeight} LED matrix.
Return ONLY a JSON object with a property "matrix" containing an array of ${matrixHeight} strings.
Each string must be exactly ${matrixWidth} characters long.
Use these characters for colors:
'0': Black/Off
'R': Red
'G': Green
'B': Blue
'Y': Yellow
'C': Cyan
'M': Magenta
'W': White
'O': Orange
'P': Pink
'L': Light Green

Example output for 5x5:
{
  "matrix": [
    "00R00",
    "0R0R0",
    "R000R",
    "0R0R0",
    "00R00"
  ]
}
Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
`;

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": window.location.origin, // Site URL for rankings on openrouter.ai.
                    "X-Title": "Pixel Matrix App", // Site title for rankings on openrouter.ai.
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": selectedModel,
                    "messages": [
                        { "role": "system", "content": systemPrompt },
                        { "role": "user", "content": prompt }
                    ],
                    "stream": false
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'Failed to fetch from OpenRouter');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Clean up markdown if present
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonStr);

            if (result.matrix && Array.isArray(result.matrix)) {
                // Validate dimensions
                if (result.matrix.length !== matrixHeight || result.matrix[0].length !== matrixWidth) {
                    // Dimensions mismatch handling could go here
                }
                setGeneratedMatrix(result.matrix);
                updateMatrix(result.matrix);
            } else {
                throw new Error('Invalid response format from AI');
            }

        } catch (err) {
            console.error(err);
            setError('Generation failed: ' + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSavePattern = () => {
        if (!patternName) {
            setError('Please enter a name for the pattern.');
            return;
        }
        if (!generatedMatrix) return;

        addCustomPattern(patternName, generatedMatrix);
        setPatternName('');
        alert('Pattern saved! You can now find it in the Design page.');
    };

    const handlePreview = () => {
        if (generatedMatrix) {
            // Just show it
            updateMatrix(generatedMatrix);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                AI Designer (OpenRouter)
            </h2>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">OpenRouter API Key</label>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-or-..."
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={handleSaveKey}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            Save
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Key is stored locally. Get one at <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">openrouter.ai</a>.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Select Model</label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                    >
                        {MODELS.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                        <option value="custom">Custom Model ID...</option>
                    </select>
                    {selectedModel === 'custom' && (
                        <input
                            type="text"
                            placeholder="Enter model ID (e.g. openai/gpt-4)"
                            className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none"
                            onChange={(e) => setSelectedModel(e.target.value)}
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Describe your design</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., A pixel art sunset with a palm tree, or a spooky ghost face"
                        className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Generate Design
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {generatedMatrix && (
                <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-white">Preview</h3>
                    <MatrixCanvas />

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Save Pattern As</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={patternName}
                                    onChange={(e) => setPatternName(e.target.value)}
                                    placeholder="Pattern Name"
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    onClick={handleSavePattern}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {Object.keys(customPatterns).length > 0 && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Your Saved Patterns</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.keys(customPatterns).map(name => (
                            <div key={name} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                                <span className="text-white font-medium">{name}</span>
                                <button
                                    onClick={() => {
                                        if (confirm(`Delete pattern "${name}"?`)) deleteCustomPattern(name);
                                    }}
                                    className="text-red-400 hover:text-red-300 p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiDesignerPage;
