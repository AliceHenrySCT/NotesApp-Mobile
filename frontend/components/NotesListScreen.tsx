import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import styles from './styles';
import { RootStackParamList } from '../navigation/AppNavigator';  // :contentReference[oaicite:2]{index=2}

type Note = {
  _id: string;
  title: string;
  description: string;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Notes'>;
  route: RouteProp<RootStackParamList, 'Notes'>;
};

export default function NotesListScreen({ navigation, route }: Props) {
  const { token } = route.params;
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://10.0.0.59:5000/api/notes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data: Note[] = JSON.parse(text);
        setNotes(data);
      } catch (err: any) {
        Alert.alert('Error loading notes', err.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5A4FCF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditNote', { token })}
        >
          <Text style={styles.buttonText}>Add Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Notes list */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.buttonContainer, { marginBottom: 12 }]}
            onPress={() => navigation.navigate('NoteDetail', { noteId: item._id, token })}
          >
            <Text style={[styles.buttonText, { fontSize: 18 }]}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>
            No notes yet. Tap “Add Note” to create one.
          </Text>
        }
      />
    </View>
  );
}