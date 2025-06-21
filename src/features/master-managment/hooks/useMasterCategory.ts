import { useQuery } from '@tanstack/react-query';
const MASTER_RECORDS_ENDPOINT = 'https://l6nqns5r-3000.inc1.devtunnels.ms/api/naga-mdm-service/master';
import axios from 'axios';


export const useMasterCategories = () => {

 const {data:categories} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${MASTER_RECORDS_ENDPOINT}/category/data`);
      return response.data.data.data.map((item: Category) => ({
        label: item.categoryName,
        value: item.categoryId
      }));
    }
  });

  return {
    categories,

  };
}; 