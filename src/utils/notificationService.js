import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_STORAGE_KEY = '@reading_tracker_notifications';
const NOTIFICATION_ID = 'daily_reading_reminder';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  // Request notification permissions
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Save permission status
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({
        permissionGranted: true,
        notificationScheduled: false,
      }));

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  // Check if permissions are granted
  async checkPermissions() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  },

  // Schedule daily reminder notification
  async scheduleDailyReminder() {
    try {
      // Check permissions first
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log('Notification permissions not granted');
        return false;
      }

      // Cancel existing notification
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);

      // Schedule new daily notification at 8 PM
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: '📚 Reading Time!',
          body: "Don't forget to update your reading progress!",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: 20, // 8 PM
          minute: 0,
          repeats: true,
        },
      });

      // Update storage
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({
        permissionGranted: true,
        notificationScheduled: true,
      }));

      console.log('Daily reading reminder scheduled for 8 PM');
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  },

  // Cancel daily reminder
  async cancelDailyReminder() {
    try {
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
      
      // Update storage
      const notificationData = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (notificationData) {
        const data = JSON.parse(notificationData);
        data.notificationScheduled = false;
        await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(data));
      }

      console.log('Daily reading reminder cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling notification:', error);
      return false;
    }
  },

  // Check if notification is scheduled
  async isNotificationScheduled() {
    try {
      const notificationData = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (notificationData) {
        const data = JSON.parse(notificationData);
        return data.notificationScheduled === true;
      }
      return false;
    } catch (error) {
      console.error('Error checking notification status:', error);
      return false;
    }
  },

  // Get notification settings
  async getNotificationSettings() {
    try {
      const notificationData = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (notificationData) {
        return JSON.parse(notificationData);
      }
      return {
        permissionGranted: false,
        notificationScheduled: false,
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        permissionGranted: false,
        notificationScheduled: false,
      };
    }
  },

  // Send immediate notification (for testing)
  async sendTestNotification() {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📚 Test Notification',
          body: 'This is a test notification for Reading Tracker!',
          sound: true,
        },
        trigger: null, // Send immediately
      });

      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  },

  // Initialize notification service (call on app start)
  async initialize() {
    try {
      const settings = await this.getNotificationSettings();
      
      if (settings.permissionGranted && settings.notificationScheduled) {
        // Re-schedule notification if it was previously enabled
        await this.scheduleDailyReminder();
      }

      return settings;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return {
        permissionGranted: false,
        notificationScheduled: false,
      };
    }
  }
};
