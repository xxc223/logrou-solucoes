// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle smooth scroll for hash links
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.remove('active');
            }
        }
    });
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Dropdown menu functionality
const servicesLink = document.querySelector('a[href="#servicos"]');
const servicesDropdown = document.getElementById('servicesDropdown');

if (servicesLink && servicesDropdown) {
    servicesLink.addEventListener('click', function(e) {
        // Se clicar no link de serviços, alterna o dropdown
        if (window.innerWidth > 768) {
            e.preventDefault();
            servicesDropdown.classList.toggle('active');
        }
    });
    
    // Mostra dropdown ao passar o mouse (desktop)
    const servicesItem = servicesLink.parentElement;
    if (servicesItem) {
        servicesItem.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                servicesDropdown.classList.add('active');
            }
        });
        
        servicesItem.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                servicesDropdown.classList.remove('active');
            }
        });
    }
}

// Fecha dropdown ao clicar fora
document.addEventListener('click', function(e) {
    if (servicesDropdown && !e.target.closest('.nav__item--dropdown')) {
        servicesDropdown.classList.remove('active');
    }
});

// Fade-in animation on scroll
const sections = document.querySelectorAll('.section');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

sections.forEach(section => {
    fadeObserver.observe(section);
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
