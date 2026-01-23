// ===== Blue Feathers - Advanced UI Engine =====

// --- Permanent Bookings (always show as BOOKED in the timetable) ---
// Format: permanentBookings[Day] = { 'TimeSlot': 'Name' }
window.permanentBookings = {
    'Monday': {
        '6PM-7PM': 'RODESHA', '7PM-8PM': 'RODESHA',
        '8PM-9PM': 'ANTON', '9PM-10PM': 'ANTON', '10PM-11PM': 'ANTON'
    },
    'Tuesday': {
        '4PM-5PM': 'ASANKA', '5PM-6PM': 'ASANKA',
        '6PM-7PM': 'ASANKA PRT', '7PM-8PM': 'ASANKA PRT', '8PM-9PM': 'ASANKA PRT',
        '9PM-10PM': 'ANIL', '10PM-11PM': 'ANIL'
    },
    'Wednesday': {
        '7PM-8PM': 'ANTON', '8PM-9PM': 'ANTON', '9PM-10PM': 'ANTON'
    },
    'Thursday': {
        '6PM-7PM': 'RODESHA', '7PM-8PM': 'RODESHA',
        '8PM-9PM': 'DANUSHKA', '9PM-10PM': 'DANUSHKA'
    },
    'Friday': {
        '4PM-5PM': 'ASANKA', '5PM-6PM': 'ASANKA PRT',
        '6PM-7PM': 'ASANKA PRT', '7PM-8PM': 'ASANKA', '8PM-9PM': 'ASANKA',
        '9PM-10PM': 'ASANKA', '10PM-11PM': 'ASANKA'
    },
    'Saturday': {
        '11AM-12PM': 'NIHINSA',
        '4PM-5PM': 'ASANKA', '5PM-6PM': 'ASANKA',
        '6PM-7PM': 'ANIL', '7PM-8PM': 'ANIL', '8PM-9PM': 'ANIL', '9PM-10PM': 'ANIL'
    },
    'Sunday': {
        '4PM-5PM': 'ASANKA', '5PM-6PM': 'ASANKA',
        '6PM-7PM': 'ASANKA', '7PM-8PM': 'ASANKA',
        '8PM-9PM': 'DINUPA', '9PM-10PM': 'DINUPA'
    }
};

// --- Fallback Timetable (renders immediately, overwritten by Firebase if loaded) ---
(function () {
    const tbody = document.getElementById('timetable-body');
    if (!tbody) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '6AM-7AM', '7AM-8AM', '8AM-9AM', '9AM-10AM', '10AM-11AM', '11AM-12PM', '12PM-1PM', '1PM-2PM',
        '2PM-3PM', '3PM-4PM', '4PM-5PM', '5PM-6PM', '6PM-7PM',
        '7PM-8PM', '8PM-9PM', '9PM-10PM', '10PM-11PM', '11PM-12AM'
    ];

    // Populate the time dropdown for auto-fill (Removed - Handled dynamically in script.js)
    /*
    const timeSelect = document.getElementById('booking-time');
    if (timeSelect && timeSelect.options.length <= 1) {
        timeSlots.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            timeSelect.appendChild(opt);
        });
    }
    */

    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('th');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement('td');
            const permanentName = window.permanentBookings[day] ? window.permanentBookings[day][time] : null;

            if (permanentName) {
                cell.textContent = permanentName; // Show name like 'ASANKA'
                cell.className = 'booked';
                cell.style.fontSize = '0.75rem'; // Make slightly smaller to fit
            } else {
                cell.textContent = 'AVAILABLE';
                cell.className = 'available';
                cell.onclick = () => {
                    const dayInput = document.getElementById('booking-day');
                    const timeInput = document.getElementById('booking-time');
                    const bookingForm = document.querySelector('.booking-form');

                    if (dayInput) dayInput.value = day;
                    if (timeInput) timeInput.value = time;
                    if (bookingForm) bookingForm.scrollIntoView({ behavior: 'smooth' });

                    document.querySelectorAll('#timetable-body td.selected').forEach(c => c.classList.remove('selected'));
                    cell.classList.add('selected');
                };
            }
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
})();
