import { createStore } from 'vuex'
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
    fetchSignInMethodsForEmail
  } from 'firebase/auth';
  import { auth, db, googleProvider, storage } from "./firebase";
  import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const store = createStore({
    state: {
        user: {
          loggedIn: false,
          data: null,
          type: 'ecoSeeker'
        }
      },
    getters: {
        user(state){
          return state.user
        }
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
        }
      },
    actions: {
        async registerWithEmail(context, { email, password, name, userType }) {
          try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            if (response) {
                const signInMethods = await fetchSignInMethodsForEmail(email);
                if (signInMethods.length > 0) {
                  throw new Error('The email address is already in use by another account.');
                }
                context.commit('SET_USER', response.user)
                context.commit('SET_LOGGED_IN', true)
                //await response.user.updateProfile({ displayName: name })
                await updateProfile(response.user, { displayName: name })
                await setDoc(doc(db, "users", response.user.uid), {
                  uid: response.user.uid,
                  name,
                  authProvider: 'local',
                  email,
                  //photoURL: '/static/images/avatar/2.jpg',
                  userType,
                  about: '',
                  address: ''
                });
              }
          } catch (error) {
            throw new Error(error)
            // Handle error here
          }
            

        },

      async setUserType(context, {userType}) {
        console.log(userType)
        context.commit('SET_USER_TYPE', userType)
        
      },  
  
        async loginWithEmail(context, { email, password }) {
          try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            context.commit('SET_LOGGED_IN', true)
            context.commit('SET_USER', response.user)
            const userRef = doc(db, "users", response.user.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              //console.log("Document data:", docSnap.get('userType'));
              context.commit('SET_USER_TYPE', docSnap.get('userType'))
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error(error);
            // Handle error here
          }
      },
  
      async logOut(context) {
        try {
          await signOut(auth);
          context.commit('SET_LOGGED_IN', false);
          context.commit('SET_USER', null);
        } catch (error) {
          console.error('Failed to log out:', error);
          // Handle error here
        }
      },
  
      async fetchUser({ commit }) {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            commit('SET_LOGGED_IN', true);
            context.commit("SET_USER", {
              displayName: user.displayName,
              email: user.email
            });
          } else {
            commit('SET_LOGGED_IN', false);
            commit('SET_USER', null);
          }
        });
      },

      async registerWithGoogle(context, { userType }) {
        const provider = googleProvider;
        if (provider) {
          provider.setCustomParameters({
            prompt: 'select_account'
          });
          signInWithRedirect(auth, provider)
          .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            const signInMethods = await fetchSignInMethodsForEmail(user.email);
            if (signInMethods.length > 1) {
              throw new Error('The email address is already in use by another account.');
            }

            // IdP data available using getAdditionalUserInfo(result)
            // ...
            context.commit('SET_USER', user)
            context.commit('SET_LOGGED_IN', true)
          }).catch((error) => {
            // Handle Errors here.
            console.log(error)
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
          })    
            //await response.user.updateProfile({ displayName: name })
            await updateProfile(result.user, { displayName: 'result.user.displayName' })
            await setDoc(doc(db, "users", 'result.user.uid'), {
              uid: 'result.user.uid',
              name: 'result.user.displayName',
              authProvider: 'google',
              email,
              //photoURL: '/static/images/avatar/2.jpg',
              userType,
              about: '',
              address: ''
            });
        } else {
            throw new Error('Unable to register user')
        }
      },

      async forgetPassword(context, email) {
        try {
          await sendPasswordResetEmail(auth, email);
          // console.log('Password reset email sent', email);
        } catch (error) {
          console.error('Failed to send password reset email:', error);
        }
      }

    }
})

export default store

