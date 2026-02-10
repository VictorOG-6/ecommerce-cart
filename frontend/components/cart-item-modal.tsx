import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreateCartitemContext } from '@/context/create-cart-item-context';
import { useCreateCartItem } from '@/hooks/use-create-cart-item';
import { useUpdateCartItem } from '@/hooks/use-update-cart-item';
import { CartItem, CartItemCreate } from '@/types';

interface CartItemProps {
    setShowCartItem: Dispatch<SetStateAction<boolean>>;
}

const createCartItemSchema = z.object({
    name: z.string().min(1, "Cart Item name is required"),
    price: z.number().positive("Cart Item price must be greater than zero"),
    quantity: z.number().positive("Cart Item quantity must be greater than zero"),
});

type CreateCartItemFormFields = z.infer<typeof createCartItemSchema>;

const CartItemModal = ({ setShowCartItem }: CartItemProps) => {
    const { isEditMode, createCartItemData, setCurrentCartItem, setCreateCartItemData } = useCreateCartitemContext()
    const [name, setName] = useState<string>("")
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [isValid, setIsValid] = useState<boolean>(false)
    const { mutate: createCartItem, isPending: isCreateCartItemPending } = useCreateCartItem()
    const { mutate: updateCartItem, isPending: isUpdateCartItemPending } = useUpdateCartItem()

    const FORM_STORAGE_KEY = 'cartItemDetailsForm';

    const form = useForm<CreateCartItemFormFields>({
        resolver: zodResolver(createCartItemSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            price: 0,
            quantity: 0,
        },
    });

    const clearFormAndState = () => {
        // Clear form values
        form.reset({
            name: '',
            price: 0,
            quantity: 0,
        });

        setName('');
        setPrice(0);
        setQuantity(0);

        // Clear persisted form data
        clearPersistedForm();
    };

    const clearPersistedForm = () => {
        localStorage.removeItem(FORM_STORAGE_KEY);
    };

    useEffect(() => {
        const stored = localStorage.getItem(FORM_STORAGE_KEY)
        if (!stored) return;

        try {
            const parsed = JSON.parse(stored);
            setName(parsed.name || '');
            setPrice(parsed.price || 0);
            setQuantity(parsed.quantity || 0)
        } catch (error) {
            console.error('Failed to parse stored cart item form data:', error)
        }
    }, [])

    useEffect(() => {
        if (isEditMode && createCartItemData) {
            const editDefaults = {
                name: createCartItemData?.name ?? '',
                price: createCartItemData?.price ?? 0,
                quantity: createCartItemData?.quantity ?? 0,
            }

            form.reset(editDefaults)

            setName(editDefaults.name)
            setPrice(editDefaults.price)
            setQuantity(editDefaults.quantity)
        }
    }, [isEditMode, createCartItemData, form])

    useEffect(() => {
        const subscription = form.watch(value => {
            const storedData = {
                name: name || value.name || '',
                price: price || value.price || 0,
                quantity: quantity || value.quantity || 0,
            }

            try {
                localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(storedData))
            } catch (error) {
                console.error('Failed to store cart item form:', error)
            }
        })

        return () => subscription.unsubscribe()
    }, [form, name, price, quantity])

    const validateFields = useCallback(() => {
        const formValues = form.getValues()
        const isNameFilled = !!formValues.name || !!name
        const isPriceFilled = !!formValues.price || !!price
        const isQuantityFilled = !!formValues.quantity || !!quantity

        setIsValid(isNameFilled && isPriceFilled && isQuantityFilled)
    }, [name, price, quantity])

    useEffect(() => {
        validateFields()
    }, [validateFields])

    const onSubmit = (formData: CreateCartItemFormFields) => {
        console.log('🟢 SUBMIT - isEditMode:', isEditMode);
        console.log('🟢 SUBMIT - createCartItemData:', createCartItemData);
        console.log('🟢 SUBMIT - createCartItemData?.id:', createCartItemData?.id);
        console.log('🟢 CONDITION CHECK:', isEditMode && createCartItemData?.id);
        if (isEditMode && createCartItemData?.id) {
            // ✅ Create the full CartItem object with id
            const updatePayload: CartItem = {
                id: createCartItemData.id,
                name: formData.name,
                price: formData.price,
                quantity: formData.quantity,
            };

            updateCartItem(updatePayload, {
                onSuccess: () => {
                    toast.success('Cart item updated successfully');
                    clearFormAndState();
                    setShowCartItem(false);
                },
                onError: (error) => {
                    console.error('Update failed:', error);
                    toast.error('Failed to update cart item');
                },
            });
        } else {
            // ✅ Create payload without id
            const cartItemPayload: CartItemCreate = {
                name: formData.name,
                price: formData.price,
                quantity: formData.quantity,
            };

            createCartItem(cartItemPayload, {
                onSuccess: () => {
                    toast.success('Cart item created successfully');
                    clearFormAndState();
                    setShowCartItem(false);
                },
                onError: (error) => {
                    console.error('Create failed:', error);
                    toast.error('Failed to create cart item');
                },
            });
        }
    };

    const handleFormError = (errors: any) => {
        console.log('Form validation errors:', errors);
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey && errors[firstErrorKey]?.message) {
            toast.error(errors[firstErrorKey].message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#32475C80]">
                    <div className="w-204 rounded-lg bg-white p-12 shadow-md">
                        <div className="mb-6 flex items-center justify-between">
                            <div className='flex flex-col gap-2'>
                                <h1 className="text-xl font-bold text-[#8F5F55]">{isEditMode ? "Edit Cart Item" : "Create Cart Item"}</h1>
                                <p className='text-sm font-normal'>{isEditMode ? "Input the details of your cart item to edit your current cart item" : "Input the details of your cart item to create a new cart item"}</p>
                            </div>
                            <X size={20} className="cursor-pointer transition-all duration-300 text-[#82808F] hover:text-red-500" onClick={() => { setShowCartItem(false) }} />
                        </div>
                        <div className='space-y-3'>
                            <div>
                                <Label className='mb-2'>Item Name</Label>
                                <Input
                                    type='text'
                                    placeholder='Enter cart item name'
                                    onChange={event => {
                                        const value = event.target.value;
                                        form.setValue('name', value);
                                        setName(value)
                                    }}
                                    name='name'
                                    value={name || form.getValues('name') || ''}
                                    required
                                    autoComplete='off'
                                    className='h-10 w-full rounded-md border border-[#DCDBE0] px-3' />
                            </div>
                            <div>
                                <Label className='mb-2'>Item Price</Label>
                                <Input
                                    type='number'
                                    placeholder='Enter cart item price'
                                    onChange={event => {
                                        const value = Number(event.target.value);
                                        form.setValue('price', value);
                                        setPrice(value)
                                    }}
                                    name='price'
                                    value={price ?? form.getValues('price') ?? ''}
                                    required
                                    autoComplete='off'
                                    className='h-10 w-full rounded-md border border-[#DCDBE0] px-3' />
                            </div>
                            <div>
                                <Label className='mb-2'>Item Quantity</Label>
                                <Input
                                    type='number'
                                    placeholder='Enter cart item quantity'
                                    onChange={event => {
                                        const value = Number(event.target.value);
                                        form.setValue('quantity', value);
                                        setQuantity(value)
                                    }}
                                    name='quantity'
                                    value={quantity ?? form.getValues('quantity') ?? ''}
                                    required
                                    autoComplete='off'
                                    className='h-10 w-full rounded-md border border-[#DCDBE0] px-3' />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Button
                                type="button"
                                className="flex h-9.5 w-22.75 items-center justify-center rounded-md border border-[#6D788D80] bg-white text-[#8592A3] cursor-pointer hover:text-white"
                                onClick={() => setShowCartItem(false)}
                            >
                                Cancel
                            </Button>
                            {
                                isEditMode ? (
                                    <Button
                                        className="flex h-9.5 w-35.75 items-center justify-center rounded-md bg-[#8F5F55] text-white shadow-sm"
                                        style={{ backgroundColor: `${!isUpdateCartItemPending ? "#8F5F55" : "#858993"}`, cursor: `${!isUpdateCartItemPending ? "pointer" : "not-allowed"}` }}
                                        type='submit'
                                        disabled={isUpdateCartItemPending}
                                    >
                                        {isUpdateCartItemPending ? "Updating..." : "Edit Item"}
                                    </Button>
                                ) : (
                                    <Button
                                        className="flex h-9.5 w-35.75 items-center justify-center rounded-md bg-[#8F5F55] text-white shadow-sm"
                                        style={{ backgroundColor: !isCreateCartItemPending && isValid ? "#8F5F55" : "#858993", cursor: !isCreateCartItemPending && isValid ? "pointer" : "not-allowed" }}
                                        type='submit'
                                        disabled={!isValid || isCreateCartItemPending}
                                    >
                                        {isCreateCartItemPending ? "Creating..." : "Create Item"}
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default CartItemModal