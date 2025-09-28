import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

// Import screens
import BookListScreen from '../screens/BookListScreen';
import AddBookScreen from '../screens/AddBookScreen';
import UpdateProgressScreen from '../screens/UpdateProgressScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookList"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="AddBook"
          component={AddBookScreen}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="UpdateProgress"
          component={UpdateProgressScreen}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
