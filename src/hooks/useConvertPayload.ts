
import { config } from "../config/types/setup";
import { useCallback } from "preact/hooks";
import { Payload } from "../types/payloadType";
import Encryptor from "../utils/encryptor";
import { IFormData } from "../types/IFormData";
import { callbackCardUrl } from "../constants/constants";

const useConvertToPayload = (
    formData: IFormData,
    config: config,
    setPayload: (payload: Payload) => void
  ) => {
    const convertToPayload = useCallback((): Promise<Payload> => {
      return new Promise((resolve, reject) => {
        try {
          const [expiryMonth, expiryYear] =
            formData.card.expirationDate.value.split('/');
          const rawKey = config.setting.secretKey;
          const encriptor = new Encryptor(rawKey);
          const cardNumber = encriptor.encrypt(formData.card.number.value);
          const expiryMonthEncrypted = encriptor.encrypt(expiryMonth);
          const expiryYearEncrypted = encriptor.encrypt(expiryYear);
          const cvvEncrypted = encriptor.encrypt(formData.card.cvv.value);
  
          const payload: Payload = {
            card: {
              number: cardNumber,
              name: config.buyer?.names,
              expirationMonth: expiryMonthEncrypted,
              expirationYear: expiryYearEncrypted,
              cvv: cvvEncrypted,
            },
            buyer: {
              documentNumber: formData.buyer?.idNumber.value as string,
              firstName: formData.buyer?.name.value as string,
              lastName: formData.buyer?.lastName.value as string,
              phone: `${formData.buyer?.countryCode.value}${formData.buyer?.phone.value}`,
              email: formData.buyer?.email.value as string,
            },
            shippingAddress: {
              country: config.shipping_address.country,
              city: formData.buyer?.city.value as string,
              street: formData.buyer?.street.value as string,
              number: formData.buyer?.zipCode.value as string,
            },
            paramsRecurrent: {},
            currency: config.currency,
            description: 'registrar tarjeta',
            clientIp: config.buyer.ipaddress,
            idEstablecimiento: btoa(config.setting.code),
            urlRetorno3ds: callbackCardUrl,
            urlRetornoExterno: callbackCardUrl,
            urlRetornoExtra:config.redirect_url
          };
          setPayload(payload);
          resolve(payload);
        } catch (error) {
          reject(error);
        }
      });
    }, [formData, config, setPayload]);
  
    return convertToPayload;
  };
  
  export default useConvertToPayload;