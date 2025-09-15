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
      card.querySelector(".addCart").addEventListener("click", (e) => addToCart(item, e.target));
      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error cargando catálogo:", err));

// --- CARRITO ---
let cart = [];

function addToCart(item, buttonElement) {
  const found = cart.find(i => i.name === item.name);
  let addedQty = 1;
  
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
  
  // Feedback visual al agregar producto
  showCartFeedback();
  showAddFeedback(buttonElement, addedQty);
}

function showCartFeedback() {
  const cartBtn = document.querySelector("#cartBtn");
  cartBtn.style.transform = "scale(1.1)";
  cartBtn.style.background = "#3b003b";
  
  setTimeout(() => {
    cartBtn.style.transform = "scale(1)";
    cartBtn.style.background = "#7b2e7b";
  }, 200);
}

function showAddFeedback(buttonElement, quantity) {
  // Crear elemento de feedback
  const feedback = document.createElement("div");
  feedback.className = "add-feedback";
  feedback.textContent = `+${quantity}`;
  
  // Añadir al botón
  buttonElement.style.position = "relative";
  buttonElement.appendChild(feedback);
  
  // Remover después de la animación
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.parentNode.removeChild(feedback);
    }
  }, 1500);
}

function removeFromCart(index) {
  if (confirm("¿Querés eliminar este producto del carrito?")) {
    cart.splice(index, 1);
    renderCart();
    
    // Feedback visual si el carrito queda vacío
    if (cart.length === 0) {
      const cartCount = document.querySelector("#cartCount");
      cartCount.style.color = "#ff4757";
      setTimeout(() => {
        cartCount.style.color = "white";
      }, 500);
    }
  }
}

function renderCart() {
  const cartItems = document.querySelector("#cartItems");
  const cartCount = document.querySelector("#cartCount");
  const cartSummary = document.querySelector("#cartSummary");
  const cartEmpty = document.querySelector("#cartEmpty");
  const cartActions = document.querySelector(".cart-actions");
  
  cartItems.innerHTML = "";
  let total = 0;

  // Mostrar/ocultar elementos según si el carrito está vacío
  if (cart.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartActions.style.display = "none";
    cartCount.textContent = "0";
    return;
  } else {
    cartEmpty.classList.add("hidden");
    cartActions.style.display = "block";
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price} c/u</div>
      </div>
      <div class="cart-item-controls">
        <input type="number" min="1" value="${item.qty}" data-index="${index}">
        <button class="remove-item-btn" data-index="${index}" title="Eliminar producto">×</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  // Event listeners para cambios de cantidad
  cartItems.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", e => {
      const idx = e.target.dataset.index;
      const newQty = parseInt(e.target.value);
      
      if (newQty <= 0) {
        // Remover item si la cantidad es 0 o menor
        cart.splice(idx, 1);
      } else {
        cart[idx].qty = newQty;
      }
      renderCart();
    });
    
    // Efecto visual en focus
    input.addEventListener("focus", e => {
      e.target.style.background = "white";
    });
    
    input.addEventListener("blur", e => {
      e.target.style.background = "#faf4eb";
    });
  });

  // Event listeners para botones de eliminar
  cartItems.querySelectorAll(".remove-item-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.dataset.index);
      removeFromCart(idx);
    });
  });

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  cartCount.textContent = totalItems;
  cartSummary.textContent = `Total: $${total} (${totalItems} item${totalItems !== 1 ? 's' : ''})`;
}

document.querySelector("#clearCart").addEventListener("click", () => {
  if (cart.length === 0) return;
  
  // Confirmación antes de vaciar
  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    cart = [];
    renderCart();
    
    // Feedback visual
    const clearBtn = document.querySelector("#clearCart");
    clearBtn.style.background = "#e69d4f";
    setTimeout(() => {
      clearBtn.style.background = "#e8ba8a";
    }, 300);
  }
});

document.querySelector("#checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío. ¡Agregá algunos waffles deliciosos!");
    return;
  }
  
  let msg = "🧇 ¡Hola! Quiero hacer un pedido de Nutri Bites:\n\n";
  cart.forEach(i => {
    msg += `• ${i.qty}x ${i.name} - $${i.price} c/u\n`;
  });
  
  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);
  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  
  msg += `\n💰 Total: $${total}\n📦 Cantidad total: ${totalItems} waffle${totalItems !== 1 ? 's' : ''}\n\n¡Gracias! 😊`;
  
  window.open(`https://wa.me/5492323521229?text=${encodeURIComponent(msg)}`, "_blank");
  
  // Feedback visual
  const checkoutBtn = document.querySelector("#checkoutBtn");
  checkoutBtn.textContent = "✅ ¡Enviado!";
  checkoutBtn.style.background = "#1ebc57";
  
  setTimeout(() => {
    checkoutBtn.textContent = "💬 Pedir por WhatsApp";
    checkoutBtn.style.background = "#25d366";
  }, 2000);
});

// --- CONTACTO ---
document.querySelector("#sendContact").addEventListener("click", () => {
  const mensaje = document.querySelector("#contactMessage").value.trim();
  if (!mensaje) {
    alert("Por favor escribí un mensaje.");
    return;
  }
  
  const fullMessage = `🧇 Consulta desde Nutri Bites:\n\n${mensaje}\n\n¡Gracias!`;
  window.open(`https://wa.me/5492323521229?text=${encodeURIComponent(fullMessage)}`, "_blank");
});

// --- MODALES ---
const cartModal = document.querySelector("#cartModal");
const contactModal = document.querySelector("#contactModal");

document.querySelector("#cartBtn").addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  renderCart(); // Asegurar que se renderice al abrir
});

document.querySelector("#contactBtn").addEventListener("click", () => {
  contactModal.classList.remove("hidden");
});

document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelector(`#${e.target.dataset.close}`).classList.add("hidden");
  });
});

// Cerrar modales clickeando fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.add("hidden");
  }
});

// Cerrar modales con ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.classList.add("hidden");
    });
  }
});

// --- HEADER SCROLL (achicar logo) ---
window.addEventListener("scroll", () => {
  const header = document.querySelector(".topbar");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});