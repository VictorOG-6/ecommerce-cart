import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { CartItem } from "@/types";
import { cartItemsKeys } from "@/lib/react-query/query-keys";

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cartItem: CartItem) => {
            const { id, ...updateData } = cartItem;
            const res = await $http.put(`/cart/items/${id}`, updateData);
            return res.data;
        },
        onSuccess: (_, updated) => {
            // refresh both single and list caches
            queryClient.invalidateQueries({ queryKey: cartItemsKeys.list() });
            queryClient.invalidateQueries({ queryKey: cartItemsKeys.detail(updated.id!.toString()) });
        },
    });
};