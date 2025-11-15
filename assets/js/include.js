// Hàm này sẽ được gọi sau khi header được tải
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header__nav a');

    navLinks.forEach(link => {
        if (link.pathname === currentPath) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}


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
        
        if (targetId === 'header-placeholder') {
            setActiveNavLink();
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

    }).catch(error => {
        console.error(`Lỗi khi chèn nội dung:`, error);
        targetElement.innerHTML = `<p style="color: red;">Lỗi tải nội dung.</p>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndInjectContent('header.html', 'header-placeholder');
    loadAndInjectContent('footer.html', 'footer-placeholder');
});