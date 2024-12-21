// #region IMPORTS
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import SvgIcon from "./img/issLogo";
import {
  validateCardNumber,
  validateCountrieSelection,
  validateCVV,
  validateEmail,
  validateExpiryDate,
  validateLettersWithPoints,
  validateOnlyLetters,
  validatePhoneNumber,
  validateZipCode,
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
import { SubmitButton } from "./components/SubmitButton";
import useConvertToPayload from "./hooks/useConvertPayload";
import { convertToDeferredOptions } from "./utils/mapers";
import { IFormData } from "./types/IFormData";
import { SplitInfoInput } from "./components/SplitInfoInput";
import cityIdValidation from "./utils/cityIdValidation";

import useFindCountrieByNumber from "./api/use-find-countrie-by-number";
import BasicSelect from "./components/material/MultiselectOption";
import MultiselectDefer from "./components/multiselect-defer";

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
    buyer: {
      name: {
        value: config.buyer.names,
        isValid: validateOnlyLetters(config.buyer.names),
      },
      lastName: {
        value: config.buyer.lastnames,
        isValid: validateOnlyLetters(config.buyer.lastnames),
      },
      email: {
        value: config.buyer.email,
        isValid: validateEmail(config.buyer.email),
      },
      phone: {
        value: config.buyer.phonenumber,
        isValid: validatePhoneNumber(config.buyer.phonenumber),
      },
      address: {
        value: config.shipping_address.state,
        isValid: validateLettersWithPoints(config.shipping_address.state),
      },
      city: {
        value: config.shipping_address.city,
        isValid: validateLettersWithPoints(config.shipping_address.city),
      },
      state: {
        value: config.shipping_address.state,
        isValid: validateLettersWithPoints(config.shipping_address.state),
      },
      countryCode: {
        value: config.buyer.countrycode,
        isValid: validateLettersWithPoints(config.shipping_address.country),
      },
      street: {
        value: config.shipping_address.street,
        isValid: validateLettersWithPoints(config.shipping_address.street),
      },
      zipCode: {
        value: config.shipping_address.Zipcode,
        isValid: validateZipCode(config.shipping_address.Zipcode),
      },
      idNumber: {
        value: config.buyer.identity,
        isValid: cityIdValidation(config.buyer.identity),
      },
      idType: { value: config.buyer.document_type, isValid: true },
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
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [deferOptions, setDeferOptions] = useState<IDeferOptions[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [useCountrie, setUserCountrie] = useState<any>();
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
    console.log(formData);
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
        buyer: prevData.buyer,
      }));
    } else {
      setisDefer(false);
      const { deferPay, ...rest } = formData.card;
      const { buyer } = formData;
      setFormData({ card: rest, buyer });
    }
  }, [selectedCreditType]);
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
        buyer: prevData.buyer,
      }));
      handleInputChange("cvv", "", false, "card");
      setResendModal(false);
    }
  }, [resendModal]);
  // #endregion

  const handleOtp = (otp: any) => {
    setOtp(otp);
  };
  const handleInputChange = useCallback(
    (
      name: any,
      value: any,
      isValid: any,
      target: "card" | "buyer" = "card"
    ) => {
      //@ts-ignore
      setFormData((prevData: any) => ({
        ...prevData,
        [target]: {
          ...prevData[target as any],
          [name]: { value, isValid },
        },
      }));
    },
    [setFormData]
  );
  const isFormValid = () => {
    return (
      formData.card &&
      formData.buyer &&
      Object.values(formData.card).every((field) => field.isValid) &&
      Object.values(formData.buyer).every((field) => field.isValid)
    );
  };
  const validateBuyerInfo = useMemo(() => {
    console.log(formData.buyer);
    return (
      formData.buyer &&
      Object.values(formData.buyer).every((field) => field.isValid)
    );
  }, [formData.buyer]);
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
  const onShowMoreInfo = useCallback(() => {
    setShowMoreInfo(!showMoreInfo);
  }, [showMoreInfo]);

  useEffect(() => {
    const currCountrieCode: any = formData.buyer?.countryCode.value;
    let isFetched = localStorage.getItem("fe_cou");
    if (!showMoreInfo || !isFetched) {
      const { getCountrie } = useFindCountrieByNumber(currCountrieCode);
      getCountrie().then((response) => {
        if (response?.data.length > 0) {
          const countrieName = response?.data[0].attributes.name;
          setUserCountrie(countrieName);
          localStorage.setItem("fe_cou", "ok");
        } else {
          setUserCountrie("No encontrado");
        }
      });
    }
  }, [showMoreInfo]);

  const onRedirect = (url: string, data: any) => {
    setClearValue(true);
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
            cardNumber={formData?.card?.number?.value || ""}
            expiredDate={formData?.card?.expirationDate.value || ""}
            names={config.buyer?.names}
          />
        </div>
      </div>
      <div class="ppxiss-row">
        <div class="ppxiss-col">
          <SplitInfoInput
            invalid={!validateBuyerInfo}
            label="Propietario de la Tarjeta"
            onChange={onShowMoreInfo}
            value={{
              ...config.buyer,
              ...config.shipping_address,
            }}
          ></SplitInfoInput>
        </div>
      </div>
      {showMoreInfo ? (
        <div className="ppxiss-moreinfo-container ppxiss-row ">
          <label className="float-label">Propietario de Tarjeta</label>
          <div class="ppxiss-col">
            <ValidatedInput
              type="buyer"
              validator={cityIdValidation}
              errorMessage="Número de identificacion inválido"
              onChange={handleInputChange}
              label="Cédula, RUC o Pasaporte"
              name="idNumber"
              placeholder="Ingrese su numero de identificacion"
              value={formData.buyer?.idNumber.value}
              isValid={formData.buyer?.idNumber.isValid}
            ></ValidatedInput>
            <div class="ppxiss-row">
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingRight: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={clearValue}
                  validator={validateOnlyLetters}
                  errorMessage="Nombre inválido"
                  onChange={handleInputChange}
                  label="Nombre"
                  name="name"
                  placeholder="Nombre"
                  value={formData.buyer?.name.value}
                  isValid={formData.buyer?.name.isValid}
                ></ValidatedInput>
              </div>
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingLeft: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={clearValue}
                  validator={validateOnlyLetters}
                  errorMessage="Apellido inválido"
                  onChange={handleInputChange}
                  label="Apellido"
                  name="lastName"
                  placeholder="Nombre"
                  value={formData.buyer?.lastName.value}
                  isValid={formData.buyer?.lastName.isValid}
                ></ValidatedInput>
              </div>
            </div>

            <div class="ppxiss-row">
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingRight: "5px" }}
              >
                {/* <ValidatedInput
                  type="buyer"
                  validator={validateExpiryDate}
                  errorMessage="requerido"
                  onChange={handleInputChange}
                  label="País"
                  name="contryCode"
                  placeholder="Ingrese su país"
                  value={useCountrie}
                  isValid={formData.buyer?.countryCode.isValid}
                ></ValidatedInput> */}
                <MultiselectDefer
                  validator={validateCountrieSelection}
                  errorMessage="requerido"
                  onChange={handleInputChange}
                  label="País"
                  name="contryCode"
                  options={[
                    {
                      code: "ec",
                      name: "Ecuador",
                    },
                  ]}
                  initialValue={useCountrie}
                />
              </div>
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingLeft: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={resendModal || clearValue}
                  validator={validatePhoneNumber}
                  errorMessage="Número invalido"
                  onChange={handleInputChange}
                  label="Celular"
                  name="phone"
                  value={formData.buyer?.phone.value}
                  isValid={formData.buyer?.phone.isValid}
                ></ValidatedInput>
              </div>
            </div>

            <ValidatedInput
              type="buyer"
              reset={clearValue}
              validator={validateEmail}
              errorMessage="Correo inválido"
              onChange={handleInputChange}
              label="Correo"
              name="email"
              placeholder="Ingrese su correo electronico"
              value={formData.buyer?.email.value}
              isValid={formData.buyer?.email.isValid}
            ></ValidatedInput>

            <div class="ppxiss-row">
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingRight: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={clearValue}
                  validator={validateOnlyLetters}
                  errorMessage="Ciudad inválida"
                  onChange={handleInputChange}
                  label="Ciudad"
                  name="clientCity"
                  placeholder="Ingrese su ciudad"
                  value={formData.buyer?.city.value}
                  isValid={formData.buyer?.city.isValid}
                ></ValidatedInput>
              </div>
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingLeft: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={clearValue}
                  validator={validateLettersWithPoints}
                  errorMessage="Direccion invalida"
                  onChange={handleInputChange}
                  label="Dirección"
                  name="clientAddress"
                  placeholder="Ingrese su dirección"
                  value={formData.buyer?.state.value}
                  isValid={formData.buyer?.state.isValid}
                ></ValidatedInput>
              </div>
            </div>

            <div class="ppxiss-row">
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingRight: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={clearValue}
                  validator={validateLettersWithPoints}
                  errorMessage="Calle inválida"
                  onChange={handleInputChange}
                  label="Calle principal"
                  name="clientStreet"
                  placeholder="Ingrese su calle principal"
                  value={formData.buyer?.street.value}
                  isValid={formData.buyer?.street.isValid}
                ></ValidatedInput>
              </div>
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingLeft: "5px" }}
              >
                <ValidatedInput
                  type="buyer"
                  reset={clearValue}
                  validator={validateZipCode}
                  errorMessage="Codigo postal inválido"
                  onChange={handleInputChange}
                  label="Código Postal"
                  name="clientZipCode"
                  placeholder="Ingrese su codigo postal"
                  value={formData.buyer?.zipCode.value}
                  isValid={formData.buyer?.zipCode.isValid}
                ></ValidatedInput>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form id="ppxiss-car-form" class="ppxiss-row" onSubmit={onSubmit}>
          <div class="ppxiss-col">
            <ValidatedInput
              type="card"
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
              <div
                class="ppxiss-col ppxiss-col-6"
                style={{ paddingLeft: "5px" }}
              >
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
          </div>
        </form>
      )}

      <div class="ppxiss-row">
        <div class="ppxiss-col ppxiss-align-center">
          <SubmitButton
            form="ppxiss-car-form"
            activeButton={() => (isFormValid() as boolean) && !isLoading}
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
    </div>
  );
}
//#endregion
