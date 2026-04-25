#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

#if __has_include("secrets.h")
#include "secrets.h"
#else
#include "secrets.example.h"
#endif

#include "actuators.h"
#include "config.h"
#include "connectivity.h"
#include "display_manager.h"
#include "globals.h"
#include "telemetry.h"

namespace {
void handleWsMessage(
  AsyncWebSocket* serverRef,
  AsyncWebSocketClient* client,
  AwsEventType type,
  void* arg,
  uint8_t* data,
  size_t len
) {
  (void)serverRef;

  if (type == WS_EVT_DATA) {
    AwsFrameInfo* info = reinterpret_cast<AwsFrameInfo*>(arg);
    if (!(info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT)) {
      return;
    }

    String message(reinterpret_cast<char*>(data), len);
    DynamicJsonDocument doc(256);
    DeserializationError error = deserializeJson(doc, message);
    if (error) {
      Serial.printf("[WS] Invalid JSON: %s\n", error.c_str());
      return;
    }

    applyCommand(doc);
    publishLatestTelemetry();
  } else if (type == WS_EVT_CONNECT) {
    Serial.printf("[WS] Client %u connected\n", client->id());
    deviceState.clientConnected = true;
  } else if (type == WS_EVT_DISCONNECT) {
    Serial.printf("[WS] Client %u disconnected\n", client->id());
    deviceState.clientConnected = false;
  }
}
}

void connectWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void ensureWifiConnection() {
  if (deviceState.wifiEnabled && WiFi.status() != WL_CONNECTED) {
    WiFi.reconnect();
  }
}

void handleWifiToggleButton() {
  const int buttonState = digitalRead(Config::BUTTON_PIN);
  if (buttonState != LOW || (millis() - lastButtonTime) <= Config::BUTTON_DEBOUNCE_MS) {
    return;
  }

  lastButtonTime = millis();
  deviceState.wifiEnabled = !deviceState.wifiEnabled;

  if (deviceState.wifiEnabled) {
    showStatus("Wi-Fi Enabling");
    connectWifi();
  } else {
    WiFi.disconnect(true);
    showStatus("Wi-Fi Disabled");
  }
}

void initializeConnectivity() {
  connectWifi();
  ws.onEvent(handleWsMessage);
  server.addHandler(&ws);
  server.begin();
}
