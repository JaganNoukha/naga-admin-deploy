import { configureStore } from '@reduxjs/toolkit';
import systemReducer from './slices/systemSlice';
import warehouseReducer from './slices/warehouseSlice';
import masterRecordsReducer from './slices/masterRecordsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    system: systemReducer,
    warehouse: warehouseReducer,
    masterRecords: masterRecordsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 