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
    if (!container) return;

    // Load local reviews first
    const localReviews = JSON.parse(localStorage.getItem('my_reviews') || '[]');

    if (db) {
        try {
            db.collection("reviews")
                .where("approved", "==", true)
                .orderBy("timestamp", "desc")
                .limit(20)
                .onSnapshot((snapshot) => {
                    container.innerHTML = '';
                    let reviews = [];

                    if (!snapshot.empty) {
                        snapshot.forEach(doc => reviews.push(doc.data()));
                    }

                    // Merge local reviews if they are not already in the list (simple check by name/text)
                    localReviews.forEach(localRev => {
                        const exists = reviews.some(r => r.name === localRev.name && r.text === localRev.text);
                        if (!exists) {
                            // Local reviews might effectively be "newer" or "pending" if offline
                            // We insert them at the top
                            reviews.unshift(localRev);
                        }
                    });

                    if (reviews.length === 0) {
                        showDefaultReviews(container, localReviews);
                    } else {
                        renderReviews(container, reviews);
                    }

                }, (error) => {
                    console.warn("Firestore reviews error:", error);
                    showDefaultReviews(container, localReviews);
                });
        } catch (error) {
            console.warn("Reviews loading error:", error);
            showDefaultReviews(container, localReviews);
        }
    } else {
        showDefaultReviews(container, localReviews);
    }
}

function showDefaultReviews(container, localReviews = []) {
    container.innerHTML = '';
    const defaults = [
        { name: "Kasun P.", rating: 5, text: "Amazing facilities! The badminton court is world-class and the booking system makes it so easy.", timestamp: { toDate: () => new Date() } }, // Mock timestamp
        { name: "Dilani S.", rating: 5, text: "The gym equipment is top-notch and the monthly membership is great value. Best sports club in Moratuwa!", timestamp: { toDate: () => new Date() } },
        { name: "Ruwan M.", rating: 5, text: "My kids love the swimming pool! Coach Tejaka is excellent. The restaurant food is delicious too.", timestamp: { toDate: () => new Date() } },
        { name: "Sanjaya K.", rating: 4, text: "Great atmosphere and friendly staff. Highly recommend for families.", timestamp: { toDate: () => new Date() } },
        { name: "Nimali P.", rating: 5, text: "Clean and well maintained. The online booking is a lifesaver.", timestamp: { toDate: () => new Date() } }
    ];

    // Combine local reviews with defaults
    // Put local reviews first
    const combined = [...localReviews, ...defaults];
    renderReviews(container, combined);
}

function renderReviews(container, reviews) {
    container.innerHTML = ''; // Clear current content

    // Sort logic could go here if timestamps were consistent, but we trust the order for now (local first, then firestore/defaults)

    // Render all reviews
    reviews.forEach((data, index) => {
        let dateStr = 'Recent';
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
            dateStr = data.timestamp.toDate().toLocaleDateString();
        } else if (data.timestamp) {
            // Handle simple date string or object from localStorage
            dateStr = new Date(data.timestamp).toLocaleDateString();
            if (dateStr === 'Invalid Date') dateStr = 'Recent';
        }

        // Show first 5, hide rest
        addReviewToUI(data.name, data.rating, data.text, dateStr, index >= 5, false);
    });

    // Add Toggle Button if needed
    if (reviews.length > 5) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'see-more-container';
        // Check if we are currently expanded or not (re-rendering preserves state logic if we wanted, but here we reset to collapsed on refresh)
        // Ideally we'd check if any .hidden-review exists, but we just rendered them.
        btnContainer.innerHTML = `<button class="btn secondary" id="toggle-reviews-btn" onclick="toggleReviews()">See More Reviews ⬇️</button>`;
        container.appendChild(btnContainer);
    }
}

window.toggleReviews = function () {
    const btn = document.getElementById('toggle-reviews-btn');
    const hiddenReviews = document.querySelectorAll('.hidden-review');
    const revealedReviews = document.querySelectorAll('.reveal-review');

    if (btn.innerText.includes('See More')) {
        // Expand
        hiddenReviews.forEach(card => {
            card.classList.remove('hidden-review');
            card.classList.add('reveal-review');
            card.style.display = 'block'; // Ensure visibility override
        });
        btn.innerHTML = 'See Less Reviews ⬆️';
    } else {
        // Collapse
        // We need to identify which ones were supposed to be hidden. 
        // Based on our render logic, the items at index >= 5 should be hidden.
        // Let's grab all cards.
        const allCards = document.querySelectorAll('.testimonial-card');
        allCards.forEach((card, index) => {
            if (index >= 5) {
                card.classList.add('hidden-review');
                card.classList.remove('reveal-review');
                card.style.display = ''; // Revert to CSS class handling
            }
        });
        btn.innerHTML = 'See More Reviews ⬇️';

        // Optional: Scroll back to top of reviews or button
        // btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

function addReviewToUI(name, rating, text, date, isHidden = false, insertAtTop = false) {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    const emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const starsStr = '⭐'.repeat(rating);
    const card = document.createElement('div');
    card.className = `testimonial-card ${isHidden ? 'hidden-review' : ''}`;
    card.innerHTML = `
        <div class="testimonial-stars">${starsStr}</div>
        <p class="testimonial-text">${escapeHtml(text)}</p>
        <p class="testimonial-author">— ${escapeHtml(name)}</p>
        <p class="testimonial-date">${date}</p>
    `;

    if (insertAtTop) {
        // Insert after the grid starts, but check if there are any existing cards
        container.insertBefore(card, container.firstChild);
    } else {
        // If we are appending, we need to be careful about the "See More" button which might be at the end.
        // But renderReviews clears the container first, so 'append' is fine there.
        // This function is also called by submitReview fallback.

        // If there is a "See More" button, we probably want to insert BEFORE it if we are just "appending" in a flow?
        // But for submitReview fallback, we will use insertAtTop = true.
        container.appendChild(card);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


/**
 * Parses a time string like "3PM-4PM" or "9AM-10AM" and returns
 * { startHour: number, endHour: number } in 24h format.
 */
function parseTimeSlot(timeStr) {
    const parts = timeStr.split('-');
    function toHour24(s) {
        s = s.trim();
        if (s === '12AM') return 0;
        if (s === '12PM') return 12;
        const num = parseInt(s);
        if (s.includes('PM') && num !== 12) return num + 12;
        if (s.includes('AM') && num === 12) return 0;
        return num;
