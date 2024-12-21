import { strapiToken, strapiUrl } from "../constants/constants"
export default (number:string) => {
    const getCountrie = async () => {
        const query = `filters[number][$eq]=${number}`;
        const response = await fetch(`${strapiUrl}/countries?${query}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${strapiToken}`
            }
        })

        return response.json();
    }
    return {getCountrie}
}