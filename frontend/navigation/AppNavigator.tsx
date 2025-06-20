import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import LoginScreen from '../components/LoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import NotesListScreen from '../components/NotesListScreen';
import NoteDetailScreen from '../components/NoteDetailScreen';
import NoteFormScreen from '../components/NoteFormScreen';

// Define the param list for each screen
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Notes: { token: string };
  NoteDetail: { noteId: string; token: string };
  EditNote: { note?: any; token: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Customize the navigation theme so the background stays dark
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212',
  },
};

// Common header styles for all authenticated screens
const commonOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#121212',      
  },
  headerTintColor: '#5A4FCF', 
  headerTitleStyle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={commonOptions}
      >
        {/* Full‐screen, no header for login/register */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Notes"
          component={NotesListScreen}
          options={{ title: 'My Notes' }}
        />
        <Stack.Screen
          name="NoteDetail"
          component={NoteDetailScreen}
          options={{ title: 'Note Details' }}
        />
        <Stack.Screen
          name="EditNote"
          component={NoteFormScreen}
          options={({ route }) => ({
            title: route.params.note ? 'Edit Note' : 'Add Note',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}