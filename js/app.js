import catalog from "../catalog.json" assert { type: "json" };

const gallery = document.getElementById("gallery");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const clearCart = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartCount = document.getElementById("cartCount");

const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");
const contactWhatsapp = document.getElementById("contactWhatsapp");

let cart = {};

function renderCatalog() {
  gallery.innerHTML = "";
  catalog.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>$${item.price}</p>
      <button onclick="addToCart(${index})">Agregar</button>
    `;
    gallery.appendChild(card);
  });
}

window.addToCart = function(index) {
  const item = catalog[index];
  cart[item.name] = (cart[item.name] || 0) + 1;
  updateCart();
};

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  Object.entries(cart).forEach(([name, qty]) => {
    const item = catalog.find(i => i.name === name);
    const subtotal = item.price * qty;
    total += subtotal;
    const div = document.createElement("div");
    div.textContent = `${name} x${qty} - $${subtotal}`;
    cartItems.appendChild(div);
  });
  cartSummary.textContent = `Total: $${total}`;
  cartCount.textContent = Object.values(cart).reduce((a,b)=>a+b,0);
}

cartBtn.onclick = () => cartModal.classList.remove("hidden");
closeCart.onclick = () => cartModal.classList.add("hidden");
clearCart.onclick = () => { cart = {}; updateCart(); };
checkoutBtn.onclick = () => {
  let msg = "Hola! Quiero pedir:\n";
  Object.entries(cart).forEach(([name, qty]) => msg += `${name} x${qty}\n`);
  window.open(`https://wa.me/5491112345678?text=${encodeURIComponent(msg)}`);
};

contactBtn.onclick = () => contactModal.classList.remove("hidden");
closeContact.onclick = () => contactModal.classList.add("hidden");
contactWhatsapp.onclick = () => {
  window.open("https://wa.me/5491112345678?text=Hola, vengo a consultarte:");
};

renderCatalog();
