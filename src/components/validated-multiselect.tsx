import { useCallback, useId, useState } from "preact/hooks";

interface ValidatedSelectProps {
  validator: (value: string) => boolean;
  errorMessage?: string;
  onChange: (name: string, value: string, isValid: boolean) => void;
  name: string;
  block: boolean;
  label: string;
  options: any[];
  initialValue?: string;
  onSendSelectedValue?: (value: {
    code: string;
    installments: number[];
    name: string;
  }) => void;
}
const ValidatedMultiselect = ({ ...props }: ValidatedSelectProps) => {
  //@ts-ignore
  const [creditType, setCreditType] = useState<{
    code: string;
    name: string;
    installments?: number[];
  }>({
    code: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = useCallback(
    (event: any) => {
      if (!event.target) return "";
      const newValue = event.target.value;
      //obtener el objeto seleccionado

      setCreditType(newValue);
      const selectedValue: any = props.options.find(
        (option: any) => option.code === newValue
      );
      if (props.onSendSelectedValue) {
        props.onSendSelectedValue(selectedValue);
      }
      let isValid = true;
      let errorMsg: string | undefined = "";
      if (props.validator) {
        isValid = props.validator(newValue);
        errorMsg = isValid ? "" : props.errorMessage;
      }
      setError(errorMsg as string);
      props.onChange(props.name, newValue, isValid);
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
        disabled={props.block}
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

export default ValidatedMultiselect;
