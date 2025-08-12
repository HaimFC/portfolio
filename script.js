// script.js

// ==== CONFIG: put your EmailJS keys here ====
const EMAILJS_PUBLIC_KEY = "o2z_t9NHk1Bga5__9";
const EMAILJS_SERVICE_ID = "service_irwcyxc";
const EMAILJS_TEMPLATE_ID = "template_yaqesah";

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  // ====== Init EmailJS ======
  // Requires: <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script> in HTML
  if (typeof emailjs !== "undefined") {
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (e) {
      console.error("EmailJS init failed. Check PUBLIC KEY and script tag.", e);
    }
  } else {
    console.error("EmailJS SDK not found. Add the CDN script in your HTML.");
  }

  // ====== Mobile menu toggle (your original) ======
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileMenu");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // ====== Contact form handling ======
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const sendBtn = document.getElementById("sendBtn");

  if (!form) return;

  // Optional honeypot (add <input type="text" name="company" style="display:none"> in the form)
  const honeypotField = form.querySelector('input[name="company"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot: if filled, abort silently (likely a bot)
    if (honeypotField && honeypotField.value) {
      return;
    }

    // Collect & validate
    const name = (form.from_name?.value || "").trim();
    const email = (form.from_email?.value || "").trim();
    const message = (form.message?.value || "").trim();

    if (!name || !email || !message) {
      setStatus("Please fill in all fields.", false);
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address.", false);
      return;
    }

    // Lock UI
    toggleSending(true);
    setStatus("Sending...", true);

    try {
      // Send via EmailJS
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: message,
      });

      setStatus("✅ Message sent successfully. Thank you!", true);
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send. Please try again later.", false);
    } finally {
      toggleSending(false);
    }
  });

  // ====== Helpers ======
  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.opacity = "1";
    statusEl.style.marginTop = "8px";
    statusEl.style.fontSize = "0.95rem";
    statusEl.style.transition = "opacity 0.3s ease";
    statusEl.style.color = ok ? "green" : "crimson";
  }

  function toggleSending(sending) {
    if (!sendBtn) return;
    sendBtn.disabled = sending;
    sendBtn.style.opacity = sending ? "0.7" : "1";
    sendBtn.textContent = sending ? "Sending..." : "Send Message";
  }

  function isValidEmail(str) {
    // Simple RFC-ish check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }
});
