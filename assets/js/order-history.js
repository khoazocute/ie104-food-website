// ========================= ORDER HISTORY MANAGEMENT ========================= 

// Order Management System
const OrderManager = {
    ORDERS_KEY: 'user_orders_v1',
    OLD_ORDER_KEY: 'last_order_demo',

    // Initialize - migrate old order format to new
    init() {
        const oldOrder = localStorage.getItem(this.OLD_ORDER_KEY);
        const allOrders = this.getAllOrders();
        
        // If old order exists and not in new system, migrate it
        if (oldOrder && allOrders.length === 0) {
            try {
                const order = JSON.parse(oldOrder);
                const migratedOrder = {
                    id: order.id || 'ORD-' + order.ts,
                    ts: order.ts || Date.now(),
                    fullname: order.fullname,
                    address: order.address,
                    phone: order.phone,
                    note: order.note || '',
                    payment: order.payment || 'cod',
                    items: order.items || [],
                    status: 'completed'
                };
                this.addOrder(migratedOrder);
            } catch (e) {
                console.log('Could not migrate old order');
            }
        }
    },

    // Get all orders for current user
    getAllOrders() {
        const raw = localStorage.getItem(this.ORDERS_KEY) || '[]';
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    },

    // Add new order
    addOrder(order) {
        const allOrders = this.getAllOrders();
        const newOrder = {
            id: order.id || 'ORD-' + Date.now(),
            ts: order.ts || Date.now(),
            fullname: order.fullname,
            address: order.address,
            phone: order.phone,
            note: order.note || '',
            payment: order.payment || 'cod',
            items: order.items || [],
            status: order.status || 'pending'
        };
        allOrders.unshift(newOrder); // Add to beginning
        localStorage.setItem(this.ORDERS_KEY, JSON.stringify(allOrders));
        return newOrder;
    },

    // Get single order by ID
    getOrder(orderId) {
        const allOrders = this.getAllOrders();
        return allOrders.find(o => o.id === orderId);
    },

    // Update order status
    updateOrderStatus(orderId, status) {
        const allOrders = this.getAllOrders();
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem(this.ORDERS_KEY, JSON.stringify(allOrders));
        }
        return order;
    },

    // Get status badge info
    getStatusBadge(status) {
        const badges = {
            'pending': { text: 'Đang xử lý', class: 'info' },
            'confirmed': { text: 'Đã xác nhận', class: 'info' },
            'shipping': { text: 'Đang giao', class: 'warning' },
            'completed': { text: 'Hoàn tất', class: 'success' },
            'cancelled': { text: 'Đã huỷ', class: 'danger' }
        };
        return badges[status] || { text: 'Không xác định', class: 'info' };
    },

    // Get payment method name
    getPaymentName(method) {
        const methods = {
            'cod': 'Thanh toán khi nhận hàng',
            'bank': 'Chuyển khoản ngân hàng',
            'momo': 'Ví Momo'
        };
        return methods[method] || method;
    }
};

// Initialize order system on page load
document.addEventListener('DOMContentLoaded', () => {
    OrderManager.init();
    renderOrders();
    setupModalHandlers();
});

// Render all orders
function renderOrders() {
    const container = document.getElementById('ordersContainer');
    const orders = OrderManager.getAllOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <p>Bạn chưa có đơn hàng nào</p>
                <a href="./menu_list.html" class="btn primary">Khám phá menu</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => createOrderCard(order)).join('');
    
    // Attach click handlers
    document.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                const orderId = card.dataset.orderId;
                showOrderDetail(orderId);
            }
        });
    });

    // Attach button handlers
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            showOrderDetail(orderId);
        });
    });

    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const orderId = btn.dataset.orderId;
            reorderItems(orderId);
        });
    });
}

