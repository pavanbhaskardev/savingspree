import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { useRouter } from "next/router";

const AppContext = createContext();

const useUserContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserData(currentUser);
      } else {
        setUserData("");
        router.push("/");
        localStorage.removeItem("docId");
        localStorage.removeItem("planName");
      }
      setError("");
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const createNewUser = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      setUserData(response.user);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const userLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setUserData(response.user);
    } catch (err) {
      let errorMessage = err.code.split("auth/")[1];
      switch (errorMessage) {
        case "user-not-found":
          setError("Wrong email address");
          break;
        case "wrong-password":
          setError("Wrong password");
          break;
        case "too-many-requests":
          setError("Too many requests try again later");
          break;
      }

      setErrorStatus(true);
    }
    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      setUserData(response.user);
    } catch (err) {
      console.log("google signin error", err.message);
    }
  };

  const forgetPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await sendPasswordResetEmail(auth, email);
      if (response === undefined) {
        setSuccessStatus(true);
      }
    } catch (err) {
      let errorMessage = err.code.split("auth/")[1];
      setErrorStatus(true);
      switch (errorMessage) {
        case "user-not-found":
          setError("Email address does not exist");
          break;
      }
    }
    setIsLoading(false);
  };

  const userLogOut = async () => {
    setIsLoading(true);
    try {
      signOut(auth);
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
  };

  const contextValue = {
    userData,
    isLoading,
    error,
    errorStatus,
    successStatus,
    createNewUser,
    userLogOut,
    signInWithGoogle,
    userLogin,
    forgetPassword,
    setErrorStatus,
    setSuccessStatus,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppProvider, useUserContext };
