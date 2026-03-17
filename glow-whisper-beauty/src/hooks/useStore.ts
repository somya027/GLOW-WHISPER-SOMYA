import { useSyncExternalStore } from "react";
import { cartStore } from "@/data/cartStore";

export function useCart() {
  const cart = useSyncExternalStore(
    cartStore.subscribe,
    () => cartStore.getCart()
  );
  const count = useSyncExternalStore(
    cartStore.subscribe,
    () => cartStore.getCartCount()
  );
  const total = useSyncExternalStore(
    cartStore.subscribe,
    () => cartStore.getCartTotal()
  );
  return { cart, count, total, ...cartStore };
}

export function useWishlist() {
  const wishlist = useSyncExternalStore(
    cartStore.subscribe,
    () => cartStore.getWishlist()
  );
  return { wishlist, toggleWishlist: cartStore.toggleWishlist };
}
