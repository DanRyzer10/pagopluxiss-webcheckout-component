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