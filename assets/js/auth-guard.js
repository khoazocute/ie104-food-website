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
/*
// Hàm kiểm tra đã đăng nhập chưa
function isLoggedIn() {
  return !!getCurrentUser();
}

// Hàm buộc đăng nhập (redirect nếu chưa đăng nhập)
function requireLogin(loginPage = "./pages/auth.html") {
  if (!isLoggedIn()) {
    window.location.href = loginPage;
  }
}
*/
// Hàm đăng xuất
function logout(redirectTo = "./pages/auth.html") {
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = redirectTo;
}

// ====== DÙNG TRONG TOÀN BỘ WEBSITE ======
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.requireLogin = requireLogin;
window.logout = logout;
