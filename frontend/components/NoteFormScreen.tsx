import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from "react-native";
import { api } from "../api/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { RouteProp } from "@react-navigation/native";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "EditNote">;
  route: RouteProp<RootStackParamList, "EditNote">;
};

type User = { _id: string; username: string };

export default function NoteFormScreen({ navigation, route }: Props) {
  const { note, token } = route.params || {};
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const isEdit = !!note;

  // Fetch all users for sharing
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users: User[] = await api("/notes/users", "GET", undefined, token);
        setAllUsers(users.filter(u => !note || u._id !== note.owner)); // Exclude owner from sharing list
      } catch (err: any) {
        Alert.alert("Failed to load users", err.message);
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
      Alert.alert("Error", "Title is required");
      return;
    }
    try {
      if (isEdit) {
        await api(
          `/notes/${note._id}`,
          "PUT",
          { title, description, sharedWith: selectedUserIds },
          token
        );
        Alert.alert("Note updated");
      } else {
        await api(
          "/notes",
          "POST",
          { title, description, sharedWith: selectedUserIds },
          token
        );
        Alert.alert("Note created");
      }
      navigation.replace("Notes", { token });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>
        {isEdit ? "Edit Note" : "New Note"}
      </Text>
      <Text>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 12 }}
      />
      <Text>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{
          borderWidth: 1,
          marginBottom: 12,
          minHeight: 60,
          textAlignVertical: "top",
        }}
        multiline
      />
      <Text style={{ marginVertical: 8, fontWeight: "bold" }}>
        Share with users:
      </Text>
      {allUsers.map(user => (
        <TouchableOpacity
          key={user._id}
          style={{
            padding: 10,
            backgroundColor: selectedUserIds.includes(user._id)
              ? "#aaf"
              : "#eee",
            borderRadius: 5,
            marginBottom: 6,
          }}
          onPress={() => toggleUser(user._id)}
        >
          <Text>{user.username}</Text>
        </TouchableOpacity>
      ))}
      <Button title={isEdit ? "Update" : "Create"} onPress={handleSave} />
      <View style={{ marginVertical: 10 }} />
      <Button
        title="Cancel"
        color="red"
        onPress={() => navigation.replace("Notes", { token })}
      />
    </ScrollView>
  );
}
