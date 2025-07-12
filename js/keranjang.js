let cartItems = [];
let isSelectAllChecked = false;

function goBack() {
  window.location.href ="../market/market_sayur.html";
}

function goToShop() {
  window.location.href = "index-vanilla.html";
}

function formatPrice(price) {
  return "Rp. " + price.toLocaleString("id-ID");
}

function loadCartItems() {
  const savedCart = localStorage.getItem("hasilkitaCart");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
  } else {
    
  }
  renderCartItems();
  updateCartSummary();
}

function saveCartToLocalStorage() {
  localStorage.setItem("hasilkitaCart", JSON.stringify(cartItems));
}

function renderCartItems() {
  const container = document.getElementById("cartItemsContainer");
  const emptyCart = document.getElementById("emptyCart");

  if (cartItems.length === 0) {
    container.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }

  container.style.display = "block";
  emptyCart.style.display = "none";

  container.innerHTML = cartItems
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="item-left">
        <input 
          type="checkbox" 
          class="cart-checkbox item-checkbox" 
          ${item.selected ? "checked" : ""} 
          onchange="toggleItemSelection(${item.id})"
        />
        <img src="${item.image}" alt="${item.name}" class="item-image" />
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-price">${formatPrice(item.price)}</p>
        </div>
      </div>
      
      <div class="item-right">
        <div class="quantity-controls">
          <button class="qty-btn minus" onclick="decreaseItemQuantity(${item.id})">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="qty-btn plus" onclick="increaseItemQuantity(${item.id})">+</button>
        </div>
        <div class="item-total">${formatPrice(item.price * item.quantity)}</div>
        <button class="delete-item-btn" onclick="deleteItem(${item.id})">×</button>
      </div>
    </div>
  `,
    )
    .join("");
}

function toggleItemSelection(itemId) {
  const item = cartItems.find((item) => item.id === itemId);
  if (item) {
    item.selected = !item.selected;
    updateSelectAllState();
    updateCartSummary();
    saveCartToLocalStorage();
  }
}

function toggleSelectAll() {
  isSelectAllChecked = !isSelectAllChecked;
  cartItems.forEach((item) => {
    item.selected = isSelectAllChecked;
  });
  renderCartItems();
  updateCartSummary();
  saveCartToLocalStorage();
}

function updateSelectAllState() {
  const allSelected = cartItems.every((item) => item.selected);
  const someSelected = cartItems.some((item) => item.selected);

  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  selectAllCheckbox.checked = allSelected;
  selectAllCheckbox.indeterminate = someSelected && !allSelected;
  isSelectAllChecked = allSelected;
}

function increaseItemQuantity(itemId) {
  const item = cartItems.find((item) => item.id === itemId);
  if (item) {
    item.quantity++;
    renderCartItems();
    updateCartSummary();
    saveCartToLocalStorage();
  }
}

function decreaseItemQuantity(itemId) {
  const item = cartItems.find((item) => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    renderCartItems();
    updateCartSummary();
    saveCartToLocalStorage();
  }
}

function deleteItem(itemId) {
  cartItems = cartItems.filter((item) => item.id !== itemId);
  renderCartItems();
  updateCartSummary();
  updateSelectAllState();
  saveCartToLocalStorage();
}

function deleteSelected() {
  const selectedItems = cartItems.filter((item) => item.selected);

  if (selectedItems.length === 0) {
    alert("Pilih produk yang ingin dihapus");
    return;
  }

  if (confirm(`Hapus ${selectedItems.length} produk dari keranjang?`)) {
    cartItems = cartItems.filter((item) => !item.selected);
    renderCartItems();
    updateCartSummary();
    updateSelectAllState();
    saveCartToLocalStorage();
  }
}

function updateCartSummary() {
  const selectedItems = cartItems.filter((item) => item.selected);
  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  document.getElementById("totalLabel").textContent =
    `Total (${totalQuantity} produk):`;
  document.getElementById("totalPrice").textContent = formatPrice(totalPrice);
}

function checkout() {
  const selectedItems = cartItems.filter((item) => item.selected);

  if (selectedItems.length === 0) {
    alert("Pilih produk yang ingin di-checkout");
    return;
  }

  // Simpan produk yang dipilih ke localStorage
  localStorage.setItem("hasilkita_checkout", JSON.stringify(selectedItems));
  
  // Redirect ke halaman checkout
  window.location.href = "../checkout.html";
}

document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
});
