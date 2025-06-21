import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehousesApi, Warehouse } from '../api/warehouses';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setWarehouses, setLoading, setError } from '@/store/slices/warehouseSlice';

export const useWarehouse = (warehouseId?: string) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { warehouses, isLoading, error } = useAppSelector((state) => state.warehouse);

  const warehousesQuery = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const response = await warehousesApi.getAll();
        dispatch(setWarehouses(response.data.items));
        return response;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    },
    enabled: warehouses.length === 0, // Only fetch if Redux store is empty
  });

  const warehouseById = useQuery({
    queryKey: ['warehouse-by-id', warehouseId],
    queryFn: ({ queryKey }) => warehousesApi.getById(queryKey[1] as string),
    enabled: !!warehouseId,
  });

  const createWarehouse = useMutation({
    mutationFn: warehousesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  const updateWarehouse = useMutation({
    mutationFn: ({
      warehouseId,
      data,
    }: {
      warehouseId: string;
      data: Partial<Warehouse>;
    }) => warehousesApi.update(warehouseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  const deleteWarehouse = useMutation({
    mutationFn: warehousesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  return {
    warehouses: {
      data: { data: { items: warehouses } },
      isLoading: isLoading || warehousesQuery.isLoading,
      error: error || warehousesQuery.error,
    },
    warehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
};
