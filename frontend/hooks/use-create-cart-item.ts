import { $http } from "@/lib/http";
import { cartItemsKeys } from "@/lib/react-query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItemCreate } from "../types";

export const useCreateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cartItem: Partial<CartItemCreate>) => {
            const res = await $http.post('/cart/items', cartItem);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartItemsKeys.lists() });
        },
    });
};