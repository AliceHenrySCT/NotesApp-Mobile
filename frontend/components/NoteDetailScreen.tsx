import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { api } from "../api/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { RouteProp } from "@react-navigation/native";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "NoteDetail">;
  route: RouteProp<RootStackParamList, "NoteDetail">;
};

export default function NoteDetailScreen({ navigation, route }: Props) {
  const { noteId, token } = route.params;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchNote = async () => {
    try {
      const note = await api(`/notes/note/${noteId}`, "GET", undefined, token);
      setNote(note);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleDelete = async () => {
    try {
      await api(`/notes/${noteId}`, "DELETE", undefined, token);
      Alert.alert("Deleted", "Note has been deleted.");
      navigation.replace("Notes", { token });
    } catch (err: any) {
      Alert.alert("Delete Failed", err.message);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!note) return null;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{note.title}</Text>
      <Text style={{ marginVertical: 12 }}>{note.description}</Text>
      <Text style={{ color: "#888" }}>
        Created: {new Date(note.createdAt).toLocaleString()}
      </Text>
      <Text style={{ color: "#888" }}>
        Last Edited: {new Date(note.updatedAt).toLocaleString()}
      </Text>
      <View style={{ marginVertical: 20 }}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate("EditNote", { note, token })}
        />
        <View style={{ marginVertical: 5 }} />
        <Button title="Delete" color="red" onPress={handleDelete} />
        <View style={{ marginVertical: 5 }} />
        <Button title="Back to Notes" onPress={() => navigation.replace("Notes", { token })} />
      </View>
    </View>
  );
}
