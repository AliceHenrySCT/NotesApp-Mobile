import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import { api } from '../api/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'NoteDetail'>;
  route: RouteProp<RootStackParamList, 'NoteDetail'>;
};

export default function NoteDetailScreen({ navigation, route }: Props) {
  const { noteId, token } = route.params;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchNote = async () => {
    try {
      const note = await api(`/notes/note/${noteId}`, 'GET', undefined, token);
      setNote(note);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleDelete = async () => {
    try {
      await api(`/notes/${noteId}`, 'DELETE', undefined, token);
      Alert.alert('Deleted', 'Note has been deleted.');
      navigation.replace('Notes', { token });
    } catch (err: any) {
      Alert.alert('Delete Failed', err.message);
    }
  };

  if (loading) return <ActivityIndicator style={styles.activityIndicator} size="large" />;
  if (!note) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.detailTitle}>{note.title}</Text>
      <Text style={styles.description}>{note.description}</Text>
      <Text style={styles.metaText}>Created by: {note.owner?.username || 'Unknown'}</Text>
      <Text style={styles.metaText}>Created: {new Date(note.createdAt).toLocaleString()}</Text>
      <Text style={styles.metaText}>Last Edited: {new Date(note.updatedAt).toLocaleString()}</Text>
      <View style={styles.detailButtonContainer}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditNote', { note, token })}
        />
        <View style={styles.spacerSmall} />
        <Button title="Delete" color="red" onPress={handleDelete} />
        <View style={styles.spacerSmall} />
        <Button title="Back to Notes" onPress={() => navigation.replace('Notes', { token })} />
      </View>
    </View>
  );
}