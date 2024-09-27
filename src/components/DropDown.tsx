import { useState, useCallback } from 'preact/hooks';

interface Option {
  key: string;
  value: string;
}

interface ValidatedDropdownProps {
  validator?: (value: string) => boolean;
  errorMessage?: string;
  onChange: (name: string, value: string, isValid: boolean) => void;
  name: string;
  label: string;
  options: Option[];
  initialValue?: string;
}

export const ValidatedDropdown = ({
  validator,
  errorMessage,
  onChange,
  name,
  label,
  options
}: ValidatedDropdownProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = useCallback((e: any) => {
    const newValue = e.target.value;
    setValue(newValue);

    let isValid = true;
    let errorMsg:any = '';
    if (validator) {
      isValid = validator(newValue);
      errorMsg = isValid ? '' : errorMessage;
    }
    setError(errorMsg);

    onChange(name, newValue, isValid);
  }, [validator, errorMessage, onChange, name]);

  return (
    <div className="ppxiss-input-field-container">
      {!error && <label className='ppx-iss-input-label' htmlFor={name}>{label}</label>}
      <select placeholder='selecciona una opcion' value={value} onChange={handleChange} id={name}>
        {options.map((option) => (
          <option selected key={option.key} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
      {error && <span className="ppxiss-error-message">{error}</span>}
    </div>
  );
};