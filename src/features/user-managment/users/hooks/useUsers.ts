import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, User, CreateUserData, UpdateUserData } from '../api/users';

interface UseUsersParams {
  search?: string;
}

export const useUsers = (params?: UseUsersParams) => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params),
  });

  return {
    users,
    createUser: useMutation({
      mutationFn: usersApi.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }),
    updateUser: useMutation({
      mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
        usersApi.update(userId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
    }),
    deleteUser: useMutation({
      mutationFn: usersApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }),
  };
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
  });
};
