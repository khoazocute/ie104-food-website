// ====== KIỂM TRA ĐĂNG NHẬP ======
const CURRENT_USER_KEY = "currentUser";

// Hàm lấy thông tin người dùng hiện tại
function getCurrentUser() {
  // Ưu tiên sessionStorage, sau đó localStorage
  const raw = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}



// Hàm đăng xuất
function logout(redirectTo = "./pages/auth.html") {
  // Xóa cả hai nơi lưu để chắc chắn phiên bị huỷ hoàn toàn
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
  // Điều hướng (redirect) về trang được chỉ định - mặc định là trang đăng nhập
  window.location.href = redirectTo;
}

// ====== DÙNG TRONG TOÀN BỘ WEBSITE ======
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.requireLogin = requireLogin;
window.logout = logout;

// Ghi chú:
// - `getCurrentUser` trả về object đã lưu (chỉ chứa username/email/ts theo cách lưu hiện tại).
// - Nếu thay đổi cấu trúc session (ví dụ thêm userId), hãy cập nhật hàm này và nơi sử dụng.
