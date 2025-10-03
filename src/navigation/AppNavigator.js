import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/AuthGuard';

// Import screens
import BookListScreen from '../screens/BookListScreen';
import AddBookScreen from '../screens/AddBookScreen';
import UpdateProgressScreen from '../screens/UpdateProgressScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BookSearchScreen from '../screens/BookSearchScreen';
import ReadScreen from '../screens/ReadScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <AuthGuard>
        <Stack.Navigator
          initialRouteName={user ? "BookList" : "Login"}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.background },
            gestureEnabled: true,
          }}
        >
          {user ? (
            // Authenticated screens
            <>
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
              <Stack.Screen
                name="BookSearch"
                component={BookSearchScreen}
                options={{
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="Read"
                component={ReadScreen}
                options={{
                  gestureEnabled: true,
                }}
              />
            </>
          ) : (
            // Authentication screens
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  gestureEnabled: true,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </AuthGuard>
    </NavigationContainer>
  );
};

export default AppNavigator;
