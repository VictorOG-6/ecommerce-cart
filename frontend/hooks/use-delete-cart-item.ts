import { useMutation, useQueryClient } from '@tanstack/react-query';
import { $http } from '@/lib/http';
import { toast } from 'sonner';
import { CartItem } from '@/types';
import { cartItemsKeys } from '@/lib/react-query/query-keys';

type DeleteContext = {
    previousCartItems?: CartItem[];
};

export const useDeleteCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        Error,
        string,
        DeleteContext
    >({
        mutationFn: async (id) => {
            await $http.delete(`/cart/item/${id}`);
        },
        onMutate: async (cartItemId) => {
            await queryClient.cancelQueries({ queryKey: cartItemsKeys.list() });

            const previousCartItems = queryClient.getQueryData<CartItem[]>(cartItemsKeys.list());

            queryClient.setQueryData<CartItem[]>(cartItemsKeys.list(), old =>
                old?.filter(tx => tx.id !== cartItemId)
            );

            return { previousCartItems };
        },
        onError: (error, _id, context) => {
            if (context?.previousCartItems) {
                queryClient.setQueryData(cartItemsKeys.list(), context.previousCartItems);
            }
        },
        onSuccess: () => {
            toast("Cart Item deleted!");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: cartItemsKeys.list() });
        },
    });
};