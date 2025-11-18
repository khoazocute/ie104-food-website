// ========================= SEARCH FUNCTIONALITY ========================= 

// 1. "Database" sản phẩm
const ProductsDB = {
    init() {
        this.products = [];
        this.loadProducts();
    },

    loadProducts() {
        this.products = [
            // Burgers
            { id: 1, name: 'Burger Phô Mai', price: 45000, category: 'Burger', image: '../assets/imgs/burger1.avif' },
            { id: 2, name: 'Burger Bò Nướng', price: 50000, category: 'Burger', image: '../assets/imgs/burger2.avif' },
            { id: 3, name: 'Burger Gà Giòn', price: 48000, category: 'Burger', image: '../assets/imgs/burger3.avif' },
            { id: 4, name: 'Burger Double Beef', price: 65000, category: 'Burger', image: '../assets/imgs/burger4.avif' },
            { id: 5, name: 'Burger Cá Tươi', price: 52000, category: 'Burger', image: '../assets/imgs/burger5.avif' },
            { id: 6, name: 'Burger Combo Tiệt Kiệm', price: 55000, category: 'Burger', image: '../assets/imgs/burger6.avif' },
            
            // Pizzas
            { id: 7, name: 'Pizza Xúc Xích', price: 80000, category: 'Pizza', image: '../assets/imgs/pizza6.avif' },
            { id: 8, name: 'Pizza Hải Sản', price: 90000, category: 'Pizza', image: '../assets/imgs/pizza22.avif' },
            { id: 9, name: 'Pizza Thịt Bò Hầm', price: 90000, category: 'Pizza', image: '../assets/imgs/pizza3.avif' },
            { id: 10, name: 'Pizza Margherita', price: 75000, category: 'Pizza', image: '../assets/imgs/pizzza1.avif' },
            
            // Combos
            { id: 14, name: 'Combo Gia Đình 2', price: 180000, category: 'Combo', image: '../assets/imgs/burger7.avif' },
            { id: 15, name: 'Combo Tiệc Gà & Mì Ý', price: 190000, category: 'Combo', image: '../assets/imgs/burger8.avif' },
            { id: 16, name: 'Pizza Combo Gia Đình', price: 220000, category: 'Combo', image: '../assets/imgs/burger9.avif' },
        ];
    },

    search(query) {
        if (!query || query.trim().length === 0) return [];
        
        const q = query.toLowerCase();
        return this.products
            .filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.category.toLowerCase().includes(q)
            )
            .slice(0, 8); // giới hạn 8 kết quả
    }
};

// 2. Quản lý UI của search
const SearchUI = {
    init() {
        this.searchInput = document.getElementById('searchInput');
        this.resultsContainer = document.getElementById('searchResults');
        
        if (!this.searchInput || !this.resultsContainer) return;
        
        this.attachListeners();
        this.hideResults(); // ban đầu ẩn
    },

    attachListeners() {
        // Gõ tới đâu search tới đó
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.trim().length === 0) {
                this.hideResults();
                return;
            }
            this.performSearch(query);
        });

        // Click ra ngoài thì ẩn popup
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header__search')) {
                this.hideResults();
            }
        });

        // Chặn submit form reload page
        if (this.searchInput.form) {
            this.searchInput.form.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        }
    },

    performSearch(query) {
        const results = ProductsDB.search(query);
        
        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        this.renderResults(results);
    },

    renderResults(results) {
        const money = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND', 
            currencyDisplay: 'code' 
        });

        let html = '<div class="search-results-list">';
        
        results.forEach(product => {
            html += `
                <a href="./menu_list.html" class="search-result-item" data-product-id="${product.id}">
                    <div class="search-result-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='../assets/imgs/burger1.avif'">
                    </div>
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <span class="search-result-category">${product.category}</span>
                        <span class="search-result-price">${money.format(product.price)}</span>
                    </div>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            `;
        });

        html += '</div>';
        this.resultsContainer.innerHTML = html;
        this.showResults();
    },

    showNoResults(query) {
        this.resultsContainer.innerHTML = `
            <div class="search-no-results">
                <i class="fa-solid fa-search"></i>
                <p>Không tìm thấy "<strong>${query}</strong>"</p>
                <small>Thử từ khóa khác hoặc xem <a href="./menu_list.html">toàn bộ menu</a></small>
            </div>
        `;
        this.showResults();
    },

    showResults() {
        this.resultsContainer.style.display = 'block';
    },

    hideResults() {
        this.resultsContainer.style.display = 'none';
    }
};

function initSearchIfReady() {
    // Nếu đã init rồi thì thôi
    if (SearchUI._initialized) return;

    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');

    // Header chưa load xong thì thoát
    if (!input || !results) return;

    ProductsDB.init();
    SearchUI.init();
    SearchUI._initialized = true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Thử init 1 lần
    initSearchIfReady();

    // Nếu header được include trễ, cứ 200ms thử lại
    const timer = setInterval(() => {
        if (SearchUI._initialized) {
            clearInterval(timer);
        } else {
            initSearchIfReady();
        }
    }, 200);
});

