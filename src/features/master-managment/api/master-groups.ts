import axios from "axios";

const GROUPS_ENDPOINT = process.env.NEXT_PUBLIC_MDM_SERVICE_URL + '/groups';

export const groupsApi = {
  getAll: async () => {
    const response = await axios.get(GROUPS_ENDPOINT);
    return response.data;
  },
  
  create: async (data: { groupName: string; displayName: string }) => {
    const response = await axios.post(GROUPS_ENDPOINT, data);
    return response.data;
  },
  
  update: async (groupId: string, data: { groupName: string; displayName: string }) => {
    const response = await axios.patch(`${GROUPS_ENDPOINT}/${groupId}`, data);
    return response.data;
  }
};