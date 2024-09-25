export default (text:string) =>{
    if(!text) return '';
    let trimmedText = text.replace(/0+$/, ''); 
    let decryptedKey = '';
    for(let i=0;i<trimmedText.length;i++){
        decryptedKey +=String.fromCharCode(trimmedText.charCodeAt(i) ^ 69);
    }
    return decryptedKey.split('').reverse().join('');
}