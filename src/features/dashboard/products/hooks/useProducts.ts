import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';

interface UseProductsParams {
  warehouseId?: string;
  brandId?: string;
  categoryId?: string;
}

export const useProducts = (params?: UseProductsParams) => {
  const queryClient = useQueryClient();

  const products = useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
  });

  const getProduct = (productId: string) => {
    return useQuery({
      queryKey: ['product', productId],
      queryFn: () => productsApi.getById(productId),
      enabled: !!productId,
    });
  };

  const createProduct = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: any }) =>
      productsApi.update(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const assignWarehousesToProduct = useMutation({
    mutationFn: ({ productId, warehouseIds }: { productId: string; warehouseIds: {warehouseId: string}[] }) =>
      productsApi.assignWarehousesToProduct(productId, warehouseIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    }
  });

  return {
    products,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    assignWarehousesToProduct
  };
};
