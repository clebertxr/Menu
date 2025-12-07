const products = [
    {
        "id": 3,
        "name": "Floresta Negra Supremo",
        "description": "Camadas ricas de bolo de chocolate escuro, chantilly fresco e cerejas marrasquino, finalizado com raspas de chocolate.",
        "price": 28.90,
        "category": "Pedaços",
        "image": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 2,
        "name": "Red Velvet Clássico",
        "description": "Aveludado e suave, com o tradicional tom vermelho e cobertura cremosa de cream cheese e baunilha.",
        "price": 45.00,
        "category": "Pedaços",
        "image": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 1,
        "name": "Morango com Chantilly",
        "description": "Massa leve de pão de ló recheada com morangos frescos selecionados e um chantilly caseiro inesquecível.",
        "price": 18.50,
        "category": "Bolos inteiros",
        "image": "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 6,
        "name": "Limão Siciliano",
        "description": "Refrescante e equilibrado. Massa amanteigada com raspas de limão e um merengue maçaricado perfeito.",
        "price": 26.50,
        "category": "Pequenos",
        "image": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 7,
        "name": "Bolos inteiros",
        "description": "Fatia generosa de bolo de chocolate belga com cobertura cremosa.",
        "price": 12.00,
        "category": "Sobremesas",
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    }
];

let cart = [];
let currentDetailId = null;
let detailQuantity = 1;
let activeCategory = 'Todos';

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    lucide.createIcons();
});

// --- Filtro ---
function renderCategories() {
    const categories = ['Todos', ...new Set(products.map(p => p.category))];
    const container = document.getElementById('category-filters');

    container.innerHTML = categories.map(cat => `
                <button 
                    onclick="filterByCategory('${cat}')"
                    class="category-btn px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 
                    ${activeCategory === cat ? 'active' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
                >
                    ${cat}
                </button>
            `).join('');
}

function filterByCategory(category) {
    activeCategory = category;
    renderCategories();
    renderProducts();
}

