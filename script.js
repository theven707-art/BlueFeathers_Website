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
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement('td');

            // Priority 1: Permanent Booking
            const permanentName = window.permanentBookings &&
                window.permanentBookings[day] ?
                window.permanentBookings[day][time] : null;

            // Priority 2: User Booking
            const booking = realtimeBookings[day] ? realtimeBookings[day][time] : null;

            if (permanentName) {
                cell.textContent = permanentName;
                cell.className = 'booked';
                cell.style.fontSize = '0.75rem';
                cell.style.backgroundColor = '#fee2e2'; // Light red for permanent
                cell.style.color = '#991b1b';
            } else if (booking) {
                if (booking.status === 'booked') {
                    cell.textContent = 'BOOKED';
                    cell.className = 'booked';
                } else if (booking.status === 'pending') {
                    cell.textContent = 'PENDING';
                    cell.className = 'pending';
                }
            } else {
                cell.textContent = 'AVAILABLE';
                cell.className = 'available';

                // Check if currently selected
                const isSelected = selectedSlots.some(slot => slot.day === day && slot.time === time);
                if (isSelected) {
                    cell.classList.add('selected');
                }

                cell.onclick = () => toggleSlot(day, time);
            }
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    // Update summary UI instead of dropdown
    updateBookingSummary();
}

function updateTimeDropdown() {
    // Deprecated in favor of updateBookingSummary, keeping empty for safety
}

// Old updateTimeDropdown removed

function selectSlot_OLD(day, time) {
    const dayInput = document.getElementById('booking-day');
    const timeInput = document.getElementById('booking-time');
    const bookingForm = document.querySelector('.booking-form');

    if (dayInput) {
        dayInput.value = day;
        // Trigger the update manually so the time options are populated
        updateTimeDropdown();
    }

    if (timeInput) {
        timeInput.value = time;
    }

    if (bookingForm) bookingForm.scrollIntoView({ behavior: 'smooth' });

    document.querySelectorAll('#timetable-body td.selected').forEach(c => c.classList.remove('selected'));
    if (event && event.target) {
        event.target.classList.add('selected');
    }
}

// SUBMIT Booking to Firebase
// function prepareBooking_OLD removed


// --- REVIEWS SYSTEM ---

let selectedRating = 0;

function initStarRating() {
    const container = document.getElementById('star-rating');
    if (!container) return;

    const stars = container.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                s.textContent = parseInt(s.getAttribute('data-value')) <= val ? '★' : '☆';
                s.style.color = parseInt(s.getAttribute('data-value')) <= val ? '#FBBF24' : '#CBD5E1';
            });
        });
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                s.textContent = parseInt(s.getAttribute('data-value')) <= selectedRating ? '★' : '☆';
                s.style.color = parseInt(s.getAttribute('data-value')) <= selectedRating ? '#FBBF24' : '#CBD5E1';
            });
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                s.textContent = parseInt(s.getAttribute('data-value')) <= selectedRating ? '★' : '☆';
                s.style.color = parseInt(s.getAttribute('data-value')) <= selectedRating ? '#FBBF24' : '#CBD5E1';
            });
        });
    });
}

window.submitReview = async function () {
    const name = document.getElementById('review-name')?.value?.trim();
    const text = document.getElementById('review-text')?.value?.trim();

    if (!name || !text) { alert('Please fill in your name and review!'); return; }
    if (selectedRating === 0) { alert('Please select a star rating!'); return; }

    const reviewData = {
        name: name,
        rating: selectedRating,
        text: text,
        timestamp: new Date().toISOString(), // Use string for local storage compatibility
        approved: true
    };

    // Save to LocalStorage immediately
    try {
        const localReviews = JSON.parse(localStorage.getItem('my_reviews') || '[]');
        localReviews.unshift(reviewData); // Add to beginning
        localStorage.setItem('my_reviews', JSON.stringify(localReviews));
    } catch (e) { console.warn("Could not save to local storage", e); }

    if (db) {
        try {
            await db.collection("reviews").add({
                ...reviewData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Overwrite with server time for DB
            });
            alert('Thank you for your review! ⭐');
            // The snapshot listener in loadReviews will handle the UI update normally, 
            // but since we updated localStorage, we can also force a reload or just let the realtime listener work.
            // For immediate feedback without waiting for listener:
            addReviewToUI(name, selectedRating, text, 'Just now', false, true);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert('Thank you for your review! ⭐\n(Saved locally)');
            addReviewToUI(name, selectedRating, text, 'Just now', false, true);
        }
    } else {
        alert('Thank you for your review! ⭐');
        addReviewToUI(name, selectedRating, text, 'Just now', false, true);
    }

    document.getElementById('review-name').value = '';
    document.getElementById('review-text').value = '';
    selectedRating = 0;
    document.querySelectorAll('#star-rating .star').forEach(s => { s.textContent = '☆'; s.style.color = '#CBD5E1'; });
};

function loadReviews() {
    const container = document.getElementById('reviews-container');
