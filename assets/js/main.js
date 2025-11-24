document.addEventListener("DOMContentLoaded", () => {

    // ========================= TESTIMONIAL ========================= 
    const track = document.getElementById('testimonials-track');

    if (track && track.children.length > 0) {
        
        const originalContent = track.innerHTML;

        track.innerHTML += originalContent;
        track.innerHTML += originalContent;
        track.innerHTML += originalContent;
        track.innerHTML += originalContent;

    }

    // ========================= MOBILE MENU =========================

    function setupMobileMenu() {
        var mobileBtn = document.getElementById('mobileMenuBtn');
        var mobileNav = document.getElementById('mobileNav');

        if (mobileBtn && mobileNav) {

            if (mobileBtn.dataset.listenerAttached !== 'true') {

                mobileBtn.addEventListener('click', function (event) {
                    event.preventDefault();
                    mobileNav.classList.toggle('is-open');
                });

                mobileBtn.dataset.listenerAttached = 'true';
            }
        }
    }


    setupMobileMenu();

    document.addEventListener('includeLoaded', (event) => {
        if (event.detail.id === 'header-placeholder') {
            setupMobileMenu();
        }
    });

})