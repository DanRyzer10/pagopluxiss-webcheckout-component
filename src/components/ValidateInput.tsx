import { CSSProperties } from "preact/compat";
import { useState, useCallback, useEffect } from "preact/hooks";
interface ValidatedInputProps {
  validator: (value: string) => boolean;
  errorMessage?: string;
  onChange: (
    name: any,
    value: any,
    isValid: any,
    target?: "card" | "buyer"
  ) => void;
  name: string;
  label: string;
  reset?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  block: boolean;
  isValid?: boolean;
  style?: CSSProperties; // Añadido para aceptar un objeto de estilo opcional
}
export const ValidatedInput = ({
  validator,
  errorMessage,
  onChange,
  name,
  label,
  reset,
  block,
  placeholder,
  style,
  type,
  value: initialValue = "",
  isValid: initialIsValid = true,
}: ValidatedInputProps) => {
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
        errorMsg = isValid ? "" : (errorMessage as string);
      }
      setError(errorMsg);

      onChange(name, newValue, isValid, (type as "card" | "buyer") || "card");
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
        style={style}
        type="text"
        value={value}
        onInput={handleChange}
        class={""}
        placeholder={placeholder}
        className={`ppxiss-input-component ${
          error ? "ppxiss-input-component-error" : "ppxiss-input-component-ok"
        }`}
      />
      {error && <p className="ppxiss-message-errors">{error}</p>}
    </div>
  );
};
