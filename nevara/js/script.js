/* NÉVARA — site scripts */
(function () {
    'use strict';

    var CFG = window.NEVARA_CONFIG || {};
    var PRODUCTS = window.NEVARA_PRODUCTS || [];
    var CATEGORIES = window.NEVARA_CATEGORIES || [];
    var COLLECTIONS = window.NEVARA_COLLECTIONS || {};
    var CART_KEY = 'nevara_cart_v1';
    var WISH_KEY = 'nevara_wishlist_v1';

    /* ---------- helpers ---------- */
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function money(n) {
        return (CFG.currency || '₦') + Number(n).toLocaleString('en-NG');
    }

    function readStore(key) {
        try {
            var raw = window.localStorage.getItem(key);
            var parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }

    function writeStore(key, value) {
        try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    }

    function findProduct(id) {
        for (var i = 0; i < PRODUCTS.length; i++) { if (PRODUCTS[i].id === id) return PRODUCTS[i]; }
        return null;
    }

    function productUrl(p) { return 'product.html?id=' + encodeURIComponent(p.id); }

    /* ---------- cart + wishlist state ---------- */
    function getCart() {
        // keep only valid lines for products that still exist
        return readStore(CART_KEY).filter(function (l) {
            return l && findProduct(l.id) && l.size && Number(l.qty) > 0;
        }).map(function (l) { return { id: l.id, size: String(l.size), qty: Math.min(10, Math.floor(Number(l.qty))) }; });
    }
    function setCart(c) { writeStore(CART_KEY, c); updateBadges(); }
    function getWish() { return readStore(WISH_KEY).filter(function (id) { return !!findProduct(id); }); }
    function setWish(w) { writeStore(WISH_KEY, w); updateBadges(); }

    function addToCart(id, size, qty) {
        var cart = getCart();
        var line = cart.filter(function (l) { return l.id === id && l.size === size; })[0];
        if (line) { line.qty = Math.min(10, line.qty + qty); } else { cart.push({ id: id, size: size, qty: qty }); }
        setCart(cart);
    }

    function cartSubtotal(cart) {
        return cart.reduce(function (sum, l) { return sum + findProduct(l.id).price * l.qty; }, 0);
    }

    function updateBadges() {
        var count = getCart().reduce(function (n, l) { return n + l.qty; }, 0);
        $$('.cart-count').forEach(function (el) { el.textContent = count; el.hidden = count === 0; });
        var wc = getWish().length;
        $$('.wish-count').forEach(function (el) { el.textContent = wc; el.hidden = wc === 0; });
    }

    /* ---------- toast ---------- */
    var toastTimer;
    function toast(message) {
        var el = $('#toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'toast';
            el.className = 'toast';
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
    }

    /* ---------- header: mobile menu ---------- */
    function initMenu() {
        var toggle = $('.menu-toggle');
        var nav = $('.nav');
        if (!toggle || !nav) return;

        function setOpen(open) {
            nav.classList.toggle('open', open);
            document.body.classList.toggle('menu-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        }

        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'site-nav');
        toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
        $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
        window.addEventListener('resize', function () { if (window.innerWidth > 800) setOpen(false); });
    }

    /* ---------- wishlist buttons (event delegation, works for rendered cards) ---------- */
    function syncWishButtons() {
        var wish = getWish();
        $$('.wishlist-btn[data-id]').forEach(function (btn) {
            var on = wish.indexOf(btn.dataset.id) !== -1;
            var icon = $('i', btn);
            btn.classList.toggle('active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            btn.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
            if (icon) { icon.className = (on ? 'fa-solid' : 'fa-regular') + ' fa-heart'; }
        });
    }

    function toggleWish(id) {
        var wish = getWish();
        var idx = wish.indexOf(id);
        if (idx === -1) { wish.push(id); toast('Saved to your wishlist'); } else { wish.splice(idx, 1); toast('Removed from your wishlist'); }
        setWish(wish);
        syncWishButtons();
        if (document.body.dataset.page === 'wishlist') renderWishlist();
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.wishlist-btn[data-id]');
        if (btn) { e.preventDefault(); e.stopPropagation(); toggleWish(btn.dataset.id); return; }

        // clicking anywhere on a product card opens it
        var card = e.target.closest('.product-card');
        if (card && !e.target.closest('a, button')) {
            var link = $('.product-info h3 a', card);
            if (link) window.location.href = link.href;
        }
    });

    /* ---------- product card markup ---------- */
    function cardHTML(p) {
        var url = productUrl(p);
        return '<article class="product-card">' +
            '<div class="product-image">' +
            (p.tag ? '<span class="product-tag">' + esc(p.tag) + '</span>' : '') +
            '<button class="wishlist-btn" data-id="' + esc(p.id) + '" aria-label="Add to wishlist" aria-pressed="false"><i class="fa-regular fa-heart"></i></button>' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" width="600" height="800">' +
            '<a href="' + url + '" class="quick-view" tabindex="-1" aria-hidden="true">QUICK VIEW</a>' +
            '</div>' +
            '<div class="product-info">' +
            '<p class="product-category">' + esc(p.label) + '</p>' +
            '<h3><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
            '<span class="price">' + money(p.price) + '</span>' +
            '</div></article>';
    }

    /* ---------- shop page ---------- */
    function renderShop() {
        var grid = $('#shop-grid');
        if (!grid) return;

        var params = new URLSearchParams(window.location.search);
        var category = params.get('category') || 'all';
        var collection = params.get('collection') || '';
        var query = (params.get('q') || '').trim();
        var sort = params.get('sort') || 'featured';

        if (!CATEGORIES.some(function (c) { return c.id === category; })) category = 'all';
        if (!COLLECTIONS[collection]) collection = '';

        var searchInput = $('#shop-search');
        var sortSelect = $('#shop-sort');
        if (searchInput) searchInput.value = query;
        if (sortSelect) sortSelect.value = sort;

        var chips = $('#shop-filters');
        chips.innerHTML = CATEGORIES.map(function (c) {
            var active = c.id === category && !collection;
            return '<button type="button" class="chip' + (active ? ' active' : '') + '" data-category="' + esc(c.id) + '" aria-pressed="' + active + '">' + esc(c.label) + '</button>';
        }).join('');

        var list = PRODUCTS.filter(function (p) {
            if (collection) return p.collections.indexOf(collection) !== -1;
            if (category !== 'all' && p.categories.indexOf(category) === -1) return false;
            return true;
        });
        if (query) {
            var q = query.toLowerCase();
            list = list.filter(function (p) {
                return (p.name + ' ' + p.label + ' ' + p.categories.join(' ')).toLowerCase().indexOf(q) !== -1;
            });
        }
        if (sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
        else if (sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
        else if (sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });

        var title = $('#shop-title');
        if (title) title.textContent = collection ? COLLECTIONS[collection] : (category === 'all' ? 'Shop All' : CATEGORIES.filter(function (c) { return c.id === category; })[0].label);

        var count = $('#shop-count');
        if (count) count.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');

        if (!list.length) {
            grid.innerHTML = '<div class="empty-state"><h2>Nothing found</h2><p>Try a different search or browse everything.</p><a href="shop.html" class="btn btn-dark">VIEW ALL PIECES <i class="fa-solid fa-arrow-right"></i></a></div>';
        } else {
            grid.innerHTML = list.map(cardHTML).join('');
        }
        syncWishButtons();
    }

    function initShop() {
        if (!$('#shop-grid')) return;

        function go(changes) {
            var params = new URLSearchParams(window.location.search);
            Object.keys(changes).forEach(function (k) {
                if (changes[k]) params.set(k, changes[k]); else params.delete(k);
            });
            var qs = params.toString();
            window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
            renderShop();
        }

        $('#shop-filters').addEventListener('click', function (e) {
            var chip = e.target.closest('.chip');
            if (!chip) return;
            go({ category: chip.dataset.category === 'all' ? '' : chip.dataset.category, collection: '' });
        });
        $('#shop-sort').addEventListener('change', function (e) { go({ sort: e.target.value === 'featured' ? '' : e.target.value }); });
        $('#shop-search-form').addEventListener('submit', function (e) { e.preventDefault(); go({ q: $('#shop-search').value.trim() }); });
        $('#shop-search').addEventListener('input', function (e) { if (!e.target.value) go({ q: '' }); });
        renderShop();
    }

    /* ---------- product page ---------- */
    function initProduct() {
        var root = $('#product-detail');
        if (!root) return;

        var id = new URLSearchParams(window.location.search).get('id');
        var p = id ? findProduct(id) : null;

        if (!p) {
            root.innerHTML = '<div class="empty-state"><h1>Piece not found</h1><p>This piece may no longer be available.</p><a href="shop.html" class="btn btn-dark">BACK TO SHOP <i class="fa-solid fa-arrow-right"></i></a></div>';
            document.title = 'Piece not found | NÉVARA';
            return;
        }

        document.title = p.name + ' | NÉVARA';
        var metaDesc = $('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', p.description);
        var ogTitle = $('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', p.name + ' | NÉVARA');

        var sizeHTML = p.sizes.map(function (s, i) {
            return '<label class="size-option"><input type="radio" name="size" value="' + esc(s) + '"' + (p.sizes.length === 1 ? ' checked' : '') + (i === 0 ? ' required' : '') + '><span>' + esc(s) + '</span></label>';
        }).join('');

        root.innerHTML =
            '<div class="product-gallery"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" width="600" height="800">' +
            (p.tag ? '<span class="product-tag">' + esc(p.tag) + '</span>' : '') + '</div>' +
            '<div class="product-panel">' +
            '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><span aria-current="page">' + esc(p.name) + '</span></nav>' +
            '<span class="eyebrow">' + esc(p.label) + '</span>' +
            '<h1>' + esc(p.name) + '</h1>' +
            '<p class="price price-lg">' + money(p.price) + '</p>' +
            '<p class="product-desc">' + esc(p.description) + '</p>' +
            '<form id="add-form" novalidate>' +
            '<fieldset class="size-field"><legend>Size</legend><div class="size-options">' + sizeHTML + '</div><p class="field-error" id="size-error" hidden>Please choose a size.</p></fieldset>' +
            '<div class="buy-row">' +
            '<div class="qty" role="group" aria-label="Quantity"><button type="button" data-qty="-1" aria-label="Decrease quantity">&minus;</button><output id="qty-value">1</output><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div>' +
            '<button type="submit" class="btn btn-dark btn-wide">ADD TO BAG <i class="fa-solid fa-arrow-right"></i></button>' +
            '<button type="button" class="wishlist-btn inline" data-id="' + esc(p.id) + '" aria-label="Add to wishlist" aria-pressed="false"><i class="fa-regular fa-heart"></i></button>' +
            '</div></form>' +
            '<ul class="detail-list">' + p.details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
            '<p class="delivery-note"><i class="fa-solid fa-truck-fast"></i> Free delivery on orders above ' + money(CFG.freeDeliveryThreshold || 100000) + '</p>' +
            '</div>';

        var qty = 1;
        var qtyOut = $('#qty-value');
        root.addEventListener('click', function (e) {
            var b = e.target.closest('[data-qty]');
            if (!b) return;
            qty = Math.max(1, Math.min(10, qty + Number(b.dataset.qty)));
            qtyOut.textContent = qty;
        });

        $('#add-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var chosen = $('input[name="size"]:checked', root);
            var err = $('#size-error');
            if (!chosen) { err.hidden = false; return; }
            err.hidden = true;
            addToCart(p.id, chosen.value, qty);
            toast(p.name + ' added to your bag');
        });

        $$('input[name="size"]', root).forEach(function (r) {
            r.addEventListener('change', function () { $('#size-error').hidden = true; });
        });

        // related
        var rel = $('#related-grid');
        if (rel) {
            var related = PRODUCTS.filter(function (o) {
                return o.id !== p.id && o.categories.some(function (c) { return p.categories.indexOf(c) !== -1; });
            }).slice(0, 4);
            if (related.length) { rel.innerHTML = related.map(cardHTML).join(''); } else { rel.closest('section').hidden = true; }
        }
        syncWishButtons();
    }

    /* ---------- wishlist page ---------- */
    function renderWishlist() {
        var grid = $('#wishlist-grid');
        if (!grid) return;
        var items = getWish().map(findProduct);
        if (!items.length) {
            grid.innerHTML = '<div class="empty-state"><h2>Your wishlist is empty</h2><p>Tap the heart on any piece to save it here.</p><a href="shop.html" class="btn btn-dark">EXPLORE THE SHOP <i class="fa-solid fa-arrow-right"></i></a></div>';
            grid.classList.add('is-empty');
        } else {
            grid.classList.remove('is-empty');
            grid.innerHTML = items.map(cardHTML).join('');
        }
        syncWishButtons();
    }

    /* ---------- bag page ---------- */
    function renderCart() {
        var list = $('#cart-items');
        if (!list) return;
        var cart = getCart();
        var layout = $('#cart-layout');
        var empty = $('#cart-empty');

        if (!cart.length) {
            layout.hidden = true;
            empty.hidden = false;
            return;
        }
        layout.hidden = false;
        empty.hidden = true;

        list.innerHTML = cart.map(function (l, i) {
            var p = findProduct(l.id);
            return '<li class="cart-line" data-index="' + i + '">' +
                '<a href="' + productUrl(p) + '" class="cart-thumb"><img src="' + esc(p.image) + '" alt="" width="90" height="120"></a>' +
                '<div class="cart-info">' +
                '<h3><a href="' + productUrl(p) + '">' + esc(p.name) + '</a></h3>' +
                '<p class="muted">Size: ' + esc(l.size) + '</p>' +
                '<p class="price">' + money(p.price) + '</p>' +
                '<div class="cart-controls">' +
                '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '"><button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button><output>' + l.qty + '</output><button type="button" data-act="inc" aria-label="Increase quantity">+</button></div>' +
                '<button type="button" class="link-btn" data-act="remove">Remove</button>' +
                '</div></div>' +
                '<p class="cart-line-total">' + money(p.price * l.qty) + '</p></li>';
        }).join('');

        var sub = cartSubtotal(cart);
        var free = sub >= (CFG.freeDeliveryThreshold || 100000);
        $('#sum-sub').textContent = money(sub);
        $('#sum-ship').textContent = free ? 'Free' : 'Confirmed with your order';
        $('#sum-total').textContent = money(sub);
        var gap = (CFG.freeDeliveryThreshold || 100000) - sub;
        $('#free-ship-note').textContent = free ? 'You qualify for free delivery.' : 'Add ' + money(gap) + ' more for free delivery.';
    }

    function initCart() {
        var list = $('#cart-items');
        if (!list) return;

        list.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-act]');
            if (!btn) return;
            var row = btn.closest('.cart-line');
            var idx = Number(row.dataset.index);
            var cart = getCart();
            if (!cart[idx]) return;
            if (btn.dataset.act === 'inc') cart[idx].qty = Math.min(10, cart[idx].qty + 1);
            if (btn.dataset.act === 'dec') cart[idx].qty = Math.max(1, cart[idx].qty - 1);
            if (btn.dataset.act === 'remove') cart.splice(idx, 1);
            setCart(cart);
            renderCart();
        });

        var form = $('#checkout-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var status = $('#checkout-status');
            var cart = getCart();
            if (!cart.length) return;
            if (!form.checkValidity()) { form.reportValidity(); return; }

            var data = new FormData(form);
            var lines = cart.map(function (l) {
                var p = findProduct(l.id);
                return '• ' + p.name + ' — Size ' + l.size + ' × ' + l.qty + ' — ' + money(p.price * l.qty);
            });
            var message = 'New NÉVARA order\n\n' + lines.join('\n') +
                '\n\nSubtotal: ' + money(cartSubtotal(cart)) +
                '\n\nName: ' + data.get('name') +
                '\nPhone: ' + data.get('phone') +
                '\nEmail: ' + data.get('email') +
                '\nDelivery address: ' + data.get('address') +
                (data.get('notes') ? '\nNotes: ' + data.get('notes') : '');

            status.className = 'form-status';

            if (CFG.whatsappNumber) {
                var url = 'https://wa.me/' + String(CFG.whatsappNumber).replace(/\D/g, '') + '?text=' + encodeURIComponent(message);
                window.open(url, '_blank', 'noopener');
                status.textContent = 'WhatsApp opened with your order. Send the message to confirm. Your bag stays saved until you clear it.';
                status.classList.add('ok');
            } else if (CFG.formEndpoint) {
                status.textContent = 'Sending your order…';
                postForm({ _subject: 'New NÉVARA order', name: data.get('name'), email: data.get('email'), message: message }).then(function () {
                    setCart([]);
                    renderCart();
                    window.location.href = 'index.html?order=received';
                }).catch(function () {
                    status.textContent = 'Sorry, we could not send your order. Please try again.';
                    status.classList.add('error');
                });
            } else {
                status.textContent = 'Online ordering is not connected yet. Please contact us to place this order.';
                status.classList.add('error');
            }
        });
        renderCart();
    }

    /* ---------- forms (newsletter + contact) ---------- */
    function postForm(payload) {
        if (!CFG.formEndpoint) return Promise.reject(new Error('not-configured'));
        return fetch(CFG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (res) { if (!res.ok) throw new Error('failed'); return res; });
    }

    function initNewsletter() {
        var form = $('.newsletter-form');
        if (!form) return;
        var status = $('.newsletter-status');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = $('input', form);
            var button = $('button', form);
            var email = input.value.trim();
            if (!email) return;
            status.className = 'newsletter-status';

            if (!CFG.formEndpoint) {
                status.textContent = 'Sign-up is not connected yet. Please check back soon.';
                status.classList.add('error');
                return;
            }
            button.disabled = true;
            postForm({ _subject: 'NÉVARA newsletter sign-up', email: email, message: 'Newsletter sign-up' }).then(function () {
                button.innerHTML = 'SUBSCRIBED <i class="fa-solid fa-check"></i>';
                input.value = '';
                input.disabled = true;
                status.textContent = 'Thank you. You are on the list.';
            }).catch(function () {
                button.disabled = false;
                status.textContent = 'Something went wrong. Please try again.';
                status.classList.add('error');
            });
        });
    }

    function initContact() {
        var form = $('#contact-form');
        if (!form) return;
        var status = $('#contact-status');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            var data = new FormData(form);
            if (data.get('company')) return; // honeypot
            status.className = 'form-status';

            if (!CFG.formEndpoint) {
                status.textContent = 'The contact form is not connected yet. Please reach us by email or WhatsApp.';
                status.classList.add('error');
                return;
            }
            var btn = $('button[type="submit"]', form);
            btn.disabled = true;
            postForm({
                _subject: 'NÉVARA enquiry: ' + data.get('subject'),
                name: data.get('name'),
                email: data.get('email'),
                message: data.get('message')
            }).then(function () {
                form.reset();
                btn.disabled = false;
                status.textContent = 'Thank you. We will get back to you soon.';
                status.classList.add('ok');
            }).catch(function () {
                btn.disabled = false;
                status.textContent = 'Something went wrong. Please try again.';
                status.classList.add('error');
            });
        });
    }

    /* ---------- config-driven bits (contact details, socials, order banner) ---------- */
    function initConfig() {
        $$('[data-social]').forEach(function (a) {
            var url = CFG.social && CFG.social[a.dataset.social];
            if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.hidden = false; }
        });
        $$('[data-contact]').forEach(function (el) {
            var key = el.dataset.contact;
            var val = CFG[key];
            if (!val) { var row = el.closest('.contact-item'); if (row) row.hidden = true; return; }
            el.textContent = val;
            if (key === 'email') el.href = 'mailto:' + val;
            if (key === 'phone') el.href = 'tel:' + String(val).replace(/[^\d+]/g, '');
        });
        var wa = $('#whatsapp-link');
        if (wa) {
            if (CFG.whatsappNumber) { wa.href = 'https://wa.me/' + String(CFG.whatsappNumber).replace(/\D/g, ''); wa.hidden = false; }
        }
        if (new URLSearchParams(window.location.search).get('order') === 'received') {
            toast('Thank you. Your order has been received.');
        }
    }

    /* ---------- boot ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initConfig();
        initShop();
        initProduct();
        initCart();
        renderWishlist();
        initNewsletter();
        initContact();
        syncWishButtons();
        updateBadges();
        // keep tabs in sync
        window.addEventListener('storage', function () { updateBadges(); syncWishButtons(); });
    });
})();
