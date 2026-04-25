#include <Arduino.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

#include "actuators.h"
#include "config.h"
#include "globals.h"

void applyMotorSpeed(uint8_t percentage) {
  deviceState.motorSpeed = percentage;
  const uint8_t dutyCycle = map(percentage, 0, 100, 0, Config::PWM_MAX_DUTY);
  ledcWrite(Config::PWM_CHANNEL, dutyCycle);
}

void applyLedState(uint8_t pin, bool enabled) {
  digitalWrite(pin, enabled ? HIGH : LOW);
}

void initializePins() {
  pinMode(Config::LED1_PIN, OUTPUT);
  pinMode(Config::LED2_PIN, OUTPUT);
  pinMode(Config::BUTTON_PIN, INPUT_PULLUP);
  pinMode(Config::LDR_PIN, INPUT);
  pinMode(Config::NOISE_PIN, INPUT);

  ledcSetup(Config::PWM_CHANNEL, Config::PWM_FREQUENCY, Config::PWM_RESOLUTION);
  ledcAttachPin(Config::MOTOR_PWM_PIN, Config::PWM_CHANNEL);

  applyLedState(Config::LED1_PIN, false);
  applyLedState(Config::LED2_PIN, false);
  applyMotorSpeed(0);
}

void initializeActuators() {
  myServo.attach(Config::SERVO_PIN);
  myServo.write(deviceState.servoAngle);
}

void applyCommand(const JsonDocument& doc) {
  const char* action = doc["action"];
  const char* componentId = doc["componentId"];
  JsonVariant value = doc["value"];

  if (!action) {
    return;
  }

  if (strcmp(action, "SET_LED") == 0 && componentId) {
    const bool enabled = value.as<bool>();
    if (strcmp(componentId, "led1") == 0) {
      deviceState.led1 = enabled;
      applyLedState(Config::LED1_PIN, enabled);
    } else if (strcmp(componentId, "led2") == 0) {
      deviceState.led2 = enabled;
      applyLedState(Config::LED2_PIN, enabled);
    }
  } else if (strcmp(action, "SET_MOTOR") == 0) {
    const int requestedSpeed = constrain(value.as<int>(), 0, 100);
    applyMotorSpeed(static_cast<uint8_t>(requestedSpeed));
  } else if (strcmp(action, "SET_SERVO") == 0) {
    const int requestedAngle = constrain(value.as<int>(), 0, 180);
    deviceState.servoAngle = static_cast<uint8_t>(requestedAngle);
    myServo.write(deviceState.servoAngle);
  }
}
