// Inisialisasi array untuk menyimpan item keranjang
let cartItems = [];

// Tambahkan semua produk ke dalam array
const allProducts = [
    {
        name: 'Meja Kantor Klasik Minimalis Jati',
        price: 'Rp 4.500.000',
        category: 'meja',
        image: 'img/produk/1.jpg',
        description: 'Meja kantor premium dengan desain klasik minimalis'
    },
    {
        name: 'Tempat Tidur Minimalis Rotan Natural',
        price: 'Rp 2.500.000',
        category: 'tempat-tidur',
        image: 'img/produk/4.jpg',
        description: 'Tempat tidur minimalis dengan sentuhan rotan natural'
    },
    {
        name: 'Kitchen Set Kayu Jati Modern',
        price: 'Rp 6.000.000',
        category: 'kitchen-set',
        image: 'img/produk/5.jpg',
        description: 'Kitchen set modern dengan material kayu jati premium'
    },
    {
        name: 'Pintu Gebyok Ukir Jati',
        price: 'Rp 9.500.000',
        category: 'pintu',
        image: 'img/produk/6.jpg',
        description: 'Pintu gebyok ukir jati dengan desain modern'
    },
    // Tambahkan produk best seller
    {
        name: 'Kursi Bar Premium',
        price: 'Rp 500.000',
        category: 'kursi',
        image: 'img/products/2.jpg',
        description: 'Kursi bar premium dengan desain modern'
    },
    {
        name: 'Pigura Matahari Premium',
        price: 'Rp 500.000',
        category: 'pigura',
        image: 'img/products/1.jpg',
        description: 'Pigura matahari dengan desain modern'
    },
    {
        name: 'Meja Makan Besi',
        price: 'Rp 1.000.000',
        category: 'meja',
        image: 'img/products/3.jpg',
        description: 'Meja makan modern dengan kombinasi besi dan kayu jati'
    }
];

function addToCart(nama, harga, gambar) {
    event.preventDefault();
    addToCartWithQuantity(nama, harga, gambar, 1);
    showNotification(`${nama} berhasil ditambahkan ke keranjang`);
}

function updateQuantity(index, change) {
    event.preventDefault();
    event.stopPropagation();
    
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity < 1) {
        removeFromCart(index);
    } else {
        renderCart();
    }
}

function removeFromCart(index) {
    event.preventDefault();
    event.stopPropagation();
    
    cartItems.splice(index, 1);
    renderCart();
}

function calculateTotal() {
    return cartItems.reduce((total, item) => {
        const price = parseInt(item.price.replace(/\D/g, ''));
        return total + (price * item.quantity);
    }, 0);
}

