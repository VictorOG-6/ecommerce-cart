export const cartItemsKeys = {
    all: ['cart/items'] as const,
    lists: () => [...cartItemsKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...cartItemsKeys.lists(), filters ?? {}] as const,
    details: () => [...cartItemsKeys.all, 'detail'] as const,
    detail: (id: string) => [...cartItemsKeys.details(), id] as const,
};