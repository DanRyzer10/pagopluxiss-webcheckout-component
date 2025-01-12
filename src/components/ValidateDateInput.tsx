import { useState, useCallback, useEffect } from "preact/hooks";

export const ValidateDateInput = ({
  validator,
  errorMessage,
  onChange,
  name,
  label,
  block,
  reset,
  value: initialValue = "",
}: any) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const formatDateValue = (newValue: string) => {
    const cleanValue = newValue.replace(/\D/g, "");
    if (cleanValue.length <= 2) {
      return cleanValue;
    }
    return cleanValue.slice(0, 2) + "/" + cleanValue.slice(2, 4);
  };

  const handleChange = useCallback(
    (e: any) => {
      let newValue = e.target.value;
      newValue = formatDateValue(newValue);
      setValue(newValue);
      let isValid = true;
      let errorMsg = "";
      if (validator) {
        isValid = validator(newValue);
        errorMsg = isValid ? "" : errorMessage;
      }
      setError(errorMsg);

      onChange(name, newValue, isValid, "card");
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
        disabled={block}
        type="text"
        id={name}
        value={value}
        placeholder={"MM/YY"}
        onInput={handleChange}
        className={`ppxiss-input-component ${
          error ? "ppxiss-input-component-error" : "ppxiss-input-component-ok"
        }`}
      />
      {error && <p className="ppxiss-message-errors">{error}</p>}
    </div>
  );
};
