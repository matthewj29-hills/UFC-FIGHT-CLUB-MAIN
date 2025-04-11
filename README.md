# UFC Fight Club

A React Native mobile app for UFC fans to predict fight outcomes and compete with friends. The app features a lock-in system where predictions must be made before the event starts.

## Current Status

The app is currently in progress and still needs much work. As of now we have a roughly implemented the following features:

- User authentication and profiles
- Event and fight card displays
- Basic prediction system
- Admin dashboard for managing events and users
- Real-time updates for fight results

## Tech Stack

- React Native with TypeScript
- Expo for development and building
- Firebase for backend services
- Redux for state management

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Windows)

### Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/ufc-fight-club.git
cd ufc-fight-club
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your Firebase credentials.

4. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/       # Screen components
│   ├── admin/     # Admin screens
│   ├── auth/      # Authentication screens
│   └── main/      # Main app screens
├── services/      # API and Firebase services
├── types/         # TypeScript interfaces
└── utils/         # Helper functions
```

## Features

### User Features
- View upcoming UFC events
- Make fight predictions
- Track prediction history
- View leaderboards
- Manage profile

### Admin Features
- Manage events and fights
- Update fight results
- Manage users
- Configure system settings

## Next Steps

- Implement real-time updates for fight results
- Add social features (friends, chat)
- Enhance prediction system with confidence levels
- Add more detailed fighter statistics
- Implement push notifications


