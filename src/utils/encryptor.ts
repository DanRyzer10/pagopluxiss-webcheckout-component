import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';

export default class Encryptor{
    private readonly key:string;

    constructor(key:string){
        this.key = key;
    }

    encrypt(plainText:string):string{
        const key = Base64.parse(this.key);
        const encrypted = AES.encrypt(plainText,key,{
            mode:ECB,
            padding:Pkcs7
        })

        return encrypted.toString();
    }
}
