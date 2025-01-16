export function validateCardNumber(cardNumber:string) {
    const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
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
    const regex = /^[A-Za-z0-9\s\.\,]+$/;
    return regex.test(text);
}
export function validatePhoneNumber(phooneNumber:string){
    //validar de 8 a 12 digitos
    const regex = /^\d{8,12}$/;
    return regex.test(phooneNumber);
}
export function validateZipCode(zipCode:string){
    if(!zipCode) return false;
    //regex vaidated for 3 digits and not aceppt 000 and values greater than 999 and less than 0
    const regex = /^(?!000)\d{3}$/;
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