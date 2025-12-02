// Hiển thị tóm tắt giỏ hàng
    document.addEventListener('DOMContentLoaded', () => {
      const STORAGE_KEY = 'cart_items_v1'; //đọc dữ liệu từ giỏ hang
      const raw = localStorage.getItem(STORAGE_KEY) || '[]';
      let items = [];
      try { items = JSON.parse(raw); } catch(e) { items = []; }
      const list = document.getElementById('summaryList');//Hiển thị danh sách sản phẩm
      const totalEl = document.getElementById('summaryTotal');//Hiển thị tổng tiền
      const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', currencyDisplay: 'code' });
      let total = 0;//Biến tính tổng tiền
      if (!list) return;
      if (items.length === 0) list.innerHTML = '<div class="empty-cart-msg">Giỏ hàng của bạn đang trống.</div>';
      items.forEach(it => { //Lặp qua các sản phẩm trong giỏ hàng và tính tổng tiền
        total += (Number(it.price) || 0) * (it.qty || 1);
        const row = document.createElement('div');//Tạo dòng sản phẩm
        row.className = 'summary-item';
        row.innerHTML = `
          <span class="summary-item-name">${it.name}</span>
          <span class="summary-item-qty">x${it.qty}</span>
          <span class="summary-item-price">${money.format((Number(it.price)||0) * (it.qty||1))}</span>
        `;
        list.appendChild(row);//Thêm dòng sản phẩm vào danh sách
      });
      totalEl.textContent = money.format(total);//Cập nhật tổng tiền

      document.getElementById('placeOrderBtn').addEventListener('click', () => {
        const fullname = document.getElementById('fullName').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        if (!fullname || !address || !phone) { 
          alert('Vui lòng điền Họ tên, Địa chỉ và Số điện thoại.'); 
          return; 
        }
        if (items.length === 0) {
          alert('Giỏ hàng đang trống. Vui lòng thêm sản phẩm.');
          return;
        }
        // Lưu đơn hàng vào localStorage 
        const order = { 
          items, 
          fullname, 
          address, 
          phone, 
          note: document.getElementById('note').value || '', 
          payment: document.querySelector('input[name="payment"]:checked').value, 
          ts: Date.now(),
          id: 'ORD-' + Date.now(),
          status: 'pending'
        };
        // Lưu đơn hàng cuối cùng để hiển thị nhanh
        localStorage.setItem('last_order_demo', JSON.stringify(order));
        // Gọi hàm lưu đơn hàng từ order-history.js
        if (window.saveNewOrder) {
          window.saveNewOrder(order);
        } else {
          // Fallback: Lưu đơn hàng vào mảng đơn hàng trong localStorage
          const ORDERS_KEY = 'user_orders_v1';
          const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
          allOrders.unshift(order);
          localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
        }
        localStorage.removeItem(STORAGE_KEY);
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.\nXem lịch sử đơn hàng trong tài khoản của bạn.');
        window.location.href = './homepage.html';
      });
    });