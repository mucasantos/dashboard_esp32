# ESP32 IoT Dashboard

Real-time IoT dashboard that combines **ESP32 firmware**, a **React + TypeScript frontend**, and **bidirectional WebSocket communication** for environmental monitoring and actuator control.

This repository is part of my portfolio as a software engineer with hands-on experience across **mobile development**, **IoT**, **frontend**, and **backend-connected products**. My main professional focus is **Flutter**, but this project highlights the kind of cross-functional work I enjoy most: bridging embedded devices, responsive interfaces, and product-oriented telemetry experiences.

## Why this project matters

This project demonstrates practical experience with:

- Real-time telemetry streaming from embedded hardware to a web UI
- Bidirectional control flow between dashboard and device
- Sensor integration on ESP32
- Hardware feedback through OLED/LCD
- Type-safe frontend development with React and TypeScript
- Product thinking: simulation mode, live charts, mobile-first UI refinement, and optional AI summarization

## Project Positioning

The core value of this project is:

- **ESP32 device integration**
- **Live telemetry visualization**
- **Remote actuator control**
- **Clear UX for real-time monitoring**

The AI layer is intentionally presented as an **optional enhancement**, not the central purpose of the system. The main story of the project is still embedded communication, dashboard design, and device control.

## Demo Scope

The system monitors and controls:

- Temperature and humidity via `DHT11`
- Ambient light via `LDR`
- Noise intensity via `FC-04`
- Two LEDs
- One PWM motor output
- One servo motor

It supports two dashboard modes:

- `Simulation mode` for UI development and demos without hardware
- `Real device mode` for live communication with the ESP32 over WebSocket

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Recharts
- Lucide React

### Firmware

- ESP32
- Arduino framework
- ESPAsyncWebServer
- AsyncTCP
- ArduinoJson
- DHT
- ESP32Servo
- Adafruit SSD1306 / GFX

## Architecture Overview

### Frontend responsibilities

- Display live sensor cards and historical charts
- Handle connection state between simulation and real device
- Send actuator commands to the ESP32
- Maintain recent telemetry history for visual monitoring
- Offer an optional AI-generated summary of the current telemetry snapshot

### Firmware responsibilities

- Read sensors periodically
- Convert raw analog values into UI-friendly telemetry
- Expose a WebSocket endpoint at `/ws`
- Receive commands and update physical actuators
- Render status and key metrics on the local display

## Project Structure

```text
esp32_react_dash/
├── App.tsx
├── components/
│   ├── AiInsights.tsx
│   ├── ControlPanel.tsx
│   └── SensorCard.tsx
├── domain/
│   └── dashboard.ts
├── hooks/
│   └── useDashboard.ts
├── infrastructure/
│   ├── simulation/
│   │   └── sensorSimulator.ts
│   └── ws/
│       └── deviceWebSocket.ts
├── services/
│   └── geminiService.ts
├── firmware/
│   ├── esp32_main/
│   │   └── esp32_main.ino
│   └── esp32_new/
│       ├── esp32_new.ino
│       ├── actuators.cpp
│       ├── actuators.h
│       ├── config.h
│       ├── connectivity.cpp
│       ├── connectivity.h
│       ├── display_manager.cpp
│       ├── display_manager.h
│       ├── globals.cpp
│       ├── globals.h
│       ├── models.h
│       ├── secrets.example.h
│       ├── telemetry.cpp
│       └── telemetry.h
├── .env.example
├── types.ts
├── index.css
├── index.tsx
├── vite.config.ts
└── README.md
```

## Hardware Mapping

| Component | GPIO |
|---|---:|
| LED 1 | 2 |
| LED 2 | 4 |
| Motor PWM | 5 |
| Servo | 18 |
| DHT11 | 15 |
| LDR | 34 |
| FC-04 Sound Sensor | 32 |
| Wi-Fi Button | 0 |
| OLED SDA | 21 |
| OLED SCL | 22 |

## How to run the frontend

### Requirements

- Node.js 20+
- npm

### Steps

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the example and add your Gemini key only if you want AI analysis:

```bash
cp .env.example .env
```

3. Start the dashboard:

