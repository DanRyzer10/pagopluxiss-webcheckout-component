import { config } from "../config/types/setup";
export interface PaymentButtonProps {
    config: config;
    services: {
      service_bridge: string;
    };
  }
  // #endregion
  export interface creditTypeValue {
    value:{
      code:string,
      installments:number[],
      name:string
    },
    isValid:boolean
  }
  export interface IDeferOptions {
    code:number,
    name:string
  }