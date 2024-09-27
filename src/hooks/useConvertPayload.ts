
import { config } from "../config/types/setup";
import { useCallback } from "preact/hooks";
import { Payload } from "../types/payloadType";
import Encryptor from "../utils/encryptor";

const useConvertToPayload = (
    formData: any,
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
              documentNumber: config.buyer?.identity,
              firstName: config.buyer.names,
              lastName: config.buyer.lastnames,
              phone: `${config.buyer.countrycode}${config.buyer.phonenumber}`,
              email: config.buyer.email,
            },
            shippingAddress: {
              country: config.shipping_address.country,
              city: config.shipping_address.city,
              street: config.shipping_address.street,
              number: config.shipping_address.Zipcode,
            },
            paramsRecurrent: {},
            currency: config.currency,
            description: 'registrar tarjeta',
            clientIp: config.buyer.ipaddress,
            idEstablecimiento: btoa(config.setting.code),
            urlRetorno3ds: config.redirect_url,
            urlRetornoExterno: config.redirect_url,
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