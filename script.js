document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  // Loader
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.style.display = 'flex';
    contactForm.reset();
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 5000);
  });

  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target + '+';
            clearInterval(counter);
          } else {
            entry.target.textContent = Math.floor(current);
          }
        }, 16);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
});