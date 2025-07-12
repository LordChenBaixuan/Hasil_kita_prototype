class CheckoutManager {
  constructor() {
    this.checkoutData = this.loadCheckoutData();
    this.selectedPaymentMethod = null;
    this.protectionFee = 2000; 
    this.isProtectionChecked = false; 
    this.serviceFee = 1000; 
    this.shippingCost = 10000; 
    this.vouchers = [
      {
        id: 1,
        name: "Voucher Gratis Ongkir",
        discount: 10000,
        type: "shipping",
      },
      { id: 2, name: "Voucher Diskon 10%", discount: 0.1, type: "percentage" },
      {
        id: 3,
        name: "Voucher Cashback Rp 5.000",
        discount: 5000,
        type: "cashback",
      },
    ];
    this.selectedVoucher = null;
    this.shippingCost = 10000;
    this.protectionFee = 2000;
    this.isProtectionEnabled = false;

    this.init();
  }

  loadCheckoutData() {
  // Ambil data dari localStorage
  const checkoutItems = localStorage.getItem("hasilkita_checkout");
  return checkoutItems ? JSON.parse(checkoutItems) : [];
}

renderProducts() {
  const container = document.getElementById("checkout-products");
  if (!container) return;

  if (this.checkoutData.length === 0) {
    container.innerHTML = `
      <div class="empty-products">
        <p>Tidak ada produk untuk checkout</p>
        <a href="keranjang.html" class="btn-back">Kembali ke Keranjang</a>
      </div>
    `;
    return;
  }

  container.innerHTML = this.checkoutData.map(item => `
    <div class="product-item">
      <div class="product-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-details">
        <h4 class="product-name">${item.name}</h4>
      </div>
      <div class="product-pricing">
        <div class="product-price">Rp ${this.formatCurrency(item.price)}</div>
        <div class="product-quantity">${item.quantity}</div>
        <div class="product-subtotal">Rp ${this.formatCurrency(item.price * item.quantity)}</div>
      </div>
    </div>
  `).join("");
}


  init() {
    this.renderProducts();
    this.setupEventListeners();
    this.updateOrderSummary();
    this.updateProtectionSummary();
  }

  renderProducts() {
  const container = document.getElementById("checkout-products");
  if (!container) return;

  if (this.checkoutData.length === 0) {
    container.innerHTML = `
      <div class="empty-products">
        <p>Tidak ada produk untuk checkout</p>
        <a href="cart/keranjang.html" class="btn-back">Kembali ke Keranjang</a>
      </div>
    `;
    return;
  }

  container.innerHTML = this.checkoutData.map(item => `
    <div class="product-item">
      <div class="product-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-details">
        <h4 class="product-name">${item.name}</h4>
      </div>
      <div class="product-pricing">
        <div class="product-price">Rp ${this.formatCurrency(item.price)}</div>
        <div class="product-quantity">${item.quantity}</div>
        <div class="product-subtotal">Rp ${this.formatCurrency(item.price * item.quantity)}</div>
      </div>
    </div>
  `).join("");
}

  setupEventListeners() {
    // Payment method selection
    const paymentMethods = document.querySelectorAll(".payment-method");
    paymentMethods.forEach((method) => {
      method.addEventListener("click", () => {
        this.selectPaymentMethod(method);
      });
    });

    // Address change button
    const changeAddressBtn = document.querySelector(".btn-change-address");
    if (changeAddressBtn) {
      changeAddressBtn.addEventListener("click", () => {
        this.openAddressSelector();
      });
    }

    // Voucher selection
    const voucherBtn = document.querySelector(".btn-voucher");
    if (voucherBtn) {
      voucherBtn.addEventListener("click", () => {
        this.openVoucherModal();
      });
    }

    // Protection service toggle
    const protectionCheckbox = document.querySelector(".protection-service");
    if (protectionCheckbox) {
      protectionCheckbox.addEventListener("change", (e) => {
        this.isProtectionEnabled = e.target.checked;
        this.updateProtectionSummary();
        this.updateOrderSummary();
      });
    }

    // Create order button
    const createOrderBtn = document.querySelector(".btn-create-order");
    if (createOrderBtn) {
      createOrderBtn.addEventListener("click", () => {
        this.processOrder();
      });
    }

    // Back button
    const backBtn = document.querySelector(".btn-modal-close");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
         window.location.href="../market/market_sayur.html"
      });
    }

    // Modal close buttons
    const modalCloses = document.querySelectorAll(
      ".modal-close, .modal-overlay",
    );
    modalCloses.forEach((close) => {
      close.addEventListener("click", (e) => {
        if (e.target === close) {
          this.closeModals();
        }
      });
    });
  }

  selectPaymentMethod(methodElement) {
    // Remove active class from all methods
    document.querySelectorAll(".payment-method").forEach((method) => {
      method.classList.remove("active");
    });

    // Add active class to selected method
    methodElement.classList.add("active");
    this.selectedPaymentMethod = methodElement.dataset.method;

    // Update create order button state
    this.updateCreateOrderButton();
  }

  openAddressSelector() {
    // Open Google Maps for address selection
    const mapsUrl =
      "https://www.google.com/maps/search/?api=1&query=alamat+pengiriman";
    window.open(mapsUrl, "_blank");
  }

  openVoucherModal() {
    const modal = document.getElementById("voucher-modal");
    if (!modal) {
      this.createVoucherModal();
    } else {
      modal.style.display = "flex";
    }
  }

  createVoucherModal() {
    const modalHTML = `
            <div id="voucher-modal" class="modal-overlay">
                <div class="modal-content voucher-modal">
                    <div class="modal-header">
                        <h3>Pilih Voucher</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="voucher-list">
                            ${this.vouchers
                              .map(
                                (voucher) => `
                                <div class="voucher-item" data-voucher-id="${voucher.id}">
                                    <div class="voucher-info">
                                        <h4>${voucher.name}</h4>
                                        <p>
                                            ${
                                              voucher.type === "percentage"
                                                ? `Diskon ${voucher.discount * 100}%`
                                                : `Hemat Rp ${this.formatCurrency(voucher.discount)}`
                                            }
                                        </p>
                                    </div>
                                    <button class="voucher-select-btn">Pilih</button>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                        <div class="voucher-actions">
                            <button class="voucher-clear-btn">Hapus Voucher</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add event listeners for voucher selection
    const voucherItems = document.querySelectorAll(".voucher-select-btn");
    voucherItems.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const voucherId = parseInt(
          e.target.closest(".voucher-item").dataset.voucherId,
        );
        this.selectVoucher(voucherId);
      });
    });

    const clearBtn = document.querySelector(".voucher-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearVoucher();
      });
    }

    // Show modal
    document.getElementById("voucher-modal").style.display = "flex";
  }

  selectVoucher(voucherId) {
    this.selectedVoucher = this.vouchers.find((v) => v.id === voucherId);
    this.updateVoucherDisplay();
    this.updateOrderSummary();
    this.closeModals();
  }

  clearVoucher() {
    this.selectedVoucher = null;
    this.updateVoucherDisplay();
    this.updateOrderSummary();
    this.closeModals();
  }

  updateVoucherDisplay() {
    const voucherText = document.querySelector(".voucher-text");
    if (voucherText) {
      if (this.selectedVoucher) {
        voucherText.textContent = this.selectedVoucher.name;
        voucherText.style.color = "#187600";
      } else {
        voucherText.textContent = "Pilih Voucher";
        voucherText.style.color = "#666";
      }
    }
  }

  calculateDiscount() {
    if (!this.selectedVoucher) return 0;

    const subtotal = this.calculateSubtotal();

    if (this.selectedVoucher.type === "percentage") {
      return subtotal * this.selectedVoucher.discount;
    } else if (this.selectedVoucher.type === "shipping") {
      return Math.min(this.selectedVoucher.discount, this.shippingCost);
    } else {
      return this.selectedVoucher.discount;
    }
  }

  calculateSubtotal() {
    return this.checkoutData.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  }

  updateProtectionSummary() {
  const quantity = this.isProtectionEnabled ? 1 : 0;
  const subtotal = quantity * this.protectionFee;
  const format = (n) => `Rp. ${this.formatCurrency(n)}`;

  document.getElementById("protection-quantity").textContent = quantity;
  document.getElementById("protection-subtotal").textContent = format(subtotal);
}


 updateOrderSummary() {
  const subtotal = this.calculateSubtotal(); 
  const shipping = this.shippingCost; 
  const serviceFee = 1000; 
  const protection = this.isProtectionEnabled ? this.protectionFee : 0; 
  const total = subtotal + shipping + serviceFee + protection;

  document.getElementById("subtotalOrder").textContent = `Rp. ${this.formatCurrency(subtotal)}`;
  document.getElementById("subtotalShipping").textContent = `Rp. ${this.formatCurrency(shipping)}`;
  document.getElementById("service-fee-amount").textContent = `Rp. ${this.formatCurrency(serviceFee)}`;
  document.getElementById("totalPayment").textContent = `Rp. ${this.formatCurrency(total)}`;

  console.log("Detail Perhitungan:", {
    subtotal,
    shipping,
    serviceFee,
    protection,
    total
  });
}

