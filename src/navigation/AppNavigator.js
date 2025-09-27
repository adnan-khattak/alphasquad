import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/colors';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
