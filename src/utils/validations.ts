export function validateCardNumber(cardNumber:string) {
    const regex = /^\d{14,16}$/;
    return regex.test(cardNumber);
}

export function validateExpiryDate(expiryDate:string) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiryDate);
  }
  
  export function validateCVV(cvv:string) {
    const regex = /^\d{3,4}$/;
    return regex.test(cvv);
}
export function validateOtp(otp:string){
    const regex = /^\d{6}$/;
    return regex.test(otp) ;
}
export function validateOnlyLetters(text:string) {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(text);
}

export function validateEmail(email:string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}
export function validatePhoneNumber(phooneNumber:string){
    const regex = /^\d{10}$/;
    return regex.test(phooneNumber);
}
export function validateZipCode(zipCode:string){
    const regex = /^\d{6}$/;
    return regex.test(zipCode);
}
export function validateIdentificationNumber(idNumber:string,type:string){
    if(type==='ID'){
        const regex = /^\d{10}$/;
        return regex.test(idNumber);
    }
    else if(type==='PASSPORT'){
        const regex = /^[a-zA-Z0-9]{6,10}$/;
        return regex.test(idNumber);
    }
    else if(type==='BUSINESSID'){
        const regex = /^\d{13}$/;
        return regex.test(idNumber);
    }
}