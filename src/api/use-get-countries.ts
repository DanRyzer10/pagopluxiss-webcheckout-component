import { strapiToken, strapiUrl } from "../constants/constants"
import { StrapiCountrieResponse } from "./types/strapi-countries"

const useGetCountries = (page:number) => {
  
    const getCountries = async (): Promise<StrapiCountrieResponse> => {
      const queryParams = `pagination[page]=${page}&pagination[pageSize]=100`;
      const response = await fetch(`${strapiUrl}/countries?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`
        }
      });
      return await response.json();
    };
  
    return { getCountries };
  };
  
  export default useGetCountries;