import axios from 'axios';

const WAREHOUSE_ENDPOINT = process.env.NEXT_PUBLIC_PARTNER_SERVICE_URL + '/warehouse';

export interface WarehouseAddress {
  streetAddress: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export interface Warehouse {
  id?: string;
  _id?: string;
  warehouseName: string;
  address: WarehouseAddress;
  isDeleted?: boolean;
}

export const warehousesApi = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    filter?: string;
    deleted?: boolean;
  }) => {
    const response = await axios.get(WAREHOUSE_ENDPOINT, { params });
    return response.data;
  },

  getById: async (warehouseId: string) => {
    const response = await axios.get(`${WAREHOUSE_ENDPOINT}/${warehouseId}`);
    return response.data;
  },

  create: async (data: Warehouse) => {
    const response = await axios.post(WAREHOUSE_ENDPOINT, data);
    return response.data;
  },

  update: async (warehouseId: string, data: Partial<Warehouse>) => {
    const response = await axios.patch(
      `${WAREHOUSE_ENDPOINT}/${warehouseId}`,
      data
    );
    return response.data;
  },

  delete: async (warehouseId: string) => {
    const response = await axios.delete(`${WAREHOUSE_ENDPOINT}/${warehouseId}`);
    return response.data;
  },

  findByIds: async (warehouseIds: string[]) => {
    const response = await axios.post(`${WAREHOUSE_ENDPOINT}/by-ids`, {
      warehouseIds,
    });
    return response.data;
  },
};
