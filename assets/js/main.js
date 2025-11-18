document.addEventListener("DOMContentLoaded", () => {
    
    // ========================= TESTIMONIAL ========================= 
    const track = document.getElementById('testimonials-track');
    
    if (track) {
        if (track.children.length > 0 && !track.classList.contains('js-cloned')) {
            const originalContent = track.innerHTML;
            
            track.innerHTML += originalContent; 
            track.innerHTML += originalContent; 
            track.innerHTML += originalContent; 
    
            track.classList.add('animate');
            track.classList.add('js-cloned'); 
        }
    }

    // ========================= MOBILE MENU =========================

    function setupMobileMenu() {
        var mobileBtn = document.getElementById('mobileMenuBtn');
        var mobileNav = document.getElementById('mobileNav');

        if (mobileBtn && mobileNav) {
            
            if (mobileBtn.dataset.listenerAttached !== 'true') { 
                
                mobileBtn.addEventListener('click', function (e) {
                    e.preventDefault(); 
                    mobileNav.classList.toggle('is-open'); 
                });
                
                mobileBtn.dataset.listenerAttached = 'true';
            }
        }
    }


    setupMobileMenu();

    document.addEventListener('includeLoaded', (e) => {
        if (e.detail.id === 'header-placeholder') {
            setupMobileMenu();
        }
    });

    // ========================= REVEAL ON SCROLL =========================
    // Observe elements with class `reveal` or attribute `data-reveal-delay`
    try {
        const revealSelector = '[data-reveal-delay], .reveal';
        const revealEls = Array.from(document.querySelectorAll(revealSelector));
        if (revealEls.length && 'IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const delay = parseInt(el.dataset.revealDelay || 0, 10) || 0;
                    if (delay) el.style.transitionDelay = `${delay}ms`;
                    el.classList.add('show');
                    obs.unobserve(el);
                });
            }, { threshold: 0.08 });

            revealEls.forEach(e => revealObserver.observe(e));
        } else if (revealEls.length) {
            // Fallback: reveal immediately if IntersectionObserver not supported
            revealEls.forEach(e => e.classList.add('show'));
        }
    } catch (err) {
        console.error('[reveal] init error', err);
    }

}); 