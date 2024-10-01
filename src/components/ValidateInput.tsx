import { useState, useCallback, useEffect } from "preact/hooks";

export const ValidatedInput = ({
  validator,
  errorMessage,
  onChange,
  name,
  label,
  reset,
  placeholder,
  value: initialValue = "",
  isValid: initialIsValid = true,
}: any) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(initialIsValid ? "" : errorMessage);

  const handleChange = useCallback(
    (e: any) => {
      const newValue = e.target.value;
      setValue(newValue);

      let isValid = true;
      let errorMsg = "";
      if (validator) {
        isValid = validator(newValue);
        errorMsg = isValid ? "" : errorMessage;
      }
      setError(errorMsg);

      onChange(name, newValue, isValid);
    },
    [validator, errorMessage, onChange, name]
  );

  useEffect(() => {
    if (reset) {
      setValue("");
      setError("");
    }
  }, [reset]);

  return (
    <div className="ppxiss-input-field-container">
      {!error && (
        <label className="ppx-iss-input-label" htmlFor="creditCard">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onInput={handleChange}
        placeholder={placeholder}
        className={`ppxiss-input-component ${
          error ? "ppxiss-input-component-error" : "ppxiss-input-component-ok"
        }`}
      />
      {error && <p className="ppxiss-message-errors">{error}</p>}
    </div>
  );
};
