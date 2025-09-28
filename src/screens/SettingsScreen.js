import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  // SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/dimensions';
import { NotificationService } from '../utils/notificationService';

const SettingsScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState({
    permissionGranted: false,
    notificationScheduled: false,
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const settings = await NotificationService.getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleNotificationToggle = async (enabled) => {
    try {
      if (enabled) {
        // Request permissions first
        const hasPermission = await NotificationService.requestPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive daily reminders.',
            [{ text: 'OK' }]
          );
          return;
        }

        // Schedule notification
        const success = await NotificationService.scheduleDailyReminder();
        if (success) {
          setNotificationSettings(prev => ({ ...prev, notificationScheduled: true }));
          Alert.alert('Success', 'Daily reading reminders enabled!');
        } else {
          Alert.alert('Error', 'Failed to enable notifications. Please try again.');
        }
      } else {
        // Cancel notification
        const success = await NotificationService.cancelDailyReminder();
        if (success) {
          setNotificationSettings(prev => ({ ...prev, notificationScheduled: false }));
          Alert.alert('Success', 'Daily reading reminders disabled.');
        } else {
          Alert.alert('Error', 'Failed to disable notifications. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const sendTestNotification = async () => {
    try {
      const success = await NotificationService.sendTestNotification();
      if (success) {
        Alert.alert('Success', 'Test notification sent!');
      } else {
        Alert.alert('Error', 'Failed to send test notification. Please check your notification permissions.');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    icon, 
    rightElement, 
    onPress,
    disabled = false 
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.textMuted,
          opacity: disabled ? 0.6 : 1,
        }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
          <Ionicons name={icon} size={20} color={colors.accent} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
    },
    backButton: {
      padding: SPACING.sm,
      marginLeft: -SPACING.sm,
    },
    headerTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: SPACING.xl,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SPACING.md,
      marginTop: SPACING.lg,
    },
    sectionTitleFirst: {
      marginTop: 0,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      marginBottom: SPACING.md,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '500',
      marginBottom: SPACING.xs,
    },
    settingSubtitle: {
      fontSize: FONT_SIZES.sm,
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      borderTopWidth: 1,
      borderTopColor: colors.textMuted,
      marginTop: SPACING.xl,
    },
    appName: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    appVersion: {
      fontSize: FONT_SIZES.sm,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Appearance */}
        <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Appearance</Text>
        <SettingItem
          title="Theme"
          subtitle={isDark ? "Dark mode" : "Light mode"}
          icon={isDark ? "moon" : "sunny"}
          rightElement={
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          }
          onPress={toggleTheme}
        />

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          title="Daily Reading Reminders"
          subtitle="Get reminded to read at 8 PM daily"
          icon="notifications"
          rightElement={
            <Switch
              value={notificationSettings.notificationScheduled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.textMuted, true: colors.accent }}
              thumbColor={colors.white}
            />
          }
        />
        
        {notificationSettings.notificationScheduled && (
          <SettingItem
            title="Send Test Notification"
            subtitle="Test if notifications are working"
            icon="send"
            rightElement={
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            }
            onPress={sendTestNotification}
          />
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Reading Tracker</Text>
          <Text style={styles.appVersion}>Version 2.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
