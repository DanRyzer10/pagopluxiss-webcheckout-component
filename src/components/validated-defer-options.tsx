import { useCallback, useId, useState } from "preact/hooks";

interface ValidatedDeferOptions {
  validator: (value: string) => boolean;
  errorMessage?: string;
  onChange: (name: string, value: string, isValid: boolean) => void;
  name: string;
  label: string;
  options: any[];
  initialValue?: string;
  onSendSelectedValue?: (value: {
    code: string;
    installments: number[];
    name: string;
  }) => void;
}
const ValidatedDefer = ({ ...props }: ValidatedDeferOptions) => {
  //@ts-ignore
  const [creditType, setCreditType] = useState<{
    code: string;
    name: string;
    installments?: number[];
  }>({
    code: "",
    name: "",
  });
  //@ts-ignore
  const [error, setError] = useState("");

  const handleChange = useCallback(
    (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const value = target.value;
      const isValid = true;
      setError(isValid ? "" : props.errorMessage || "Invalid value");
      props.onChange(props.name, value, isValid);
    },
    [props.validator, props.errorMessage, props.onChange, props.name]
  );
  const id = useId();
  return (
    <div class={"ppxiss-input-field-container"}>
      {!error && (
        <label className="ppx-iss-input-label" htmlFor={id}>
          {props.label}
        </label>
      )}
      <select
        placeholder={"seleccione una opción"}
        onChange={handleChange}
        class={""}
        name="multiselect-option"
        className={`w-100 ppxiss-select ${
          error ? "ppxiss-input-component-error" : "ppxiss-input-component-ok "
        }`}
        id={id}
      >
        {props.options.map((option: any) => (
          <option value={option.code} key={option.code}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <div className="ppxiss-error-message">{error}</div>}
    </div>
  );
};

export default ValidatedDefer;
