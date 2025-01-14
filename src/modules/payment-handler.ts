import { ParamsVerifyPayment } from "../config/types/params-verify-payment";
import { payloadppx } from "../config/types/payloadPagoplux";
import { config } from "../config/types/setup";
import { challengeUrl,callbackUrlSuccess, baseUrl } from "../constants/constants";
import { pagoPluxResponsesCodes } from "../enums/pagoplux-responses";
import { ApiService } from "../services/api.service";

export class PaymentHandler {
    private config: config;
    private onError:Function;
    private readonly serviceUri = '/api/webcheckout/confirmPay';
    private apiService: ApiService | null = null;
    private modal: HTMLDivElement | null = null;
    private challengeUrlServer= challengeUrl;
    constructor(config:config,onError:Function){
        this.config = config;
        this.onError = onError;
        this.initializePayment = this.initializePayment.bind(this);
        this.handlePaymentResponse = this.handlePaymentResponse.bind(this);
        this.verifyPayment = this.verifyPayment.bind(this);
        this.setupVerificationListener();
    }

     setupVerificationListener(){
        const urlService = baseUrl
        window.addEventListener('message', async (event) => {
            if(!event.origin!=urlService){
                return;
            }
            if(event.data.type ==='3DS_COMPLETE'){
                await this.verifyPayment(event.data.data)
            }else if(event.data.type==='TRANSACTION_SUCCESS'){
                let redirect_url = new URL(this.config.redirect_url)
                redirect_url.searchParams.append('id_transaccion',event.data.data.id_transaccion)
                redirect_url.searchParams.append('status',event.data.data.status)
                redirect_url.searchParams.append('token',event.data.data.token)
                this.modal?.remove();
                window.location.href=redirect_url.toString();
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
            return this.handlePaymentResponse(response);
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
        if(response?.code==0){
            const successUrl = new URL(this.config.redirect_url);
            const urlParams:any = {
                transaction_id: response.detail.id_transaccion,
                status:response.status,
                token:response.detail.token
            }
            Object.keys(urlParams).forEach(key=>{
                successUrl.searchParams.append(key,urlParams[key])
            })
            window.location.href = successUrl.toString();
        }else{
            this.onError("Transacción no logró ser procesada.",true,response.code, response.description);
            throw new Error('Error al procesar el pago')
            
        }

    }catch(error){
        console.error(error);
        this.onError("Transacción no logró ser procesada.",true,"2", "Error al procesar el pago");
    }

    }
    handlePaymentResponse(response:any){
        if(response.code==pagoPluxResponsesCodes["3ds"]){
            const challengeUrl = response.detail?.url;
            const params = response.detail.parameters;
            const queryParams: string = params
              .map((param: { name: string; value: string }) => 
                `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`
              )
              .join('&');
            
            const fullUrl = `${challengeUrl}&${queryParams}`;
            const challengeUrlS = `${this.challengeUrlServer}?challengeUrl=${encodeURIComponent(fullUrl)}`;
            this.openModalRedirect(challengeUrlS);

            return {status:'PENDING_3DS'}


        }
        else if(response.code==pagoPluxResponsesCodes["otp"]){
            return {
                status:'PENDING_OTP',
                response:response
            }
        }
        else if(response.code==pagoPluxResponsesCodes["ok"]){
            const paymentOkUrl = new URL(callbackUrlSuccess);
            const urlParams:any = {
                id_transaccion: response.detail.id_transaccion,
                status:response.status,
                token:response.detail.token
            }
            Object.keys(urlParams).forEach(key=>{
                paymentOkUrl.searchParams.append(key,urlParams[key])
            })

            this.openModalRedirect(paymentOkUrl.toString())
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
        }
        else if(response?.code==pagoPluxResponsesCodes["otpIncorrect"]){
            this.onError("Transacción no logró ser procesada.",true,response.code,"Código OTP incorrecto");
        }
        else{
            return {
                status:'ERROR',
                message:"Transacción no logró ser procesada." 
            }
        }


    }


    openModalRedirect(url:string) {
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
        iframe.src = url;
        modal.appendChild(iframe);
        document.body.appendChild(modal);
        this.modal = modal;   
      }
}