// Create order card HTML
function createOrderCard(order) {
    const statusInfo = OrderManager.getStatusBadge(order.status);
    const date = new Date(order.ts).toLocaleDateString('vi-VN');
    const total = calculateOrderTotal(order.items);
    const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', currencyDisplay: 'code' });
    const itemPreview = order.items.slice(0, 2)
        .map(item => `${item.name} x${item.qty}`)
        .join(', ') + (order.items.length > 2 ? ` +${order.items.length - 2} món khác` : '');

    return `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-card-header">
                <span class="order-card-id">${order.id}</span>
                <span class="order-card-date">${date}</span>
                <span class="order-card-status"><span class="badge ${statusInfo.class}">${statusInfo.text}</span></span>
            </div>

            <div class="order-card-body">
                <div class="order-card-info">
                    <p><strong>Người nhận:</strong> ${order.fullname}</p>
                    <p><strong>Địa chỉ:</strong> ${order.address}</p>
                </div>

                <div class="order-card-items">
                    <p><strong>Các mặt hàng:</strong></p>
                    <div class="order-card-item-preview">${itemPreview}</div>
                </div>

                <div class="order-card-total">
                    <span class="order-card-total-label">Tổng cộng</span>
                    <span class="order-card-total-amount">${money.format(total)}</span>
                </div>
            </div>

            <div class="order-card-footer">
                <button class="view-details-btn" data-order-id="${order.id}">
                    <i class="fa-solid fa-eye"></i> Xem chi tiết
                </button>
                <button class="reorder-btn" data-order-id="${order.id}">
                    <i class="fa-solid fa-redo"></i> Đặt lại
                </button>
            </div>
        </div>
    `;
}

// Show order detail modal
function showOrderDetail(orderId) {
    const order = OrderManager.getOrder(orderId);
    if (!order) return;

    const modal = document.getElementById('orderModal');
    const statusInfo = OrderManager.getStatusBadge(order.status);
    const date = new Date(order.ts).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    const total = calculateOrderTotal(order.items);
    const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', currencyDisplay: 'code' });

    // Fill modal data
    document.getElementById('modalOrderId').textContent = order.id;
    document.getElementById('modalOrderDate').textContent = date;
    document.getElementById('modalOrderStatus').textContent = statusInfo.text;
    document.getElementById('modalOrderStatus').className = `badge ${statusInfo.class}`;
    document.getElementById('modalFullName').textContent = order.fullname;
    document.getElementById('modalAddress').textContent = order.address;
    document.getElementById('modalPhone').textContent = order.phone;
    document.getElementById('modalPayment').textContent = OrderManager.getPaymentName(order.payment);
    
    // Handle note
    if (order.note && order.note.trim()) {
        document.getElementById('modalNoteSection').style.display = 'block';
        document.getElementById('modalNote').textContent = order.note;
    } else {
        document.getElementById('modalNoteSection').style.display = 'none';
    }

    // Render items
    const itemsList = document.getElementById('modalItemsList');
    itemsList.innerHTML = order.items.map(item => `
        <div class="item-row">
            <span class="item-name">${item.name}</span>
            <span class="item-qty">x${item.qty}</span>
            <span class="item-price">${money.format(Number(item.price) * item.qty)}</span>
        </div>
    `).join('');

    document.getElementById('modalTotal').textContent = money.format(total);

    // Set reorder button
    document.getElementById('reorderBtn').dataset.orderId = orderId;

    // Show modal
    modal.classList.add('active');
}

// Setup modal handlers
function setupModalHandlers() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.modal-close');
    const closeModalBtn = document.getElementById('closeModalBtn');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    document.getElementById('reorderBtn').addEventListener('click', () => {
        const orderId = document.getElementById('reorderBtn').dataset.orderId;
        reorderItems(orderId);
    });
}

// Reorder - add items back to cart
function reorderItems(orderId) {
    const order = OrderManager.getOrder(orderId);
    if (!order) return;

    const CART_KEY = 'cart_items_v1';
    const currentCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

    // Add all items from order to cart
    order.items.forEach(item => {
        const existingItem = currentCart.find(ci => ci.id === item.id);
        if (existingItem) {
            existingItem.qty += item.qty;
        } else {
            currentCart.push(item);
        }
    });

    localStorage.setItem(CART_KEY, JSON.stringify(currentCart));

    // Close modal and show confirmation
    document.getElementById('orderModal').classList.remove('active');
    alert(`✓ Đã thêm ${order.items.length} mặt hàng vào giỏ hàng. Bạn có thể đi tới trang menu để hoàn tất.`);
    
    // Optional: redirect to checkout
    // setTimeout(() => {
    //     window.location.href = './checkout.html';
    // }, 1000);
}

// Calculate order total
function calculateOrderTotal(items) {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0);
}

// Integration with checkout - update this when orders are created
// This function should be called from checkout.html after order is placed
window.saveNewOrder = function(order) {
    OrderManager.addOrder(order);
};
