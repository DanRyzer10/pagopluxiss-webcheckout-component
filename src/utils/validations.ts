
export function validateCardNumber(cardNumber:string) {
    const regex = /^\d{14,16}$/;
    return regex.test(cardNumber);
}

export function validateExpiryDate(expiryDate:string) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiryDate);
  }
  export function validateCountrieSelection(countrie:{code:string,name:string}){
    return countrie.code !== '' && countrie.name !== '';
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
    if(!text) return false;
    //reges with letters, points an spaces
    const regex = /^[A-Za-z\s\.\,]+$/;
    return regex.test(text);
}

export function validateEmail(email:string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}
export  function validateLettersWithPoints(text:string){
    if(!text) return false;
    //validar solo letras y puntos y espacios
    const regex = /^[A-Za-z\s\.\,]+$/;
    return regex.test(text);
}
export function validatePhoneNumber(phooneNumber:string){
    //validar de 8 a 12 digitos
    const regex = /^\d{8,12}$/;
    return regex.test(phooneNumber);
}
export function validateZipCode(zipCode:string){
    if(!zipCode) return false;
    const regex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
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



 