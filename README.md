# UFC Fight Club

A React Native/Expo application that allows users to make predictions for UFC fights and compete with others in a prediction challenge.

## Features

- View upcoming UFC events and fight cards
- Make predictions for fights
- Lock in predictions 2 minutes before each fight
- Track prediction accuracy and stats
- View leaderboards
- Real-time fight result updates

## Tech Stack

- React Native / Expo
- TypeScript
- Firebase (Authentication, Realtime Database)
- React Navigation
- AsyncStorage
- Date-fns

## Project Structure

```
src/
  components/     # Reusable UI components
  screens/        # Screen components
  services/       # API and data services
  contexts/       # React Context providers
  types/          # TypeScript type definitions
  utils/          # Helper functions
  hooks/          # Custom React hooks
  data/           # Static data and constants
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ufc-fight-club.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UFC for fight data
- Firebase for backend services
- React Native community for excellent tools and libraries 