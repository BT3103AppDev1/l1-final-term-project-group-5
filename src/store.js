import { createStore } from "vuex";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth, db, googleProvider, storage } from "./firebase";
import {
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import CryptoJS from "crypto-js";

const store = createStore({
  state: {
    user: {
      loggedIn: false,
      type: "",
      displayName: "",
      email: "",
      uid: "",
      photoURL: "",
      about: "",
      address: "",
      detailsSubmitted: false,
      weight: 0,
      bankDetails: "",
      authProvider: "",
    },
    products: [],
    listings: [],
    activeListings: [],
    inactiveListings: [],
    notification: null,
    cart: {
      items: [],
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    getUser(state) {
      return state.user;
    },
    cartItems(state) {
      return state.cart.items;
    },
    totalPrice: (state) => {
      //console.log(state.cart.items);
      return state.cart && state.cart.items
        ? state.cart.items
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)
        : 0;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },

    SET_USER_TYPE(state, data) {
      state.user.type = data;
    },

    SET_USER_ID(state, value) {
      state.user.uid = value;
    },

    SET_USER_DETAILS(state, details) {
      state.user.displayName = details.displayName || state.user.displayName;
      state.user.email = details.email || state.user.email;
      state.user.photoURL = details.photoURL || state.user.photoURL || "";
      state.user.about = details.about || state.user.about || "";
      state.user.address = details.address || state.user.address || "";
    },

    SET_USER_REGISTERED(state, value) {
      state.user.detailsSubmitted = value;
    },

    ADD_PRODUCT(state, product) {
      state.products.push(product);
    },

    SET_PRODUCTS(state, products) {
      state.products = products;
    },

    REMOVE_PRODUCT(state, productId) {
      state.products = state.products.filter(
        (product) => product.id !== productId
      );
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

    updateListing(state, { id, updates }) {
      const index = state.listings.findIndex((listing) => listing.id === id);
      if (index !== -1) {
        state.listings[index] = updates;
      }
    },

    UPDATE_LISTING_STATUS(state, { listingId, isActive }) {
      // Find the listing and update its 'isActive' status
      const index = state.listings.findIndex(
        (listing) => listing.id === listingId
      );
      if (index !== -1) {
        const listing = state.listings[index];
        listing.isActive = isActive;
        // Vue.set(state.listings, index, listing); // Use Vue.set if you need to ensure reactivity
      }
    },

    REMOVE_LISTING(state, listingId) {
      state.listings = state.listings.filter(
        (listing) => listing.id !== listingId
      );
    },

    SET_NOTIFICATION(state, notification) {
      state.notification = notification;
    },

    CLEAR_NOTIFICATION(state) {
      state.notification = null;
    },

    SET_WEIGHT(state, weight) {
      state.user.weight = weight;
    },

    SET_BANK_DETAILS(state, bankDetails) {
      state.user.bankDetails = bankDetails;
    },

    SET_PROVIDER(state, provider) {
      state.user.authProvider = provider;
    },
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    ADD_TO_CART(state, item) {
      const found = state.cart.items.find(
        (product) => product.listingId === item.listingId
      );
      if (found) {
        found.quantity += item.quantity;
        //console.log('Added existing ' + item.name +  ' to cart x ', item.quantity);
      } else {
        state.cart.items.push({
          ...item,
          quantity: item.quantity,
        });
        //console.log('Added ' + item.name +  ' to cart x ', item.quantity);
      }
    },
    CLEAR_CART(state) {
      state.cart.items = [];
      state.totalPrice = 0;
      //console.log('Cart cleared');
    },

    REMOVE_FROM_CART(state, item) {
      const index = state.cart.items.findIndex(
        (cartItem) => cartItem.listingId === item.listingId
      );
      if (index !== -1) {
        //console.log('Removed ' + item.name + ' from cart');
        state.cart.items.splice(index, 1);
      } else {
        //console.log(item.name + ' not found in cart');
      }
      //console.log('Current Cart: ', state.cart.items);
    },
  },

  actions: {
    async registerWithEmail(context, { email, password }) {
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (response) {
          context.commit("SET_LOGGED_IN", true);
          const storageRef = ref(storage, `profilepic/default_pic` + ".png");
          const defaultProfilePictureURL = await getDownloadURL(storageRef);
          await setDoc(doc(db, "users", response.user.uid), {
            userType: "",
            uid: response.user.uid,
            displayName: "",
            authProvider: "local",
            email: email,
            about: "",
            address: "",
            photoURL: defaultProfilePictureURL,
            weight: 0,
            bankDetails: "",
          });
          context.commit("SET_USER_DETAILS", {
            displayName: "",
            email: email,
            photoURL: defaultProfilePictureURL,
            about: "",
            address: "",
          });
          context.commit("SET_USER_ID", response.user.uid);
          context.commit("SET_PROVIDER", "local");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async setUserType(context, { userType }) {
      context.commit("SET_USER_TYPE", userType);
    },

    async setUserRegistered(context, { value }) {
      context.commit("SET_USER_REGISTERED", value);
    },

    async loginWithEmail({ dispatch, state, commit }, { email, password }) {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        commit("SET_LOGGED_IN", true);
        commit("SET_USER_ID", response.user.uid);
        const userRef = doc(db, "users", response.user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          commit("SET_USER_TYPE", docSnap.get("userType"));
          commit("SET_USER_DETAILS", {
            displayName: docSnap.get("displayName"),
            email: docSnap.get("email"),
            photoURL: docSnap.get("photoURL"),
            about: docSnap.get("about"),
            address: docSnap.get("address"),
          });
          commit("SET_USER_REGISTERED", true);
          commit("SET_WEIGHT", docSnap.get("weight"));
          commit("SET_BANK_DETAILS", docSnap.get("bankDetails"));
          commit("SET_PROVIDER", "local");
          return true;
        } else {
          await deleteDoc(userRef);
          await deleteUser(auth.currentUser);
          commit("SET_LOGGED_IN", false);
          commit("SET_NOTIFICATION", {
            type: "error",
            message: "User not found in database, please register again.",
          });
          console.log("No such document!");
        }
      } catch (error) {
        dispatch("addNotification", {
          type: "error",
          message: error,
        });
        return false;
      }
    },

    async logOut(context) {
      try {
        await signOut(auth).then(console.log("User signed out!"));
        context.commit("SET_LOGGED_IN", false);
        context.commit("SET_USER_DETAILS", {
          displayName: "",
          email: "",
          photoURL: "",
          uid: "",
          about: "",
          address: "",
        });
        context.commit("SET_USER_ID", "");
        context.commit("SET_USER_REGISTERED", false);
      } catch (error) {
        console.error("Failed to log out:", error);
      }
    },

    async fetchUser({ commit }) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          commit("SET_LOGGED_IN", true);
          context.commit("SET_USER_DETAILS", {
            displayName: docSnap.get("displayName"),
            email: docSnap.get("email"),
            photoURL: docSnap.get("photoURL"),
            about: docSnap.get("about"),
            address: docSnap.get("address"),
          });
        } else {
          commit("SET_LOGGED_IN", false);
          commit("SET_USER", {
            displayName: "",
            email: "",
            photoURL: "",
            uid: "",
            about: "",
            address: "",
          });
        }
      });
    },

    async fetchUpdatedData({ commit }) {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          commit("SET_USER_DETAILS", {
            displayName: userData.displayName,
            email: userData.email,
            photoURL: userData.photoURL,
            about: userData.about,
            address: userData.address,
          });
          console.log(userData);
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user logged in");
      }
    },

    async registerWithGoogle(context, {}) {
      const provider = googleProvider;
      if (provider) {
        provider.setCustomParameters({
          prompt: "select_account",
        });
        try {
          await signInWithPopup(auth, provider).then(async (result) => {
            const user = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            context.commit("SET_LOGGED_IN", true);
            context.commit("SET_USER_ID", user.uid);

            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
              await setDoc(userRef, {
                userType: "",
                uid: user.uid,
                displayName: user.displayName,
                authProvider: "google",
                email: user.email,
                about: "",
                address: "",
                photoURL: user.photoURL,
                weight: 0,
                bankDetails: "",
              });
              context.commit("SET_USER_DETAILS", {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                about: "",
                address: "",
              });
              context.commit("SET_PROVIDER", "google");
            } else {
              const userSnap = await getDoc(userRef);
              const userData = userSnap.data();
              if (userData.userType === "") {
                await deleteDoc(userRef);
                await deleteUser(auth.currentUser);
                context.commit("SET_NOTIFICATION", {
                  type: "error",
                  message: "User not found in database, please register again.",
                });
                context.commit("SET_USER_REGISTERED", false);
              } else {
                context.commit("SET_USER_DETAILS", {
                  displayName: userData.displayName,
                  email: userData.email,
                  photoURL: userData.photoURL,
                  about: userData.about,
                  address: userData.address,
                });
                context.commit("SET_USER_REGISTERED", true);
                context.commit("SET_USER_TYPE", userData.userType);
                context.commit("SET_WEIGHT", userData.weight);
                context.commit("SET_BANK_DETAILS", userData.bankDetails);
                context.commit("SET_PROVIDER", "google");
              }
            }
          });
        } catch (error) {
          console.error("Failed to register with Google:", error);
        }
      } else {
        throw new Error("Unable to register with Google");
      }
    },

    async forgetPassword(context, email) {
      try {
        await sendPasswordResetEmail(auth, email).catch((error) => {
          context.dispatch("addNotification", {
            type: "error",
            message: error,
          });
          return "error";
        });
        context.dispatch("addNotification", {
          type: "success",
          message: "Password reset email sent for: " + email,
        });
        // console.log('Password reset email sent', email);
      } catch (error) {
        console.error("Failed to send password reset email:", error);
      }
    },

    async registerDetails(
      { dispatch, state, commit },
      { displayName, userType, about, address }
    ) {
      try {
        const uid = state.user.uid;
        console.log(uid);
        const userRef = doc(db, "users", uid);

        await updateDoc(userRef, {
          displayName: displayName,
          userType: userType,
          about: about,
          address: address,
        });
        const docSnap = await getDoc(userRef);
        console.log(docSnap.get("photoURL"));

        commit("SET_USER_DETAILS", {
          displayName: displayName,
          userType: userType,
          photoURL: docSnap.get("photoURL"),
          about: about,
          address: address,
        });
        commit("SET_USER_TYPE", userType);
        commit("SET_USER_REGISTERED", true);
        await sendEmailVerification(auth.currentUser).catch((error) => {
          dispatch("addNotification", {
            type: "error",
            message: error,
          });
        });
        dispatch("addNotification", {
          type: "success",
          message: "Details submitted successfully! Please verify your email.",
        });
      } catch (error) {
        console.error("Error updating user details: ", error);
      }
    },

    async reauthenticate({ dispatch, state, commit }, { email, password }) {
      try {
        const user = state.user;
        if (user.authProvider === "google") {
          const credential = GoogleAuthProvider.credential(email, password);
          await reauthenticateWithCredential(
            auth.currentUser,
            credential
          ).catch((error) => {
            dispatch("addNotification", {
              type: "error",
              message: "Failed email validation:" + error,
            });
          });
        } else {
          const credential = EmailAuthProvider.credential(email, password);
          await reauthenticateWithCredential(
            auth.currentUser,
            credential
          ).catch((error) => {
            dispatch("addNotification", {
              type: "error",
              message: "Failed email validation:" + error,
            });
          });
        }
      } catch (error) {
        console.error("Failed to reauthenticate:", error);
      }
    },

    async updateNewPassword(
      { dispatch, state, commit },
      { email, oldPassword, newPassword }
    ) {
      try {
        if (!auth.currentUser.emailVerified) {
          dispatch("addNotification", {
            type: "error",
            message: "Please verify the new email before changing password.",
          });
          return "error";
          //throw new Error("Please verify the new email before changing email.");
        } else {
          await dispatch("reauthenticate", { email, oldPassword });
          await updatePassword(auth.currentUser, newPassword).then(
            console.log("Password updated")
          );
          dispatch("addNotification", {
            type: "success",
            message: "Password updated successfully",
          });
        }
      } catch (error) {
        console.error("Failed to update password:", error);
      }
    },

    async resendEmailVerification({ dispatch }) {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          dispatch("addNotification", {
            type: "error",
            message: "No user is currently signed in",
          });
          throw new Error("No user is currently signed in");
        } else {
          if (currentUser.emailVerified) {
            dispatch("addNotification", {
              type: "error",
              message: "Email already verified",
            });
          } else {
            await sendEmailVerification(currentUser);
            dispatch("addNotification", {
              type: "success",
              message: "Verification email sent",
            });
          }
        }
      } catch (error) {
        dispatch("addNotification", {
          type: "error",
          message: error,
        });
      }
    },

    async uploadProfilePicture(context, file) {
      try {
        const user = context.state.user;
        console.log(user);
        const storageRef = ref(storage, `profilePictures/${user.uid}` + ".png");
        await uploadBytes(storageRef, file);
        console.log("Upload completed");
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, { photoURL: downloadURL }).then(
          await updateDoc(doc(db, "users", user.uid), {
            photoURL: downloadURL,
          })
        );
        context.commit("SET_USER_DETAILS", {
          displayName: context.state.user.displayName,
          email: context.state.user.email,
          photoURL: downloadURL,
          about: context.state.user.about,
          address: context.state.user.address,
        });

        await context
          .dispatch("fetchUpdatedData")
          .then(console.log("Profile picture uploaded"));
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
      }
    },

    async updateDisplayName(context, name) {
      try {
        const user = context.state.user;
        //await updateEmail(user, email);
        await updateDoc(doc(db, "users", user.uid), { displayName: name });
        context.commit("SET_USER_DETAILS", { ...user, displayName: name });
      } catch (error) {
        console.error("Failed to update email:", error);
      }
    },

    checkEmailVerified({ dispatch, state }) {
      if (!state.user.emailVerified) {
        dispatch("addNotification", {
          type: "error",
          message: "Please verify your email before proceeding",
        });
        return false;
      } else {
        return true;
      }
    },

    async updateEmail(
      { dispatch, state, commit },
      { oldEmail, newEmail, password }
    ) {
      try {
        const user = state.user;
        if (email != user.email) {
          if (!auth.currentUser.emailVerified) {
            dispatch("addNotification", {
              type: "error",
              message: "Please verify the new email before changing email.",
            });
            return "error";
            //throw new Error("Please verify the new email before changing email.");
          } else {
            await dispatch("reauthenticate", { oldEmail, password });
            await updateEmail(auth.currentUser, newEmail);
            dispatch("addNotification", {
              type: "success",
              message: "Email updated successfully",
            });
            await updateDoc(doc(db, "users", user.uid), { email: newEmail });
            commit("SET_USER_DETAILS", { ...user, email: newEmail });
          }
        } else {
          console.log("Email is the same");
        }
      } catch (error) {
        console.error("Failed to update email:", error);
        return "error";
      }
    },

    async updateAbout(context, about) {
      try {
        const user = context.state.user;
        //await updateEmail(user, email);
        await updateDoc(doc(db, "users", user.uid), { about: about });
        context.commit("SET_USER_DETAILS", { ...user, about: about });
      } catch (error) {
        console.error("Failed to update email:", error);
      }
    },

    async updateAddress(context, address) {
      try {
        const user = context.state.user;
        //await updateEmail(user, email);
        await updateDoc(doc(db, "users", user.uid), { address: address });
        context.commit("SET_USER_DETAILS", { ...user, address: address });
      } catch (error) {
        console.error("Failed to update email:", error);
      }
    },

    async addProductToDB({ commit }, product) {
      try {
        const storageRef = ref(storage, `products/${product.image.name}`); // Create a reference to the storage location
        const snapshot = await uploadBytes(storageRef, product.image); // Upload the file
        const imageUrl = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded file

        // Prepare the product object with the image URL
        const productToAdd = {
          name: product.name,
          category: product.category,
          weight: product.weight,
          sellerId: product.sellerId,
          imageUrl,
        };

        // Add the product object to Firestore
        const docRef = await addDoc(collection(db, "products"), productToAdd);
        await updateDoc(doc(db, "products", docRef.id), {
          productId: docRef.id,
        });
        productToAdd.productId = docRef.id;

        // Commit to Vuex state
        commit("ADD_PRODUCT", productToAdd);
      } catch (error) {
        console.error("Error adding product: ", error);
      }
    },

    async fetchProducts({ commit }) {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      commit("SET_PRODUCTS", products);
    },

    async deleteProduct({ commit }, productId) {
      try {
        await deleteDoc(doc(db, "products", productId));
        commit("REMOVE_PRODUCT", productId);
      } catch (error) {
        console.error("Error deleting product:", error);
        // Handle the error appropriately
      }
    },

    async addListing({ commit }, newListing) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set now to beginning of the day
      newListing.unitsRemaining = Number(newListing.unitsToSell);
      newListing.createdDate = now;
      newListing.isActive =
        newListing.unitsRemaining > 0 &&
        new Date(newListing.expirationDate) >= now;
      const docRef = await addDoc(collection(db, "listings"), newListing);
      await updateDoc(doc(db, "listings", docRef.id), {
        listingId: docRef.id,
      });
      newListing.listingId = docRef.id;
      commit("ADD_LISTING", { id: docRef.id, ...newListing });
    },

    async editListing({ commit }, editedListing) {
      try {
        const id = editedListing.listingId;
        const listingRef = doc(db, "listings", id);
        await updateDoc(listingRef, editedListing);
        commit("updateListing", { id, editedListing });
      } catch (error) {
        console.error("Error updating listing:", error);
      }
    },

    async fetchActiveListingsWithProductDetails({ commit }, sellerId) {
      const activeListingsQuery = query(
        collection(db, "listings"),
        where("isActive", "==", true),
        where("sellerId", "==", sellerId)
      );
      const querySnapshot = await getDocs(activeListingsQuery);

      const listings = await Promise.all(
        querySnapshot.docs.map(async (listingDoc) => {
          const listing = listingDoc.data();
          //const productRef = doc(db, "products", String(listing.productId));
          //const productSnap = await getDoc(productRef);

          // Assuming the product exists and adding a check for the same
          //if (productSnap.exists()) {
          //const product = productSnap.data();
          // Return the listing with additional product details
          //   return {
          //     ...listing,
          //     productName: product.name,
          //     productImage: product.imageUrl,
          //     productCategory: product.category,
          //   };
          // }

          // If the product does not exist, return the listing without product details
          return listing;
        })
      );

      commit("SET_ACTIVE_LISTINGS", listings);
    },

    async fetchInactiveListingsWithProductDetails({ commit }, sellerId) {
      const inactiveListingsQuery = query(
        collection(db, "listings"),
        where("isActive", "==", false),
        where("sellerId", "==", sellerId)
      );
      const querySnapshot = await getDocs(inactiveListingsQuery);

      const listings = await Promise.all(
        querySnapshot.docs.map(async (listingDoc) => {
          const listing = listingDoc.data();
          // const productRef = doc(db, "products", listing.productId);
          // const productSnap = await getDoc(productRef);

          // // Assuming the product exists and adding a check for the same
          // if (productSnap.exists()) {
          //   const product = productSnap.data();
          //   // Return the listing with additional product details
          //   return {
          //     ...listing,
          //     productName: product.name,
          //     productImage: product.imageUrl,
          //     productCategory: product.category,
          //   };
          // }

          // If the product does not exist, return the listing without product details
          return listing;
        })
      );

      commit("SET_INACTIVE_LISTINGS", listings);
    },

    async checkAndUpdateListingStatus({ commit }) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Use start of the day for comparison
      const listingsRef = collection(db, "listings");

      const querySnapshot = await getDocs(listingsRef);

      const updates = [];
      querySnapshot.forEach((doc) => {
        const listing = doc.data();
        //const listingExpirationDate = new Date(listing.expirationDate.seconds * 1000);

        // Determine if the listing should be marked as inactive
        const shouldBeInactive =
          listing.unitsRemaining <= 0 || new Date(listing.expirationDate) < now;

        if (listing.isActive && shouldBeInactive) {
          // Only update if the listing is currently active but should be inactive
          updates.push({
            id: doc.id,
            updateFn: updateDoc(doc.ref, { isActive: false }),
          });
        }
      });

      // Execute all update operations
      await Promise.all(updates.map((u) => u.updateFn));

      // Commit updates to the Vuex store
      updates.forEach(({ id }) => {
        commit("UPDATE_LISTING_STATUS", { listingId: id, isActive: false });
      });
    },

    async deleteListing({ commit }, listingId) {
      try {
        await deleteDoc(doc(db, "listings", listingId));
        commit("REMOVE_LISTING", listingId);
      } catch (error) {
        console.error("Error deleting listing:", error);
        // Handle the error appropriately
      }
    },

    addNotification({ commit }, { type, message }) {
      // Assign a unique ID to the notification
      const notification = {};
      notification.id = Date.now();
      notification.type = type;
      notification.icon = "$" + type;
      notification.message = message;
      commit("SET_NOTIFICATION", notification);
      setTimeout(() => {
        commit("CLEAR_NOTIFICATION");
      }, 7000);
    },

    removeNotification({ commit }) {
      commit("CLEAR_NOTIFICATION");
    },

    async updateBankDetails(
      { dispatch, state, commit },
      { bankDetails, password }
    ) {
      try {
        const secretKey = import.meta.env.VITE_APP_SECRET_KEY;
        const ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(bankDetails),
          secretKey
        ).toString();
        const uid = state.user.uid;
        const userRef = doc(db, "users", uid);
        const email = state.user.email;
        await dispatch("reauthenticate", { email, password });
        await updateDoc(userRef, {
          bankDetails: ciphertext,
        });
        commit("SET_BANK_DETAILS", ciphertext);
        dispatch("addNotification", {
          type: "success",
          message: "Bank details updated successfully",
        });
      } catch (error) {
        dispatch("addNotification", {
          type: "error",
          message: error,
        });
        //console.error("Error updating bank details:", error);
      }
    },

    async fetchWeight({ commit }) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            // Commit mutation to update user state
            commit("SET_WEIGHT", userData.weight);
          }
        });
      }
    },

    fetchProducts({ commit }) {
      const products = [];
      commit(
        "SET_PRODUCTS",
        products.filter((p) => p.isActive)
      );
    },

    addToCart({ commit }, item) {
      commit("ADD_TO_CART", item);
    },
    removeFromCart({ commit }, listingId) {
      commit("REMOVE_FROM_CART", listingId);
    },

    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
  },
});

export default store;
