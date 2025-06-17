import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { api } from "../api/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api("/auth/register", "POST", { username, email, password });
      Alert.alert("Success", "Account created. Please log in.");
      navigation.replace("Login");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
