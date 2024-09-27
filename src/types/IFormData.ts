export interface IFormData {
    card: {
        number: IFormOption,
        expirationDate: IFormOption,
        cvv: IFormOption,
        creditType: IFormOption,
        deferPay?: IFormOption
    }
    buyer?:object
}

interface IFormOption{
    value:string,
    isValid:boolean
}