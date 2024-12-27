export interface config {
    setting:{
        production:boolean,
        code:string,
        authorization:string, //cadena de autorizacion 
        secretKey:string, // llave simetrica de 32 caracteres
        simetricKey:string //llave simetrica encriptada con llave publica de pagoplux
    },
    business:{
        name:string,
        email:string,
        country:string,
        country_code:string,
        phonenumber:string,
    }
    reference_id:string,
    module:'COLLECTION' | 'SUBSCRIPTION' | 'TOKENIZATION',
    currency:string,
    total_amount?:number,
    installmentCredit?:{
        code:string,
        name:string,
        installments:number[]
    }[],
    buyer:{
        document_type:string,
        identity:string,
        names:string,
        lastnames:string,
        email:string,
        countrycode:string,
        phonenumber:string,
        ipaddress:string
    },
    shipping_address:{
        country:string,
        state?:string,
        city:string,
        number:string
        Zipcode?:string,
        street:string,
    },
    redirect_url:string,
}