import { useState, useEffect, useId, useRef } from "preact/hooks";
import { validateOtp } from "../utils/validations";

export function OtpModal({ open, onAction, onOtpChange,onResendOtp }: any) {
  const [visible, setVisible] = useState(open);
  const [block, setBlock] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({
    otp: "",
  });
  const dialogId: any = useId();
  const dialogRef: any = useRef(null);

  useEffect(() => {
    if(open){
      dialogRef.current.showModal()
    }else{
      dialogRef.current.close()
    }
    setVisible(open);
  }, [open]);

  const handleOtpInputChange = (e: any) => {
    const newOtp = e.target.value;
    setOtp(newOtp);
    onOtpChange(newOtp);
  };

  const handleResendOtp = async () =>{
    dialogRef.current.close()
    setVisible(false);
    setOtp("");
    onResendOtp();
  }

  const handleAction = async (e: any) => {
    e.preventDefault();
    setBlock(true)
    const otpError = validateOtp(otp) ? "" : "Otp Invalido";
    console.log(visible)
    if (otpError) {
      setError({ otp: otpError });
      return;
    }
    onAction();
    setVisible(false);
  };
  return (
    <dialog id={dialogId} className="ppxiss-modal-container" ref={dialogRef}>
      <div className="modal-content">
        <div class="ppxiss-modal-title">Ingresa tu código OTP</div>
        <form class='ppxiss-form-otp' onSubmit={handleAction}>
          <div class='ppxiss-input-container'>
            <input
              type="text"
              value={otp}
              onInput={handleOtpInputChange}
              maxLength={6} // Limitar el OTP a 6 caracteres
              className="ppxiss-otp-input"
            />
            {error.otp && <span className="error-message">{error.otp}</span>}
          </div>

          <div class='ppxiss-button-container'>
            <button
              type="submit"
              disabled={otp.length < 6 || block} // Habilitar el botón solo cuando el OTP tenga más de 6 caracteres
              className={`ppxiss-button-payiss-pay ppxiss-medium-width ${
                otp.length < 6 || block
                  ? "ppxiss-button-inactive"
                  : "ppxiss-button-active"
              }`}
            >
              <span>Confirmar</span>
            </button>
          </div>
          <span class='ppxiss-footer-info'>
            ¿No recibiste tu código OTP?
          </span><br />
          <span onClick={handleResendOtp} class='ppxiss-footer-info-resend'>
              Haz clic aquí para solicitar nuevo código
          </span>
        </form>
      </div>
    </dialog>
  );
}
