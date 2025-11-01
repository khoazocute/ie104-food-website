// Tệp: include.js

/**
 * Hàm tải nội dung từ URL và chèn vào phần tử có ID tương ứng.
 * Sử dụng promise (.then) để đảm bảo tính tuần tự và dễ đọc.
 */
function loadAndInjectContent(url, targetId) {
    // 1. Tìm phần tử placeholder trong HTML
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
        console.error(`Lỗi: Không tìm thấy ID '${targetId}'.`);
        return; // Dừng nếu không tìm thấy ID
    }

    // 2. Bắt đầu lấy nội dung từ URL (header.html hoặc footer.html)
    fetch(url)
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không (mã trạng thái 200-299)
            if (!response.ok) {
                // Nếu không thành công, ném lỗi để chuyển sang .catch
                throw new Error(`Không thể tải tệp ${url}. Mã lỗi: ${response.status}`);
            }
            // Trả về nội dung dưới dạng văn bản (HTML)
            return response.text();
        })
        .then(htmlContent => {
            // 3. Chèn nội dung HTML đã tải vào phần tử
            targetElement.innerHTML = htmlContent;
        })
        .catch(error => {
            // Bắt và xử lý lỗi (ví dụ: tệp không tồn tại 404)
            console.error(`Lỗi khi chèn nội dung từ ${url}:`, error);
            targetElement.innerHTML = `<p style="color: red;">Lỗi tải: ${url}</p>`;
        });
}

// Chạy các hàm chèn khi toàn bộ cấu trúc DOM (HTML) đã được tải
document.addEventListener('DOMContentLoaded', () => {
    // Chèn Header vào vị trí có id="header-placeholder"
    loadAndInjectContent('header.html', 'header-placeholder');
    
    // Chèn Footer vào vị trí có id="footer-placeholder"
    loadAndInjectContent('footer.html', 'footer-placeholder');
});