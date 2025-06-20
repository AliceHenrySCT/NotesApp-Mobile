import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/AppNavigator';
import styles from './styles';
import Constants from "expo-constants";

const API_BASE_URL = Constants?.expoConfig?.extra?.API_BASE_URL;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'NoteDetail'>;
  route: RouteProp<RootStackParamList, 'NoteDetail'>;
};

type NoteDetail = {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function NoteDetailScreen({ navigation, route }: Props) {
  const { noteId, token } = route.params;
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/notes/note/${noteId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data: NoteDetail = await response.json();
        setNote(data);
      } catch (err: any) {
        Alert.alert('Error loading note', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, token]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#121212',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#5A4FCF" />
      </View>
    );
  }

  if (!note) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#121212',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Note not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      {/* Title */}
      <Text style={[styles.label, { fontSize: 24, marginBottom: 12 }]}>
        {note.title}
      </Text>

      {/* Description */}
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          marginBottom: 20,
          lineHeight: 22,
        }}
      >
        {note.description}
      </Text>

      {/* Timestamps */}
      {note.createdAt && (
        <Text style={[styles.label, { marginBottom: 8 }]}>
          Created: {new Date(note.createdAt).toLocaleString()}
        </Text>
      )}


      {/* Edit Button */}
      <TouchableOpacity
        style={[styles.button, { marginBottom: 12 }]}
        onPress={() => navigation.navigate('EditNote', { note, token })}
      >
        <Text style={styles.buttonText}>Edit Note</Text>
      </TouchableOpacity>

      {/* Back to List */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Notes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}