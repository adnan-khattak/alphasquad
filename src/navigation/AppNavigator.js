import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/colors';

// Import screens
import BookListScreen from '../screens/BookListScreen';
import AddBookScreen from '../screens/AddBookScreen';
import UpdateProgressScreen from '../screens/UpdateProgressScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookList"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
