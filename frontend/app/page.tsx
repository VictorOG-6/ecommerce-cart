"use client"

import CartItemCard from "@/components/cart-item-card";
import { useCreateCartitemContext } from "@/context/create-cart-item-context";
import useFetchCartItems from "@/hooks/use-fetch-cart-items";
import { formatToNaira } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { CartItem } from "@/types";
import CartItemModal from "@/components/cart-item-modal";

export default function Home() {
  const { showCartItem, setShowCartItem, setIsEditMode } = useCreateCartitemContext()
  const { data: cartItems = [], isLoading, isError } = useFetchCartItems()

  const { totalPrice, totalQuantity } = useMemo(() => {
    return cartItems.reduce((acc: { totalPrice: number; totalQuantity: number }, item: CartItem) => {
      return {
        totalPrice: acc.totalPrice + (item.price * item.quantity),
        totalQuantity: acc.totalQuantity + item.quantity
      }
    }, { totalPrice: 0, totalQuantity: 0 })
  }, [cartItems])

  return (
    <>
      <section className="lg:max-w-7xl [@media(min-width:768px)_and_(max-width:1024px)]:max-w-[820px] sm:max-w-[620px] max-w-[90%] mx-auto bg-[#f6f7f9] pb-4 pt-20">
        <div className="mb-10 px-4">
          <h1 className="text-center text-[#8F5F55] text-3xl font-bold">Victor's Cart</h1>
          <button
            className="bg-[#8F5F55] rounded-md flex items-center justify-center text-sm font-semibold float-end px-3 py-2 text-white gap-2 cursor-pointer"
            onClick={() => { setIsEditMode(false); setShowCartItem(true) }}
          >
            <Plus size={12} color='white' className='sm:w-4 sm:h-4' /> Add Cart Items
          </button>
        </div>
        <div className="h-90 overflow-y-auto">
          {cartItems.map((cartItem: CartItem) => (
            <CartItemCard cartItem={cartItem} />
          ))}
        </div>
        <div className="w-full flex items-center justify-between py-4 px-20">
          <div className="flex flex-col items-center gap-2">
            <h2>Total Price</h2>
            <p className="text-[#8F5F55]">{formatToNaira(totalPrice)}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2>Total Quantity</h2>
            <p className="text-[#8F5F55]">{totalQuantity}</p>
          </div>
        </div>
      </section>
      {showCartItem && <CartItemModal setShowCartItem={setShowCartItem} />}
    </>
  );
}