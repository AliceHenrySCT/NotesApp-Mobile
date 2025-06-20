import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/AppNavigator';
import styles from './styles';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
  route: RouteProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  // Local state for form inputs and loading indicator
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Called when "Register" button pressed
  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Validation', 'Please enter username, email, and password');
    }
    setLoading(true);

    try {
      // 1) Register
      const res = await fetch('http://10.0.0.59:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch { data = {}; }

      if (!res.ok) {
        // Handle already existing username error
        if (data.error && data.error.includes('E11000')) {
          return Alert.alert(
            'Username Taken',
            'That username is already in use. Please choose another.'
          );
        }
        return Alert.alert(
          'Registration Failed',
          data.message || data.error || `HTTP ${res.status}`
        );
      }

      // 2) Immediately log in to get a valid JWT
      const loginRes = await fetch('http://10.0.0.59:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginText = await loginRes.text();
      let loginData: any;
      try { loginData = JSON.parse(loginText); } catch { loginData = {}; }

      if (!loginRes.ok || !loginData.token) {
        return Alert.alert(
          'Login Failed',
          loginData.message || loginData.error || `HTTP ${loginRes.status}`
        );
      }

      // 3) Navigate into Notes with a valid token
      navigation.replace('Notes', { token: loginData.token });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Text style={[styles.label, { fontSize: 28, marginBottom: 30 }]}>
        Create Account
      </Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Choose a username"
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholder="Create a password"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={styles.buttonText}>Register</Text>
        }
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        <Text style={{ color: '#fff' }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#5A4FCF', marginLeft: 6 }}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}