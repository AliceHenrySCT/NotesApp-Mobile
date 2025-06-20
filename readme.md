# NotesApp-Mobile

A simple note-taking mobile application built with React Native and Expo that allows users to create, read, update, and delete personal notes, with support for sharing notes among users.

## Features

- **User Authentication**: Register and login using secure JWT-based authentication.
- **CRUD Notes**: Create, view, edit, and delete notes.
- **Sharing**: Add or remove shared users for each note.
- **Note Details**: View detailed information about a note, including the creator’s username.
- **Dark Theme**: Modern dark UI with purple accent colors.

## Tech Stack

- **React Native** (Expo)
- **TypeScript**
- **React Navigation**
- **Node.js & Express** (backend API)
- **JSON Web Tokens** for auth

## Prerequisites

- Node.js 
- npm
- Expo CLI 
- Running backend API instance

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AliceHenrySCT/NotesApp-Mobile
   cd NotesApp-Mobile
   ```

2. **Install dependencies for frontend and backends**

   ```bash
   cd frontend
   npm install
   cd backend
   npm install
   ```

3. **Create local only files and set api route**

  After you run the install commands create a .env in the backend folder. It should contain the following
  
  ```
  PORT = 5000
  MONGODB_URI="your mongoDB uri"
  JWT_SECRET=my_secret_key
  ```

  Also in the frontend folder navigate to the app.json file and update the API_BASE_URL located at the bottom
  
  ```
  "extra": {
      "API_BASE_URL": "'your local ip address':5000/api"
    }
  ``` 

4. **Start the app and the backend server**

   ```bash
   cd backend
   npm start
   cd frontend
   npx expo start --clear
   ```

   Then scan the QR code with Expo Go

## Usage

1. **Register** a new user or **login** with existing credentials.
2. **Create** a note by tapping the corresponding buttons.
3. **Edit** a note by selecting it in the list.
4. **Share** a note by adding usernames on the detail screen.
5. **View** who created the note in the details view.


## Additional Notes

Implementing JWT authentication and user sharing features surfaced challenges around secure token storage and synchronizing shared note updates in real time, which I addressed by carefully managing state and network error handling. The dark theme with purple accents was chosen to reduce eye strain and reflect a modern aesthetic, and careful attention was paid to UX patterns to deliver a smooth, intuitive experience.

I chose this NoteApp-Mobile as it was the most involved project I’d made so far and I wanted to expand its capabilities beyond basic CRUD; it’s also something I can see myself using daily to organize my thoughts and tasks. Early on, I struggled to get the API calls wired up correctly, particularly around authentication; ultimately, I resolved this by splitting the backend routes into two files, one for public endpoints and another that enforces JWT-based token authentication, streamlining both development and security.

