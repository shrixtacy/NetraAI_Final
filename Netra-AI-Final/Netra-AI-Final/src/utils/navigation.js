import { setupMobileNav } from './mobileNav';

export function setupNavigation() {
  document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Setup mobile navigation
    setupMobileNav();
    
    // Handle navigation clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        if (!targetId) return;

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          updateActiveLink(link);
        }
      });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section');
      let currentSection = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
          currentSection = section.getAttribute('id') || '';
        }
      });

      updateActiveLinks(currentSection);
    }, { passive: true });
  });
}

function updateActiveLink(activeLink) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
  });
  activeLink.classList.add('active');
}

function updateActiveLinks(currentSection) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}