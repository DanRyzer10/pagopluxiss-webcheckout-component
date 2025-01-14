export interface Payload {
    card: {
      number: string;
      name: string;
      expirationMonth: string;
      expirationYear: string;
      cvv: string;
    };
    buyer: {
      documentNumber: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    shippingAddress: {
      country: string;
      city: string;
      street: string;
      number: string;
    };
    paramsRecurrent: {};
    currency: string;
    description: string;
    clientIp: string;
    idEstablecimiento: string;
    urlRetorno3ds: string;
    urlRetornoExterno: string;
    urlRetornoExtra?:string;
    paramsOtp?: {
        otpCode:string,
        
    }
  }