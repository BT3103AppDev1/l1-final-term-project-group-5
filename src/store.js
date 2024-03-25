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
  import { query, doc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDoc, getDocs, where } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const store = createStore({
    state: {
        user: {
          loggedIn: false,
          data: null,
          type: 'ecoSeeker'
        },
        products: [],
        listings: [],
        activeListings: [],
        inactiveListings: []
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
        },

        SET_PRODUCTS(state, products) {
          state.products = products;
        },

        ADD_LISTING(state, listing) {
          state.listings.push(listing);
        },

        SET_ACTIVE_LISTINGS(state, listings) {
          state.activeListings = listings;
        },

        SET_INACTIVE_LISTINGS(state, listings) {
          state.inactiveListings = listings;
        },

        UPDATE_LISTING_STATUS(state, { listingId, isActive }) {
          // Find the listing and update its 'isActive' status
          const index = state.listings.findIndex(listing => listing.id === listingId);
          if (index !== -1) {
            const listing = state.listings[index];
            listing.isActive = isActive;
            // Vue.set(state.listings, index, listing); // Use Vue.set if you need to ensure reactivity
          }
        },

        REMOVE_LISTING(state, listingId) {
          state.listings = state.listings.filter(listing => listing.id !== listingId);
        },
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
        const storageRef = ref(storage, `products/${product.image.name}`);    // Create a reference to the storage location
        const snapshot = await uploadBytes(storageRef, product.image);        // Upload the file
        const imageUrl = await getDownloadURL(snapshot.ref);                  // Get the URL of the uploaded file

        // Prepare the product object with the image URL
        const productToAdd = {
          name: product.name,
          category: product.category,
          weight: product.weight, // Assuming you've added 'weight' to your product object
          imageUrl
        };

        // Add the product object to Firestore
        const docRef = await addDoc(collection(db, 'products'), productToAdd);
        await updateDoc(doc(db, 'products', docRef.id), {
          productId: docRef.id
        });
        productToAdd.productId = docRef.id;

        // Commit to Vuex state
        commit('ADD_PRODUCT', productToAdd);
      } catch (error) {
        console.error("Error adding product: ", error);
      }
    },

    async fetchProducts({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      commit('SET_PRODUCTS', products);
    },

    async addListing({ commit }, newListing) {
      const now = new Date();
      now.setHours(0, 0, 0, 0) // Set now to beginning of the day
      newListing.unitsRemaining = newListing.unitsToSell;
      newListing.createdDate = now;
      newListing.isActive = (newListing.unitsRemaining > 0) && (new Date(newListing.expirationDate) >= now);
  
      const docRef = await addDoc(collection(db, 'listings'), newListing);
      await updateDoc(doc(db, 'listings', docRef.id), {
        listingId: docRef.id
      });
      newListing.listingId = docRef.id;
      commit('ADD_LISTING', { id: docRef.id, ...newListing });
    },

    async fetchActiveListingsWithProductDetails({ commit }) {
      const activeListingsQuery = query(collection(db, 'listings'), where('isActive', '==', true));
      const querySnapshot = await getDocs(activeListingsQuery);
  
      const listings = await Promise.all(querySnapshot.docs.map(async (listingDoc) => {
        const listing = listingDoc.data();
        const productRef = doc(db, 'products', listing.productId);
        const productSnap = await getDoc(productRef);
        
        // Assuming the product exists and adding a check for the same
        if (productSnap.exists()) {
          const product = productSnap.data();
          // Return the listing with additional product details
          return {
            ...listing,
            productName: product.name,
            productImage: product.imageUrl,
            productCategory: product.category
          };
        }
        
        // If the product does not exist, return the listing without product details
        return listing;
      }));
  
      commit('SET_ACTIVE_LISTINGS', listings);
    },

    async fetchInactiveListingsWithProductDetails({ commit }) {
      const activeListingsQuery = query(collection(db, 'listings'), where('isActive', '==', false));
      const querySnapshot = await getDocs(activeListingsQuery);
  
      const listings = await Promise.all(querySnapshot.docs.map(async (listingDoc) => {
        const listing = listingDoc.data();
        const productRef = doc(db, 'products', listing.productId);
        const productSnap = await getDoc(productRef);
        
        // Assuming the product exists and adding a check for the same
        if (productSnap.exists()) {
          const product = productSnap.data();
          // Return the listing with additional product details
          return {
            ...listing,
            productName: product.name,
            productImage: product.imageUrl,
            productCategory: product.category
          };
        }
        
        // If the product does not exist, return the listing without product details
        return listing;
      }));
  
      commit('SET_INACTIVE_LISTINGS', listings);
    },

    async checkAndUpdateListingStatus({ commit }) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Use start of the day for comparison
      const listingsRef = collection(db, 'listings');
  
      const querySnapshot = await getDocs(listingsRef);
      
      const updates = [];
      querySnapshot.forEach((doc) => {
        const listing = doc.data();
        //const listingExpirationDate = new Date(listing.expirationDate.seconds * 1000);
        
        // Determine if the listing should be marked as inactive
        const shouldBeInactive = listing.unitsRemaining <= 0 || new Date(listing.expirationDate) < now;
        
        if (listing.isActive && shouldBeInactive) {
          // Only update if the listing is currently active but should be inactive
          updates.push({
            id: doc.id,
            updateFn: updateDoc(doc.ref, { isActive: false })
          });
        }
      });
      
      // Execute all update operations
      await Promise.all(updates.map(u => u.updateFn));
      
      // Commit updates to the Vuex store
      updates.forEach(({ id }) => {
        commit('UPDATE_LISTING_STATUS', { listingId: id, isActive: false });
      });
    },

    async deleteListing({ commit }, listingId) {
      try {
        await deleteDoc(doc(db, 'listings', listingId));
        commit('REMOVE_LISTING', listingId);
      } catch (error) {
        console.error('Error deleting listing:', error);
        // Handle the error appropriately
      }
    },

    }
})

export default store

