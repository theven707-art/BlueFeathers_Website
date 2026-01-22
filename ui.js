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

