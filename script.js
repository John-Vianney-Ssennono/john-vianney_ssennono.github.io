/**
 * John Vianney Ssennono — Official Portfolio Scripts
 * Apple Vision Glass & Navy/Brown Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initHardwareSimulator();
    initDoorSimulator();
    initResumeModal();
    initClipboardCopy();
    initContactForm();
    initScrollSpy();
});

/* ---------------------------------------------------------------------------------------------
   1. THEME SWITCHING (DARK / LIGHT WITH LOCALSTORAGE & OS SYNC)
   --------------------------------------------------------------------------------------------- */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeLabelText = document.getElementById('themeLabelText');
    const html = document.documentElement;

    // Detect saved theme or system preference
    const savedTheme = localStorage.getItem('john_portfolio_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark theme as requested for rich Apple Vision aesthetic, or user choice
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('john_portfolio_theme', newTheme);
            showToast(`Switched to ${newTheme.toUpperCase()} theme`);
        });
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (themeLabelText) {
            themeLabelText.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        }
    }
}

/* ---------------------------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   --------------------------------------------------------------------------------------------- */
function initMobileNav() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (!mobileBtn || !drawer) return;

    mobileBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            drawer.classList.remove('open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
            drawer.classList.add('open');
            mobileBtn.setAttribute('aria-expanded', 'true');
            mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
    });

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !mobileBtn.contains(e.target) && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
}

/* ---------------------------------------------------------------------------------------------
   3. HARDWARE FIRMWARE SIMULATOR (AUTONOMOUS VISION GLASSES)
   --------------------------------------------------------------------------------------------- */
function initHardwareSimulator() {
    const slider = document.getElementById('distanceSlider');
    const distanceVal = document.getElementById('distanceVal');
    const simStatusPill = document.getElementById('simStatusPill');
    const simLogicVal = document.getElementById('simLogicVal');
    const simPulseVal = document.getElementById('simPulseVal');
    const simAcousticVal = document.getElementById('simAcousticVal');

    if (!slider || !distanceVal) return;

    const SPEED_OF_SOUND_AIR = 0.0343; // cm per microsecond
    const THRESHOLD_CM = 15;

    function updateSimulation(cm) {
        // Speed of sound: round trip travel time in microseconds: (2 * cm) / 0.0343 ≈ cm * 58.3
        const pulseTimeUs = Math.round((2 * cm) / SPEED_OF_SOUND_AIR);
        distanceVal.textContent = `${cm} cm`;
        simPulseVal.textContent = `${pulseTimeUs.toLocaleString()} µs`;

        if (cm <= THRESHOLD_CM) {
            // Threshold exceeded — alert state
            simStatusPill.textContent = '⚠️ OBSTACLE ALERT (<15cm)';
            simStatusPill.className = 'sim-status sim-alert';
            simLogicVal.textContent = 'ALERT (Sub-15ms Loop)';
            simLogicVal.style.color = '#ef4444';
            
            // Frequency scales higher the closer the obstacle is
            const freq = Math.round(2400 + (THRESHOLD_CM - cm) * 120);
            simAcousticVal.textContent = `${freq} Hz (Pulsing)`;
            simAcousticVal.style.color = '#f59e0b';
        } else {
            // Normal clearance
            simStatusPill.textContent = 'Safe Clearance';
            simStatusPill.className = 'sim-status';
            simLogicVal.textContent = 'IDLE (Clear Path)';
            simLogicVal.style.color = 'var(--status-emerald)';
            simAcousticVal.textContent = 'Muted (0 Hz)';
            simAcousticVal.style.color = 'var(--text-primary)';
        }
    }

    slider.addEventListener('input', (e) => {
        updateSimulation(parseInt(e.target.value, 10));
    });

    // Initialize
    updateSimulation(parseInt(slider.value, 10));
}

/* ---------------------------------------------------------------------------------------------
   4. DOOR REED SWITCH CIRCUIT SIMULATOR
   --------------------------------------------------------------------------------------------- */
function initDoorSimulator() {
    const toggleBtn = document.getElementById('toggleDoorBtn');
    const doorStatusPill = document.getElementById('doorStatusPill');
    const circuitLed = document.getElementById('circuitLed');
    const circuitLedText = document.getElementById('circuitLedText');

    if (!toggleBtn || !circuitLed) return;

    let isAvailable = true;

    toggleBtn.addEventListener('click', () => {
        isAvailable = !isAvailable;

        if (isAvailable) {
            doorStatusPill.textContent = 'Office Open (Green LED)';
            doorStatusPill.className = 'sim-status';
            circuitLed.classList.remove('led-red');
            circuitLedText.textContent = 'ACTIVE: GREEN (Available)';
            circuitLedText.style.color = 'var(--status-emerald)';
            toggleBtn.innerHTML = '<i class="fa-solid fa-toggle-on"></i> Toggle Door State';
        } else {
            doorStatusPill.textContent = 'Office In Use / Closed (Red LED)';
            doorStatusPill.className = 'sim-status sim-alert';
            circuitLed.classList.add('led-red');
            circuitLedText.textContent = 'ACTIVE: RED (Busy / In Meeting)';
            circuitLedText.style.color = 'var(--status-red)';
            toggleBtn.innerHTML = '<i class="fa-solid fa-toggle-off"></i> Toggle Door State';
        }
    });
}

/* ---------------------------------------------------------------------------------------------
   5. RESUME MODAL & PRINTING
   --------------------------------------------------------------------------------------------- */
function initResumeModal() {
    const modal = document.getElementById('resumeModal');
    const openBtn = document.getElementById('openResumeBtn');
    const closeBtn = document.getElementById('closeResumeBtn');
    const printBtn = document.getElementById('printResumeBtn');

    if (!modal) return;

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/* ---------------------------------------------------------------------------------------------
   6. INSTANT CLIPBOARD COPY WITH TOAST NOTIFICATIONS
   --------------------------------------------------------------------------------------------- */
function initClipboardCopy() {
    const copyBtns = document.querySelectorAll('[data-copy]');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied "${textToCopy}" to clipboard!`);
                
                // Visual button feedback
                const icon = btn.querySelector('i');
                if (icon) {
                    const originalClass = icon.className;
                    icon.className = 'fa-solid fa-check text-emerald';
                    setTimeout(() => {
                        icon.className = originalClass;
                    }, 2000);
                }
            }).catch(() => {
                showToast(`Failed to copy to clipboard`);
            });
        });
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

/* ---------------------------------------------------------------------------------------------
   7. CONTACT FORM SUBMISSION
   --------------------------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('senderName').value;
        const email = document.getElementById('senderEmail').value;
        const subject = document.getElementById('messageSubject').value;
        const body = document.getElementById('messageBody').value;

        const emailRecipient = 'john.vianney.ssennono-1@ou.edu';
        const formattedSubject = encodeURIComponent(`[Portfolio Contact] ${subject} from ${name}`);
        const formattedBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${body}`
        );

        showToast('Opening default email application...');
        window.location.href = `mailto:${emailRecipient}?subject=${formattedSubject}&body=${formattedBody}`;
    });
}

/* ---------------------------------------------------------------------------------------------
   8. ACTIVE NAV SCROLLSPY
   --------------------------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 160;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}
