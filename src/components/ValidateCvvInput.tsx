import { useState, useCallback} from 'preact/hooks';

export const ValidateCvvInput = ({ validator, errorMessage, onChange, name,label, value: initialValue = '' }:any) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const formatOtpValue = (newValue:string) =>{
    const cleanValue = newValue.replace(/\D/g, '');
   return cleanValue;
  }

  const handleChange = useCallback((e:any) => {
    let newValue = e.target.value;
    newValue = formatOtpValue(newValue);
    setValue(newValue);
    let isValid = true;
    let errorMsg = '';
    if (validator) {
      isValid = validator(newValue);
      errorMsg = isValid ? '' : errorMessage;
    }
    setError(errorMsg);

    onChange(name, newValue, isValid);
  }, [validator, errorMessage, onChange, name]);
  return (
    <div className="ppxiss-input-field-container">
          {!error && <label className='ppx-iss-input-label' htmlFor="creditCard">{label}</label>}
      <input
        type="password"
        value={value}
        onInput={handleChange}
        placeholder='CVV'
        className={`ppxiss-input-component ${error ? 'ppxiss-input-component-error' : 'ppxiss-input-component-ok'}`}
      />
      {error && <p className="ppxiss-message-errors">{error}</p>}
    </div>
  );
};