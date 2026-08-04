"use client"

export interface CartDevoteeDetails {
  name: string
  nakshatra: string
  rashi: string
  gothra: string
  notes: string
}

export interface CartItem {
  sevaId: string
  slug: string
  name: string
  price: number
  quantity: number
  devoteeDetails?: CartDevoteeDetails
}

const CART_KEY = "seva_cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_KEY)
}

export function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }): CartItem[] {
  const cart = getCart()
  const existingIndex = cart.findIndex((c) => c.sevaId === item.sevaId)
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity ?? 1
  } else {
    cart.push({ ...item, quantity: item.quantity ?? 1 })
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(sevaId: string): CartItem[] {
  const cart = getCart().filter((c) => c.sevaId !== sevaId)
  saveCart(cart)
  return cart
}

export function updateCartQuantity(sevaId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const idx = cart.findIndex((c) => c.sevaId === sevaId)
  if (idx >= 0) {
    if (quantity <= 0) {
      cart.splice(idx, 1)
    } else {
      cart[idx].quantity = quantity
    }
    saveCart(cart)
  }
  return cart
}

export function updateCartDevotee(sevaId: string, devoteeDetails: CartDevoteeDetails): CartItem[] {
  const cart = getCart()
  const idx = cart.findIndex((c) => c.sevaId === sevaId)
  if (idx >= 0) {
    cart[idx].devoteeDetails = devoteeDetails
    saveCart(cart)
  }
  return cart
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}
