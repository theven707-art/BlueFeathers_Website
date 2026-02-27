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

// --- Preloader ---
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 600);
        }, 800);
    }

    // --- Initialize Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // --- Animated Counters ---
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'), 10);
                    const suffix = target.getAttribute('data-suffix') || '';
                    const prefix = target.getAttribute('data-prefix') || '';
                    if (isNaN(finalValue)) return;

                    let current = 0;
                    const increment = Math.max(1, Math.floor(finalValue / 60));
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= finalValue) {
                            current = finalValue;
                            clearInterval(timer);
                        }
                        target.textContent = prefix + current.toLocaleString() + suffix;
                    }, 25);

                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // --- Lightbox for Gallery ---
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const lightboxImg = lightboxOverlay ? lightboxOverlay.querySelector('img') : null;

    document.querySelectorAll('.gallery-item img, .menu-images img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            if (lightboxOverlay && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// --- Header scroll effect ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// --- Mobile menu toggle ---
window.toggleMenu = function () {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
};

// --- Back to Top scroll ---
document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Coach Contact Click Handler ---
    document.querySelectorAll('.coach-card').forEach(card => {
        card.addEventListener('click', () => {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3 && p) {
                const name = h3.textContent.trim();
                const phoneMatch = p.textContent.match(/[\d-]+/);
                if (phoneMatch) {
                    const phone = phoneMatch[0].replace(/-/g, '').trim();
                    if (confirm(`Would you like to call ${name}?`)) {
                        window.location.href = `tel:${phone}`;
                    }
                }
            }
        });
    });
});
