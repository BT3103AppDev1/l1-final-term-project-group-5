import { createStore } from "vuex";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db, googleProvider, storage } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const store = createStore({
  state: {
    user: {
      loggedIn: false,
      data: null,
      type: "ecoSeeker",
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_USER_TYPE(state, data) {
      state.user.type = data;
    },
  },
  actions: {
    async registerWithEmail(context, { email, password, name, userType }) {
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (response) {
          const signInMethods = await fetchSignInMethodsForEmail(email);
          if (signInMethods.length > 0) {
            throw new Error(
              "The email address is already in use by another account."
            );
          }
          context.commit("SET_USER", response.user);
          context.commit("SET_LOGGED_IN", true);
          //await response.user.updateProfile({ displayName: name })
          await updateProfile(response.user, { displayName: name });
          await setDoc(doc(db, "users", response.user.uid), {
            uid: response.user.uid,
            name,
            authProvider: "local",
            email,
            //photoURL: '/static/images/avatar/2.jpg',
            userType,
            about: "",
            address: "",
          });
        }
      } catch (error) {
        throw new Error(error);
        // Handle error here
      }
    },

    async setUserType(context, { userType }) {
      //console.log(userType);
      context.commit("SET_USER_TYPE", userType);
    },

    async loginWithEmail(context, { email, password }) {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        context.commit("SET_LOGGED_IN", true);
        context.commit("SET_USER", response.user);
        const userRef = doc(db, "users", response.user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.get('userType'));
          context.commit("SET_USER_TYPE", docSnap.get("userType"));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error(error);
      }
    },

    async logOut(context) {
      try {
        await signOut(auth).then(console.log("User signed out!"));
        context.commit("SET_LOGGED_IN", false);
        context.commit("SET_USER", null);
      } catch (error) {
        console.error("Failed to log out:", error);
      }
    },

    async fetchUser({ commit }) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          commit("SET_LOGGED_IN", true);
          context.commit("SET_USER", {
            displayName: user.displayName,
            email: user.email,
          });
        } else {
          commit("SET_LOGGED_IN", false);
          commit("SET_USER", null);
        }
      });
    },

    async registerWithGoogle(context, { userType }) {
      const provider = googleProvider;
      if (provider) {
        provider.setCustomParameters({
          prompt: "select_account",
        });
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          context.commit("SET_USER", user);
          context.commit("SET_LOGGED_IN", true);
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            // If the document does not exist, create it with the user type
            await setDoc(userRef, { userType: userType });
            context.commit("SET_USER_TYPE", userType);
          } else {
            console.log("User already exists!");
          }
        } catch (error) {
          console.error("Failed to register with Google:", error);
          // Handle error here
        }
      } else {
        throw new Error("Unable to register with Google");
      }
    },

    async loginWithGoogle(context, { }) {
      await signOut(auth).then(console.log("User signed out before signing in with Google!"));

      const provider = googleProvider;
      // if (provider) {
      //   provider.setCustomParameters({
      //     prompt: "select_account",
      //   });}
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
        // if (signInMethods.length === 0) {
        //   console.log("The Google account is not registered.")
        //   throw new Error("The Google account is not registered.");
        // }
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          context.commit("SET_USER", user);
          context.commit("SET_LOGGED_IN", true);
          context.commit("SET_USER_TYPE", docSnap.get("userType"));
        } else {
          console.log("No such document!");
          context.commit("SET_LOGGED_IN", false);
          throw new Error("The Google account is not registered. Please register first.");
        }
      } catch (error) {
        console.error("Failed to sign in with Google:", error);
        // Handle error here
      }
      // } else {
      //   throw new Error("Unable to login with Google");
      // }
    },

    async forgetPassword(context, email) {
      try {
        await sendPasswordResetEmail(auth, email);
        // console.log('Password reset email sent', email);
      } catch (error) {
        console.error("Failed to send password reset email:", error);
      }
    },
  },
});

export default store;
