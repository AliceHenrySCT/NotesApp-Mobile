import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import { api } from '../api/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'EditNote'>;
  route: RouteProp<RootStackParamList, 'EditNote'>;
};

type User = { _id: string; username: string };

export default function NoteFormScreen({ navigation, route }: Props) {
  const { note, token } = route.params || {};
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    note?.sharedWith || []
  );

  const isEdit = !!note;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users: User[] = await api('/notes/users', 'GET', undefined, token);
        setAllUsers(users.filter(u => !note || u._id !== note.owner));
        if (note?.sharedWith) {
          const sharedIds = note.sharedWith.map((u: any) =>
            typeof u === 'string' ? u : u._id
          );
          setSelectedUserIds(sharedIds);
        }
      } catch (err: any) {
        Alert.alert('Failed to load users', err.message);
      }
    };
    fetchUsers();
  }, []);

  const toggleUser = (userId: string) => {
    setSelectedUserIds(ids =>
      ids.includes(userId) ? ids.filter(id => id !== userId) : [...ids, userId]
    );
  };

  const handleSave = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    try {
      if (isEdit) {
        await api(`/notes/${note._id}`, 'PUT', { title, description, sharedWith: selectedUserIds }, token);
        Alert.alert('Note updated');
      } else {
        await api('/notes', 'POST', { title, description, sharedWith: selectedUserIds }, token);
        Alert.alert('Note created');
      }
      navigation.replace('Notes', { token });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.formTitle}>{isEdit ? 'Edit Note' : 'New Note'}</Text>
      <Text>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Text>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.descriptionInput}
        multiline
      />
      <Text style={styles.sharedLabel}>Shared with:</Text>
      {allUsers.filter(u => selectedUserIds.includes(u._id)).map(user => (
        <View key={user._id} style={styles.userRow}>
          <Text>{user.username}</Text>
          <Button
            title="Remove"
            color="red"
            onPress={() => setSelectedUserIds(prev => prev.filter(id => id !== user._id))}
          />
        </View>
      ))}
      <Text style={styles.sharedLabel}>Add user access:</Text>
      <View style={styles.userAccessContainer}>
        {allUsers.filter(u => !selectedUserIds.includes(u._id)).map(user => (
          <TouchableOpacity
            key={user._id}
            onPress={() => toggleUser(user._id)}
            style={styles.touchable}
          >
            <Text>{user.username}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title={isEdit ? 'Update' : 'Create'} onPress={handleSave} />
      <View style={styles.spacerLarge} />
      <Button
        title="Cancel"
        color="red"
        onPress={() => navigation.replace('Notes', { token })}
      />
    </ScrollView>
  );
}