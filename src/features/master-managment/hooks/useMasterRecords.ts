import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterRecordsApi } from '../api/master-records';

export const useMasterRecords = (masterName: string, recordId?: string) => {
  const queryClient = useQueryClient();

  const records = useQuery({
    queryKey: ['master-records', masterName],
    queryFn: () => masterRecordsApi.getAll(masterName),
    enabled: !!masterName,
  });

  const recordById = useQuery({
    queryKey: ['master-record-by-id', masterName, recordId],
    queryFn: () => masterRecordsApi.getById(masterName, recordId as string),
    enabled: !!masterName && !!recordId,
  });

  const createRecord = useMutation({
    mutationFn: masterRecordsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-records', masterName] });
    }
  });

  const updateRecord = useMutation({
    mutationFn: masterRecordsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-records', masterName] });
    }
  });

  const deleteRecord = useMutation({
    mutationFn: ({ masterName, recordId }: { masterName: string; recordId: string }) =>
      masterRecordsApi.delete(masterName, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-records', masterName] });
    }
  });

  return {
    records,
    recordById,
    createRecord,
    updateRecord,
    deleteRecord,
  };
};

export const useBrands = (brandId?: string) => {
  return useMasterRecords('brand', brandId);
};

export const useCategories = (categoryId?: string) => {
  return useMasterRecords('category', categoryId);
};

export const useSubcategories = (subcategoryId?: string) => {
  return useMasterRecords('subcategory', subcategoryId);
};

export const usePackages = (packageId?: string) => {
  return useMasterRecords('package', packageId);
}; 