updateElement(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

  updateCreateOrderButton() {
    const createOrderBtn = document.querySelector(".btn-create-order");
    if (createOrderBtn) {
      if (this.selectedPaymentMethod) {
        createOrderBtn.disabled = false;
        createOrderBtn.style.opacity = "1";
        createOrderBtn.style.cursor = "pointer";
      } else {
        createOrderBtn.disabled = true;
        createOrderBtn.style.opacity = "0.6";
        createOrderBtn.style.cursor = "not-allowed";
      }
    }
  }

  processOrder() {
    if (!this.selectedPaymentMethod) {
      this.showNotification("Silakan pilih metode pembayaran", "error");
      return;
    }

    if (this.checkoutData.length === 0) {
      this.showNotification("Tidak ada produk untuk checkout", "error");
      return;
    }

    // Show loading state
    const createOrderBtn = document.querySelector(".btn-create-order");
    const originalText = createOrderBtn.textContent;
    createOrderBtn.textContent = "Memproses...";
    createOrderBtn.disabled = true;

    // Simulate order processing
    setTimeout(() => {
      this.completeOrder();
      createOrderBtn.textContent = originalText;
      createOrderBtn.disabled = false;
    }, 2000);
  }

  completeOrder() {
    // Create order data
    const orderData = {
      id: "HSK" + Date.now(),
      products: this.checkoutData,
      paymentMethod: this.selectedPaymentMethod,
      voucher: this.selectedVoucher,
      subtotal: this.calculateSubtotal(),
      shipping: this.shippingCost,
      protection: this.isProtectionEnabled ? this.protectionFee : 0,
      discount: this.calculateDiscount(),
      total:
        this.calculateSubtotal() +
        (this.isProtectionEnabled ? this.protectionFee : 0) +
        this.shippingCost -
        this.calculateDiscount(),
      date: new Date().toISOString(),
      status: "pending",
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("hasilkita_orders") || "[]");
    orders.push(orderData);
    localStorage.setItem("hasilkita_orders", JSON.stringify(orders));

    // Clear checkout data
    localStorage.removeItem("hasilkita_checkout");

    // Update cart (remove checked out items)
    const cart = JSON.parse(localStorage.getItem("hasilkita_cart") || "[]");
    const remainingCart = cart.filter(
      (cartItem) =>
        !this.checkoutData.some(
          (checkoutItem) => checkoutItem.id === cartItem.id,
        ),
    );
    localStorage.setItem("hasilkita_cart", JSON.stringify(remainingCart));

    // Show success modal
    this.showSuccessModal(orderData);
  }

  showSuccessModal(orderData) {
    const modal = document.getElementById("SuccessModal");
    if (modal) {
      // Update order ID in modal
      const orderIdEl = modal.querySelector(".order-id");
      if (orderIdEl) {
        orderIdEl.textContent = orderData.id;
      }

      modal.style.display = "flex";

      // Add event listeners for modal buttons
      const shopAgainBtn = modal.querySelector(".shop-again-btn");
      const trackOrderBtn = modal.querySelector(".track-order-btn");

      if (shopAgainBtn) {
        shopAgainBtn.addEventListener("click", () => {
          window.location.href = "index-vanilla.html";
        });
      }

      if (trackOrderBtn) {
        trackOrderBtn.addEventListener("click", () => {
          this.showNotification(
            "Fitur pelacakan pesanan akan segera hadir",
            "info",
          );
          this.closeModals();
        });
      }
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Add close event listener
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.removeNotification(notification);
      });
    }
  }

  removeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  closeModals() {
    const modals = document.querySelectorAll(".modal-overlay");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID").format(amount);
  }
}

