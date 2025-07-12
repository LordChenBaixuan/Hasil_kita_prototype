// ---------- GLOBAL ----------
let selectedQuantity = 1;

// ---------- DOM ----------
const quantityDisplay = document.getElementById("selectedQuantity");
const successModal     = document.getElementById("successModal");

// ---------- QUANTITY ----------
function decreaseQuantity() { if (selectedQuantity > 1) { selectedQuantity--; updateQuantityDisplay(); } }
function increaseQuantity() { selectedQuantity++; updateQuantityDisplay(); }
function updateQuantityDisplay() { if (quantityDisplay) quantityDisplay.textContent = selectedQuantity; }

// ---------- CART CORE ----------
function saveToCart(product) {
  const cart = JSON.parse(localStorage.getItem("hasilkitaCart")) || [];
  const existing = cart.find(i => i.id === product.id);
  if (existing)  existing.quantity += product.quantity;
  else           cart.push(product);
  localStorage.setItem("hasilkitaCart", JSON.stringify(cart));
}

// dipanggil langsung dari tombol HTML
function addToCartFromHTML(btn){
  const product = {
    id:        +btn.dataset.id,
    name:       btn.dataset.name,
    price:     +btn.dataset.price,
    image:      btn.dataset.image,
    quantity:   selectedQuantity,
    selected:  false
  };
  saveToCart(product);
  showSuccessModal();
}

// ---------- MODAL ----------
function showSuccessModal(){ if(successModal){ successModal.classList.add("show"); setTimeout(hideSuccessModal,2000);} }
function hideSuccessModal(){ if(successModal) successModal.classList.remove("show"); }
function setupModalEventListeners(){
  if(successModal){ successModal.addEventListener("click",e=>{ if(e.target===successModal) hideSuccessModal(); }); }
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded",()=>{
  setupModalEventListeners();
  updateQuantityDisplay();
  document.querySelector(".back-button")?.addEventListener("click",()=>history.back());
});

// ---------- UTIL ----------
function formatPrice(p){ return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(p); }

// ---------- EXPORT if needed ----------
window.HasilKita={
  addToCartFromHTML,
  decreaseQuantity,
  increaseQuantity,
  formatPrice
};
