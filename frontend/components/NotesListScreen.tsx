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
import { RootStackParamList } from '../navigation/AppNavigator';

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

  // Fetch all notes on mount
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

        // Treat a 500 as “no notes yet” to avoid an alert popup
        if (response.status === 500) {
          console.error('Notes fetch 500 error:', text);
          setNotes([]);
          return;
        }
        if (!response.ok) {
          console.error('Notes fetch error:', response.status, text);
          throw new Error(`Server responded with ${response.status}`);
        }

        setNotes(JSON.parse(text));
      } catch (err: any) {
        Alert.alert('Error loading notes', err.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  // Handler for logout: replace back to the Login screen
  const handleLogout = () => {
    navigation.replace('Login');
  };

  // Render a single note item
  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[styles.buttonContainer, { marginBottom: 12 }]}
      onPress={() =>
        navigation.navigate('NoteDetail', { noteId: item._id, token })
      }
    >
      <Text style={[styles.buttonText, { fontSize: 18 }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  // Show loading spinner while fetching notes
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

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Top bar: Add Note only */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditNote', { token })}
        >
          <Text style={styles.buttonText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      {/* Notes list */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              marginTop: 50,
            }}
          >
            No notes yet. Tap “Add Note” to create one.
          </Text>
        }
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      {/* Logout button fixed at bottom */}
      <View style={{ padding: 40, backgroundColor: '#121212' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}