// Initialize checkout when page loads
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutManager();
});

// Add CSS for notifications and additional modal styles
const additionalStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    max-width: 400px;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.notification-message {
    font-family: 'Cairo', sans-serif;
    font-size: 14px;
    line-height: 1.4;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    color: #666;
    cursor: pointer;
    margin-left: 12px;
}

.notification-error {
    border-left: 4px solid #ef4444;
}

.notification-success {
    border-left: 4px solid #187600;
}

.notification-info {
    border-left: 4px solid #3b82f6;
}

.voucher-modal {
    max-width: 500px;
    width: 90%;
}

.voucher-list {
    max-height: 300px;
    overflow-y: auto;
}

.voucher-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
}

.voucher-info h4 {
    font-family: 'Cairo', sans-serif;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #187600;
}

.voucher-info p {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    margin: 0;
    color: #666;
}

.voucher-select-btn {
    background: #187600;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Cairo', sans-serif;
    font-size: 14px;
    font-weight: 600;
}

.voucher-select-btn:hover {
    background: #27c100;
}

.voucher-actions {
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    margin-top: 16px;
}

.voucher-clear-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Cairo', sans-serif;
    font-size: 14px;
    font-weight: 600;
}

.voucher-clear-btn:hover {
    background: #dc2626;
}

.empty-products {
    text-align: center;
    padding: 40px 20px;
}

.empty-products p {
    font-family: 'Cairo', sans-serif;
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.btn-back {
    display: inline-block;
    background: #187600;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
}

.btn-back:hover {
    background: #27c100;
}
`;

// Add the additional styles to the page
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
