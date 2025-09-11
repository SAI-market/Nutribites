let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function loadProducts() {
  const res = await fetch("products/manifest.json");
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="products/${p.path}" alt="${p.name}" />
      <div class="name">${p.name.replace(/\.[^/.]+$/, "")}</div>
      <button onclick="addToCart('${p.name}')">Agregar</button>
    `;
    gallery.appendChild(card);
  });
}

function addToCart(name) {
  cart.push(name);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

function showCart() {
  const modal = document.getElementById("cartModal");
  modal.classList.remove("hidden");

  const itemsDiv = document.getElementById("cartItems");
  itemsDiv.innerHTML = cart.map(item => `<p>${item.replace(/\.[^/.]+$/, "")}</p>`).join("");
  document.getElementById("cartSummary").textContent = `Total: ${cart.length} waffles`;
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showCart();
}

function checkout() {
  const number = "5491112345678"; // ← ponés tu número real
  const text = encodeURIComponent("Hola, quiero pedir:\n" + cart.join(", "));
  window.open(`https://wa.me/${number}?text=${text}`, "_blank");
}

function showContact() {
  document.getElementById("contactModal").classList.remove("hidden");
}

function closeContact() {
  document.getElementById("contactModal").classList.add("hidden");
}

function contactWhatsApp() {
  const number = "5491112345678";
  const text = encodeURIComponent("Hola, vengo para consultarte: ");
  window.open(`https://wa.me/${number}?text=${text}`, "_blank");
}

// Eventos
document.getElementById("cartBtn").onclick = showCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("clearCart").onclick = clearCart;
document.getElementById("checkoutBtn").onclick = checkout;

document.getElementById("contactBtn").onclick = showContact;
document.getElementById("closeContact").onclick = closeContact;
document.getElementById("contactWhatsApp").onclick = contactWhatsApp;

loadProducts();
updateCartCount();

