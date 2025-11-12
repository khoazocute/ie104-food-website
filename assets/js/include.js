// Tệp: include.js
// Hàm tải nội dung từ URL và chèn vào phần tử có ID tương ứng.

function loadAndInjectContent(url, targetId) {
    const targetElement = document.getElementById(targetId);

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

    function tryUrls(list) {
        if (!list.length) return Promise.reject(new Error('Không tìm thấy tệp để chèn'));
        const u = list.shift();
        return fetch(u).then(resp => {
            if (!resp.ok) throw new Error(`Không thể tải ${u}`);
            return resp.text().then(text => ({ text, url: u }));
        }).catch(() => tryUrls(list));
    }

    tryUrls(candidates.slice()).then(({ text: htmlContent, url: usedUrl }) => {
        // Chèn nội dung vào placeholder
        targetElement.innerHTML = htmlContent;
        
        // Đảm bảo tất cả các link trong injected content vẫn có thể click bình thường
        // (xóa bất kỳ event handler toàn cục nào có thể chặn link)
        const linksInInjected = targetElement.querySelectorAll('a[href]');
        linksInInjected.forEach(link => {
            // Bỏ qua các anchor (#) hoặc không có href
            if (!link.href || link.href === '#') return;
            // Đảm bảo link có thể click bình thường (không bị preventDefault)
            link.style.cursor = 'pointer';
        });

        // Phát sự kiện thông báo đã chèn xong
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

    }).catch(error => {
        console.error(`Lỗi khi chèn nội dung:`, error);
        targetElement.innerHTML = `<p style="color: red;">Lỗi tải nội dung.</p>`;
    });
}

// Chạy khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    loadAndInjectContent('header.html', 'header-placeholder');
    loadAndInjectContent('footer.html', 'footer-placeholder');
});