#ifndef CONFIG_H
#define CONFIG_H

#include <stdint.h>
#include <DHT.h>

namespace Config {
const uint8_t LED1_PIN = 2;
const uint8_t LED2_PIN = 4;
const uint8_t MOTOR_PWM_PIN = 5;
const uint8_t SERVO_PIN = 18;
const uint8_t BUTTON_PIN = 0;
const uint8_t NOISE_PIN = 32;
const uint8_t DHT_PIN = 15;
const uint8_t LDR_PIN = 34;
const uint8_t I2C_SDA = 21;
const uint8_t I2C_SCL = 22;

const uint8_t DHT_TYPE = DHT11;
const unsigned long BUTTON_DEBOUNCE_MS = 50;
const unsigned long SENSOR_INTERVAL_MS = 2000;
const unsigned long NOISE_SAMPLE_WINDOW_MS = 50;

const int SCREEN_WIDTH = 128;
const int SCREEN_HEIGHT = 64;
const int OLED_RESET = -1;
const uint8_t OLED_ADDRESS = 0x3C;

const uint8_t PWM_CHANNEL = 0;
const uint16_t PWM_FREQUENCY = 5000;
const uint8_t PWM_RESOLUTION = 8;
const uint8_t PWM_MAX_DUTY = 255;
}

#endif
