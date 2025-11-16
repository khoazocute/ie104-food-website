// header-auth.js
// Responsible for updating the header auth text to show "Đăng nhập" or the logged-in username.

(function () {
    const CURRENT_USER_KEY = 'currentUser';

    function getCurrentUser() {
        let raw = localStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function updateHeader() {
        const textEl = document.getElementById('auth-text');
        const linkEl = document.getElementById('auth-link');
        if (!textEl || !linkEl) return false;

        const user = getCurrentUser();
        if (user && user.username) {
            textEl.textContent = user.username;
            // Khi đang đăng nhập, dẫn tới trang Profile khi bấm vào tên
            linkEl.setAttribute('href', './profile.html');
            linkEl.setAttribute('title', 'Xem trang cá nhân');
            linkEl.onclick = null;

            // Mobile auth button (nếu có) cũng dẫn về profile
            const mobileBtn = document.getElementById('mobile-auth-btn');
            const mobileText = document.getElementById('mobile-auth-text');
            if (mobileBtn) {
                mobileBtn.setAttribute('href', './profile.html');
                mobileBtn.onclick = null;
            }
            if (mobileText) mobileText.textContent = user.username;
        } else {
            textEl.textContent = 'Đăng nhập';
            // đảm bảo href dẫn tới trang đăng nhập
            // (dùng đường dẫn tương đối theo file header được chèn)
            // set lại href tới trang đăng nhập và xóa onclick
            linkEl.setAttribute('href', './auth.html');
            linkEl.setAttribute('title', 'Đăng nhập');
            linkEl.onclick = null;
            const mobileBtn = document.getElementById('mobile-auth-btn');
            const mobileText = document.getElementById('mobile-auth-text');
            if (mobileBtn) mobileBtn.setAttribute('href', './auth.html');
            if (mobileText) mobileText.textContent = 'Đăng nhập';
        }
        return true;
    }

    // Khi include.js phát event sau khi chèn nội dung
    document.addEventListener('includeLoaded', (e) => {
        // Cố gắng cập nhật nếu header vừa được chèn
        updateHeader();
    });

    // Trong trường hợp header đã có khi script chạy, thử cập nhật ngay
    // (lặp nhẹ nếu chưa có phần tử ngay lập tức)
    function initPoll(retries = 10, interval = 100) {
        let attempts = 0;
        const iv = setInterval(() => {
            attempts++;
            const ok = updateHeader();
            if (ok || attempts >= retries) clearInterval(iv);
        }, interval);
    }

    // Khởi tạo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initPoll(20, 100));
    } else {
        initPoll(20, 100);
    }

})();
