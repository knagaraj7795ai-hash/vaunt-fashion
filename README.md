# VAUNT Fashion

A full-featured fashion e-commerce mobile application built with Expo (React Native). Shop the latest trends with a premium, minimal design experience.

![VAUNT Fashion](https://via.placeholder.com/800x400/0F172A/FFFFFF?text=VAUNT+Fashion)

## Features

- **Product Discovery** - Hero banners, category browsing, deal countdowns
- **Product Listing** - Multi-facet filtering, sorting, search
- **Product Details** - Image carousel, size/color selection, reviews
- **Cart & Checkout** - Coupon support, price breakdown
- **Orders** - Order history, tracking with timeline UI
- **User Account** - Profile, addresses, wishlist, notifications
- **Guest Mode** - Browse without signing in

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Expo SDK 57 | Core framework |
| React Native 0.86 | Mobile UI |
| TypeScript 6.0 | Type safety |
| React Navigation 7 | Navigation |
| Expo Image | Optimized images |
| AsyncStorage | Local persistence |

## Project Structure

```
vaunt-fashion/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Header, Button, Badge, etc.
│   │   ├── home/          # Banner, Category, Deals
│   │   ├── product/       # ProductCard, Carousel
│   │   ├── cart/          # CartItem, PriceBreakdown
│   │   └── order/         # OrderCard, Tracking
│   ├── screens/           # 19 screen components
│   ├── context/           # 7 React Context providers
│   ├── services/          # Service layer (mock data)
│   ├── data/              # JSON mock data files
│   ├── types/             # TypeScript definitions
│   └── constants/         # Theme & route names
├── assets/                # Icons, splash screens
├── app.json               # Expo configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Clone the repository
git clone https://github.com/knagaraj7795ai-hash/vaunt-fashion.git

# Navigate to project
cd vaunt-fashion

# Install dependencies
npm install
```

### Run the App

```bash
# Start Expo development server
npx expo start
```

Scan the QR code with Expo Go on your phone.

### Run on Specific Platform

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

## Build APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

Download the APK from the provided link after build completes.

## Mock Data

All data is local/mock - no backend required. Products, reviews, banners, categories, brands, users, addresses, orders, coupons, and notifications are stored as JSON files in `src/data/`.

## License

MIT