// --- Produtos ---
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filteredProducts = activeCategory === 'Todos'
        ? products
        : products.filter(p => p.category === activeCategory);

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
                    <div class="col-span-full text-center py-10">
                        <p class="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
                    </div>
                `;
    } else {
        grid.innerHTML = filteredProducts.map(product => `
                    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group animate-in fade-in">
                        <div class="relative h-48 overflow-hidden cursor-pointer" onclick="openProductDetails(${product.id})">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                                ${product.category}
                            </div>
                        </div>
                        
                        <div class="p-5 flex-1 flex flex-col">
                            <div class="flex justify-between items-start mb-2 cursor-pointer" onclick="openProductDetails(${product.id})">
                                <h3 class="text-lg font-bold text-gray-900 leading-tight hover:text-red-600 transition-colors">${product.name}</h3>
                                <span class="text-lg font-bold text-red-600 whitespace-nowrap ml-2">R$ ${product.price.toFixed(2)}</span>
                            </div>
                            
                            <p class="text-gray-500 text-sm mb-4 line-clamp-2 flex-1 cursor-pointer" onclick="openProductDetails(${product.id})">${product.description}</p>

                            <button onclick="openProductDetails(${product.id})" class="w-full bg-red-50 text-red-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                                <i data-lucide="plus" class="h-5 w-5"></i>
                                <span>Adicionar</span>
                            </button>
                        </div>
                    </div>
                `).join('');
    }
    lucide.createIcons();
}

// --- Detalhes ---
function openProductDetails(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentDetailId = id;
    detailQuantity = 1;

    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-price').innerText = `R$ ${product.price.toFixed(2)}`;
    document.getElementById('detail-description').innerText = product.description;
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-quantity').innerText = "1";
    document.getElementById('detail-observation').value = "";

    const btnAdd = document.getElementById('btn-add-detail');
    btnAdd.onclick = () => {
        const obs = document.getElementById('detail-observation').value.trim();
        addToCart(currentDetailId, detailQuantity, obs);
        closeProductDetails();
    };

    document.getElementById('product-detail-modal').classList.remove('hidden');
}

function closeProductDetails() {
    document.getElementById('product-detail-modal').classList.add('hidden');
}

function adjustDetailQuantity(delta) {
    const newQty = detailQuantity + delta;
    if (newQty >= 1) {
        detailQuantity = newQty;
        document.getElementById('detail-quantity').innerText = detailQuantity;
    }
}

// --- Carrinho ---
function addToCart(productId, quantity, observation) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.productId === productId && item.observation === observation);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            cartId: Date.now().toString(),
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity,
            observation: observation
        });
    }

    updateCartUI();
    showToast(`Adicionado ao pedido: ${quantity} ${product.name}`);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
}

function updateCartQuantity(cartId, delta) {
    const item = cart.find(item => item.cartId === cartId);
    if (item) {
        const newQty = item.quantity + delta;
        if (newQty > 0) item.quantity = newQty;
    }
    updateCartUI();
}

function toggleCart(show) {
    const modal = document.getElementById('cart-modal');
    if (show) {
        modal.classList.remove('hidden');
        updateCartUI();
    } else {
        modal.classList.add('hidden');
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');

    if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    const footer = document.getElementById('cart-footer');
    if (cart.length > 0) {
        footer.classList.remove('hidden');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
    } else {
        footer.classList.add('hidden');
    }

    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cart-content');

    if (cart.length === 0) {
        container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div class="bg-gray-100 p-6 rounded-full">
                            <i data-lucide="shopping-cart" class="h-12 w-12 text-gray-400"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">Seu pedido está vazio</h3>
                            <p class="text-gray-500 mt-1">Adicione alguns itens deliciosos!</p>
                        </div>
                        <button onclick="toggleCart(false)" class="text-red-600 font-semibold hover:text-red-700">
                            Voltar ao Menu
                        </button>
                    </div>
                `;
    } else {
        let html = '<ul class="space-y-4 mb-6">';
        cart.forEach(item => {
            const obsHtml = item.observation
                ? `<div class="mt-1 text-xs text-red-600 bg-red-50 p-1 rounded border border-red-100 italic">
                             <i data-lucide="message-square" class="inline w-3 h-3 mr-1"></i>Obs: ${item.observation}
                           </div>`
                : '';

            html += `
                        <li class="flex py-2 fade-in border-b border-gray-100 pb-4 last:border-0">
                            <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-center">
                            </div>
                            <div class="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div class="flex justify-between text-base font-medium text-gray-900">
                                        <h3>${item.name}</h3>
                                        <p class="ml-4">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p class="mt-1 text-sm text-gray-500">${item.category}</p>
                                    ${obsHtml}
                                </div>
                                <div class="flex flex-1 items-end justify-between text-sm mt-2">
                                    <div class="flex items-center border border-gray-300 rounded-lg">
                                        <button onclick="updateCartQuantity('${item.cartId}', -1)" class="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"><i data-lucide="minus" class="h-4 w-4 text-gray-600"></i></button>
                                        <span class="px-3 font-medium text-gray-900">${item.quantity}</span>
                                        <button onclick="updateCartQuantity('${item.cartId}', 1)" class="p-1 hover:bg-gray-100 rounded-r-lg transition-colors"><i data-lucide="plus" class="h-4 w-4 text-gray-600"></i></button>
                                    </div>
                                    <button onclick="removeFromCart('${item.cartId}')" class="font-medium text-red-500 hover:text-red-700 flex items-center space-x-1 transition-colors">
                                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        <span>Remover</span>
                                    </button>
                                </div>
                            </div>
                        </li>
                    `;
        });
        html += '</ul>';
        container.innerHTML = html;
    }
    lucide.createIcons();
}

function checkout() {
    const phoneNumber = "5511964064041";
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = "*NOVA ENCOMENDA*\n\n*Itens do Pedido:*\n";

    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        if (item.observation)
            message += `   _Obs: ${item.observation}_\n`;
    });

    message += `\n*Total: R$ ${total.toFixed(2)}*`;
    message += "\n\n----------------------------\nQuero confirmar o pedido!";

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}