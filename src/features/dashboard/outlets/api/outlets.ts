import axios from "axios";

const OUTLETS_ENDPOINT = process.env.NEXT_PUBLIC_PARTNER_SERVICE_URL + '/outlets';

export const outletsApi = {

  getAll: async (params?: { warehouseId?: string; outletTypeId?: string; status?: string; search?: string }) => {

    const response = await axios.get(OUTLETS_ENDPOINT, { params });
    return response.data;
  },

  getById: async (outletId: string) => {
    const response = await axios.get(`${OUTLETS_ENDPOINT}/${outletId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(OUTLETS_ENDPOINT, data);
    return response.data;
  },

  update: async (outletId: string, data: any) => {
    const response = await axios.patch(`${OUTLETS_ENDPOINT}/${outletId}`, data);
    return response.data;
  },

  delete: async (outletId: string) => {
    const response = await axios.delete(`${OUTLETS_ENDPOINT}/${outletId}`);
    return response.data;
  }
};
