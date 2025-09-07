const API = {
    all: 'https://openapi.programming-hero.com/api/plants',
    categories: 'https://openapi.programming-hero.com/api/categories',
    byCategory: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
};

const categoryListEl = document.getElementById('categoryList');
const cardGridEl = document.getElementById('cardGrid');
const spinnerEl = document.getElementById('spinner');
const emptyStateEl = document.getElementById('emptyState');

const cartListEl = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');

const detailModal = document.getElementById('detailModal');
const modalContent = document.getElementById('modalContent');

let activeCategoryId = null;
const cart = [];

// Helpers
const showSpinner = (show) => {
    spinnerEl.classList.toggle('hidden', !show);
    cardGridEl.classList.toggle('hidden', show);
    emptyStateEl.classList.add('hidden');
};

const formatPrice = (p) => {
    const n = Number(p);
    return isNaN(n) ? '0.00' : n.toFixed(2);
};

// Category UI
async function loadCategories() {
    try {
        const res = await fetch(API.categories);
        const data = await res.json();
        const categories = data?.categories || data?.data || [];
        categoryListEl.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.className = 'w-full text-left py-2 px-4 rounded-xl font-semibold category-btn';
        allBtn.textContent = 'All Trees';
        allBtn.addEventListener('click', () => {
            setActiveCategory(null, allBtn);
            loadAllPlants();
        });
        categoryListEl.appendChild(allBtn);

        categories.forEach(cat => {
            const id = cat?.id ?? cat?.category_id ?? cat?.categoryId;
            const name = cat?.category_name ?? cat?.category ?? cat?.name ?? 'Unknown Category';
            if (!id) return;

            const btn = document.createElement('button');
            btn.className = 'w-full text-left py-2 px-4 category-btn rounded-xl';
            btn.textContent = name;
            btn.dataset.id = id;
            btn.addEventListener('click', () => {
                setActiveCategory(id, btn);
                loadPlantsByCategory(id);
            });
            categoryListEl.appendChild(btn);
        });
    } catch (e) {
        console.error('Failed to load categories', e);
        categoryListEl.innerHTML = '<div class="text-error">Failed to load categories.</div>';
    }
}

function setActiveCategory(id, btnEl) {
    activeCategoryId = id;
    [...categoryListEl.querySelectorAll('.category-btn')].forEach(b => {
        b.classList.remove('bg-success', 'text-white', 'font-semibold');
        b.classList.add('text-gray-700');
    });
    btnEl.classList.remove('text-gray-700');
    btnEl.classList.add('bg-success', 'text-white', 'font-semibold');
}

async function loadAllPlants() {
    showSpinner(true);
    try {
        const res = await fetch(API.all);
        const data = await res.json();
        const plants = data?.plants || data?.data || [];
        renderCards(plants);
    } catch (e) {
        console.error('Failed to load plants', e);
        cardGridEl.innerHTML = '<div class="text-error">Failed to load plants.</div>';
        emptyStateEl.classList.remove('hidden');
    } finally {
        showSpinner(false);
    }
}

async function loadPlantsByCategory(id) {
    showSpinner(true);
    try {
        const res = await fetch(API.byCategory(id));
        const data = await res.json();
        const plants = data?.plants || data?.data || data?.data?.plants || [];
        renderCards(plants);
    } catch (e) {
        console.error('Failed to load category plants', e);
        cardGridEl.innerHTML = '<div class="text-error">Failed to load trees.</div>';
        emptyStateEl.classList.remove('hidden');
    } finally {
        showSpinner(false);
    }
}

function renderCards(plants) {
    cardGridEl.innerHTML = '';
    if (!plants || plants.length === 0) {
        emptyStateEl.classList.remove('hidden');
        return;
    }
    emptyStateEl.classList.add('hidden');

    plants.forEach(p => {
        const id = p?.id ?? p?.plant_id ?? Math.random().toString(36).substring(2, 9);
        const name = p?.name ?? p?.plant_name ?? 'Unknown Tree';
        const image = p?.image || p?.img || 'https://via.placeholder.com/400x300?text=No+Image';
        const price = Number(p?.price ?? p?.cost ?? 0);
        const category = p?.category ?? p?.category_name ?? '—';
        const description = p?.short_description ?? p?.description ?? 'Native tree well-suited to urban habitats.';

        const card = document.createElement('div');
        card.className = 'card bg-white shadow-xl hover:shadow-2xl transition';
        card.innerHTML = `
            <figure class="px-4 pt-4 cursor-pointer">
                <img class="rounded-xl h-48 w-full object-cover" src="${image}" alt="${name}" />
            </figure>
            <div class="card-body px-4 py-4">
                <h3 class="card-title text-success cursor-pointer">${name}</h3>
                <p class="truncate-3 text-gray-700 text-sm">${description}</p>
                <div class="flex items-center justify-between text-sm opacity-80">
                    <span class="badge bg-[#dcfce7] text-success">${category}</span>
                    <span class="font-bold text-success text-lg">৳${formatPrice(price)}</span>
                </div>
                <div class="card-actions justify-center mt-2">
                    <button class="btn bg-success text-white w-full rounded-3xl shadow-xl hover:bg-success" data-add="${id}" data-name="${name}" data-price="${price}">Add to Cart</button>
                </div>
            </div>
        `;
        cardGridEl.appendChild(card);

        card.querySelector('.card-title')?.addEventListener('click', () => openDetails(p));
        card.querySelector('figure')?.addEventListener('click', () => openDetails(p));
        card.querySelector('[data-add]')?.addEventListener('click', () => {
            const item = {
                id: p.id,
                name: p.name,
                price: Number(p.price) || 0,
            };
            addToCart(item);

            // New message for "Add to Cart" click
            alert(`${item.name} has been added to your cart!`);
        });
    });
}

