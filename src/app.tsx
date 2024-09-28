// #region IMPORTS
import { useEffect, useState } from "preact/hooks";
import SvgIcon from "./img/issLogo";
import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
} from "./utils/validations";
import { ValidatedInput } from "./components/ValidateInput";
import { ValidateDateInput } from "./components/ValidateDateInput";
import { ValidateCvvInput } from "./components/ValidateCvvInput";
import { OtpModal } from "./components/OtpModal";
import { PaymentButtonProps, IDeferOptions } from "./types/appTypes";
import { payloadppx } from "./config/types/payloadPagoplux";
import { ApiService } from "./services/api.service";
import { responseppx } from "./config/types/responseApi";
import { CardBrand } from "./components/cardBrand";
import "./app.css";
import BasicSelect from "./components/material/MultiselectOption";
import { SubmitButton } from "./components/SubmitButton";
import useConvertToPayload from "./hooks/useConvertPayload";
import { convertToDeferredOptions } from "./utils/mapers";
import { IFormData } from "./types/IFormData";
import { SplitInfoInput } from "./components/SplitInfoInput";

// #endregion

// #region COMPONENT APP
export function PaymentButton({ config, services }: PaymentButtonProps) {
  // #region variables reactivas
  const [formData, setFormData] = useState<IFormData>({
    card: {
      number: { value: "", isValid: false },
      expirationDate: { value: "", isValid: false },
      cvv: { value: "", isValid: false },
      creditType: {
        value: "",
        isValid: false,
      },
    },
  });
  const [payload, setPayload] = useState<payloadppx>();
  const [resendModal, setResendModal] = useState(false);
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [responseppx, setResponse] = useState<responseppx>();
  const [isLoading, setIsLoading] = useState(false);
  const [clearValue, setClearValue] = useState(false);
  const [otp, setOtp] = useState("");
  const [isDefer, setisDefer] = useState(false);
  const [deferOptions, setDeferOptions] = useState<IDeferOptions[]>([]);
  //const [showMore, setShowMore] = useState(false);
  const [selectedCreditType, setSelectedCreditType] = useState<{
    code: string;
    installments: number[];
    name: string;
  }>();
  const handleSelectedCreditType = (value: {
    code: string;
    installments: number[];
    name: string;
  }) => {
    setSelectedCreditType(value);
  };
  useEffect(() => {
    if (!selectedCreditType) return;
    let installments: any[] = selectedCreditType.installments;
    if (installments.length > 0) {
      const installmentOptions: IDeferOptions[] =
        convertToDeferredOptions(installments);
      setDeferOptions(installmentOptions);
      setisDefer(true);
      setFormData((prevData) => ({
        card: {
          ...prevData.card,
          deferPay: { value: "", isValid: false },
        },
      }));
    } else {
      setisDefer(false);
      //quitar deferPay del formData
      const { deferPay, ...rest } = formData.card;
      setFormData({ card: rest });
    }
  }, [selectedCreditType]);
  useEffect(() => {
    return () => {
      setFormData({
        card: {
          number: { value: "", isValid: false },
          expirationDate: { value: "", isValid: false },
          cvv: { value: "", isValid: false },
          creditType: {
            value: "",
            isValid: false,
          },
        },
      });
      setClearValue(true);
      setOtp("");
    };
  }, []);
  useEffect(() => {
    if (resendModal) {
      setFormData((prevData) => ({
        card: {
          number: { value: prevData.card.number.value, isValid: true },
          expirationDate: {
            value: prevData.card.expirationDate.value,
            isValid: true,
          },
          cvv: { value: "", isValid: false },
          creditType: { value: prevData.card.creditType.value, isValid: true },
        },
      }));
      console.log(formData);
      handleInputChange("cvv", "", false);
    }
  }, [resendModal]);
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
  const ConvertToPayload = useConvertToPayload(formData, config, setPayload);
  // #region POSTDATA FORM
  const handleSubmit = async (e: any, action: "submit" | "otp") => {
    e.preventDefault();
    console.log(formData);
    setIsLoading(true);
    console.log(payload);
    if (isFormValid()) {
      //const payload = await convertToPayload();
      const payload: any = await ConvertToPayload();
      if (action === "otp") {
        payload.paramsOtp = {
          ...responseppx?.data.detail,
          otpCode: otp,
        };
      }
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
        } else {
          console.error(
            `No se pudo realizar la transaccion. Comunicate con el establecmiento:\n mail :${config.business.email}\n telefono:${config.business.phonenumber}`
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
        if (action === "otp") {
          setVisibleModal(false);
        }
      }
    } else {
      console.error("Formulario inválido. Por favor, corrija los errores.");
    }
  };

  const onSubmit = (e: any) => handleSubmit(e, "submit");

  const onSendDataWithOtp = (e: any) => handleSubmit(e, "otp");
  const onShowMoreInfo = () => {
    console.log("show more info");
  };

  const onRedirect = (url: string, data: any) => {
    const baseUrl = url;
    const queryParams = new URLSearchParams(data).toString();
    const fullUrl = `${baseUrl}?${queryParams}`;
    window.location.href = fullUrl;
  };
  const resendOtp = () => {
    setVisibleModal(false);
    setResendModal(true);
  };
  //#region JSX
  return (
    <div class="ppxiss-container">
      <OtpModal
        onResendOtp={resendOtp}
        open={isVisibleModal}
        onAction={onSendDataWithOtp}
        onOtpChange={handleOtp}
      ></OtpModal>
      <div class="ppxiis-row">
        <div class="ppxiss-col ppxiss-align-center ppxiss-card-brand-padding">
          <span class="ppxis-text-align-center ppxiss-text-header-info">
            Estás realizando un pago para
            <br />
            <span class="ppxis-text-align-center ppxiss-text-header-info ppxiss-text-strong">
              {config.business.name}
            </span>
          </span>
        </div>
      </div>
      <div class="ppxiss-row">
        <div class="ppxiss-col ppxiss-align-center ppxiss-card-brand-padding">
          <CardBrand
            cardNumber={formData.card.number.value}
            expiredDate={formData.card.expirationDate.value}
            names={config.buyer?.names}
          />
        </div>
      </div>
      <div class="ppxiss-row">
        <div class="ppxiss-col">
          <SplitInfoInput
            onChange={onShowMoreInfo}
            value={{
              ...config.buyer,
              ...config.shipping_address,
            }}
          ></SplitInfoInput>
        </div>
      </div>
      <form class="ppxiss-row" onSubmit={onSubmit}>
        <div class="ppxiss-col">
          <ValidatedInput
            reset={clearValue}
            validator={validateCardNumber}
            errorMessage="Número de tarjeta inválida"
            onChange={handleInputChange}
            label="Número de tarjeta"
            name="number"
            placeholder="XXXX XXXX XXXX XXXX"
            value={formData.card.number.value}
          ></ValidatedInput>

          <div class="ppxiss-row">
            <div
              class="ppxiss-col ppxiss-col-6"
              style={{ paddingRight: "5px" }}
            >
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
            <div class="ppxiss-col ppxiss-col-6" style={{ paddingLeft: "5px" }}>
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
          <div class="ppxiss-row" style={{ marginBottom: "16px" }}>
            <div class="ppxiss-col">
              <BasicSelect
                label="Tipo de Crédito"
                name="creditType"
                onChange={handleInputChange}
                validator={(value) => value !== ""}
                errorMessage="Seleccione una opción"
                options={config.installmentCredit as any}
                onSendSelectedValue={handleSelectedCreditType}
              ></BasicSelect>
            </div>
          </div>
          {isDefer && (
            <div class="ppxiss-row" style={{ marginBottom: "16px" }}>
              <div class="ppxiss-col">
                <BasicSelect
                  label="Diferido"
                  name="deferPay"
                  onChange={handleInputChange}
                  validator={(value) => value !== ""}
                  errorMessage="Seleccione una opción"
                  options={deferOptions as any}
                ></BasicSelect>
              </div>
            </div>
          )}

          <div class="ppxiss-row">
            <div class="ppxiss-col ppxiss-align-center">
              <SubmitButton
                activeButton={() => isFormValid() && !isLoading}
                disabledButton={() => !isFormValid() || isLoading}
              >
                <span>
                  {config.module === "TOKENIZATION"
                    ? "Registrar tarjeta"
                    : `Pagar ${config.total_amount} ${config.currency}`}
                </span>
              </SubmitButton>
            </div>
          </div>
          <div class="ppxiss-row">
            <div class="ppxiss-col ppxiss-align-center">
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
