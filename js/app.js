// --- FUNCIONES DE GALERÍA DE IMÁGENES ---
function initializeProductGallery(galleryElement) {
  const images = galleryElement.querySelectorAll('img');
  const dots = galleryElement.querySelectorAll('.dot');
  const prevBtn = galleryElement.querySelector('.prev-btn');
  const nextBtn = galleryElement.querySelector('.next-btn');
  
  if (images.length <= 1) {
    galleryElement.classList.add('single-image');
    return;
  }
  
  let currentIndex = 0;
  
  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  
  function nextImage() {
    const newIndex = (currentIndex + 1) % images.length;
    showImage(newIndex);
  }
  
  function prevImage() {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(newIndex);
  }
  
  // Event listeners para los botones
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  
  // Event listeners para los dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showImage(index));
  });
  
  // Inicializar mostrando la primera imagen
  showImage(0);
}

// --- CARGAR CATÁLOGO ---
fetch("catalog.json")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector("#catalog");

    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("gallery-item");
      
      // Si el item tiene múltiples imágenes, crear galería
      let imagesHtml = '';
      let dotsHtml = '';
      
      if (item.images && item.images.length > 0) {
        // Múltiples imágenes
        imagesHtml = item.images.map((img, index) => 
          `<img src="${img}" alt="${item.name}" class="${index === 0 ? 'active' : ''}">`
        ).join('');
        
        if (item.images.length > 1) {
          dotsHtml = `
            <div class="gallery-dots">
              ${item.images.map((_, index) => 
                `<span class="dot ${index === 0 ? 'active' : ''}"></span>`
              ).join('')}
            </div>
          `;
        }
      } else if (item.image) {
        // Una sola imagen (compatibilidad con formato anterior)
        imagesHtml = `<img src="${item.image}" alt="${item.name}" class="active">`;
      }
      
      card.innerHTML = `
        <div class="product-gallery">
          ${imagesHtml}
          ${dotsHtml}
          ${item.images && item.images.length > 1 ? `
            <div class="gallery-nav">
              <button class="prev-btn">‹</button>
              <button class="next-btn">›</button>
            </div>
          ` : ''}
        </div>
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <button class="addCart">Agregar</button>
      `;
      
      // Inicializar galería si tiene múltiples imágenes
      const gallery = card.querySelector('.product-gallery');
      if (gallery) {
        initializeProductGallery(gallery);
      }
      
      // Event listener para agregar al carrito
      card.querySelector(".addCart").addEventListener("click", (e) => {
        // Usar la primera imagen para el carrito
        const cartItem = {
          ...item,
          image: item.images ? item.images[0] : item.image
        };
        addToCart(cartItem, e.target);
      });
      
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

function updateQuantity(index, change) {
  const newQty = cart[index].qty + change;
  
  if (newQty <= 0) {
    // Si la cantidad llega a 0, eliminar del carrito
    removeFromCart(index);
  } else {
    cart[index].qty = newQty;
    renderCart();
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
    cartEmpty.classList.add("show");
    cartActions.style.display = "none";
    cartCount.textContent = "0";
    cartItems.style.display = "none"; // Ocultar contenedor de items
    return;
  } else {
    cartEmpty.classList.remove("show");
    cartActions.style.display = "block";
    cartItems.style.display = "block"; // Mostrar contenedor de items
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price} c/u</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button class="qty-btn minus-btn" data-index="${index}" ${item.qty <= 1 ? 'disabled' : ''}>−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn plus-btn" data-index="${index}">+</button>
        </div>
        <button class="remove-item-btn" data-index="${index}" title="Eliminar producto">×</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  // Event listeners para botones de cantidad
  cartItems.querySelectorAll(".minus-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.dataset.index);
      updateQuantity(idx, -1);
    });
  });

  cartItems.querySelectorAll(".plus-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.dataset.index);
      updateQuantity(idx, 1);
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
// --- CAMBIO DE TEXTO EN BOTONES AL SCROLLEAR ---
const topbar = document.querySelector(".topbar");
const contactBtn = document.getElementById("contactBtn");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

// Textos originales
const originalContactText = "Contacto";
const originalCartText = "Carrito";

// Función que actualiza los botones según el estado del topbar
function updateButtonsOnScroll() {
  if (topbar.classList.contains("scrolled")) {
    contactBtn.textContent = "📞";
    cartBtn.innerHTML = `🛒 (<span id="cartCount">${cartCount.textContent}</span>)`;
  } else {
    contactBtn.textContent = originalContactText;
    cartBtn.innerHTML = `${originalCartText} (<span id="cartCount">${cartCount.textContent}</span>)`;
  }
}

// Escuchar el scroll para añadir o quitar la clase "scrolled"
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    topbar.classList.add("scrolled");
  } else {
    topbar.classList.remove("scrolled");
  }
  updateButtonsOnScroll();
});

// Asegurar que al cargar la página se muestren correctos
updateButtonsOnScroll();

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});