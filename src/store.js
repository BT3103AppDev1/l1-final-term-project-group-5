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
    signOut,
    updateEmail,
    updatePassword,
    updateProfile,
  } from 'firebase/auth';
  import { auth, db, googleProvider, storage } from "./firebase";
  import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

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
        async register(context, { email, password, name, userType }){
            const response = await createUserWithEmailAndPassword(auth, email, password)
            if (response) {
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
            } else {
                throw new Error('Unable to register user')
            }
        },

      async setUserType(context, {userType}) {
        console.log(userType)
        context.commit('SET_USER_TYPE', userType)
        
      },  
  
        async login(context, { email, password }){
          const response = await signInWithEmailAndPassword(auth, email, password)
          if (response) {
              context.commit('SET_LOGGED_IN', true)
              context.commit('SET_USER', response.user)
          } else {
              throw new Error('login failed')
          }
      },
  
      async logOut(context){
          await signOut(auth)
          context.commit('SET_LOGGED_IN', false)
          context.commit('SET_USER', null)
      },
  
      async fetchUser(context ,user) {
        context.commit("SET_LOGGED_IN", user !== null);
        if (user) {
          context.commit("SET_USER", {
            displayName: user.displayName,
            email: user.email
          });
        } else {
          context.commit("SET_USER", null);
        }
    }
    }
})

export default store

