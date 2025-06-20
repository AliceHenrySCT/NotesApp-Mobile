import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/AppNavigator';
import styles from './styles';

type User = { _id: string; username: string };
type NoteParam = {
  _id: string;
  title: string;
  description: string;
  owner?: User | string;
  sharedWith?: (User | string)[];
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'EditNote'>;
  route: RouteProp<RootStackParamList, 'EditNote'>;
};

export default function NoteFormScreen({ navigation, route }: Props) {
  const { token, note } = route.params as { token: string; note?: NoteParam };
  const isEditing = Boolean(note && note._id);

  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(
    note && note.owner
      ? typeof note.owner === 'string'
        ? note.owner
        : note.owner._id
      : null
  );
  const [sharedUserIds, setSharedUserIds] = useState<string[]>(
    note?.sharedWith
      ? note.sharedWith.map(u => (typeof u === 'string' ? u : u._id))
      : []
  );
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch note detail if editing
  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const res = await fetch(
          `http://10.0.0.59:5000/api/notes/note/${note!._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        // owner
        let oId: string | null = null;
        if (data.owner) {
          oId =
            typeof data.owner === 'string'
              ? data.owner
              : data.owner._id;
        }
        setOwnerId(oId);
        // shared
        const sIds: string[] = [];
        if (Array.isArray(data.sharedWith)) {
          data.sharedWith.forEach((e: User | string) => {
            sIds.push(typeof e === 'string' ? e : e._id);
          });
        } else if (Array.isArray(data.userIds)) {
          data.userIds.forEach((id: string) => {
            if (id !== oId) sIds.push(id);
          });
        }
        setSharedUserIds(sIds);
      } catch (e: any) {
        Alert.alert('Error loading note data', e.message);
      }
    })();
  }, [isEditing, note, token]);

  // Fetch all users
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://10.0.0.59:5000/api/notes/users', {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const users: User[] = await res.json();
        setAllUsers(users);
      } catch (e: any) {
        Alert.alert('Error loading users', e.message);
      }
    })();
  }, [token]);

  const addSharedUser = (id: string) => {
    setShowDropdown(false);
    if (id !== ownerId && !sharedUserIds.includes(id)) {
      setSharedUserIds(prev => [...prev, id]);
    }
  };
  const removeSharedUser = (id: string) =>
    setSharedUserIds(prev => prev.filter(u => u !== id));

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim())
      return Alert.alert(
        'Validation',
        'Please fill out both title and description'
      );
    setLoading(true);
    try {
      let url: string, method: 'POST' | 'PUT';
      if (isEditing) {
        url = `http://10.0.0.59:5000/api/notes/note/${note!._id}`;
        method = 'PUT';
      } else {
        url = `http://10.0.0.59:5000/api/notes`;
        method = 'POST';
      }
      const payload: any = { title, description };
      if (isEditing) {
        payload.sharedWith = sharedUserIds;
      }
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Save failed (${res.status})\n${text}`);
      }
      navigation.replace('Notes', { token });
    } catch (e: any) {
      Alert.alert('Error saving note', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#121212' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 150,  // leave space for fixed button
        }}
      >
        <Text style={[styles.label, { fontSize: 24, marginBottom: 20 }]}>
          {isEditing ? 'Edit Note' : 'Add New Note'}
        </Text>

        {/* Title & Description */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Note title"
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 120 }]}
          placeholder="Note description"
          placeholderTextColor="#888"
          multiline
        />

        {/* Owner */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Owner</Text>
          <View style={styles.assignedUsersContainer}>
            {ownerId ? (
              <Text style={{ color: '#fff' }}>
                {allUsers.find(u => u._id === ownerId)?.username ?? ownerId}
              </Text>
            ) : (
              <ActivityIndicator color="#5A4FCF" />
            )}
          </View>
        </View>

        {/* Shared Users */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shared With</Text>
          <View style={styles.assignedUsersContainer}>
            {sharedUserIds.map(id => (
              <View key={id} style={styles.userItemRow}>
                <Text style={{ color: '#fff', flex: 1 }}>
                  {allUsers.find(u => u._id === id)?.username ?? id}
                </Text>
                <TouchableOpacity onPress={() => removeSharedUser(id)}>
                  <Text style={{ color: '#5A4FCF' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setShowDropdown(s => !s)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: '#5A4FCF' }}>
              {showDropdown ? 'Cancel' : 'Add User ▼'}
            </Text>
          </TouchableOpacity>

          {showDropdown && (
            <View
              style={[styles.assignedUsersContainer, { marginTop: 4 }]}
            >
              {allUsers
                .filter(
                  u =>
                    u._id !== ownerId &&
                    !sharedUserIds.includes(u._id)
                )
                .map(user => (
                  <TouchableOpacity
                    key={user._id}
                    onPress={() => addSharedUser(user._id)}
                    style={{ paddingVertical: 8 }}
                  >
                    <Text style={{ color: '#5A4FCF' }}>
                      {user.username}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Save Button */}
      <View style={{ padding: 20, backgroundColor: '#121212' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? 'Save Changes' : 'Create Note'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}