// --- CARGAR CATÁLOGO ---
fetch("catalog.json")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector("#catalog");

    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("gallery-item");
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <button class="addCart">Agregar</button>
      `;
      card.querySelector(".addCart").addEventListener("click", () => addToCart(item));
      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error cargando catálogo:", err));

// --- CARRITO ---
let cart = [];

function addToCart(item) {
  const found = cart.find(i => i.name === item.name);
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.querySelector("#cartItems");
  const cartCount = document.querySelector("#cartCount");
  const cartSummary = document.querySelector("#cartSummary");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} - $${item.price}</span>
      <input type="number" min="1" value="${item.qty}" data-index="${index}">
    `;
    cartItems.appendChild(div);
  });

  cartItems.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", e => {
      const idx = e.target.dataset.index;
      cart[idx].qty = parseInt(e.target.value) || 1;
      renderCart();
    });
  });

  cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
  cartSummary.textContent = `Total: $${total}`;
}

document.querySelector("#clearCart").addEventListener("click", () => {
  cart = [];
  renderCart();
});

document.querySelector("#checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Tu carrito está vacío.");
  let msg = "Hola! Quiero hacer un pedido:\n";
  cart.forEach(i => {
    msg += `- ${i.qty}x ${i.name} ($${i.price})\n`;
  });
  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);
  msg += `\nTotal: $${total}`;
  window.open(`https://wa.me/5491123456789?text=${encodeURIComponent(msg)}`, "_blank");
});

// --- CONTACTO ---
document.querySelector("#sendContact").addEventListener("click", () => {
  const mensaje = document.querySelector("#contactMessage").value.trim();
  if (!mensaje) return alert("Por favor escribí un mensaje.");
  window.open(`https://wa.me/5491123456789?text=${encodeURIComponent(mensaje)}`, "_blank");
});

// --- MODALES ---
const cartModal = document.querySelector("#cartModal");
const contactModal = document.querySelector("#contactModal");

document.querySelector("#cartBtn").addEventListener("click", () => {
  cartModal.classList.remove("hidden");
});
document.querySelector("#contactBtn").addEventListener("click", () => {
  contactModal.classList.remove("hidden");
});

document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelector(`#${e.target.dataset.close}`).classList.add("hidden");
  });
});

// --- HEADER SCROLL (achicar logo) ---
window.addEventListener("scroll", () => {
  const header = document.querySelector(".topbar");
  if (window.scrollY > 50) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});
