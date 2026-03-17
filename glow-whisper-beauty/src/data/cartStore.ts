import type { Product } from "./products";

// Simple in-memory store with localStorage persistence

export interface CartItem {
  product: Product;
  quantity: number;
}

// ── localStorage helpers ──
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("aura_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("aura_cart", JSON.stringify(items));
}

function loadWishlist(): string[] {
  try {
    const raw = localStorage.getItem("aura_wishlist");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]) {
  localStorage.setItem("aura_wishlist", JSON.stringify(ids));
}

let cartItems: CartItem[] = loadCart();
let wishlistIds: string[] = loadWishlist();
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getCart: () => cartItems,
  getWishlist: () => wishlistIds,
  addToCart(product: Product) {
    const existing = cartItems.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
      cartItems = [...cartItems];
    } else {
      cartItems = [...cartItems, { product, quantity: 1 }];
    }
    saveCart(cartItems);
    notify();
  },
  removeFromCart(productId: string) {
    cartItems = cartItems.filter((i) => i.product.id !== productId);
    saveCart(cartItems);
    notify();
  },
  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      cartStore.removeFromCart(productId);
      return;
    }
    cartItems = cartItems.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveCart(cartItems);
    notify();
  },
  clearCart() {
    cartItems = [];
    saveCart(cartItems);
    notify();
  },
  toggleWishlist(productId: string) {
    if (wishlistIds.includes(productId)) {
      wishlistIds = wishlistIds.filter((id) => id !== productId);
    } else {
      wishlistIds = [...wishlistIds, productId];
    }
    saveWishlist(wishlistIds);
    notify();
  },
  getCartTotal() {
    return cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },
  getCartCount() {
    return cartItems.reduce((sum, i) => sum + i.quantity, 0);
  },
};
