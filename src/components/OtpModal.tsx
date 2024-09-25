import { useState, useEffect } from 'preact/hooks';
import { validateOtp } from '../utils/validations';

export function OtpModal({ open, onAction, onOtpChange }: any) {
  const [visible, setVisible] = useState(open);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState({
    otp: '',
  });

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const handleOtpInputChange = (e: any) => {
    const newOtp = e.target.value;
    setOtp(newOtp);
    onOtpChange(newOtp);
  };

  const handleAction = async (e: any) => {
    e.preventDefault();
    const otpError = validateOtp(otp)?'':'Otp Invalido';
    if (otpError) {
      setError({ otp: otpError });
      return;
    }
    onAction();
    setVisible(false);
  };

  return (
    <dialog className='modal-container' open={visible}>
      <div className="modal-content">
        <h2>OTP Verification</h2>
        <p>Enter the OTP sent to your mobile number</p>
        <form onSubmit={handleAction}>
          <input
            type="text"
            value={otp}
            onInput={handleOtpInputChange}
            maxLength={6} // Limitar el OTP a 6 caracteres
            className="otp-input"
          />
          {error.otp && <span className='error-message'>{error.otp}</span>}

          <button 
            type="submit" 
            disabled={otp.length < 6} // Habilitar el botón solo cuando el OTP tenga más de 6 caracteres
            className={`submit-btn ${otp.length < 6 ? 'disabled-btn' : ''}`}
          >
            Enviar
          </button>
        </form>
      </div>
    </dialog>
  );
}
