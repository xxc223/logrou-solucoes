// Consolidated frontend logic: navigation toggle, smooth scroll, section observer,
// service routing (showService/showHome), form handler, popstate/load handling.

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only skip smooth-scroll for real service detail anchors like "#servico-1"
        if (href && href.startsWith('#servico-')) return; // Don't smooth scroll for service detail links

        if (href === '#home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement && !targetElement.classList.contains('service-detail')) {
                e.preventDefault();
                // Ensure the section is visible (in case IntersectionObserver didn't trigger yet)
                targetElement.classList.add('visible');
                const navEl = document.querySelector('.nav');
                const navHeight = navEl ? navEl.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
});

// Service detail page routing
function showService(serviceId, evt) {
    // prevent default only if an event was provided
    if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();

    // Hide home page
    const homePageEl = document.getElementById('homePage');
    if (homePageEl) homePageEl.style.display = 'none';

    // Hide all service detail pages
    document.querySelectorAll('.service-detail').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected service detail page
    const servicePage = document.getElementById(`service-${serviceId}`);
    if (servicePage) {
        servicePage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update URL hash for deep linking without reloading
    try { history.pushState(null, '', `#servico-${serviceId}`); } catch (e) {}
}

function showHome(evt) {
    if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();

    // Hide all service detail pages
    document.querySelectorAll('.service-detail').forEach(page => {
        page.classList.remove('active');
    });

    // Show home page
    const homePageEl = document.getElementById('homePage');
    if (homePageEl) homePageEl.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try { history.pushState(null, '', '#home'); } catch (e) {}
}

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    event.target.reset();
}

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset + 100;

    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    // Only treat hashes like "#servico-1" as service detail routes
    if (window.location.hash.startsWith('#servico-')) {
        const serviceId = window.location.hash.split('-')[1];
        showService(parseInt(serviceId));
    } else {
        showHome();
        // If the hash corresponds to a section (e.g., #sobre, #servicos), scroll to it
        const hash = window.location.hash;
        if (hash && hash !== '#home') {
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement && !targetElement.classList.contains('service-detail')) {
                targetElement.classList.add('visible');
                const navEl = document.querySelector('.nav');
                const navHeight = navEl ? navEl.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    }
});

// Initialize page state on load
window.addEventListener('load', () => {
    if (window.location.hash.startsWith('#servico-')) {
        const serviceId = window.location.hash.split('-')[1];
        showService(parseInt(serviceId));
    } else if (window.location.hash && window.location.hash !== '#home') {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement && !targetElement.classList.contains('service-detail')) {
            targetElement.classList.add('visible');
            const navEl = document.querySelector('.nav');
            const navHeight = navEl ? navEl.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }
});

function navigateToSection(sectionId, event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    showHome(); // volta para a homepage
    setTimeout(() => {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            targetElement.classList.add('visible');
            const navEl = document.querySelector('.nav');
            const navHeight = navEl ? navEl.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }, 50); // pequeno delay para garantir que a homepage foi exibida
    try { history.pushState(null, '', `#${sectionId}`); } catch (e) {}
}
