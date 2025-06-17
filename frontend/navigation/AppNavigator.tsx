import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";
import NotesListScreen from "../components/NotesListScreen";
import NoteDetailScreen from "../components/NoteDetailScreen";
import NoteFormScreen from "../components/NoteFormScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Notes: { token: string };
  NoteDetail: { noteId: string; token: string };
  EditNote: { note?: any; token: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  // This structure assumes token is passed between screens via params for simplicity.
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Notes" component={NotesListScreen} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
        <Stack.Screen name="EditNote" component={NoteFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
