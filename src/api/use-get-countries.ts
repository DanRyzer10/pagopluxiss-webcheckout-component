import { strapiToken, strapiUrl } from "../constants/constants"
import { StrapiCountrieResponse } from "./types/strapi-countries"

const useGetCountries = (page:number) => {
  
    const getCountries = async (): Promise<StrapiCountrieResponse> => {
      const queryParams = `pagination[page]=${page}&pagination[pageSize]=100&fields[0]=name&fields[1]=code&fields[2]=number`;
      const response = await fetch(`${strapiUrl}/countries?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`
        }
      });
      return response.json();
    };
  
    return { getCountries };
  };
  
  export default useGetCountries;