function renderCart() {
    const shoppingCart = document.querySelector('.shopping-cart');
    const cartItemsWrapper = shoppingCart.querySelector('.cart-items-wrapper');
    if (!cartItemsWrapper) return;
    
    cartItemsWrapper.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsWrapper.innerHTML = `
            <div class="empty-cart">
                <i data-feather="shopping-bag"></i>
                <p>Keranjang belanja kosong</p>
            </div>
        `;
    } else {
        cartItems.forEach((item, index) => {
            cartItemsWrapper.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         onerror="this.src='img/default-product.jpg'"
                         class="cart-item-image">
                    <div class="item-detail">
                        <h3>${item.name}</h3>
                        <div class="item-price">${item.price}</div>
                        <div class="item-actions">
                            <button class="qty-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${index})">
                                <i data-feather="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // Update total di footer
    const totalAmount = shoppingCart.querySelector('.total-amount');
    if (totalAmount) {
        totalAmount.textContent = `IDR ${calculateTotal().toLocaleString('id-ID')}`;
    }
    
    feather.replace();
}

// Tambahkan event listener untuk tombol shopping cart
document.querySelector('#shopping-cart-button').addEventListener('click', function(e) {
    e.preventDefault();
    const shoppingCart = document.querySelector('.shopping-cart');
    shoppingCart.classList.toggle('active');
});

// Tutup cart ketika klik di luar cart
document.addEventListener('click', function(e) {
    const shoppingCart = document.querySelector('.shopping-cart');
    const cartButton = document.querySelector('#shopping-cart-button');
    const isClickInsideCart = shoppingCart.contains(e.target);
    const isClickOnCartButton = cartButton.contains(e.target);
    
    // Cek apakah yang diklik adalah tombol aksi di dalam cart
    const isActionButton = e.target.closest('.qty-btn') || 
                          e.target.closest('.remove-btn') ||
                          e.target.closest('.checkout-btn');
    
    // Jika klik di luar cart DAN bukan tombol cart DAN bukan tombol aksi
    if (!isClickInsideCart && !isClickOnCartButton && !isActionButton) {
        shoppingCart.classList.remove('active');
    }
});

function checkout() {
    if (cartItems.length === 0) {
        showNotification('Keranjang belanja masih kosong');
        return;
    }
    
    // Format pesan WhatsApp untuk multiple items
    let message = 'Halo, saya ingin memesan:%0A%0A';
    
    // Tambahkan setiap item ke pesan
    cartItems.forEach(item => {
        message += `- ${item.name} (${item.quantity} pcs) @ ${item.price}%0A`;
    });
    
    // Tambahkan total
    message += `%0ATotal: IDR ${calculateTotal().toLocaleString('id-ID')}%0A`;
    message += `%0AMohon diproses pesanan saya.`;
    
    // Redirect ke WhatsApp
    window.location.href = `https://wa.me/6285878612964?text=${message}`;
}

// Fungsi untuk pencarian produk
function searchProducts(query) {
    if (!query) return [];
    
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
}

// Event listener untuk tombol search
document.querySelector('#search-button').addEventListener('click', function(e) {
    e.preventDefault();
    const searchForm = document.querySelector('.search-form');
    searchForm.classList.toggle('active');
    
    // Focus pada input search ketika form dibuka
    if (searchForm.classList.contains('active')) {
        document.querySelector('.search-input').focus();
    }
});

// Update event listener untuk input search
document.querySelector('.search-input').addEventListener('input', async function(e) {
    const query = e.target.value;
    const loadingEl = document.querySelector('.search-loading');
    const resultsContainer = document.querySelector('.results-container');
    
    // Reset dan sembunyikan hasil sebelumnya
    resultsContainer.style.display = 'none';
    
    // Jika query kosong, sembunyikan loading dan hasil
    if (!query) {
        loadingEl.classList.remove('active');
        resultsContainer.style.display = 'block';
        displaySearchResults([]);
        return;
    }
    
    // Tampilkan loading
    loadingEl.classList.add('active');
    
    // Simulasi delay pencarian (bisa diganti dengan actual API call)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Lakukan pencarian
    const results = searchProducts(query);
    
    // Sembunyikan loading
    loadingEl.classList.remove('active');
    resultsContainer.style.display = 'block';
    
    // Tampilkan hasil
    displaySearchResults(results);
});

// Fungsi untuk menampilkan hasil pencarian
function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.results-container');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">Tidak ada produk yang ditemukan</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(product => `
        <div class="search-result-item">
            <div class="result-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="result-info">
                <span class="result-category">${product.category}</span>
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="result-price">${product.price}</div>
            </div>
        </div>
    `).join('');
}

// Tutup search form ketika klik di luar
document.addEventListener('click', function(e) {
    const searchForm = document.querySelector('.search-form');
    const searchButton = document.querySelector('#search-button');
    
    if (!searchForm.contains(e.target) && !searchButton.contains(e.target)) {
        searchForm.classList.remove('active');
    }
});

// Tambahkan fungsi untuk menangani modal box
function handleDetailButtons() {
    const detailButtons = document.querySelectorAll('.detail-btn, .item-detail-button');
    const modal = document.getElementById('item-detail-modal');
    const closeIcon = modal.querySelector('.close-icon');
    
    // Tambahkan event listener untuk tombol quantity
    const minusBtn = modal.querySelector('.qty-btn.minus');
    const plusBtn = modal.querySelector('.qty-btn.plus');
    const qtyInput = modal.querySelector('.qty-input');
    const addToCartBtn = modal.querySelector('.add-to-cart');
    
    // Event listener untuk tombol tambah ke keranjang di modal
    addToCartBtn.addEventListener('click', function() {
        const nama = modal.querySelector('.product-title').textContent;
        const harga = modal.querySelector('.current').textContent;
        const gambar = modal.querySelector('#modal-product-image').src;
        const quantity = parseInt(qtyInput.value);
        
        // Tambahkan ke keranjang dengan quantity yang dipilih
        addToCartWithQuantity(nama, harga, gambar, quantity);
        
        // Tutup modal
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Event listener untuk tombol minus
    minusBtn.addEventListener('click', function() {
        let currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    });
    
    // Event listener untuk tombol plus
    plusBtn.addEventListener('click', function() {
        let currentQty = parseInt(qtyInput.value);
        qtyInput.value = currentQty + 1;
    });
    
    // Validasi input manual
    qtyInput.addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
    });

    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset quantity ke 1 setiap kali modal dibuka
            qtyInput.value = 1;
            
            // Ambil data dari atribut data-
            const nama = this.getAttribute('data-nama');
            const harga = this.getAttribute('data-harga');
            const gambar = this.getAttribute('data-gambar');
            
            // Update konten modal
            modal.querySelector('.product-title').textContent = nama;
            modal.querySelector('.current').textContent = harga;
            modal.querySelector('#modal-product-image').src = gambar;
            
            // Tampilkan modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Tutup modal saat klik close icon
    closeIcon.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Tutup modal saat klik di luar modal
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Fungsi baru untuk menambahkan item dengan quantity
function addToCartWithQuantity(nama, harga, gambar, quantity) {
    const existingItem = cartItems.find(item => item.name === nama);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            name: nama,
            price: harga,
            image: gambar,
            quantity: quantity
        });
    }
    
    renderCart();
    showNotification(`${quantity} ${nama} berhasil ditambahkan ke keranjang`);
}

// Panggil fungsi setelah DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    handleDetailButtons();
    
    // Re-initialize setelah feather icons di-replace
    feather.replace();
});

// Tambahkan fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Hapus notifikasi yang sudah ada (jika ada)
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi baru
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i data-feather="check-circle"></i>
        <span>${message}</span>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Replace feather icons
    feather.replace();
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fungsi untuk menangani klik tombol "Beli Sekarang"
function beliSekarang(element) {
    event.preventDefault();
    
    // Ambil data produk dari atribut data-
    const nama = element.getAttribute('data-nama');
    const harga = element.getAttribute('data-harga');
    
    // Format pesan WhatsApp
    let message = `Halo, saya tertarik dengan produk ini:%0A%0A`;
    message += `Nama Produk: ${nama}%0A`;
    message += `Harga: ${harga}%0A%0A`;
    message += `Mohon informasi lebih lanjut.`;
    
    // Nomor WhatsApp tujuan (ganti dengan nomor WhatsApp bisnis Anda)
    const phoneNumber = '6285878612964';
    
    // Redirect ke WhatsApp
    window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
}

// Fungsi untuk mengecek elemen dalam viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
}

// Fungsi untuk menambahkan class show
function showElements() {
    // Animasi untuk sections
    document.querySelectorAll('section').forEach(section => {
        if (isInViewport(section)) {
            section.classList.add('show');
        }
    });

    // Animasi untuk cards
    document.querySelectorAll('.produk-card, .product-card').forEach(card => {
        if (isInViewport(card)) {
            setTimeout(() => {
                card.classList.add('show');
            }, 200 * Array.from(card.parentNode.children).indexOf(card));
        }
    });

    // Animasi untuk content
    document.querySelectorAll('.content, .about, .produk, .products, .contact').forEach(content => {
        if (isInViewport(content)) {
            content.classList.add('show');
        }
    });

    // Animasi untuk images
    document.querySelectorAll('.about-img, .produk-card-img, .product-image').forEach(img => {
        if (isInViewport(img)) {
            img.classList.add('show');
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', showElements);
document.addEventListener('scroll', showElements);
window.addEventListener('resize', showElements);

// Smooth scroll untuk link navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Section
document.addEventListener('DOMContentLoaded', function() {
  const faqs = document.querySelectorAll('.faq');
  
  faqs.forEach(faq => {
    const toggle = faq.querySelector('.faq-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        // Tutup FAQ lain yang sedang terbuka
        faqs.forEach(item => {
          if (item !== faq && item.classList.contains('active')) {
            item.classList.remove('active');
          }
        });
        // Toggle FAQ yang diklik
        faq.classList.toggle('active');
        
        // Ganti ikon saat toggle
        const icon = toggle.querySelector('i');
        if (icon) {
          if (faq.classList.contains('active')) {
            icon.setAttribute('data-feather', 'chevron-up');
          } else {
            icon.setAttribute('data-feather', 'chevron-down');
          }
          feather.replace();
        }
      });
    }
  });
});

// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = (e) => {
  navbarNav.classList.toggle('active');
  e.preventDefault();
};

// Klik di luar sidebar untuk menghilangkan nav
document.addEventListener('click', function(e) {
  if(!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }
});

// Tutup navbar saat link di klik
document.querySelectorAll('.navbar-nav a').forEach(link => {
  link.addEventListener('click', () => {
    navbarNav.classList.remove('active');
  });
});


