export function setupMobileNav() {
  document.addEventListener('DOMContentLoaded', initializeMobileNav);
}

function initializeMobileNav() {
  const navbar = document.querySelector('.navbar');
  const navContent = document.querySelector('.nav-content');
  const navLinks = document.querySelector('.nav-links');
  
  if (!navbar || !navContent || !navLinks) {
    console.warn('Required navigation elements not found');
    return;
  }

  setupMenuToggle(navContent, navLinks);
  setupScrollBehavior(navbar);
  setupClickHandlers(navbar, navLinks);
}

function setupMenuToggle(navContent, navLinks) {
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '☰';
  menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
  
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  navContent.appendChild(menuToggle);
}

function setupScrollBehavior(navbar) {
  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

function setupClickHandlers(navbar, navLinks) {
  // Close menu when clicking outside
  document.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      const menuToggle = navbar.querySelector('.menu-toggle');
      if (menuToggle) {
        menuToggle.innerHTML = '☰';
      }
    }
  });

  // Prevent clicks inside navbar from closing menu
  navbar.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close menu when clicking a nav link
  navLinks.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('active');
      const menuToggle = navbar.querySelector('.menu-toggle');
      if (menuToggle) {
        menuToggle.innerHTML = '☰';
      }
    }
  });
}