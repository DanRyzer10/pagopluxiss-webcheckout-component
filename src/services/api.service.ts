import { payloadppx } from "../config/types/payloadPagoplux";
import { responseppx } from "../config/types/responseApi";



export class ApiService {
    private readonly baseUrl:string;
    private authorization:string;
    private simetricKey:string;
    constructor(authorization:string,simetricKey:string){
        this.baseUrl = import.meta.env.VITE_BASE_URL as string;
        this.authorization = authorization;
        this.simetricKey = simetricKey
    }

    async post(endpoint:string,payload:payloadppx):Promise<responseppx | undefined>{
        try{
            const response = await fetch(`${this.baseUrl}/${endpoint}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Basic ${this.authorization}`,
                    'X-PPISS-AUTH':this.simetricKey
                },
                body:JSON.stringify(payload)
            });
            if(!response.ok){
                throw new Error('Error Http! estado fallido');
            }
            const data = await response.json();
            return {
                data,
                status:response.status,
                code:data.code
            }

        }catch(e){
            console.error(e);
        return undefined;
    }
}
}