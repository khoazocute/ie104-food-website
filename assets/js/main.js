document.addEventListener("DOMContentLoaded", () => {

    // ========================= TESTIMONIAL ========================= 
    const track = document.getElementById('testimonials-track');

    if (track && track.children.length > 0) {
        
        const originalContent = track.innerHTML;

        // Nhân bản nội dung nhiều lần để đảm bảo carousel/testimonials có đủ
        // phần tử cho hiệu ứng lặp liên tục. Nếu bạn dùng thư viện slider,
        // có thể không cần nhân bản thủ công.
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

    // Ghi chú:
    // - `setupMobileMenu` dùng `data.listenerAttached` để tránh gắn sự kiện nhiều lần
    //   khi header được load lại (include). Nếu bạn thay id button hoặc cấu trúc header,
    //   hãy cập nhật selector trong hàm.

    // - `includeLoaded` event được phát bởi `include.js` ngay sau khi header/footer
    //   được chèn vào DOM. Chúng ta lắng nghe event này để gọi `setupMobileMenu`
    //   khi header mới vừa được thêm vào (ví dụ khi user truy cập trang con).

})