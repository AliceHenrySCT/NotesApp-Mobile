import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  fullContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#E0E0E0',
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 12,
    color: '#E0E0E0',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 12,
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF', 
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#E0E0E0',
    backgroundColor: '#1E1E1E',
  },
  sharedLabel: {
    marginVertical: 8,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    marginBottom: 6,
  },
  userAccessContainer: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 5,
    marginBottom: 12,
  },
  touchable: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#BB86FC',
    borderRadius: 5,
  },
  activityIndicator: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  description: {
    marginVertical: 12,
    color: '#E0E0E0',
  },
  metaText: {
    color: '#AAA',
  },
  detailButtonContainer: {
    marginVertical: 20,
  },
  spacerSmall: {
    marginVertical: 5,
  },
  spacerLarge: {
    marginVertical: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  listTitle: {
    fontSize: 18,
    color: '#E0E0E0',
  },
  listDescription: {
    color: '#BBB',
  },
  registerButtonContainer: {
    marginTop: 10,
  },
  logoutButtonContainer: {
    marginBottom: 30,
  },
    button: {
    backgroundColor: '#5A4FCF',   
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',             
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    backgroundColor: '#1F1F1F',   
    padding: 10,
    borderRadius: 8,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 4,
    fontSize: 14,
  },
   sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 8,
  },
  assignedUsersContainer: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 6,
  },
  unassignedUsersContainer: {
    paddingVertical: 10,
  },
  userItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
});