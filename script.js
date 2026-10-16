/**
 * =============================================================================================
 * JOHN VIANNEY SSENNONO — OFFICIAL PORTFOLIO CONTROLLER JAVASCRIPT
 * =============================================================================================
 * What this file is:
 * This script powers the interactive features of John Vianney Ssennono's personal engineering
 * portfolio website. It manages dark/light theme switching, simulated embedded microcontroller
 * firmware logic for obstacle detection, hardware circuit visualizers, modal popups, clipboard
 * copying with toast notifications, and smooth navigation scroll-tracking.
 *
 * Designed with Apple Human Interface Guidelines in mind:
 * - Ultra-low-latency feedback on user interactions.
 * - Non-blocking event listeners with passive scroll optimization.
 * - Seamless preservation of user preferences using browser localStorage.
 * =============================================================================================
 */

// Listen for the DOMContentLoaded event to ensure the browser has parsed all HTML elements before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the Dark/Light theme system, checking saved preferences and system defaults
    initTheme();
    // 2. Initialize the responsive mobile drawer navigation menu for smartphones and tablets
    initMobileNav();
    // 3. Initialize the embedded firmware logic simulator for the Autonomous Vision Glasses
    initHardwareSimulator();
    // 4. Initialize the live digital circuit state visualizer for the Door Reed Switch system
    initDoorSimulator();
    // 5. Initialize the Apple-style interactive modal dialog for viewing and printing the resume
    initResumeModal();
    // 6. Initialize one-click clipboard copying for email and phone numbers with visual toast feedback
    initClipboardCopy();
    // 7. Initialize the contact form to dispatch pre-formatted inquiries to John's university inbox
    initContactForm();
    // 8. Initialize the scroll-spy observer to highlight the active section in the navigation bar
    initScrollSpy();
});

/* ---------------------------------------------------------------------------------------------
   1. THEME SWITCHING (DARK / LIGHT WITH LOCALSTORAGE & OS SYNC)
   --------------------------------------------------------------------------------------------- */
function initTheme() {
    // Locate the theme toggle button element in the DOM by its unique ID
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    // Locate the text label element inside the button that displays "Dark" or "Light"
    const themeLabelText = document.getElementById('themeLabelText');
    // Grab a reference to the root <html> element where our data-theme attribute is placed
    const html = document.documentElement;

    // Retrieve any previously saved user theme preference from browser local storage
    const savedTheme = localStorage.getItem('john_portfolio_theme');
    // Query the user's operating system to check if they prefer dark mode at the system level
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Choose the initial theme: prioritize user's saved choice, then OS preference, defaulting to dark
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    // Apply the chosen initial theme immediately to prevent any visual theme flicker
    applyTheme(initialTheme);

    // Verify the theme toggle button exists in the DOM before attaching an event listener
    if (themeToggleBtn) {
        // Attach a click event listener to toggle between dark and light themes on demand
        themeToggleBtn.addEventListener('click', () => {
            // Read the current active theme from the data-theme attribute, defaulting to 'dark'
            const currentTheme = html.getAttribute('data-theme') || 'dark';
            // Invert the theme: if currently dark, switch to light; if light, switch to dark
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            // Apply the new theme to update all CSS custom variables across the site
            applyTheme(newTheme);
            // Persist the user's explicit theme choice into localStorage for future visits
            localStorage.setItem('john_portfolio_theme', newTheme);
            // Display an Apple-style toast notification confirming the theme change
            showToast(`Switched to ${newTheme.toUpperCase()} theme`);
        });
    }

    // Helper function to update the DOM attribute and label text for a given theme
    function applyTheme(theme) {
        // Set the data-theme attribute on the root <html> element (activates CSS rules)
        html.setAttribute('data-theme', theme);
        // If the label text element exists, update its displayed string with capitalization
        if (themeLabelText) {
            // Capitalize the first letter (e.g., 'dark' -> 'Dark', 'light' -> 'Light')
            themeLabelText.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        }
    }
}

