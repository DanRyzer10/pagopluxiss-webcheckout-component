export interface IFormData {
    card: {
        number: IFormOption,
        expirationDate: IFormOption,
        cvv: IFormOption,
        creditType: IFormOption,
        deferPay?: IFormOption
    }
    buyer?:{
        name:IFormOption,
        lastName:IFormOption,
        email:IFormOption,
        phone:IFormOption,
        address:IFormOption,
        city:IFormOption,
        countryCode:IFormOption,
        phoneCode?:IFormOption,
        country?:IFormOption,
        // street:IFormOption,
        number:IFormOption,
        idNumber:IFormOption,
        idType:IFormOption
    }
}

interface IFormOption{
    value:string,
    isValid:boolean
}