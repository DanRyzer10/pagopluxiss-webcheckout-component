// #region IMPORTS
import { useEffect, useState } from "preact/hooks";
import SvgIcon from './img/issLogo'
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
import { ValidatedDropdown } from "./components/DropDown";
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
      creditType: { value: "", isValid: false },
    },
  });
  
  const [payload, setPayload] = useState<payloadppx>();
  const [resendModal, setResendModal] = useState(false);
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [response, setResponse] = useState<responseppx>();
  const [isLoading, setIsLoading] = useState(false);
  const [clearValue,setClearValue] = useState(false)
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

  useEffect(()=>{
    return ()=>{
      setFormData({
        card: {
          number: { value: "", isValid: false },
          expirationDate: { value: "", isValid: false },
          cvv: { value: "", isValid: false },
          creditType: { value: "", isValid: false },
        },
      })
      setClearValue(true)
      setOtp('')
    }
  },[])
  useEffect(()=>{
    if(resendModal){
      setFormData((prevData) => ({
        card: {
        number:{value:prevData.card.number.value,isValid:true},
        expirationDate:{value:prevData.card.expirationDate.value,isValid:true},
        cvv:{value:'',isValid:false},
        creditType:{value:prevData.card.creditType.value,isValid:true
        }}
      }));
      console.log(formData)
      handleInputChange('cvv','',false)
    }
  },[resendModal])
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
    setIsLoading(true);
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
      }finally{
        setIsLoading(false);
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
  const resendOtp = () =>{
    setVisibleModal(false);
    setResendModal(true)
    //limpiar todos los datos
    
  }
  //#region JSX
  return (
    <div class="ppxiss-container">
      <OtpModal
      onResendOtp={resendOtp}
        open={isVisibleModal}
        onAction={sendDataWithOtp}
        onOtpChange={handleOtp}
      ></OtpModal>
      <div class="ppxiss-row">
        <div class="ppxiss-col ppxiss-align-center ppxiss-card-brand-padding">
          <CardBrand
            cardNumber={formData.card.number.value}
            expiredDate={formData.card.expirationDate.value}
            names={config.buyer?.names}
          />
        </div>
      </div>
      <form class="ppxiss-row" onSubmit={handleSubmit}>
        <div class="ppxiss-col">
          <ValidatedInput
             reset={clearValue}
            validator={validateCardNumber}
            errorMessage="Número de tarjeta inválida"
            onChange={handleInputChange}
            label="Número de tarjeta"
            name="number"
            value={formData.card.number.value}
          ></ValidatedInput>

          <div class="ppxiss-row">
            <div class="ppxiss-col ppxiss-col-6">
              <ValidateDateInput
                reset={clearValue}
                validator={validateExpiryDate}
                errorMessage="Fecha de expiración inválida"
                onChange={handleInputChange}
                label="Fecha de expiración"
                name="expirationDate"
                value={formData.card.expirationDate.value}
              ></ValidateDateInput>
            </div>
            <div class="ppxiss-col ppxiss-col-6">
              <ValidateCvvInput
                reset={resendModal || clearValue}
                validator={validateCVV}
                errorMessage="CVV inválido"
                onChange={handleInputChange}
                label="CVV"
                name="cvv"
                value={formData.card.cvv.value}
              ></ValidateCvvInput>
            </div>
          </div>
          <div class='ppxiss-row'>
            <div class='ppxiss-col'>
              <ValidatedDropdown
                validator={(value) => value !== ""}
                errorMessage="Seleccione una opción"
                onChange={handleInputChange}
                label="Tipo de Crédito"
                name="creditType"
                options={[
                  { key: "1", value: "Crédito" },
                  { key: "2", value: "Débito" },
                ]}
                initialValue={formData.card.creditType.value}
              >
              </ValidatedDropdown>
            </div>
          </div>
          <div class='ppxiss-row'>
            <div class='ppxiss-col ppxiss-align-center'>
            <button
            type="submit"
            className={`ppxiss-button-payiss-pay ${
              isFormValid()  && !isLoading ? "ppxiss-button-active" : "ppxiss-button-inactive"
            }`}
            disabled={!isFormValid() || isLoading}
          >
            <span>{config.module==='TOKENIZATION'?'Registrar tarjeta':`Pagar ${config.total_amount} ${config.currency}`}</span>
          </button>
            </div>
          </div>
          <div class='ppxiss-row'>
            <div class='ppxiss-col ppxiss-align-center'>
              <SvgIcon></SvgIcon>
            </div>
          </div>
          {/* <div>
          {config.setting.production ?(<div></div>):(<div>Entorno de pruebas xdxd</div>)}
          </div> */}
        </div>
      </form>
    </div>
  );
}
//#endregion