/* ---------------------------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   --------------------------------------------------------------------------------------------- */
function initMobileNav() {
    // Locate the hamburger menu button in the mobile navigation bar
    const mobileBtn = document.getElementById('mobileMenuBtn');
    // Locate the mobile slide-down drawer container element
    const drawer = document.getElementById('mobileDrawer');
    // Query all navigational anchor links located inside the mobile drawer
    const drawerLinks = document.querySelectorAll('.drawer-link');

    // If either element is missing from the page, exit early to avoid JavaScript errors
    if (!mobileBtn || !drawer) return;

    // Attach a click handler to the hamburger button to toggle the menu open and closed
    mobileBtn.addEventListener('click', () => {
        // Check whether the drawer currently has the 'open' CSS class applied
        const isOpen = drawer.classList.contains('open');
        // If it is currently open, close it
        if (isOpen) {
            // Remove the 'open' class to trigger the smooth CSS slide-up transition
            drawer.classList.remove('open');
            // Update the ARIA attribute for screen reader accessibility
            mobileBtn.setAttribute('aria-expanded', 'false');
            // Restore the hamburger bars icon inside the button
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
            // If it is closed, add the 'open' class to reveal the navigation links
            drawer.classList.add('open');
            // Update the ARIA attribute to notify assistive technologies that it is expanded
            mobileBtn.setAttribute('aria-expanded', 'true');
            // Change the button icon to an 'X' close glyph
            mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
    });

    // Loop through each navigation link inside the drawer
    drawerLinks.forEach(link => {
        // When a user taps a navigation link, smoothly close the drawer automatically
        link.addEventListener('click', () => {
            // Remove the 'open' CSS class from the drawer
            drawer.classList.remove('open');
            // Reset the accessibility expansion state
            mobileBtn.setAttribute('aria-expanded', 'false');
            // Restore the standard hamburger icon
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // Listen for clicks anywhere on the document to dismiss the drawer if tapped outside
    document.addEventListener('click', (e) => {
        // Check if the click occurred outside the drawer and outside the hamburger button
        if (!drawer.contains(e.target) && !mobileBtn.contains(e.target) && drawer.classList.contains('open')) {
            // Close the drawer if it is currently open
            drawer.classList.remove('open');
            // Reset ARIA state
            mobileBtn.setAttribute('aria-expanded', 'false');
            // Restore hamburger icon
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
}

/* ---------------------------------------------------------------------------------------------
   3. HARDWARE FIRMWARE SIMULATOR (AUTONOMOUS VISION GLASSES)
   --------------------------------------------------------------------------------------------- */
function initHardwareSimulator() {
    // Grab the range slider element representing obstacle distance
    const slider = document.getElementById('distanceSlider');
    // Grab the text element showing the current distance in centimeters
    const distanceVal = document.getElementById('distanceVal');
    // Grab the status pill element that flashes safe or alert state
    const simStatusPill = document.getElementById('simStatusPill');
    // Grab the telemetry display element showing embedded interrupt logic
    const simLogicVal = document.getElementById('simLogicVal');
    // Grab the telemetry display element showing ultrasonic pulse travel time
    const simPulseVal = document.getElementById('simPulseVal');
    // Grab the telemetry display element showing acoustic buzzer frequency
    const simAcousticVal = document.getElementById('simAcousticVal');

    // If essential simulator elements are absent, exit gracefully
    if (!slider || !distanceVal) return;

    // Physical constant: speed of sound in air at 20°C in cm per microsecond (343 m/s)
    const SPEED_OF_SOUND_AIR = 0.0343;
    // Engineering safety threshold: 15 centimeters is the trigger boundary for obstacle warnings
    const THRESHOLD_CM = 15;

    // Core simulation calculation function executed on every slider adjustment
    function updateSimulation(cm) {
        // Calculate round-trip ultrasonic pulse travel time in microseconds: (2 * distance) / speed
        const pulseTimeUs = Math.round((2 * cm) / SPEED_OF_SOUND_AIR);
        // Update the visual distance readout label with unit suffix
        distanceVal.textContent = `${cm} cm`;
        // Update the microsecond pulse time display formatted with thousands separator
        simPulseVal.textContent = `${pulseTimeUs.toLocaleString()} µs`;

        // Check if the obstacle is within the critical safety boundary (<= 15 cm)
        if (cm <= THRESHOLD_CM) {
            // Update status pill with warning symbol and active alert styling
            simStatusPill.textContent = '⚠️ OBSTACLE ALERT (<15cm)';
            // Add alert CSS classes triggering the pulsing red specular glow
            simStatusPill.className = 'sim-status sim-alert';
            // Update firmware logic readout indicating real-time interrupt execution
            simLogicVal.textContent = 'ALERT (Sub-15ms Loop)';
            // Set font color to safety red for high visual urgency
            simLogicVal.style.color = '#ef4444';
            
            // Calculate dynamic buzzer pitch: frequency increases proportionally as obstacle gets closer
            const freq = Math.round(2400 + (THRESHOLD_CM - cm) * 120);
            // Display active pulsing acoustic tone frequency in Hertz
            simAcousticVal.textContent = `${freq} Hz (Pulsing)`;
            // Highlight acoustic frequency in radiant amber warning color
            simAcousticVal.style.color = '#f59e0b';
        } else {
            // Distance is greater than 15 cm: clear path safe state
            simStatusPill.textContent = 'Safe Clearance';
            // Restore normal green status styling
            simStatusPill.className = 'sim-status';
            // Set logic readout to idle monitoring state
            simLogicVal.textContent = 'IDLE (Clear Path)';
            // Set text color to healthy emerald green
            simLogicVal.style.color = 'var(--status-emerald)';
            // Display acoustic buzzer as muted (0 Hz output)
            simAcousticVal.textContent = 'Muted (0 Hz)';
            // Reset text color to standard theme primary tone
            simAcousticVal.style.color = 'var(--text-primary)';
        }
    }

    // Attach real-time input event listener to re-evaluate firmware calculations as slider moves
    slider.addEventListener('input', (e) => {
        // Parse slider value as a decimal integer and pass it into simulation engine
        updateSimulation(parseInt(e.target.value, 10));
    });

    // Run simulation once immediately on load to calibrate initial values (25 cm baseline)
    updateSimulation(parseInt(slider.value, 10));
}

/* ---------------------------------------------------------------------------------------------
   4. DOOR REED SWITCH CIRCUIT SIMULATOR
   --------------------------------------------------------------------------------------------- */
function initDoorSimulator() {
    // Locate the interactive button to toggle door magnetic contact
    const toggleBtn = document.getElementById('toggleDoorBtn');
    // Locate the status indicator badge for door state
    const doorStatusPill = document.getElementById('doorStatusPill');
    // Locate the visual glowing LED circuit element
    const circuitLed = document.getElementById('circuitLed');
    // Locate the text description next to the LED indicator
    const circuitLedText = document.getElementById('circuitLedText');

    // Exit if elements are not present on the current page
    if (!toggleBtn || !circuitLed) return;

    // State variable tracking whether the office is currently available (true = open/available)
    let isAvailable = true;

    // Attach click handler to simulate opening or closing the office door
    toggleBtn.addEventListener('click', () => {
        // Toggle boolean state
        isAvailable = !isAvailable;

        // If door is closed and office is available
        if (isAvailable) {
            // Update badge text to show office is open
            doorStatusPill.textContent = 'Office Open (Green LED)';
            // Set badge class to standard emerald green
            doorStatusPill.className = 'sim-status';
            // Remove red LED styling from glowing circle
            circuitLed.classList.remove('led-red');
            // Update status readout description
            circuitLedText.textContent = 'ACTIVE: GREEN (Available)';
            // Apply emerald green color to label text
            circuitLedText.style.color = 'var(--status-emerald)';
            // Update toggle button icon and text
            toggleBtn.innerHTML = '<i class="fa-solid fa-toggle-on"></i> Toggle Door State';
        } else {
            // If door is closed for a private meeting / in use
            doorStatusPill.textContent = 'Office In Use / Closed (Red LED)';
            // Set badge class to alerting red
            doorStatusPill.className = 'sim-status sim-alert';
            // Add red LED glow styling
            circuitLed.classList.add('led-red');
            // Update status readout description
            circuitLedText.textContent = 'ACTIVE: RED (Busy / In Meeting)';
            // Apply red color to label text
            circuitLedText.style.color = 'var(--status-red)';
            // Update toggle button icon to toggled-off representation
            toggleBtn.innerHTML = '<i class="fa-solid fa-toggle-off"></i> Toggle Door State';
        }
    });
}

/* ---------------------------------------------------------------------------------------------
   5. RESUME MODAL & PRINTING
   --------------------------------------------------------------------------------------------- */
function initResumeModal() {
    // Locate the background overlay for the modal dialog
    const modal = document.getElementById('resumeModal');
    // Locate the navigation button that opens the resume modal
    const openBtn = document.getElementById('openResumeBtn');
    // Locate the 'X' button inside the modal header that closes it
    const closeBtn = document.getElementById('closeResumeBtn');
    // Locate the print action button at the bottom of the modal
    const printBtn = document.getElementById('printResumeBtn');

    // Exit if the modal container is not found in the DOM
    if (!modal) return;

    // Helper function to display the modal smoothly
    function openModal(e) {
        // Prevent default anchor jump behavior if triggered by a hyperlink
        if (e) e.preventDefault();
        // Add 'open' class to trigger CSS opacity and scale-in animation
        modal.classList.add('open');
        // Update accessibility attribute for screen readers
        modal.setAttribute('aria-hidden', 'false');
        // Lock background body scrolling so user cannot scroll the page behind the modal
        document.body.style.overflow = 'hidden';
    }

    // Helper function to close the modal smoothly
    function closeModal() {
        // Remove 'open' class to hide modal
        modal.classList.remove('open');
        // Update accessibility attribute
        modal.setAttribute('aria-hidden', 'true');
        // Restore normal page scrolling on the document body
        document.body.style.overflow = '';
    }

    // Attach click listener to the open button if present
    if (openBtn) openBtn.addEventListener('click', openModal);
    // Attach click listener to the close button if present
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close the modal when clicking on the blurred background overlay outside the sheet
    modal.addEventListener('click', (e) => {
        // If the click target was the backdrop itself (not the inner dialog), dismiss
        if (e.target === modal) closeModal();
    });

    // Listen for the Escape key on the physical keyboard to dismiss the modal gracefully
    document.addEventListener('keydown', (e) => {
        // Check if Escape key was pressed while the modal is currently open
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            // Dismiss the modal
            closeModal();
        }
    });

    // Attach print handler to launch browser's native print preview
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Trigger native print dialog which formats the resume via @media print CSS
            window.print();
        });
    }
}

/* ---------------------------------------------------------------------------------------------
   6. INSTANT CLIPBOARD COPY WITH TOAST NOTIFICATIONS
   --------------------------------------------------------------------------------------------- */
function initClipboardCopy() {
    // Find all elements marked with the custom data-copy attribute
    const copyBtns = document.querySelectorAll('[data-copy]');

    // Iterate through each copy button found
    copyBtns.forEach(btn => {
        // Attach click listener to perform clipboard copy
        btn.addEventListener('click', () => {
            // Read the exact string to copy from data-copy attribute
            const textToCopy = btn.getAttribute('data-copy');
            // If string is empty, skip execution
            if (!textToCopy) return;

            // Use modern asynchronous Clipboard API to copy text
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show floating toast notification confirming copy success
                showToast(`Copied "${textToCopy}" to clipboard!`);
                
                // Locate icon inside the button to give instant visual feedback
                const icon = btn.querySelector('i');
                // If icon exists, briefly swap it to a green checkmark
                if (icon) {
                    // Remember original icon class (e.g., 'fa-regular fa-copy')
                    const originalClass = icon.className;
                    // Swap to green checkmark icon
                    icon.className = 'fa-solid fa-check text-emerald';
                    // Revert back to the original copy icon after 2 seconds
                    setTimeout(() => {
                        icon.className = originalClass;
                    }, 2000);
                }
            }).catch(() => {
                // Fallback message if clipboard permission was denied by browser
                showToast(`Failed to copy to clipboard`);
            });
        });
    });
}

// Global utility to render an Apple-style floating toast alert
function showToast(message) {
    // Locate the toast element in the DOM
    const toast = document.getElementById('toast');
    // If element is missing, abort
    if (!toast) return;

    // Set notification message text
    toast.textContent = message;
    // Add 'show' class to animate toast upward with blur and fade-in
    toast.classList.add('show');

    // Clear any previously pending timeout to prevent premature hiding
    clearTimeout(window._toastTimeout);
    // Automatically hide the toast after 2.8 seconds
    window._toastTimeout = setTimeout(() => {
        // Remove 'show' class to fade toast out
        toast.classList.remove('show');
    }, 2800);
}

/* ---------------------------------------------------------------------------------------------
   7. CONTACT FORM SUBMISSION
   --------------------------------------------------------------------------------------------- */
function initContactForm() {
    // Locate the contact form element by its ID
    const form = document.getElementById('contactForm');
    // If form is not on the page, exit
    if (!form) return;

    // Attach submit event listener to intercept default HTTP post
    form.addEventListener('submit', (e) => {
        // Prevent default browser form refresh
        e.preventDefault();

        // Extract sender's name from input field
        const name = document.getElementById('senderName').value;
        // Extract sender's email from input field
        const email = document.getElementById('senderEmail').value;
        // Extract topic selection from dropdown menu
        const subject = document.getElementById('messageSubject').value;
        // Extract message contents from textarea
        const body = document.getElementById('messageBody').value;

        // Destination official email address at University of Oklahoma
        const emailRecipient = 'john.vianney.ssennono-1@ou.edu';
        // URL-encode the subject line for mailto URL safety
        const formattedSubject = encodeURIComponent(`[Portfolio Contact] ${subject} from ${name}`);
        // URL-encode the body including sender contact details and message
        const formattedBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${body}`
        );

        // Notify user that their mail application is being launched
        showToast('Opening default email application...');
        // Open the user's default desktop or mobile email client pre-populated with inquiry
        window.location.href = `mailto:${emailRecipient}?subject=${formattedSubject}&body=${formattedBody}`;
    });
}

/* ---------------------------------------------------------------------------------------------
   8. ACTIVE NAV SCROLLSPY
   --------------------------------------------------------------------------------------------- */
function initScrollSpy() {
    // Query all section elements that possess an id attribute
    const sections = document.querySelectorAll('section[id]');
    // Query all navigational links in the header
    const navLinks = document.querySelectorAll('.nav-link');

    // Exit if there are no sections or links to track
    if (!sections.length || !navLinks.length) return;

    // Attach passive scroll listener for optimal 60fps rendering performance
    window.addEventListener('scroll', () => {
        // Variable to hold the ID of the section currently in view
        let current = '';
        // Calculate scroll trigger line with 160px offset below header
        const scrollPosition = window.scrollY + 160;

        // Loop over each section on the page
        sections.forEach(section => {
            // Distance from top of the page to section start
            const sectionTop = section.offsetTop;
            // Height of the section
            const sectionHeight = section.offsetHeight;
            // Check if scroll position falls within this section's vertical bounds
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Record the matching section's ID attribute
                current = section.getAttribute('id');
            }
        });

        // Loop over each navigation link in the header
        navLinks.forEach(link => {
            // Remove active highlighting from all links
            link.classList.remove('active');
            // If link's href matches the currently viewed section, highlight it
            if (link.getAttribute('href') === `#${current}`) {
                // Add 'active' class to apply specular glass highlight
                link.classList.add('active');
            }
        });
    }, { passive: true });
}
