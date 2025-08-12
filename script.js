document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileMenu');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
});