(() => {
  // ===============================
  // CẤU HÌNH CHUNG
  // ===============================
  const STORAGE_KEY = "cart_items_v1";
  const LOCALE = "vi-VN";         // Ngôn ngữ Việt Nam
  const CURRENCY = "VND";         // Đơn vị tiền Việt Nam Đồng

  // Định dạng tiền tệ hiển thị
  const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  currencyDisplay: "code"   // hiển thị “VND” thay cho ký hiệu ₫
});

  // ===============================
  // TRẠNG THÁI & TIỆN ÍCH LƯU TRỮ
  // ===============================
  let cart = []; //Khởi tạo mãng để lưu trữ dữ liệu 

  /** Đọc giỏ hàng từ LocalStorage */
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  /** Lưu giỏ hàng vào LocalStorage */
  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  /** Cập nhật số lượng badge trên icon giỏ hàng */
  function updateBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    const totalQty = cart.reduce((sum, it));
    badge.textContent = String(totalQty);
  }     

  /** Đảm bảo icon giỏ hàng có badge hiển thị */
  function ensureBadge() {
    const cartIcon = document.querySelector(".header__cart");
    if (!cartIcon) return;

    let badge = cartIcon.querySelector("#cartBadge");
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "cartBadge";
  
      cartIcon.appendChild(badge);
    }
  }

  // ===============================
  // NHÚNG GIAO DIỆN GIỎ HÀNG
  // ===============================
  /** 
   * Tải nội dung file cart.html và nhúng vào <body>
   */
  async function injectCartHTML() {
    const res = await fetch("./cart.html"); //Truy cập tới đường dẫn cart.html
    const html = await res.text();

    const wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    document.body.appendChild(wrap.firstElementChild);
  }

  // ===============================
  // XỬ LÝ DỮ LIỆU GIỎ HÀNG
  // ===============================
  function addItem(p) {
    const found = cart.find((i) => i.id === p.id); // Tìm xem có sản phẩm đó trong giỏ hàng hay chưa
    if (found) {
      found.qty += p.qty || 1; //Nếu có rồi thì tăng số lượng
    } else {
      cart.push({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image || "",
        sku: p.sku || "",
        qty: p.qty || 1,
      });
    }
    render();
  }
/*Xóa khỏi giỏ hàng*/
  function removeAt(idx) {
    cart.splice(idx, 1);
    render();
  }

  function setQty(idx, val, resetFocus = false) {
    cart[idx].qty = Math.max(1, Number(val || 1));
    render(resetFocus);
  }

  // ===============================
  // RENDER POPUP GIỎ HÀNG
  // ===============================
  let modal, bodyEl, totalEl;

  function render(resetFocus = true) {
    if (!bodyEl || !totalEl) return;

    bodyEl.innerHTML = "";
    let total = 0;

    cart.forEach((item, idx) => {
      total += item.price * item.qty;

      const tr = document.createElement("tr");
      tr.className = "cart-row";
      tr.innerHTML = `
        <td class="cart-cell">
          <div class="pinfo">
            <img class="thumb" src="${item.image || ""}" alt="">
            <div>
              <div class="name">${item.name}</div>
              <div class="sku">${item.sku || ""}</div>
            </div>
          </div>
        </td>
        <td class="cart-cell">
          <input class="qty" type="number" min="1" value="${item.qty}" data-idx="${idx}">
        </td>
        <td class="cart-cell price">${money.format(item.price)}</td>
        <td class="cart-cell">
          <button class="remove" data-rm="${idx}" title="Remove">✕</button>
        </td>
      `;
      bodyEl.appendChild(tr);
    });

    totalEl.textContent = money.format(total);
    saveCart();
    updateBadge();
    if (resetFocus) modal.querySelector(".cart-sheet")?.focus?.();
  }

  // ===============================
  // MỞ / ĐÓNG POPUP
  // ===============================
  function openCart() {
    modal.classList.add("show");
    render();
  }

  function closeCart() {
    modal.classList.remove("show");
  }

  // ===============================
  // SỰ KIỆN GIAO DIỆN
  // ===============================
  function attachEvents() {
    //  Mở popup khi nhấn icon giỏ hàng
    document.querySelector(".header__cart")?.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });

    // Thêm sản phẩm vào giỏ khi bấm nút .add-to-cart-btn
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart-btn");
      if (!btn) return;

      // Ưu tiên lấy dữ liệu từ data-*
      let id = btn.dataset.id || btn.dataset.sku;
      let name = btn.dataset.name;
      let price = btn.dataset.price;
      let image = btn.dataset.image;
      let sku = btn.dataset.sku;

      // Nếu không có data-* thì tìm trong card sản phẩm
      if (!id || !name || !price) {
        const card = btn.closest(".product, .product-card, .card, .menu-item") || document;
        name = name || (card.querySelector(".name, h3, .title")?.textContent || "Sản phẩm").trim();

        // Xử lý giá tiền: loại bỏ chữ, dấu chấm, VND → số
        const rawPrice = price || (card.querySelector(".price")?.textContent || "0");
        price = Number(String(rawPrice).replace(/[^\d]/g, "")) || 0;

        image = image || (card.querySelector("img")?.getAttribute("src") || "");
        sku = sku || (card.querySelector(".sku")?.textContent || "").trim();
        id = id || sku || `${name}|${price}`;
      }

      addItem({ id, name, price, image, sku, qty: 1 });
      openCart();
    });

    //  Thay đổi số lượng
    bodyEl.addEventListener("input", (e) => {
      if (!e.target.matches(".qty")) return;
      const idx = Number(e.target.dataset.idx);
      setQty(idx, e.target.value, false);
    });

    //  Xóa sản phẩm
    bodyEl.addEventListener("click", (e) => {
      if (!e.target.matches(".remove")) return;
      const idx = Number(e.target.dataset.rm);
      removeAt(idx);
    });

    //  Đóng popup khi bấm ngoài vùng nội dung
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeCart();
    });

    //  Đóng popup khi bấm nút X
    modal.querySelector(".cart-close").addEventListener("click", closeCart);

    //  Đóng popup khi bấm phím ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCart();
    });

    //  Nút tiếp tục thanh toán
    const checkoutBtn = modal.querySelector('#checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (!cart || cart.length === 0) {
          alert('Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
          return;
        }
        // Điều hướng tới trang checkout (trong cùng thư mục pages/ khi trang hiện tại là trong pages)
        // Dùng đường dẫn tương đối so với trang hiện tại: './checkout.html'
        window.location.href = './checkout.html';
      });
    }
  }

  // ===============================
  // KHỞI TẠO
  // ===============================
  //Hàm async dùng để tải nội dung từ file html
  async function init() {
    cart = loadCart();        // Đọc LocalStorage
    ensureBadge();            // Tạo badge nếu chưa có
    updateBadge();            // Hiển thị số lượng hiện tại
    await injectCartHTML();   // Nhúng giao diện popup

    // Lưu tham chiếu phần tử
    modal = document.getElementById("cartModal");
    if (!modal) {
      console.error("[Cart] Không tìm thấy #cartModal sau khi inject cart.html");
      return;
    }
    bodyEl = modal.querySelector("#cartBody");
    totalEl = modal.querySelector("#cartTotal");

    attachEvents(); // Gắn sự kiện
    render(false);  // Render lần đầu
  }

  // Chạy init khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
