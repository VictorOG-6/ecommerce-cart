"use client"

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { $http } from '@/lib/http';
import { toDate } from '@/lib/utils';
import { cartItemsKeys } from '@/lib/react-query/query-keys';

const useFetchCartItems = () => {

    return useQuery({
        queryKey: cartItemsKeys.list(),
        queryFn: async () => {
            const response = await $http.get('/cart/items');
            const data = response.data.map((item: any) => ({
                ...item,
                createdAt: toDate(item.createdAt ?? item.date ?? item.created_at) || new Date(),
            }));

            return data;
        },
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
};

export default useFetchCartItems;