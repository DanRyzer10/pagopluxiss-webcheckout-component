import { ParamsVerifyPayment } from "../config/types/params-verify-payment";
import { payloadppx } from "../config/types/payloadPagoplux";
import { config } from "../config/types/setup";
import { challengeUrl } from "../constants/constants";
import { pagoPluxResponsesCodes } from "../enums/pagoplux-responses";
import { ApiService } from "../services/api.service";

export class PaymentHandler {
    private config: config;
    private readonly serviceUri = '/api/webcheckout/confirmPay';
    private apiService: ApiService | null = null;
    private modal: HTMLDivElement | null = null;
    private challengeUrlServer= challengeUrl;
    constructor(config:config){
        this.config = config;
        this.initializePayment = this.initializePayment.bind(this);
        this.handlePaymentResponse = this.handlePaymentResponse.bind(this);
        this.verifyPayment = this.verifyPayment.bind(this);

        this.setupVerificationListener();
    }

     setupVerificationListener(){
        window.addEventListener('message', async (event) => {
            console.log(event.data);

            if(event.data.type ==='3DS_COMPLETE'){
                await this.verifyPayment(event.data.params)
            }
        })

    }
    async initializePayment(service:string,payload:payloadppx){
        try{
            this.apiService = new ApiService(
                this.config.setting.authorization,
                this.config.setting.simetricKey
            );
            const response = await this.apiService.post(service,payload);
            return this.handlePaymentResponse(response?.data);
        }catch(error){
            console.error(error);
            throw new Error('Error al procesar el pago');
        }

    }
   async verifyPayment(params:ParamsVerifyPayment){
    try{
        const authorization = this.config.setting.authorization;
        if(!authorization){
            throw new Error('No se ha configurado la autorización');
        }
        const payload = {
            pti:params.pti,
            pcc:params.pcc,
            ptk:params.ptk,
            prc:params.prc
        }
        const response:any = await this.apiService?.post(this.serviceUri,payload);
        if(this.modal){
            document.body.removeChild(this.modal);
            this.modal=null;
        }
        if(response?.data.code==0){
            const successUrl = new URL(this.config.redirect_url);
            const urlParams:any = {
                transaction_id: response.detail.id_transaction,
                status:response.status,
                token:response.detail.token
            }
            Object.keys(urlParams).forEach(key=>{
                successUrl.searchParams.append(key,urlParams[key])
            })
            window.location.href = successUrl.toString();
        }else{
            throw new Error('Error al procesar el pago')
        }

    }catch(error){
        console.error(error);
        const errorUrl = new URL(this.config.redirect_url);
        errorUrl.searchParams.append('status','ERROR');
        window.location.href = errorUrl.toString();
    }

    }
    handlePaymentResponse(response:any){
        console.log(response);
        if(response.code==pagoPluxResponsesCodes["3ds"]){
            const challengeUrl = response.detail?.url;
            const params = response.detail.parameters;
            const queryParams: string = params
              .map((param: { name: string; value: string }) => 
                `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`
              )
              .join('&');
            
            const fullUrl = `${challengeUrl}&${queryParams}`;
            console.log(fullUrl);

            this.open3DSChallenge(fullUrl);

            return {status:'PENDING_3DS'}


        }
        else if(response.code==pagoPluxResponsesCodes["otp"]){
            return {
                status:'PENDING_OTP',
                response:response
            }
        }
        else if(response.code==pagoPluxResponsesCodes["ok"]){
            return {
                status:'SUCCESS',
                transaction_id:response.detail.transaction_id,
                response:response,
                token:response.detail.token
            }
        }else if(response?.code==pagoPluxResponsesCodes["stablishmentError"]){
            return {
                status:'ERROR',
                message:"Error en el establecimiento"
            }
        }else{
            return {
                status:'ERROR',
                message:"Transacción no logró ser procesada." 
            }
        }


    }


    open3DSChallenge(challengeUrl:string) {
        // Crear un iframe modal para el desafío 3DS
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        `;
    
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
          width: 500px;
          height: 600px;
          border: none;
          background: white;
          border-radius: 8px;
        `;
        iframe.onload = ()=>{
           
            
        }
        iframe.onformdata = (e)=>{
            console.log('onformdata',e);
        }
        const challengeUrlS = `${this.challengeUrlServer}?challengeUrl=${encodeURIComponent(challengeUrl)}`;
        console.log(challengeUrlS);
        iframe.src = challengeUrlS;
        iframe.addEventListener('message',()=>{
            console.log('message');
        })
        modal.appendChild(iframe);
        document.body.appendChild(modal);
        this.modal = modal;
       
      }
}

declare global {
    interface Window {
        PaymentHandler: typeof PaymentHandler;
    }
}

if(typeof module !='undefined' && module.exports){
    module.exports = PaymentHandler;

}else{
    window.PaymentHandler = PaymentHandler;
}