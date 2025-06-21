import axios from "axios";
const MASTER_RECORDS_ENDPOINT = process.env.NEXT_PUBLIC_MDM_SERVICE_URL + '/master';

interface MasterCategory {
  id?: string;
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  metadata?: Category<string, string | number | boolean>;
}

interface CreateRecordPayload {
  masterName: string;
  data: Omit<MasterCategory, 'id' | 'createdAt' | 'updatedAt'>;
}

interface UpdateRecordPayload {
  masterName: string;
  recordId: string;
  data: Partial<Omit<MasterCategory, 'id' | 'createdAt' | 'updatedAt'>>;
}

export const masterRecordsApi = {
  getAll: async (masterName: string) => {
    const response = await axios.get(`${MASTER_RECORDS_ENDPOINT}/${masterName}/data`);
    return response.data;
  },

  getById: async (masterName: string, recordId: string) => {
    const response = await axios.get(`${MASTER_RECORDS_ENDPOINT}/${masterName}/data/${recordId}`);
    return response.data;
  },

  create: async (data: CreateRecordPayload) => {
    const response = await axios.post(`${MASTER_RECORDS_ENDPOINT}/${data.masterName}/data`, data.data);
    return response.data;
  },

  update: async (data: UpdateRecordPayload) => {
    const response = await axios.put(
      `${MASTER_RECORDS_ENDPOINT}/${data.masterName}/data/${data.recordId}`,
      data.data
    );
    return response.data;
  },

  delete: async (masterName: string, recordId: string) => {
    const response = await axios.delete(`${MASTER_RECORDS_ENDPOINT}/${masterName}/data/${recordId}`);
    return response.data;
  }
}; 