function openDetails(plant) {
    modalContent.innerHTML = `<div class="p-8 text-center"><span class="loading loading-spinner loading-lg text-success"></span></div>`;
    detailModal.showModal();

    const mockPlant = {
        id: plant?.id ?? plant?.plant_id ?? Math.random(),
        name: plant?.name ?? plant?.plant_name ?? 'Unknown Tree',
        image: plant?.image || plant?.img || 'https://via.placeholder.com/400x300?text=No+Image',
        description: 'A majestic shade tree with a vast canopy and iconic aerial roots. Revered in many cultures, it offers shelter to countless birds and animals. It is a vital part of many ecosystems and thrives in tropical climates.',
        category: plant?.category ?? plant?.category_name ?? 'Shade Tree',
        price: Number(plant?.price ?? plant?.cost ?? 1200),
    };

    renderModalContent(mockPlant);
}

function renderModalContent(plant) {
    const name = plant?.name;
    const image = plant?.image;
    const description = plant?.description;
    const category = plant?.category;
    const price = plant?.price;

    modalContent.innerHTML = `
        <div class="relative">
            <h3 class="text-3xl font-bold text-success p-6 text-left">${name}</h3>
            <img class="block mx-auto h-48 w-3/4 object-cover rounded-xl mb-6" src="${image}" alt="${name}" />
            <div class="p-6 pt-0"> <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold text-lg mb-1">Category:</h4>
                        <span class="badge badge-lg badge-success text-white">${category}</span>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg mb-1">Price:</h4>
                        <span class="font-bold text-success text-xl">৳${formatPrice(price)}</span>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg mb-1">Description:</h4>
                        <p class="text-gray-700">${description}</p>
                    </div>
                </div>
                <div class="modal-action mt-6">
                    <form method="dialog">
                        <button class="btn btn-ghost btn-block">Close</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function addToCart(item) {
    const existing = cart.find(ci => String(ci.id) === String(item.id));
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            qty: 1
        });
    }
    renderCart();
}

function removeItem(id) {
    const itemIndex = cart.findIndex(item => String(item.id) === String(id));
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        renderCart();
    }
}

function clearCart() {
    cart.length = 0;
    renderCart();
}

function renderCart() {
    cartListEl.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-base-100 rounded-xl p-2 shadow-sm';
        li.innerHTML = `
            <div class="flex-1 mr-2">
                <p class="font-medium leading-tight">${item.name}</p>
                <p class="text-sm opacity-70">
                    ৳${formatPrice(item.price)} x ${item.qty}
                </p>
            </div>
            <div class="flex items-center gap-2">
                <button class="btn btn-xs btn-error remove-btn" data-item-id="${item.id}" aria-label="Remove item">✕</button>
            </div>
        `;
        cartListEl.appendChild(li);
    });
    cartTotalEl.textContent = formatPrice(total);

    cartListEl.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.dataset.itemId;
            removeItem(itemId);
        });
    });
}

document.getElementById('donationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, select');
    const nameEl = inputs[0];
    const emailEl = inputs[1];
    const treesEl = inputs[2];
    const trees = Number(treesEl.value || 1);
    if (!nameEl.value.trim() || !emailEl.value.trim() || trees < 1) return alert('Please fill valid details.');
    alert(`Thanks, ${nameEl.value}! You pledged ${trees} tree(s). We'll email ${emailEl.value}.`);
    e.target.reset();
});

clearCartBtn.addEventListener('click', clearCart);

(async function init() {
    await loadCategories();
    const firstBtn = categoryListEl.querySelector('.category-btn');
    if (firstBtn) setActiveCategory(null, firstBtn);
    await loadAllPlants();
})();