import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { outletsApi } from '../api/outlets';


interface UseOutletsParams {
  warehouseId?: string;
  outletTypeId?: string;
  status?: string;
  search?: string;
}

export const useOutlets = (params?: UseOutletsParams) => {

  const queryClient = useQueryClient();

  const outlets = useQuery({
    queryKey: ['outlets', params],
    queryFn: () => outletsApi.getAll(params),
  });

  const getOutlet = (outletId: string) => {
    return useQuery({
      queryKey: ['outlet', outletId],
      queryFn: () => outletsApi.getById(outletId),
      enabled: !!outletId,
    });
  };

  const createOutlet = useMutation({
    mutationFn: outletsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });

  const updateOutlet = useMutation({
    mutationFn: ({ outletId, data }: { outletId: string; data: any }) =>
      outletsApi.update(outletId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      queryClient.invalidateQueries({ queryKey: ['outlet'] });
    },
  });

  const deleteOutlet = useMutation({
    mutationFn: outletsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });

  return {
    outlets,
    getOutlet,
    createOutlet,
    updateOutlet,
    deleteOutlet,
  };
};
