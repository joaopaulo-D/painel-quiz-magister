import React, { createContext, useEffect, useState } from "react";

import { firebase } from "../firebase/firebase";
import { Error as Err } from "../utils/errors";

interface AuthContextProps {
  user: firebase.User | null;
  loginWithEmailPassword: (email: string, password: string) => void;
  signupWithEmailPassword: (displayName: string, email: string, password: string) => void;
  sendPasswordResetEmail: (email: string) => void;
  logoutUser: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const FirebaseAuthenticationContextProvider = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [error, setError] = useState<string>("");

  const isAuthenticated = !!user;

  const loginWithEmailPassword = async (email: string, password: string) => {
    try {
      const { user: authUser } = await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      const { err } = Err(error);
      window.alert(err)
      // setError(err);
    }
  };

  const signupWithEmailPassword = async (displayName: string, email: string, password: string) => {
    try {
      const { user: authUser } = await firebase.auth().createUserWithEmailAndPassword(email, password);

      if (authUser.email) {
        await firebase.firestore().collection("users").doc(authUser?.uid).set({
          name: displayName,
          email: authUser?.email,
          teacher: true,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        })
      }
    } catch (error) {
      const { err } = Err(error);
      window.alert(err)
      // setError(err);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email).then(() => window.alert("Link para redefinir sua senha foi enviado com sucesso!"))
    } catch (error) {
      const { err } = Err(error);
      window.alert(err)
      // setError(err);
    }
  }

  const logoutUser = async () => {
    const response = window.confirm("Você deseja realmente sair?")

    if(response){
      await firebase.auth().signOut()
    }else{
      return;
    }
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithEmailPassword, signupWithEmailPassword, sendPasswordResetEmail, logoutUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};