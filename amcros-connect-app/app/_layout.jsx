import { Stack } from "expo-router";
import { UserDetailContext } from "../context/UserDetailContext";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function RootLayout() {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // user is logged in, now fetch Firestore user detail
        try {
          const docRef = doc(db, "users", user.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetail(docSnap.data());
            console.log("Restored userDetail from Firestore:", docSnap.data());
          } else {
            console.log("User document not found in Firestore");
          }
        } catch (error) {
          console.error("Error restoring userDetail:", error);
        }
      } else {
        setUserDetail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <Stack screenOptions={{ headerShown: false }} />
    </UserDetailContext.Provider>
  );
}
