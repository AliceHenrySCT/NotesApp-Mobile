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
import { api } from '../api/api';
import styles from '../components/styles';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter both email and password');
    }
    setLoading(true);
    try {
      const { token } = await api('/auth/login', 'POST', { email, password });
      setLoading(false);

      if (token) {
        // Navigate into your Notes screen instead of Home
        navigation.replace('Notes', { token });
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Text style={[styles.label, { fontSize: 28, marginBottom: 30 }]}>
        Welcome back!
      </Text>

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
        placeholder="Enter your password"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={styles.buttonText}>Log In</Text>
        }
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
        }}
      >
        <Text style={{ color: '#fff' }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#5A4FCF', marginLeft: 6 }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
