// ====== CẤU HÌNH ĐƯỜNG DẪN ======
// Trang chuyển tới sau khi đăng nhập thành công
const HOMEPAGE_URL = "./homepage.html"; // auth.html & homepage.html cùng trong /pages

// ====== KHÓA LƯU TRỮ ======
const USERS_KEY = "app_users_v1";      // danh sách tài khoản
const CURRENT_USER_KEY = "currentUser"; // người dùng hiện tại

// ====== HÀM TRỢ GIÚP (làm việc với localStorage) ======
function getUsers() { //Dùng để lấy tài khoản đã đăng ký
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []; //Nếu không có thì trả về mảng rỗng
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users)); //Lưu mảng users vào localStorage, chuyển về chuỗi JSON trước khi lưu 
}

function usernameOrEmailExists(users, username, email) { //Kiểm tra tên đăng nhập hoặc email đã tồn tại chưa
  const u = (username || "").trim().toLowerCase();
  const e = (email || "").trim().toLowerCase();
  return users.some(x =>
    (x.username && x.username.trim().toLowerCase() === u) ||
    (x.email && x.email.trim().toLowerCase() === e)
  );
}

function findUser(users, loginId) { //Tìm user theo username hoặc email (không phân biệt hoa thường)
  const key = (loginId || "").trim().toLowerCase();
  return users.find(x =>
    (x.username && x.username.trim().toLowerCase() === key) ||
    (x.email && x.email.trim().toLowerCase() === key)
  );
}

// Lưu thông tin đăng nhập (ghi nhớ / không ghi nhớ)
function storeSession(userObj, remember) {
  const payload = JSON.stringify({
    username: userObj.username,
    email: userObj.email,
    ts: Date.now(),
  });
  if (remember) {
    localStorage.setItem(CURRENT_USER_KEY, payload);// Lưu lâu dài
  } else {
    sessionStorage.setItem(CURRENT_USER_KEY, payload);// Lưu tạm thời
  }
}

// Ghi chú an toàn: mật khẩu được lưu plaintext trong `localStorage` ở demo này.
// Trong môi trường thực tế cần gửi lên server và hash mật khẩu trước khi lưu.

// -------------------------------
// CHÚ THÍCH HÀM TIỆN ÍCH
// - `getUsers()` trả về mảng user từ `localStorage` hoặc mảng rỗng.
// - `saveUsers(users)` serialize mảng user và lưu lại.
// - `usernameOrEmailExists(...)` dùng để tránh trùng tên/email khi đăng ký.
// - `findUser(users, loginId)` tìm user theo username hoặc email (không phân biệt hoa thường).
// - `storeSession(userObj, remember)` lưu thông tin phiên. Nếu `remember` = true
//    sẽ lưu vào `localStorage` để giữ login lâu dài, ngược lại dùng `sessionStorage`.


// ====== XỬ LÝ SAU KHI TRANG LOAD XONG ======
document.addEventListener("DOMContentLoaded", () => { // chờ DOM sẵn sàng
  // Lấy các phần tử giao diện
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (!loginTab || !registerTab) return;

  // --- Chuyển giữa 2 tab ---
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
  });

  // --- Xử lý ĐĂNG KÝ ---
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Lấy dữ liệu nhập
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("newUser").value.trim();
    const password = document.getElementById("newPass").value.trim();

    // Kiểm tra hợp lệ
    if (!email || !username || !password) {
      alert("Vui lòng điền đủ Email, Tên đăng nhập, Mật khẩu.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Email không hợp lệ.");
      return;
    }

    const users = getUsers();// Lấy danh sách user đã đăng ký

    // Kiểm tra trùng tên đăng nhập hoặc email  
    if (usernameOrEmailExists(users, username, email)) {
      alert("Tên đăng nhập hoặc Email đã tồn tại.");
      return;
    }

    // Lưu tài khoản mới
    users.push({ email, username, password });
    saveUsers(users);

    // Thông báo và quay lại tab đăng nhập
    alert("Đăng ký thành công! Mời bạn đăng nhập.");
    loginTab.click();
    document.getElementById("username").value = username;
    document.getElementById("password").value = "";
  });

  // --- Xử lý ĐĂNG NHẬP ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const loginId = document.getElementById("username").value.trim(); // có thể là username hoặc email
    const password = document.getElementById("password").value.trim();
    const remember = loginForm.querySelector('input[type="checkbox"]').checked;

    if (!loginId || !password) {
      alert("Vui lòng nhập Tên đăng nhập (hoặc Email) và Mật khẩu.");
      return;
    }

    const users = getUsers();
    const user = findUser(users, loginId);

    if (!user || user.password !== password) {
      alert("Thông tin đăng nhập không đúng.");
      return;
    }

    // Lưu thông tin người dùng & chuyển trang
    storeSession(user, remember);
    alert("Đăng nhập thành công!");
    window.location.href = HOMEPAGE_URL;
  });
});
