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
    <div className="mb-4">
        <label htmlFor="creditCard">{label}</label>
      <input
        type="text"
        value={value}
        onInput={handleChange}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};