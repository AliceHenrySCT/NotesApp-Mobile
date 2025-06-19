import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    padding: 20,
  },
  input: {
    backgroundColor: '#3a3a55',
    color: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#a259ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a259ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#ffffff',
    marginBottom: 5,
  },
  noteCard: {
    backgroundColor: '#2e2e48',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteTitle: {
    color: '#a259ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteDescription: {
    color: '#ffffff',
    fontSize: 14,
  },
});
