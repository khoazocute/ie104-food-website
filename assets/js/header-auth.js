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
            // Khi đang đăng nhập, bạn có thể đổi liên kết tới trang profile hoặc làm chức năng đăng xuất.
            // Ở đây ta để liên kết dẫn tới auth.html (hoặc có thể đổi thành '#')
            // Thêm behavioral: bấm Ctrl+Click sẽ mở trang auth (giữ nguyên href)
            // Thêm: khi đang đăng nhập, đổi click thành hành động ĐĂNG XUẤT (xác nhận) — thay vì điều hướng
            linkEl.setAttribute('href', '#');
            linkEl.setAttribute('title', 'Nhấn để đăng xuất');
            // thay handler cũ (nếu có) bằng handler mới
            linkEl.onclick = function (e) {
                e.preventDefault();
                const ok = confirm('Bạn có muốn đăng xuất không?');
                if (!ok) return;
                try { localStorage.removeItem(CURRENT_USER_KEY); } catch (e) {}
                try { sessionStorage.removeItem(CURRENT_USER_KEY); } catch (e) {}
                // reload để cập nhật giao diện
                window.location.reload();
            };
        } else {
            textEl.textContent = 'Đăng nhập';
            // đảm bảo href dẫn tới trang đăng nhập
            // (dùng đường dẫn tương đối theo file header được chèn)
            // set lại href tới trang đăng nhập và xóa onclick
            linkEl.setAttribute('href', './auth.html');
            linkEl.setAttribute('title', 'Đăng nhập');
            linkEl.onclick = null;
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
