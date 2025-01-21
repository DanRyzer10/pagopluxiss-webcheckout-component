/**
 * @fileoverview
 * @name app.tsx
 * @description Este archivo contiene el componente principal de la aplicacion.
 *  Este componente se encarga de renderizar el formulario de pago y de gestionar la logica de negocio
 * para realizar el pago.
 * @author Angel Zambrano
 * @version 0.1.0 */
/*
 */

// #region IMPORTS
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import "bootstrap/dist/css/bootstrap.min.css";
import SvgIcon from "./img/issLogo";
import {
  validateCardNumber,
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
import ValidatedMultiselect from "./components/validated-multiselect";
import ValidatedDefer from "./components/validated-defer-options";
import ValidatedMultiselectCountry from "./components/multiselect-country";
import ValidatedMultiSelectPhoneNumber from "./components/multi-select-phonenumber";
import { PaymentHandler } from "./modules/payment-handler";
// #endregion

// #region COMPONENT APP
export function PaymentButton({
  config,
  services,
  onError,
}: PaymentButtonProps) {
  // #region variables reactivas
  const [formData, setFormData] = useState<IFormData>({
    card: {
      number: { value: "", isValid: false },
      expirationDate: { value: "", isValid: false },
      cvv: { value: "", isValid: false },
      creditType: { value: "", isValid: true },
    },
    buyer: {
      name: { value: "", isValid: false },
      lastName: { value: "", isValid: false },
      email: { value: "", isValid: false },
      phone: { value: "", isValid: false },
      address: { value: "", isValid: false },
      city: { value: "", isValid: false },
      country: { value: "", isValid: false },
      phoneCode: { value: "", isValid: false },
      countryCode: { value: "", isValid: false },
      // street: { value: "", isValid: false },
      number: { value: "", isValid: false },
      idNumber: { value: "", isValid: false },
      idType: { value: "", isValid: true },
    },
  });

  useEffect(() => {
    const countryCode: any = localStorage.getItem("c_cc");
    setFormData({
      card: {
        number: { value: "", isValid: false },
        expirationDate: { value: "", isValid: false },
        cvv: { value: "", isValid: false },
        creditType: {
          value: config.installmentCredit
            ? config.installmentCredit[0].code
            : "",
          isValid: true,
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
          value: (config.shipping_address.street as string) || "",
          isValid: validateLettersWithPoints(
            config.shipping_address.street as string
          ),
        },
        country: {
          value: countryCode?.attributes?.code || config.buyer.countrycode,
          isValid: true,
        },
        phoneCode: {
          value: countryCode?.attributes?.number || config.buyer.countrycode,
          isValid: true,
        },
        city: {
          value: config.shipping_address.city || "",
          isValid: validateLettersWithPoints(config.shipping_address.city),
        },
        countryCode: {
          value: config.buyer.countrycode,
          isValid: validateLettersWithPoints(config.shipping_address.country),
        },

        number: {
          value: config.shipping_address.number
            ? config.shipping_address.number
            : "",
          isValid: validateZipCode(config.shipping_address.number as string),
        },
        idNumber: {
          value: config.buyer.identity,
          isValid: cityIdValidation(config.buyer.identity),
        },
        idType: { value: config.buyer.document_type, isValid: true },
      },
    });
  }, [config]);
  //@ts-ignore
  const [payload, setPayload] = useState<payloadppx>();
  const [resendModal, setResendModal] = useState(false);
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [responseppx, setResponse] = useState<responseppx>();
  const [isLoading, setIsLoading] = useState(false);
  //@ts-ignore
  const [clearValue, setClearValue] = useState(false);
  const [otp, setOtp] = useState("");
  const [isDefer, setisDefer] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [deferOptions, setDeferOptions] = useState<IDeferOptions[]>([]);
  const [useCountrie, setUserCountrie] = useState<any>();
  //const [showMore, setShowMore] = useState(false);
  const [selectedCreditType, setSelectedCreditType] = useState<{
    code: string;
    installments: number[];
    name: string;
  }>(
    config.installmentCredit
      ? config.installmentCredit[0]
      : { code: "", installments: [], name: "" }
  );
  /**
   * @description Funcion que se encarga de manejar el cambio de la opcion seleccionada en el campo de tipo de credito
   * @param value - Valor del campo
   */
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
          deferPay: { value: installments[0], isValid: true },
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
      //@ts-ignore
      isValid: any,
      target: "card" | "buyer" = "card"
    ) => {
      //@ts-ignore
      setFormData((prevData: any) => ({
        ...prevData,
        [target]: {
          ...prevData[target as any],
          [name]: { value, isValid: isValid },
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
  /**
   * @description Valida si los campos del formulario del comprador son validos
   * @returns {boolean} - Retorna true si todos los campos del formulario del comprador son validos
   * @memberof PaymentButton
   */
  const validateBuyerInfo = useMemo(() => {
    console.log("formData.buyer: ", formData);
    return (
      formData.buyer &&
      Object.values(formData.buyer).every((field) => field.isValid)
    );
  }, [formData.buyer]);

  const ConvertToPayload = useConvertToPayload(formData, config, setPayload);
  // #region POSTDATA FORM

  /**
   * @description Funcion que se encarga de enviar los datos del formulario al servidor
   * @param e
   * @param action  - accion a realizar. envio de datos o validacion de otp
   */
  const handleSubmit = async (e: any, action: "submit" | "otp") => {
    e.preventDefault();
    setIsLoading(true);
    if (isFormValid()) {
      const payload: any = await ConvertToPayload();
      if (action === "otp") {
        console.log("payload response: ", responseppx);
        payload.paramsOtp = {
          //@ts-ignore
          ...responseppx?.detail,
          otpCode: otp,
        };
      }
      try {
        const paymentHandler = new PaymentHandler(config, onError);
        const response = await paymentHandler.initializePayment(
          services.service_bridge,
          payload
        );
        if (response?.status == "PENDING_OTP") {
          setVisibleModal(true);
          setResponse(response.response);
        }
      } catch (e) {
        console.error(e);
        onError("Error al procesar el pago");
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
    const currCountrieCode: any = config.buyer.countrycode;
    let isFetched = localStorage.getItem("fe_cou");
    if (!showMoreInfo && !isFetched) {
      const { getCountrie } = useFindCountrieByNumber(currCountrieCode);
      getCountrie().then((response) => {
        if (response?.data.length > 0) {
          const countrieName = response?.data[0];
          localStorage.setItem("c_cc", JSON.stringify(countrieName));
          setUserCountrie(countrieName);
          localStorage.setItem("fe_cou", "ok");
        } else {
          setUserCountrie("No encontrado");
        }
      });
    }
  }, [showMoreInfo, config]);
  /**
   * @description Funcion que se encarga de reenviar el otp al servidor.limpia el formulario de cvv
   * @memberof PaymentButton
   *
   */
  const resendOtp = () => {
    setVisibleModal(false);
    setResendModal(true);
  };
  //#region JSX
  return (
    <div className="container w-100">
      <OtpModal
        onResendOtp={resendOtp}
        open={isVisibleModal}
        onAction={onSendDataWithOtp}
        onOtpChange={handleOtp}
      ></OtpModal>

      <div class="row mb-1">
        <div class="col text-align-center d-flex justify-content-center align-items-center text-center">
          <span class=" ppxiss-text-header-info">
            Estás realizando un pago para
            <br />
            <span class=" ppxiss-text-header-info ppxiss-text-strong">
              {config.business.name}
            </span>
          </span>
        </div>
      </div>
      <div class={"row mb-1"}>
        <div class={"col d-flex text-align-center px-4 justify-content-center"}>
          <CardBrand
            cardNumber={formData?.card?.number?.value || ""}
            expiredDate={formData?.card?.expirationDate.value || ""}
            names={formData.buyer?.name.value || ""}
            lastnames={formData.buyer?.lastName.value || ""}
          />
        </div>
      </div>
      {showMoreInfo ? (
        <div class={"ppxiss-moreinfo-container"}>
          <label className="float-label">Propietario de Tarjeta</label>
          <div class={"col px-2 pt-2 "}>
            <ValidatedInput
              block={isLoading}
              type="buyer"
              validator={cityIdValidation}
              errorMessage="Solo se admiten números"
              onChange={handleInputChange}
              label="Cédula, RUC o Pasaporte"
              name="idNumber"
              placeholder="Ingrese su numero de identificación"
              value={formData.buyer?.idNumber.value}
              isValid={formData.buyer?.idNumber.isValid}
            ></ValidatedInput>
          </div>
          <div class={"row px-2 "}>
            <div class={"col "}>
              <ValidatedInput
                block={isLoading}
                type="buyer"
                reset={clearValue}
                validator={validateOnlyLetters}
                errorMessage="Solo se admiten letras"
                onChange={handleInputChange}
                label="Nombre"
                name="name"
                placeholder="Nombre"
                value={formData.buyer?.name.value}
                isValid={formData.buyer?.name.isValid}
              ></ValidatedInput>
            </div>
            <div class={"col"}>
              <ValidatedInput
                block={isLoading}
                type="buyer"
                reset={clearValue}
                validator={validateOnlyLetters}
                errorMessage="Solo se admiten letras"
                onChange={handleInputChange}
                label="Apellido"
                name="lastName"
                placeholder="Nombre"
                value={formData.buyer?.lastName.value}
                isValid={formData.buyer?.lastName.isValid}
              ></ValidatedInput>
            </div>
          </div>

          <div class={"row px-2 "}>
            <div class={"col"}>
              <ValidatedInput
                block={isLoading}
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
            </div>
          </div>

          <div class={"row px-2 "}>
            <div class={"col-4 pe-0"}>
              <ValidatedMultiSelectPhoneNumber
                validator={(value: any) =>
                  value.code !== "" && value.name !== ""
                }
                errorMessage="Número inválido"
                type="buyer"
                onChange={handleInputChange}
                label="Teléfono"
                name="phoneCode"
                initialValue={useCountrie}
              />
            </div>
            <div class={"col-8 ps-0"}>
              <ValidatedInput
                block={isLoading}
                type="buyer"
                style={{ borderRadius: "0px 20px 20px 0", height: "37px" }}
                reset={clearValue}
                validator={validatePhoneNumber}
                errorMessage="Número inválido"
                onChange={handleInputChange}
                label="Número"
                name="phone"
                placeholder="Ingrese su número de teléfono"
                value={formData.buyer?.phone.value}
                isValid={formData.buyer?.phone.isValid}
              />
            </div>
          </div>

          <div class={"row px-2 "}>
            <div class={"col "}>
              <ValidatedMultiselectCountry
                validator={(value: string) => value.length > 0}
                type="buyer"
                errorMessage="Seleccionar país"
                onChange={handleInputChange}
                label="País"
                name="country"
                initialValue={useCountrie}
              />
            </div>
            <div class={"col"}>
              <ValidatedInput
                block={isLoading}
                type="buyer"
                reset={clearValue}
                validator={validateOnlyLetters}
                errorMessage="Solo se admiten letras"
                onChange={handleInputChange}
                label="Ciudad"
                name="city"
                placeholder="Ingrese su ciudad"
                value={formData.buyer?.city.value}
                isValid={formData.buyer?.city.isValid}
              ></ValidatedInput>
            </div>
          </div>

          <div class={"row px-2 "}>
            <div class={"col "}>
              <ValidatedInput
                block={isLoading}
                type="buyer"
                reset={clearValue}
                validator={validateLettersWithPoints}
                errorMessage="Caracter no permitido"
                onChange={handleInputChange}
                label="Dirección"
                name="address"
                placeholder="Ingrese su dirección"
                value={formData.buyer?.address.value}
                isValid={formData.buyer?.address.isValid}
              ></ValidatedInput>
            </div>
            <div class={"col"}>
              <ValidatedInput
                block={isLoading}
                type="buyer"
                reset={clearValue}
                validator={validateZipCode}
                errorMessage="Máx. 3 números"
                onChange={handleInputChange}
                label="Número"
                name="number"
                placeholder="Ingrese su número de casa"
                value={formData.buyer?.number.value}
                isValid={formData.buyer?.number.isValid}
              ></ValidatedInput>
            </div>
          </div>

          <div class={"row"}>
            <div class={"col d-flex justify-content-center"}>
              <button
                class={"ppxiss-moreinfo-button"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#212121",
                }}
                onClick={onShowMoreInfo}
              >
                continuar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <form id="ppxiss-card-form" class={""} onSubmit={onSubmit}>
            <div class={"col"}>
              <ValidatedInput
                block={isLoading}
                type="card"
                reset={clearValue}
                validator={validateCardNumber}
                errorMessage="Número de tarjeta inválido"
                onChange={handleInputChange}
                label="Número de tarjeta"
                name="number"
                placeholder="Ingrese su número de tarjeta"
                value={formData.card.number.value}
              ></ValidatedInput>
            </div>
            <div class={"row "}>
              <div class={"col "}>
                <ValidateDateInput
                  block={isLoading}
                  reset={clearValue}
                  validator={validateExpiryDate}
                  errorMessage="Fecha de expiración inválida"
                  onChange={handleInputChange}
                  label="Fecha de expiración"
                  name="expirationDate"
                  value={formData.card.expirationDate.value}
                ></ValidateDateInput>
              </div>
              <div class={"col"}>
                <ValidateCvvInput
                  block={isLoading}
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

            <div class={"row mb-1"}>
              <div class={"col"}>
                <ValidatedMultiselect
                  block={isLoading}
                  validator={(value: string) => value.length > 0}
                  errorMessage="Seleccione un tipo de credito"
                  onChange={handleInputChange}
                  onSendSelectedValue={handleSelectedCreditType}
                  label="Tipo de Crédito"
                  name="creditType"
                  options={config.installmentCredit || []}
                  initialValue={""}
                />
              </div>
            </div>
            {isDefer && (
              <div class={"row mb-1"}>
                <div class={"col"}>
                  <ValidatedDefer
                    block={isLoading}
                    validator={(value: string) => value.length > 0}
                    errorMessage="Seleccione un plazo"
                    onChange={handleInputChange}
                    label="Plazo"
                    name="deferPay"
                    options={deferOptions}
                    initialValue={""}
                  />
                </div>
              </div>
            )}
          </form>
          <div class={"row mb-1"}>
            <div class={"col position-relative "}>
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
        </div>
      )}
      <div class={"row"}>
        <div class={"col d-flex justify-content-center"}>
          {!showMoreInfo && (
            <SubmitButton
              form="ppxiss-card-form"
              activeButton={() => (isFormValid() as boolean) && !isLoading}
              disabledButton={() => !isFormValid() || isLoading}
            >
              <div class="d-flex justify-content-center align-items-center">
                <span style={{ marginRight: "5px" }}>
                  {config.module === "TOKENIZATION"
                    ? "Registrar tarjeta"
                    : `Pagar ${config.total_amount} ${config.currency}`}
                </span>
                {isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                    width="17"
                    height="17"
                    style="shape-rendering: auto; display: block; background: transparent;"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g>
                      <circle
                        stroke-dasharray="164.93361431346415 56.97787143782138"
                        r="35"
                        stroke-width="10"
                        stroke="#ffffff"
                        fill="none"
                        cy="50"
                        cx="50"
                      >
                        <animateTransform
                          keyTimes="0;1"
                          values="0 50 50;360 50 50"
                          dur="3.7037037037037033s"
                          repeatCount="indefinite"
                          type="rotate"
                          attributeName="transform"
                        ></animateTransform>
                      </circle>
                      <g></g>
                    </g>
                  </svg>
                )}
              </div>
            </SubmitButton>
          )}
        </div>
      </div>
      <div class={"row"}>
        <div class={"col d-flex justify-content-center"}>
          <SvgIcon></SvgIcon>
        </div>
      </div>
    </div>
  );
}
//#endregion
