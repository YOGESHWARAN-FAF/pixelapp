
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Activity } from 'lucide-react';

const LogsPage = () => {
    const { logs, clearLogs, sendFrame } = useContext(AppContext);

    const handlePing = () => {
        sendFrame({
            cmd: "ping",
            message: "hello-from-web-app"
        });
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-bold text-white">Logs & Debug</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handlePing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
                    >
                        <Activity size={16} />
                        <span>Ping</span>
                    </button>
                    <button
                        onClick={clearLogs}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
                    >
                        <Trash2 size={16} />
                        <span>Clear</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs md:text-sm">
                    {logs.length === 0 && (
                        <div className="text-gray-500 text-center mt-10">No logs yet.</div>
                    )}
                    {logs.map((log) => (
                        <div key={log.id} className="flex space-x-2 border-b border-gray-800 pb-1 last:border-0">
                            <span className="text-gray-500 shrink-0">[{log.time}]</span>
                            <span className={`font-bold shrink-0 w-16 ${log.type === 'sent' ? 'text-blue-400' :
                                    log.type === 'received' ? 'text-green-400' :
                                        log.type === 'error' ? 'text-red-400' : 'text-gray-300'
                                }`}>
                                {log.type.toUpperCase()}
                            </span>
                            <span className="text-gray-300 break-all">{log.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogsPage;
