import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionGroupsApi } from '../api/permission-groups';

interface UsePermissionGroupsParams {
  search?: string;
  status?: string;
}

export const usePermissionGroups = (params?: UsePermissionGroupsParams) => {
  const queryClient = useQueryClient();

  const permissionGroups = useQuery({
    queryKey: ['permissionGroups', params],
    queryFn: () => permissionGroupsApi.getAll(params),
  });

  const getPermissionGroup = (permissionGroupId: string) => {
    return useQuery({
      queryKey: ['permissionGroup', permissionGroupId],
      queryFn: () => permissionGroupsApi.getById(permissionGroupId),
      enabled: !!permissionGroupId,
    });
  };

  const createPermissionGroup = useMutation({
    mutationFn: permissionGroupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissionGroups'] });
    },
  });

  const updatePermissionGroup = useMutation({
    mutationFn: ({ permissionGroupId, data }: { permissionGroupId: string; data: any }) =>
      permissionGroupsApi.update(permissionGroupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissionGroups'] });
      queryClient.invalidateQueries({ queryKey: ['permissionGroup'] });
    },
  });

  const deletePermissionGroup = useMutation({
    mutationFn: permissionGroupsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissionGroups'] });
    },
  });

  return {
    permissionGroups,
    getPermissionGroup,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
  };
};
