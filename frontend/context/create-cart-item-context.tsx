"use client"

import { CartItem } from '@/types';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

type CreateCartItemContextType = {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    currentCartItem: CartItem | null;
    setCurrentCartItem: Dispatch<SetStateAction<CartItem | null>>;
    createCartItemData: CartItem | null; // ✅ Changed to null
    setCreateCartItemData: Dispatch<SetStateAction<CartItem | null>>; // ✅ Changed to null
    showCartItem: boolean;
    setShowCartItem: Dispatch<SetStateAction<boolean>>;
    isEditMode: boolean;
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
};

const CreateCartItemContext = createContext({} as CreateCartItemContextType);

export const useCreateCartitemContext = () => {
    const ctx = useContext(CreateCartItemContext);

    if (!ctx) {
        throw new Error('[useCartItem] must be used within a CreateCartItemProvider');
    }

    return ctx;
};

const CreateCartItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, isOpen] = useState(false);
    const [currentCartItem, setCurrentCartItem] = useState<CartItem | null>(null);
    const [createCartItemData, setCreateCartItemData] = useState<CartItem | null>(null); // ✅ Changed to null
    const [showCartItem, setShowCartItem] = useState<boolean>(false)
    const [isEditMode, setIsEditMode] = useState(false);

    const value = {
        open,
        onOpenChange: isOpen,
        currentCartItem,
        setCurrentCartItem,
        createCartItemData,
        setCreateCartItemData,
        showCartItem,
        setShowCartItem,
        isEditMode,
        setIsEditMode
    };

    useEffect(() => {
        // reset create request data when modal is closed
        if (!showCartItem) { // ✅ Changed from !open to !showCartItem
            setCreateCartItemData(null); // ✅ Changed to null
            setIsEditMode(false);
        }
    }, [showCartItem]); // ✅ Changed dependency from open to showCartItem

    return <CreateCartItemContext.Provider value={value}>{children}</CreateCartItemContext.Provider>;
};

export default CreateCartItemProvider;