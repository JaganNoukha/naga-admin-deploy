import axios from "axios";

const USERS_ENDPOINT = process.env.NEXT_PUBLIC_USER_SERVICE_URL + '/users';

interface Coordinates {
  coordinates: [number, number];
  type: string;
}

interface UserAddress {
  location: Coordinates;
  streetAddress: string;
}

interface Warehouse {
  warehouseId: string;
}

interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  employeeCode: string;
  imeiNo: string;
  grade: string;
  userType: string;
  roleId: string;
  userAddress: UserAddress;
  status: string;
  doj: string;
  permissionGroup: string[];
  warehouse: Warehouse[];
  userName: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: User[];
  status: number;
  errors: null | string;
}

interface CreateUserData {
  name: string;
  phoneNumber: string;
  email: string;
  employeeCode: string;
  imeiNo: string;
  grade: string;
  userType: string;
  roleId: string;
  userAddress: UserAddress;
  status: string;
  doj: string;
  permissionGroup: string[];
  warehouse: Warehouse[];
  userName: string;
  password: string;
}

interface UpdateUserData extends Partial<CreateUserData> {}

export const usersApi = {
  getAll: async (params?: { search?: string }): Promise<ApiResponse> => {
    const response = await axios.get(USERS_ENDPOINT, { params });
    return response.data;
  },

  getById: async (userId: string): Promise<User> => {
    const response = await axios.get(`${USERS_ENDPOINT}/${userId}`);
    return response.data;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await axios.post(USERS_ENDPOINT, data);
    return response.data;
  },

  update: async (userId: string, data: UpdateUserData): Promise<User> => {
    const response = await axios.patch(`${USERS_ENDPOINT}/${userId}`, data);
    return response.data;
  },

  delete: async (userId: string): Promise<void> => {
    const response = await axios.delete(`${USERS_ENDPOINT}/${userId}`);
    return response.data;
  }
};
