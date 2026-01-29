// ===== Blue Feathers - Firebase Booking & Reviews =====
// Uses Firebase Compat SDK (loaded via script tags in HTML)

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCd6VfzKNoSO3KISKwUXZUM1rJ34YFYqgg",
    authDomain: "bluefeathers-booking-48cef.firebaseapp.com",
    projectId: "bluefeathers-booking-48cef",
    storageBucket: "bluefeathers-booking-48cef.firebasestorage.app",
    messagingSenderId: "939459423530",
    appId: "1:939459423530:web:b83760e100ba97b21d8253",
    measurementId: "G-HZT4HEMPZB"
};

// Initialize Firebase
let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("✅ Firebase Initialized Successfully");
} catch (e) {
    console.warn("⚠️ Firebase not available:", e.message);
}

