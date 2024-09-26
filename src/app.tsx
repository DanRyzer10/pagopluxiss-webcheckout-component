// #region IMPORTS
import { useEffect, useState } from "preact/hooks";
import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
} from "./utils/validations";
import { ValidatedInput } from "./components/ValidateInput";
import { ValidateDateInput } from "./components/ValidateDateInput";
import { ValidateCvvInput } from "./components/ValidateCvvInput";
import { OtpModal } from "./components/OtpModal";
import { config } from "./config/types/setup";
import Encryptor from "./utils/encryptor";
import { payloadppx } from "./config/types/payloadPagoplux";
import { ApiService } from "./services/api.service";
import { responseppx } from "./config/types/responseApi";
import { CardBrand } from "./components/cardBrand";
import "./app.css";
// #endregion
// #region INTERFACES
interface PaymentButtonProps {
  config: config;
  services: {
    service_bridge: string;
  };
}
// #endregion

// #region COMPONENT APP
export function PaymentButton({ config, services }: PaymentButtonProps) {
  // #region variables reactivas
  const [formData, setFormData] = useState({
    card: {
      number: { value: "", isValid: false },
      expirationDate: { value: "", isValid: false },
      cvv: { value: "", isValid: false },
    },
  });
  const [payload, setPayload] = useState<payloadppx>();
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [response, setResponse] = useState<responseppx>();
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (otp.length >= 6) {
      setPayload((prevData: any) => ({
        ...prevData,
        paramsOtp: {
          ...response?.data.detail,
          otpCode: otp,
        },
      }));
    }
  }, [otp]);
  // #endregion

  const handleOtp = (otp: any) => {
    setOtp(otp);
  };
  const handleInputChange = (name: any, value: any, isValid: any) => {
    setFormData((prevData) => ({
      card: {
        ...prevData.card,
        [name]: { value, isValid },
      },
    }));
  };
  const isFormValid = () => {
    return Object.values(formData.card).every((field) => field.isValid);
  };

  // #region POSTDATA FORM
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isFormValid()) {
      const payload = await convertToPayload();
      let response: responseppx | undefined;
      try {
        const apiService = new ApiService(
          config.setting.authorization,
          config.setting.simetricKey
        );
        response = await apiService.post(services.service_bridge, payload);
        setResponse(response);
        /**
         * TODO- validar el las diferentes respuestas por el codigo que retorna pagoplux
         */
        if (response?.code == 103) {
          //validator 3ds
          const challengeUrl: any = response.data?.detail?.url;
          const params: any = response.data.detail.parameters;
          const queryParams = params
            .map(
              (param: any) =>
                `${encodeURIComponent(param.name)}=${encodeURIComponent(
                  param.value
                )}`
            )
            .join("&");

          const fullUrl: string = `${challengeUrl}&${queryParams}`;
          const redirectUrl: string = import.meta.env
            .VITE_CHALLENGE_URL as string;
          window.location.href = `${redirectUrl}?challengeUrl=${encodeURIComponent(
            fullUrl
          )}`;
        } else if (response?.code === 100) {
          //otp validacion
          setVisibleModal(true);
        } else if (response?.code === 0) {
          //respuesta ok :)
          onRedirect(config.redirect_url, response.data);
        } else if (response?.code === 3) {
          console.error("Credenciales de establecimiento no encontradas");
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error("Formulario inválido. Por favor, corrija los errores.");
    }
  };
  // #endregion

  const sendDataWithOtp = async () => {
    let response: responseppx | undefined;
    try {
      const apiService = new ApiService(
        config.setting.authorization,
        config.setting.simetricKey
      );
      response = await apiService.post(
        services.service_bridge,
        payload as payloadppx
      );
      setResponse(response);
      /**
       * TODO- validar el las diferentes respuestas por el codigo que retorna pagoplux
       */
      if (response?.code == 103) {
        //validator 3ds
        const challengeUrl: any = response.data?.detail?.url;
        const params: any = response.data.detail.parameters;
        const queryParams = params
          .map(
            (param: any) =>
              `${encodeURIComponent(param.name)}=${encodeURIComponent(
                param.value
              )}`
          )
          .join("&");

        const fullUrl: string = `${challengeUrl}&${queryParams}`;
        const redirectUrl: string = import.meta.env
          .VITE_CHALLENGE_URL as string;
        window.location.href = `${redirectUrl}?challengeUrl=${encodeURIComponent(
          fullUrl
        )}`;
      } else if (response?.code === 100) {
        //otp validacion
        setVisibleModal(true);
      } else if (response?.code === 0) {
        //respuesta ok :)
        onRedirect(config.redirect_url, response.data);
      } else if (response?.code === 3) {
        console.error("Credenciales de establecimiento no encontradas");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVisibleModal(false);
    }
  };

  // #region PARSEPAYLOAD
  const convertToPayload = (): Promise<payloadppx> => {
    return new Promise((resolve, reject) => {
      try {
        const [expiryMonth, expiryYear] =
          formData.card.expirationDate.value.split("/");
        const rawKey = config.setting.secretKey;
        const encriptor = new Encryptor(rawKey);
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
          description: "registrar tarjeta",
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
  };
  // #endregion
  const onRedirect = (url: string, data: any) => {
    const baseUrl = url;
    const queryParams = new URLSearchParams(data).toString();
    const fullUrl = `${baseUrl}?${queryParams}`;
    window.location.href = fullUrl;
  };
  //#region JSX
  return (
    <div class="ppxiss-main-container">
      <OtpModal
        open={isVisibleModal}
        onAction={sendDataWithOtp}
        onOtpChange={handleOtp}
      ></OtpModal>
      <div>
        <CardBrand
          cardNumber={formData.card.number.value}
          expiredDate={formData.card.expirationDate.value}
          names={config.buyer?.names}
        />
      </div>
      <form class='ppxiss-form-container' onSubmit={handleSubmit}>
          <ValidatedInput
            validator={validateCardNumber}
            errorMessage="Número de tarjeta inválida"
            onChange={handleInputChange}
            label="Número de tarjeta"
            name="number"
            value={formData.card.number.value}
          ></ValidatedInput>
         <div className=''>
         <ValidateDateInput
            validator={validateExpiryDate}
            errorMessage="Fecha de expiración inválida"
            onChange={handleInputChange}
            label="Fecha de expiración"
            name="expirationDate"
            value={formData.card.expirationDate.value}
          ></ValidateDateInput>

          <ValidateCvvInput
            validator={validateCVV}
            errorMessage="CVV inválido"
            onChange={handleInputChange}
            label="CVV"
            name="cvv"
            value={formData.card.cvv.value}
          ></ValidateCvvInput>
         </div>
          <button
            type="submit"
            className={`ppxiss-button-payiss-pay ${
              isFormValid() ? "ppxiss-button-active" : "ppxiss-button-inactive"
            }`}
            disabled={!isFormValid()}
          >
            <span>{`Pagar ${config.module=='TOKENIZATION'? config.total_amount+ config.currency:'Registrar tarjeta'} `}</span>
          </button>
        </form>
    </div>
  );
}
//#endregion
