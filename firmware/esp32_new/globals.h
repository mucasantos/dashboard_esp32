#ifndef GLOBALS_H
#define GLOBALS_H

#include <ESPAsyncWebServer.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <ESP32Servo.h>

#include "models.h"

extern AsyncWebServer server;
extern AsyncWebSocket ws;
extern Adafruit_SSD1306 display;
extern DHT dht;
extern Servo myServo;

extern DeviceState deviceState;
extern unsigned long lastSensorRead;
extern unsigned long lastButtonTime;

#endif
