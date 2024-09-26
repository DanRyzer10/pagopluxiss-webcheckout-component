import { useState, useCallback } from 'preact/hooks';

export const ValidatedInput = ({ validator, errorMessage, onChange, name,label, value: initialValue = '' }:any) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const handleChange = useCallback((e:any) => {
    const newValue = e.target.value;
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
   <div>
     <div className="ppxiss-input-field-container">
        {!error && <label className='ppx-iss-input-label' htmlFor="creditCard">{label}</label>}
      <input
        type="text"
        value={value}
        onInput={handleChange}
        placeholder='xxxx xxxx xxxx xxxx'
        className={`ppxiss-input-component ${error ? 'ppxiss-input-component-error' : 'ppxiss-input-component-ok'}`}
      />
      {error && <p className="ppxiss-message-errors">{error}</p>}
    </div>
   </div>
  );
};