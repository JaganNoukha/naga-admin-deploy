import axios from "axios";

const PRODUCTS_ENDPOINT = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL + '/products';

export const productsApi = {
  getAll: async (params?: { warehouseId?: string; brandId?: string; categoryId?: string, subcategoryId?: string }) => {
    const response = await axios.get(PRODUCTS_ENDPOINT, { params });
    return response.data;
  },

  getById: async (productId: string) => {
    const response = await axios.get(`${PRODUCTS_ENDPOINT}/${productId}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await axios.post(PRODUCTS_ENDPOINT, data);
    return response.data;
  },
  
  update: async (productId: string, data: any) => {
    const response = await axios.patch(`${PRODUCTS_ENDPOINT}/${productId}`, data);
    return response.data;
  },
  
  delete: async (productId: string) => {
    const response = await axios.delete(`${PRODUCTS_ENDPOINT}/${productId}`);
    return response.data;
  },

  assignWarehousesToProduct: async (productId: string, warehouseIds: {warehouseId: string}[]) => {    
    const url = `${PRODUCTS_ENDPOINT}/${productId}/warehouses`;
    const payload = { warehouses: warehouseIds };
    const response = await axios.patch(url, payload);
    return response.data;
  }
}; 