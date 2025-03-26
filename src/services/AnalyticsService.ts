import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Analytics Events
  public async logEvent(eventName: string, params?: { [key: string]: any }): Promise<void> {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
  }

  public async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Error logging screen view:', error);
    }
  }

  public async logPrediction(
    fightId: string,
    userId: string,
    prediction: string,
    method: string
  ): Promise<void> {
    try {
      await analytics().logEvent('make_prediction', {
        fight_id: fightId,
        user_id: userId,
        prediction,
        method,
      });
    } catch (error) {
      console.error('Error logging prediction:', error);
    }
  }

  public async logLogin(method: string): Promise<void> {
    try {
      await analytics().logEvent('login', { method });
    } catch (error) {
      console.error('Error logging login:', error);
    }
  }

  public async logSignUp(method: string): Promise<void> {
    try {
      await analytics().logEvent('sign_up', { method });
    } catch (error) {
      console.error('Error logging sign up:', error);
    }
  }

  // Crashlytics
  public async logError(error: Error): Promise<void> {
    try {
      await crashlytics().recordError(error);
    } catch (err) {
      console.error('Error logging to crashlytics:', err);
    }
  }

  public async setUserProperties(userId: string, username: string): Promise<void> {
    try {
      await crashlytics().setUserId(userId);
      await crashlytics().setAttributes({
        username,
      });
      await analytics().setUserProperty('username', username);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  public async logMessage(message: string): Promise<void> {
    try {
      await crashlytics().log(message);
    } catch (error) {
      console.error('Error logging message to crashlytics:', error);
    }
  }
}

export default AnalyticsService; 