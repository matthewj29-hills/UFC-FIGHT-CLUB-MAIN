import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
      return true; // Android doesn't need explicit permission
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  public async getFCMToken(): Promise<string | null> {
    try {
      return await messaging().getToken();
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  public async saveFCMToken(userId: string, token: string): Promise<void> {
    try {
      const userTokensRef = doc(db, 'userTokens', userId);
      const tokenDoc = await getDoc(userTokensRef);

      if (tokenDoc.exists()) {
        const tokens = tokenDoc.data().tokens as string[];
        if (!tokens.includes(token)) {
          await setDoc(userTokensRef, {
            tokens: [...tokens, token],
          });
        }
      } else {
        await setDoc(userTokensRef, {
          tokens: [token],
        });
      }
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  public async removeFCMToken(userId: string, token: string): Promise<void> {
    try {
      const userTokensRef = doc(db, 'userTokens', userId);
      const tokenDoc = await getDoc(userTokensRef);

      if (tokenDoc.exists()) {
        const tokens = tokenDoc.data().tokens as string[];
        await setDoc(userTokensRef, {
          tokens: tokens.filter((t) => t !== token),
        });
      }
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  }

  public onMessage(callback: (message: any) => void): () => void {
    return messaging().onMessage(callback);
  }

  public onNotificationOpenedApp(callback: (message: any) => void): () => void {
    return messaging().onNotificationOpenedApp(callback);
  }

  public async getInitialNotification(): Promise<any> {
    return await messaging().getInitialNotification();
  }

  public async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  public async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }
}

export default NotificationService; 