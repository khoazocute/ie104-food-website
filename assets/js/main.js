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

}); 