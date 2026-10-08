# 🛍️ E-Commerce - Expo E-Commerce Mobile App

### AppCenter builds

> A modern, cross-platform e-commerce mobile application built with React Native, Expo, and TypeScript. Features seamless product browsing, persistent cart management, state-driven checkout flows, and automated CI/CD via EAS.

---

### Dev Tools

| Tool           | Version          |
| -------------- | ---------------- |
| expo           | ~53.0.0          |
| react-native   | 0.79.6           |
| nodejs         | >=25.2.1         |
| vite           | ^8.1.0           |
| express        | ^5.2.1           |

### Dev Quick Start

```
$ make setup

$ npx expo prebuild --clean

# ios
$ npx expo run:ios

# android
$ npx expo run:android
```

### Test

```
$ make ci
```

## ✨ Features

- **📂 Product Discovery:** Categorized listings, search filtering, and high-resolution image galleries.
- **🛒 Persistent Cart Management:** Add/remove items, update quantities, and calculate totals in real-time with local storage fallback.
- **💳 Secure Checkout:** Payment sheet integration supporting Credit Cards and Apple Pay / Google Pay.
- **👤 User Authentication:** Secure login, user registration, and order history tracking.
- **🤖 AI Agent:** E-commerce customer service AI assistant to improve shopping experience.

---

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) (Managed Workflow / Expo Router)
- **Language:** TypeScript
- **Authentication:** Clerk
- **User synchronize:** Inngest
- **REST API:** Node.js + Express
- **State Management:**  React Query
- **Styling:** NativeWind (Tailwind CSS)
- **Payments:** Stripe SDK for React Native
- **Storage:** MongoDB
- **CI/CD:** GitHub Actions & Expo Application Services (EAS)
- **monitoring & error tracking:** Sentry
- **PR Analysis:** CodeRabbit

---

| ENV        | Endpoint                                       |
| ---------- | ---------------------------------------------- |
| dev        | http://localhost:3000/api                      |
| staging    | http://localhost:3000/api                      |
| production | https://expo-e-commerce-1tspv.sevalla.app/api  |

---

## 🚀 CI/CD 4 BUILD PIPELINE
Automated build, test, and deployment workflows are managed via **GitHub Actions** and **Expo Application Services (EAS)**.

### Pipeline Overview

| Workflow | Triggers | Target / Action | Key Steps |
| :--- | :--- | :--- | :--- |
| **Continuous Integration (CI)** | `push` or `pull_request` to `main` | Quality & Test Checks | `make setup` → `make ci` |
| **Staging Deployment (CD)** | Tag `staging-v*` or `workflow_dispatch` | EAS Staging Build | `eas build --profile staging --auto-submit` |
| **Production Deployment (CD)** | `push` to `release` or `workflow_dispatch` | Store Submission (iOS / Android) | `eas build --profile production --auto-submit` |

---

# Staging Build
npx eas build --platform all --profile staging

# Production Store Build & Auto-Submit
npx eas build --platform all --profile production --auto-submit