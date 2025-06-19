import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import styles from './styles';
import { api } from '../api/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Notes'>;
  route: RouteProp<RootStackParamList, 'Notes'>;
};

export default function NotesListScreen({ navigation, route }: Props) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = route.params;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const notes = await api('/notes', 'GET', undefined, token);
      setNotes(notes);
    } catch (err) {
      // handle errors
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <View style={styles.fullContainer}>
      <Button
        title="Create New Note"
        onPress={() => navigation.navigate('EditNote', { token })}
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotes} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('NoteDetail', { noteId: item._id, token })}
            style={styles.listItem}
          >
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.listDescription}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.logoutButtonContainer}>
        <Button title="Logout" color="red" onPress={() => navigation.replace('Login')} />
      </View>
    </View>
  );
}