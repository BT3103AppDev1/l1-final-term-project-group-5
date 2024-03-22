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
  import { doc, setDoc, updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const store = createStore({
    state: {
        user: {
          loggedIn: false,
          data: null,
          type: 'ecoSeeker'
        },
        products: []
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
        },

        ADD_PRODUCT(state, product) {
          state.products.push(product);
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
    },

    async addProductToDB({ commit }, product) {
      try {
        // Create a reference to the storage location
        const storageRef = ref(storage, `products/${product.image.name}`);
        // Upload the file
        const snapshot = await uploadBytes(storageRef, product.image);
        // Get the URL of the uploaded file
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Prepare the product object with the image URL
        const productToAdd = {
          name: product.name,
          category: product.category,
          weight: product.weight, // Assuming you've added 'weight' to your product object
          imageUrl
        };

        // Add the product object to Firestore
        const docRef = await addDoc(collection(db, 'products'), productToAdd);
        
        // Commit to Vuex state
        commit('ADD_PRODUCT', { id: docRef.id, ...productToAdd });
      } catch (error) {
        console.error("Error adding product: ", error);
      }
    }

    }
})

export default store

