document.addEventListener("DOMContentLoaded", () => {

    // ===================================================
    // CHỨC NĂNG 1: BĂNG CHUYỀN ĐÁNH GIÁ (TESTIMONIAL)
    // ===================================================
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

    // ===================================================
    // CHỨC NĂNG 2: ĐẾM SỐ THỐNG KÊ (COUNTER NUMBERS)
    // Tự động đếm số khi cuộn tới section "Hành Trình Từ 2020"
    // ===================================================
    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // Chỉ chạy khi đi vào màn hình
            if (!entry.isIntersecting) return;
            
            const card = entry.target;
            const h4 = card.querySelector('h4');
            const suffix = card.getAttribute('data-suffix') || '';
            const target = parseFloat((card.getAttribute('data-target') || '0').replace(/[^0-9.]/g, ''));
            const duration = 1500; 
            let startTime = null;
            const decimals = target % 1 !== 0 ? 1 : 0; 

            function step(ts) {
                if (!startTime) startTime = ts;
                const p = Math.min((ts - startTime) / duration, 1); 
                const val = (target * p).toFixed(decimals);
                h4.textContent = val + suffix;
                if (p < 1) requestAnimationFrame(step); 
            }
            
            requestAnimationFrame(step); // Bắt đầu đếm
            obs.unobserve(card); // Dừng theo dõi để không đếm lại
        });
    }, { threshold: 0.8 }); // Kích hoạt khi thấy 80% thẻ

    // Tìm tất cả các thẻ .stat-card để theo dõi
    document.querySelectorAll('.stat-card').forEach(c => statsObserver.observe(c));

    
    // ===================================================
    // CHỨC NĂNG 3: MENU TRÊN DI ĐỘNG (MOBILE MENU)
    // Xử lý đóng/mở menu khi bấm nút
    // ===================================================
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

    // 1. Chạy ngay lập tức khi tải trang
    setupMobileMenu();

    // 2. Chạy lại khi header (chứa menu) được tải động vào
    document.addEventListener('includeLoaded', (e) => {
        if (e.detail.id === 'header-placeholder') {
            setupMobileMenu();
        }
    });

});