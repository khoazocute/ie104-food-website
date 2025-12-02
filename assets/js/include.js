// Hàm này sẽ được gọi sau khi header được tải
function setActiveNavLink() {// Đánh dấu liên kết hiện tại trong điều hướng header  
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header__nav a');// Lấy tất cả các liên kết trong điều hướng header

    navLinks.forEach(link => {
        if (link.pathname === currentPath) {
            link.parentElement.classList.add('active');// Thêm class 'active' cho <li> chứa link
        } else {
            link.parentElement.classList.remove('active');// Xóa class 'active' nếu không khớp
        }
    });
}


// Hàm tải nội dung từ URL và chèn vào phần tử có ID tương ứng.

function loadAndInjectContent(url, targetId) {// Tải và chèn nội dung từ URL vào phần tử có ID targetId
    const targetElement = document.getElementById(targetId);// Lấy phần tử mục tiêu theo ID

    if (!targetElement) {
        console.error(`Lỗi: Không tìm thấy ID '${targetId}'.`);
        return;
    }

    // Thử nhiều đường dẫn khả dĩ (vì include.js có thể được nhúng từ root hoặc từ pages/)
    const candidates = [
        url,
        `pages/${url}`,
        `./${url}`,
        `./pages/${url}`,
        `../${url}`,
        `../pages/${url}`
    ];

    function tryUrls(list) {// Thử lần lượt các URL trong danh sách
        if (!list.length) return Promise.reject(new Error('Không tìm thấy tệp để chèn'));
        const u = list.shift();// Lấy URL đầu tiên trong danh sách
        return fetch(u).then(resp => {
            if (!resp.ok) throw new Error(`Không thể tải ${u}`);
            return resp.text().then(text => ({ text, url: u }));// Trả về nội dung và URL đã dùng
        }).catch(() => tryUrls(list));// Nếu lỗi, thử URL tiếp theo
    }

    tryUrls(candidates.slice()).then(({ text: htmlContent, url: usedUrl }) => {
        // Chèn nội dung vào placeholder
        targetElement.innerHTML = htmlContent;
        
        if (targetId === 'header-placeholder') {
            setActiveNavLink();// Đánh dấu liên kết hiện tại trong header
        }

        // Đảm bảo tất cả các link trong injected content vẫn có thể click bình thường
        // (xóa bất kỳ event handler toàn cục nào có thể chặn link)
        const linksInInjected = targetElement.querySelectorAll('a[href]');
        linksInInjected.forEach(link => {
            if (!link.href || link.href === '#') return;
            link.style.cursor = 'pointer';
        });

        try { 
            document.dispatchEvent(new CustomEvent('includeLoaded', { detail: { id: targetId, url: usedUrl } })); 
        } catch (e) {}

        // Tự động nạp script xử lý header/auth
        try {
            const selfScript = Array.from(document.scripts).find(s => s.src && s.src.includes('include.js'));
            const base = selfScript ? selfScript.src.replace(/include\.js$/, '') : './assets/js/';
            const headerAuthSrc = base + 'header-auth.js';
            if (!document.querySelector(`script[src="${headerAuthSrc}"]`)) {
                const s = document.createElement('script');
                s.src = headerAuthSrc;
                s.defer = true;
                document.head.appendChild(s);
            }
        } catch (e) { 
            console.error('Không thể nạp header-auth.js:', e); 
        }

        // Ghi chú chi tiết:
        // - `tryUrls` lần lượt thử các đường dẫn trong `candidates` để tìm file tương ứng.
        //   Điều này hữu ích khi bạn có cấu trúc thư mục khác nhau (ví dụ khi chạy
        //   trang từ root hoặc từ /pages/). Nếu cần thêm đường dẫn khác, sửa biến
        //   `candidates` phía trên.
        // - Sau khi chèn nội dung, chúng ta phát event `includeLoaded` để những module
        //   như `header-auth.js` hoặc `main.js` biết họ có thể thao tác DOM của header.
        // - Việc tự động nạp `header-auth.js` dựa trên `include.js` script `src`.
        //   Nếu `include.js` được load từ CDN hoặc vị trí khác, biến `base` sẽ thay đổi
        //   tương ứng.

    }).catch(error => {
        console.error(`Lỗi khi chèn nội dung:`, error);
        targetElement.innerHTML = `<p style="color: red;">Lỗi tải nội dung.</p>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndInjectContent('header.html', 'header-placeholder');
    loadAndInjectContent('footer.html', 'footer-placeholder');
});

// Notes:
// - `loadAndInjectContent` cố gắng nhiều đường dẫn để phù hợp khi file include.js
//   được chèn từ nhiều vị trí khác nhau trong dự án. Nếu  di chuyển thư mục,
//   hãy cập nhật `candidates` cho phù hợp.
// - Hàm dispatch `includeLoaded` giúp các module (vd: `header-auth.js`) biết khi
//   phần header/footer đã sẵn sàng để thao tác DOM.    