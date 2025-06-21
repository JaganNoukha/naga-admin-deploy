import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Warehouse {
  _id: string;
  warehouseId: string;
  warehouseName: string;
  address: {
    streetAddress: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  isDeleted: boolean;
  __v: number;
}

interface WarehouseState {
  warehouses: Warehouse[];
  warehouseMap: Record<string, Warehouse>;
  isLoading: boolean;
  error: string | null;
}

const initialState: WarehouseState = {
  warehouses: [],
  warehouseMap: {},
  isLoading: false,
  error: null,
};

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    setWarehouses: (state, action: PayloadAction<Warehouse[]>) => {
      state.warehouses = action.payload;
      state.warehouseMap = action.payload.reduce((acc, warehouse) => {
        acc[warehouse.warehouseId] = warehouse;
        return acc;
      }, {} as Record<string, Warehouse>);
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setWarehouses, setLoading, setError } = warehouseSlice.actions;
export default warehouseSlice.reducer; 