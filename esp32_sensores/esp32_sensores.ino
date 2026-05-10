/*
 * =====================================================
 *  ESP32 - Simulador de Sensores Fisiológicos
 *  Para usar no Wokwi (VS Code) + Railway bridge
 * =====================================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// ─── WiFi (rede simulada do Wokwi) ───────────────────
const char* WIFI_SSID     = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// ─── Bridge no Railway ────────────────────────────────
// ⚠️  Substitui pelo teu URL depois do deploy no Railway
// Exemplo: "bridge-production-abc1.up.railway.app"
const char* BRIDGE_HOST = "SEU-BRIDGE.up.railway.app";
const int   BRIDGE_PORT = 443;   // WSS (HTTPS) no Railway
const char* BRIDGE_PATH = "/esp32";

#define PIN_PULSE 34
#define PIN_EDA   35

WebSocketsClient ws;
bool wsConnected = false;
unsigned long lastSend = 0;
const unsigned long SEND_INTERVAL = 2000;

float simStress   = 30.0;
float simHR       = 75.0;
float simEDA      = 1.0;
float stressDelta = 0.5;

struct SensorReading {
  int   heartRate;
  float eda;
  int   stressIndex;
  long  timestamp;
};

SensorReading readSensors() {
  simStress += stressDelta + (random(-10, 10) / 10.0);
  if (simStress >= 85.0 || simStress <= 10.0) stressDelta *= -1;
  simStress = constrain(simStress, 5.0, 95.0);

  float targetHR = 60.0 + (simStress * 0.5) + random(-5, 5);
  simHR = simHR * 0.8 + targetHR * 0.2;

  float targetEDA = 0.3 + (simStress / 100.0) * 3.5 + (random(-20, 20) / 100.0);
  simEDA = simEDA * 0.7 + targetEDA * 0.3;

  SensorReading r;
  r.heartRate   = (int)round(simHR);
  r.eda         = round(simEDA * 100.0) / 100.0;
  r.stressIndex = (int)round(simStress);
  r.timestamp   = millis();
  return r;
}

void onWsEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      wsConnected = false;
      Serial.println("[WS] Desconectado. A reconectar...");
      break;
    case WStype_CONNECTED:
      wsConnected = true;
      Serial.printf("[WS] Conectado a wss://%s%s\n", BRIDGE_HOST, BRIDGE_PATH);
      ws.sendTXT("{\"type\":\"hello\",\"device\":\"esp32_wokwi\"}");
      break;
    case WStype_TEXT:
      Serial.printf("[WS] Recebido: %s\n", payload);
      break;
    case WStype_ERROR:
      Serial.println("[WS] Erro WebSocket");
      break;
    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n=== ESP32 Sensor Bridge (Railway) ===");

  analogReadResolution(12);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nWiFi OK! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\nFalhou WiFi.");
  }

  // WSS (porta 443) para Railway
  ws.beginSSL(BRIDGE_HOST, BRIDGE_PORT, BRIDGE_PATH);
  ws.onEvent(onWsEvent);
  ws.setReconnectInterval(3000);

  Serial.println("Sistema pronto!");
}

void loop() {
  ws.loop();

  unsigned long now = millis();
  if (now - lastSend >= SEND_INTERVAL) {
    lastSend = now;
    SensorReading r = readSensors();

    StaticJsonDocument<128> doc;
    doc["heart_rate"]   = r.heartRate;
    doc["eda"]          = r.eda;
    doc["stress_index"] = r.stressIndex;
    doc["timestamp"]    = r.timestamp;

    String jsonStr;
    serializeJson(doc, jsonStr);

    if (wsConnected) {
      ws.sendTXT(jsonStr);
      Serial.printf("[SEND] %s\n", jsonStr.c_str());
    } else {
      Serial.printf("[SEM WS] %s\n", jsonStr.c_str());
    }
  }
}
