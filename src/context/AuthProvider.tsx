import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticating(true);
          setLoading(false);
        } else {
          setUser(null);
          setIsAuthenticating(false);
          setLoading(false);
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (crediential: { email: string; password: string }) => {
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        crediential.email,
        crediential.password
      );
      const user = response.user;
      console.log("Logged in user:", user);
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error; 
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const signup = async (crediential: { email: string; password: string; name?: string }) => {
    try {
      const firebaseResponse = await createUserWithEmailAndPassword(
        auth,
        crediential.email,
        crediential.password
      );

      const newUser = firebaseResponse.user;

      if (crediential.name) {
        await updateProfile(newUser, {
          displayName: crediential.name,
        });
      }

      setUser({ ...newUser, displayName: crediential.name || newUser.displayName });
      setIsAuthenticating(true);
      return true;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        console.error("This email is already in use. Please log in.");
        toast.error("This email is already in use. Please log in.");
      } else if (error.code === "auth/network-request-failed") {
        console.error("Network error. Please check your internet connection.");
        toast.error("Network error. Please check your internet connection.");
      } else {
        console.error("Signup error:", error.message);
      }
      return false;
    }
  };

   const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email. Please try again.");
      return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  };


  return (
    <AuthContext.Provider value={{ login, user, logout, isAuthenticating, loading, signup, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
