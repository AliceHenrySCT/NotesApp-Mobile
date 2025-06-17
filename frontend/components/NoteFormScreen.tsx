import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { api } from "../api/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { RouteProp } from "@react-navigation/native";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "EditNote">;
  route: RouteProp<RootStackParamList, "EditNote">;
};

export default function NoteFormScreen({ navigation, route }: Props) {
  const { note, token } = route.params || {};
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const isEdit = !!note;

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Error", "Title is required");
      return;
    }
    try {
      if (isEdit) {
        await api(`/notes/${note._id}`, "PUT", { title, description }, token);
        Alert.alert("Note updated");
      } else {
        await api("/notes", "POST", { title, description }, token);
        Alert.alert("Note created");
      }
      navigation.replace("Notes", { token });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
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
      <Button title={isEdit ? "Update" : "Create"} onPress={handleSave} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Cancel" color="red" onPress={() => navigation.replace("Notes", { token })} />
    </View>
  );
}
