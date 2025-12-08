import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const AboutPage = () => {
    const [copied, setCopied] = useState(false);

    const esp32Code = `
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <FastLED.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

#define LED_PIN     5
#define NUM_LEDS    400 // 40x10 matrix
#define BRIGHTNESS  50
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];
WebSocketsServer webSocket = WebSocketsServer(81);

// --- Matrix Mapping (ZigZag) ---
// Adjust this function based on your physical wiring
int getPixelIndex(int x, int y) {
  if (y % 2 == 0) {
    // Even rows go left to right
    return y * 40 + x;
  } else {
    // Odd rows go right to left
    return y * 40 + (39 - x);
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      }
      break;
    case WStype_TEXT:
      {
        // Parse JSON
        DynamicJsonDocument doc(20000); // Adjust size as needed
        DeserializationError error = deserializeJson(doc, payload);

        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
          return;
        }

        const char* cmd = doc["cmd"];
        if (strcmp(cmd, "matrix") == 0) {
            int width = doc["matrixWidth"];
            int height = doc["matrixHeight"];
            int brightness = doc["brightness"];
            
            FastLED.setBrightness(brightness);

            JsonArray frames = doc["frames"];
            // For now, just take the first frame
            JsonObject frame = frames[0];
            const char* data = frame["data"]; // Array of strings? Or single string?
            // The app sends an array of strings (rows) inside the frame object? 
            // Actually, the app sends: frames: [{ data: ["row1", "row2"...] }]
            
            JsonArray rows = frame["data"];
            
            for (int y = 0; y < height; y++) {
                const char* rowHex = rows[y]; // "RRGGBB..." string? 
                // Wait, the app currently sends characters like 'R', 'G', 'B'.
                // We need to map these characters to CRGB colors.
                
                // If the app sends raw color chars:
                for (int x = 0; x < width; x++) {
                    char c = rowHex[x];
                    CRGB color = CRGB::Black;
                    switch(c) {
                        case 'R': color = CRGB::Red; break;
                        case 'G': color = CRGB::Green; break;
                        case 'B': color = CRGB::Blue; break;
                        case 'Y': color = CRGB::Yellow; break;
                        case 'C': color = CRGB::Cyan; break;
                        case 'M': color = CRGB::Magenta; break;
                        case 'W': color = CRGB::White; break;
                        case 'O': color = CRGB::Orange; break;
                        case 'P': color = CRGB::Pink; break; // Pink
                        case 'L': color = CRGB(144, 238, 144); break; // LightGreen
                        case '0': color = CRGB::Black; break;
                        default: color = CRGB::Black; break;
                    }
                    int idx = getPixelIndex(x, y);
                    if (idx < NUM_LEDS) leds[idx] = color;
                }
            }
            FastLED.show();
        }
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);

  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi. IP: ");
  Serial.println(WiFi.localIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(esp32Code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">About & Documentation</h2>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-white">How to Connect</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                    <li>Upload the code below to your ESP32.</li>
                    <li>Open the Serial Monitor to find the ESP32's IP address.</li>
                    <li>Go to the <strong>Connection</strong> page in this app.</li>
                    <li>Enter the IP address and Port (default 81).</li>
                    <li>Click <strong>Connect</strong>.</li>
                </ol>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">ESP32 Arduino Code</h3>
                    <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                </div>
                <div className="relative">
                    <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-sm font-mono text-green-400 border border-gray-800">
                        <code>{esp32Code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
