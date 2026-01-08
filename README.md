# YourInfo 🔍

A privacy awareness mobile app that reveals what data applications can collect about you. Built with React Native and Expo, this app demonstrates the extent of your digital footprint through an engaging, modern interface.

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo)

## 🎬 Demo

<video src="apps/native/assets/yourinfo.mp4" controls width="300"></video>

## 📱 Overview

**YourInfo** is an educational app that shows users exactly what information mobile applications can access. It collects and displays:

- **Device Fingerprint** - A unique identifier generated from your device characteristics
- **Location Data** - Your precise GPS coordinates visualized on an interactive 3D globe
- **Device Information** - Model, brand, OS version, and physical device detection
- **Network Details** - Connection type and IP address
- **Battery Status** - Real-time battery level monitoring
- **Sensor Data** - Live accelerometer and gyroscope readings
- **Permissions Status** - What access the app has to your device

## ✨ Features

### 🌍 Interactive 3D Globe
An interactive Three.js-powered globe that displays your current location with:
- Smooth drag-to-rotate controls with momentum
- Pulsing location marker
- Glowing atmosphere effect
- Auto-rotation when idle

### 📊 Real-Time Sensor Visualization
Live data from your device's motion sensors:
- Accelerometer (X, Y, Z axes)
- Gyroscope readings
- Sensor availability detection (magnetometer, barometer, pedometer, device motion)

### 🔐 Permission Management
Detailed permission tracking with privacy risk indicators:
- Location (foreground & background)
- Motion sensors
- Risk level classification (Critical, High, Medium)

### 🎨 Modern UI/UX
- Dark theme with cyan and purple accents
- Smooth animations powered by Reanimated
- Blur effects and gradients
- Responsive card-based layout

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.81 with Expo 54 |
| Language | TypeScript 5 |
| 3D Graphics | Three.js via expo-three |
| Styling | TailwindCSS (uniwind) |
| Animations | React Native Reanimated |
| Navigation | Expo Router |
| UI Components | HeroUI Native |
| Build System | Turborepo |
| Package Manager | Bun |

## 📦 Project Structure

```
yourinfoapp/
├── apps/
│   └── native/              # React Native mobile app
│       ├── app/             # Expo Router screens
│       │   ├── index.tsx    # Home - device info & globe
│       │   ├── sensors.tsx  # Live sensor data
│       │   └── permissions.tsx # Permission management
│       ├── components/      # Reusable components
│       │   ├── globalView.tsx  # 3D globe component
│       │   ├── container.tsx   # Layout wrapper
│       │   └── ...
│       └── assets/          # Images (earth texture)
├── packages/
│   ├── config/              # Shared TypeScript config
│   ├── db/                  # Prisma database package
│   └── env/                 # Environment variables
└── turbo.json               # Turborepo configuration
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.16 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator / Android Emulator or physical device with [Expo Go](https://expo.dev/client)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yourinfoapp.git
   cd yourinfoapp
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run dev:native
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS Simulator / `a` for Android Emulator

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all applications |
| `bun run dev:native` | Start React Native/Expo dev server |
| `bun run build` | Build all applications |
| `bun run check-types` | TypeScript type checking |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run database migrations |

## 🔒 Privacy Note

This app is designed for **educational purposes** to raise awareness about data privacy. It demonstrates what information apps can potentially collect. The app does not store or transmit any collected data to external servers.

## 📄 License

MIT License - feel free to use this project for learning and awareness purposes.

---

<p align="center">
  <i>"We know more about you than you think..."</i>
</p>
