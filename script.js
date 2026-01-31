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

// --- BADMINTON BOOKING LOGIC ---

// --- BADMINTON BOOKING LOGIC ---

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
    '6AM-7AM', '7AM-8AM', '8AM-9AM', '9AM-10AM', '10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM',
    '2PM-3PM', '3PM-4PM', '4PM-5PM', '5PM-6PM', '6PM-7PM',
    '7PM-8PM', '8PM-9PM', '9PM-10PM', '10PM-11PM', '11PM-12AM'
];
const PRICE_PER_HOUR = 1000;

// Global state for bookings
let realtimeBookings = {};
let selectedSlots = []; // Array of {day, time} objects

// Populate timetable with Real-time Data from Firebase
function populateTimetableFirebase() {
    if (!db) return;

    // Listener 1: Permanent Bookings
    db.collection("permanent_bookings").onSnapshot(snapshot => {
        const newPerm = {};
        snapshot.forEach(doc => {
            newPerm[doc.id] = doc.data(); // { '6PM-7PM': 'Name' }
        });
        window.permanentBookings = newPerm;
        renderTimetable();
    });

    // Listener 2: User Bookings
    db.collection("bookings").onSnapshot(snapshot => {
        realtimeBookings = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!realtimeBookings[data.day]) realtimeBookings[data.day] = {};
            realtimeBookings[data.day][data.time] = data;
        });
        renderTimetable();
    });
}

function renderTimetable() {
    const tbody = document.getElementById('timetable-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('th');
        timeCell.textContent = time;
