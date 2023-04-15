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
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { useRouter } from "next/router";
import { useMediaQuery } from "@chakra-ui/react";

const AppContext = createContext();

const useUserContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserData(currentUser);
      } else {
        setUserData("");
        router.replace("/");
        //removes planName present in local storage
        localStorage.clear();
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
    if (isSmallerThan768) {
      await signInWithRedirect(auth, provider);
    } else {
      try {
        const response = await signInWithPopup(auth, provider);
        setUserData(response.user);
      } catch (error) {
        console.log("google signin error", error.message);
      }
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
    setUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppProvider, useUserContext };
