import axios from "axios";

const PERMISSION_GROUPS_ENDPOINT = process.env.NEXT_PUBLIC_USER_SERVICE_URL + '/permissiongroup';

export const permissionGroupsApi = {
  getAll: async (params?: { search?: string; status?: string }) => {
    const response = await axios.get(PERMISSION_GROUPS_ENDPOINT, { params });
    return response.data;
  },

  getById: async (permissionGroupId: string) => {
    const response = await axios.get(`${PERMISSION_GROUPS_ENDPOINT}/${permissionGroupId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(PERMISSION_GROUPS_ENDPOINT, data);
    return response.data;
  },

  update: async (permissionGroupId: string, data: any) => {
    const response = await axios.patch(`${PERMISSION_GROUPS_ENDPOINT}/${permissionGroupId}`, data);
    return response.data;
  },

  delete: async (permissionGroupId: string) => {
    const response = await axios.delete(`${PERMISSION_GROUPS_ENDPOINT}/${permissionGroupId}`);
    return response.data;
  }
};
