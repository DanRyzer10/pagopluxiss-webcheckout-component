import { useState} from 'preact/hooks';
import { validateCardNumber, validateCVV, validateExpiryDate } from './utils/validations';
import { ValidatedInput } from './components/ValidateInput';
import { ValidateDateInput } from './components/ValidateDateInput';
import { ValidateCvvInput } from './components/ValidateCvvInput';
import { OtpModal } from './components/OtpModal';
import { config } from './config/types/setup';
import Encryptor from './utils/encryptor';
import { payloadppx } from './config/types/payloadPagoplux';
interface PaymentButtonProps {
  config:config,
  services:object
}
export function PaymentButton({config,services}:PaymentButtonProps){
  const [formData, setFormData] = useState({
    card:{
      number: { value: '', isValid: false },
      expirationDate: { value: '', isValid: false },
      cvv: { value: '', isValid: false}
    },
  });
  const [isVisibleModal,setVisibleModal] = useState(false);
  const [otp, setOtp] = useState('');


  const handleOtp = (otp:any) =>{
    setOtp(otp);
  }

  const handleInputChange = (name:any, value:any, isValid:any) => {
    console.log(name, value, isValid);
    setFormData(prevData => ({
     card:{
      ...prevData.card,
      [name]: { value, isValid }
     }
    }));
  };

  const isFormValid = () => {
    console.log(formData);
    return Object.values(formData.card).every(field => field.isValid);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log(otp)
      console.log('Formulario válido. Datos:', formData);
      const payload = await convertToPayload();
      const headers = {
        Authorization: `Basic ${config.setting.authorization}`,
        'X-PPISS-AUTH': config.setting.simetricKey
      }
      console.log(headers)
      console.log(payload)
      console.log(services)
    } else {
      console.error('Formulario inválido. Por favor, corrija los errores.');
    }
  };
  const convertToPayload = (): Promise<payloadppx> => {
    return new Promise((resolve, reject) => {
      try {
        const [expiryMonth, expiryYear] = formData.card.expirationDate.value.split('/');
        const rawKey = config.setting.secretKey;
        const encriptor = new Encryptor(btoa(rawKey));
        const cardNumber = encriptor.encrypt(formData.card.number.value);
        const expiryMonthEncrypted = encriptor.encrypt(expiryMonth);
        const expiryYearEncrypted = encriptor.encrypt(expiryYear);
        const cvvEncrypted = encriptor.encrypt(formData.card.cvv.value);
  
        const payload: payloadppx = {
          card: {
            number: cardNumber,
            name: config.buyer?.names,
            expirationMonth: expiryMonthEncrypted,
            expirationYear: expiryYearEncrypted,
            cvv: cvvEncrypted
          },
          buyer: {
            documentNumber: config.buyer?.identity,
            firstName: config.buyer.names,
            lastName: config.buyer.lastnames,
            phone: config.buyer.phonenumber,
            email: config.buyer.email
          },
          shippingAddress: {
            country: config.shipping_address.country,
            city: config.shipping_address.city,
            street: config.shipping_address.street,
            number: config.shipping_address.Zipcode
          },
          currency: config.currency,
          description: config.items?.[0]?.name ?? '',
          clientIp: config.buyer.ipaddress,
          idEstablecimiento: btoa(config.setting.code),
          urlRetorno3ds: config.redirect_url,
          urlRetornoExterno: config.redirect_url,
        };
  
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div>
      <OtpModal
        open={isVisibleModal}
        onAction={() => setVisibleModal(false)}
        onOtpChange={handleOtp}
      >

      </OtpModal>
      <form onSubmit={handleSubmit}>
     <ValidatedInput
      validator={validateCardNumber}
      errorMessage="Número de tarjeta inválida"
      onChange={handleInputChange}
      label="Número de tarjeta"
      name="number"
      value={formData.card.number.value}
     >

     </ValidatedInput>
     <ValidateDateInput
      validator={validateExpiryDate}
      errorMessage="Fecha de expiración inválida"
      onChange={handleInputChange}
      label="Fecha de expiración"
      name="expirationDate"
      value={formData.card.expirationDate.value}
     >

     </ValidateDateInput>

     <ValidateCvvInput
      validator={validateCVV}
      errorMessage="CVV inválido"
      onChange={handleInputChange}
      label="CVV"
      name="cvv"
      value={formData.card.cvv.value}
     >

     </ValidateCvvInput>

     <button 
          type="submit" 
          className={`px-4 py-2 text-white rounded-md ${
            isFormValid() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isFormValid()}
        >
          Enviar
        </button>
    </form>
    </div>
  )
}