```bash
npm run dev
```

4. Open the local Vite URL shown in the terminal.

5. Choose:

- `Simulation` to explore the UI without the board
- `Real Device` to connect to the ESP32 WebSocket endpoint, for example `ws://192.168.x.x/ws`

### Production build

```bash
npm run build
```

## Deploying to Vercel

This dashboard is a good fit for **Vercel deployment** as a public portfolio demo.

Recommended public positioning:

- `Simulation mode` is the primary demo experience
- `Real device mode` is available when connected to the same local network as the ESP32

### Vercel notes

- The project is configured as a Vite app through [vercel.json](/Volumes/Dados/projects/iot/esp32_react_dash/vercel.json:1)
- If you want the AI summary feature enabled in production, add `VITE_GEMINI_API_KEY` in the Vercel environment variables
- If you do not configure the API key, the dashboard still works normally and the AI section will behave as an optional disabled enhancement

### Recommended deploy steps

1. Import the repository into Vercel.
2. Keep the detected framework as `Vite`.
3. Optionally add `VITE_GEMINI_API_KEY`.
4. Deploy and use the public URL as your live portfolio demo.

## How to run the firmware

1. Open `firmware/esp32_new/esp32_new.ino` in Arduino IDE.
2. Install the required libraries listed in this README.
3. Copy `firmware/esp32_new/secrets.example.h` to `firmware/esp32_new/secrets.h`.
4. Add your local Wi-Fi credentials in `secrets.h`.
5. Flash the firmware to your ESP32 board.
6. Read the assigned IP from Serial Monitor or the OLED display.
7. Use that IP in the React dashboard WebSocket field.

### Firmware module layout

- `esp32_new.ino`: application entry point with `setup()` and `loop()`
- `config.h`: GPIO, timing, display, and PWM constants
- `models.h`: shared device and telemetry structs
- `globals.*`: hardware singletons and shared runtime state
- `actuators.*`: LEDs, motor PWM, servo, and incoming command handling
- `telemetry.*`: sensor reading, logging, and WebSocket payload generation
- `display_manager.*`: OLED rendering and status messages
- `connectivity.*`: Wi-Fi lifecycle, button handling, and WebSocket events

## Libraries validated in the project

- `ESP Async WebServer` 3.9.0
- `AsyncTCP` 3.4.9
- `ArduinoJson` 7.4.2
- `Adafruit SSD1306`
- `Adafruit GFX`
- `DHT sensor library`
- `ESP32Servo`

## Portfolio Highlights

This project reflects the kind of engineering work I enjoy most:

- Shipping product-oriented experiences, not just demos
- Building usable interfaces on top of live device data
- Bridging firmware and product-facing software
- Working across mobile, frontend, backend, and edge devices
- Turning low-level telemetry into meaningful UX

Although my main professional focus is **mobile development with Flutter**, this repository shows that I can also contribute comfortably in **IoT systems**, **React dashboards**, **TypeScript frontend work**, and **backend-oriented integration flows**.

## Recruiter Keywords

Relevant areas represented in this project:

- Flutter
- Mobile Developer
- Mobile Engineer
- Cross-platform Development
- IoT
- ESP32
- Embedded Systems
- React
- TypeScript
- Frontend
- WebSocket
- Real-time Systems
- Dashboard Development
- Backend Integration
- Product Engineering

## Current Limitations

- AI analysis still runs directly from the frontend and should be proxied by a backend in production
- The firmware is cleaner and modular inside Arduino IDE constraints, but further testing on different boards and sensor combinations would still be valuable
- The frontend bundle is smaller than before but can still benefit from code splitting and lazy loading

## Next Improvements

- Add screenshots, wiring diagram, and short demo video/GIF
- Add tests for frontend data mapping, command serialization, and UI state transitions
- Add broader validation on physical hardware runs and actuator edge cases
- Add a backend or edge function to proxy AI requests securely
- Add automatic reconnection and richer device health reporting

## Author

Samuel Santos

Mobile developer focused on **Flutter**, with practical experience in **IoT integrations**, **frontend engineering**, and **backend-connected products**.

## License

MIT
# dashboard_esp32
