# Rental App

A modern mobile application for renting vehicles and properties, built with React Native and Expo.

## Features

- 🏠 Apartment Rentals
- 🚗 Car Rentals
- 🏍️ Bike Rentals
- 📱 Modern UI/UX
- 🔍 Search and Filter
- 📞 Direct Contact with Owners
- 📱 Responsive Design

## Tech Stack

- React Native
- Expo
- TypeScript
- Firebase (Authentication)
- React Navigation
- Expo Router

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd rental-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

### Building for Production

To build an APK for Android:

```bash
eas build --platform android --profile preview
```

## Project Structure

```
rental-app/
├── app/                 # Main application code
│   ├── (auth)/         # Authentication screens
│   ├── (tabs)/         # Main tab navigation
│   ├── apartment/      # Apartment related screens
│   ├── bike/           # Bike related screens
│   ├── car/            # Car related screens
│   └── profile/        # Profile management
├── assets/             # Static assets
├── components/         # Reusable components
├── constants/          # App constants
├── data/              # Mock data
├── hooks/             # Custom hooks
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Features in Detail

### Vehicle Rentals
- Detailed vehicle listings
- Specifications and pricing
- Direct contact with owners
- Booking functionality

### Apartment Rentals
- Property listings with images
- Location and amenities
- Contact information
- Booking system

### User Features
- Profile management
- Authentication
- Search and filters
- Favorites system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact [your-email@example.com]
