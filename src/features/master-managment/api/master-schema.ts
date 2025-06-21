import axios from "axios";
const MASTER_SCHEMA_ENDPOINT = process.env.NEXT_PUBLIC_MDM_SERVICE_URL + '/schema';

interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  masterId?: string;
  relation?: string;
}

interface CreateSchemaPayload {
  name: string;
  displayName: string;
  groupId: string;
  groupName: string;
  fields: SchemaField[];
}

export const masterSchemaApi = {
  getAll: async () => {
    const response = await axios.get(MASTER_SCHEMA_ENDPOINT);
    return response.data;
  },
  getSchemaById: async (schemaName: string) => {
    const response = await axios.get(`${MASTER_SCHEMA_ENDPOINT}/${schemaName}`);
    return response.data;
  },
  
  create: async (data: CreateSchemaPayload) => {
    const response = await axios.post(MASTER_SCHEMA_ENDPOINT, data);
    return response.data;
  },

  update: async (schemaId: string, data: CreateSchemaPayload) => {
    const response = await axios.put(`${MASTER_SCHEMA_ENDPOINT}/${schemaId}`, data);
    return response.data;
  },

  delete: async (schemaName: string) => {
    const response = await axios.delete(`${MASTER_SCHEMA_ENDPOINT}/${schemaName}`);
    return response.data;
  },

  getSchemasByGroupId: async (groupId: string) => {
    const response = await axios.get(`${MASTER_SCHEMA_ENDPOINT}/group/${groupId}`);
    return response.data;
  }
}; 