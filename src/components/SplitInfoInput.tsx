import { useCallback, useEffect, useState } from "preact/hooks";

interface SplitInfoInputProps {
  validator?: (value: string) => boolean;
  errorMessage?: string;
  onChange: (value: boolean) => void;
  name?: string;
  label?: string;
  reset?: boolean;
  placeholder?: string;
  invalid: boolean;
  value: {
    document_type: string;
    identity: string;
    names: string;
    lastnames: string;
    email: string;
    countrycode: string;
    phonenumber: string;
    ipaddress: string;
    country: string;
    state?: string;
    city: string;
    Zipcode?: string;
    street: string;
  };
}

export const SplitInfoInput = ({ ...props }: SplitInfoInputProps) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    if (props.invalid) {
      setError(true);
    } else {
      setError(false);
    }
  }, [props.invalid]);
  const handleChange = useCallback(
    (event: boolean) => {
      if (!props.onChange) return;
      props.onChange(event);
      if (props.invalid) {
        setError(true);
      }
    },
    [props]
  );
  return (
    <div>
      {!error && (
        <label className="ppx-iss-input-label-textarea" htmlFor="creditCard">
          {props.label}
        </label>
      )}
      <textarea
        className={`ppxiss-input-component ${
          error ? "ppxiss-input-component-error" : "ppxiss-input-component-ok"
        }`}
        readonly
        name=""
        id=""
        style={{
          height: "50px",
          width: "100%",
          resize: "none",
          position: "relative",
        }}
      >
        {`${props.value.names} ${props.value.lastnames}\n${props.value.phonenumber}`}
      </textarea>
      <button
        onClick={() => handleChange(true)}
        className="ppxiss-button-split-info"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13 11.7V7.15H11.7V11.7H1.3V1.3H5.85V0H1.3C0.58203 0 0 0.58203 0 1.3V11.7C0 12.418 0.58203 13 1.3 13H11.7C12.418 13 13 12.418 13 11.7ZM11.1658 0.470225C10.8678 0.169923 10.4599 0 10.0343 0C9.60917 0 9.20165 0.169539 8.902 0.471008L3.46222 5.91072C2.97613 6.33902 2.65748 6.97634 2.6021 7.66175L2.59999 9.75152V10.4015H5.28748C6.02478 10.3509 6.66836 10.0292 7.12237 9.50544L12.5313 4.09879C12.8314 3.7987 13 3.39169 13 2.9673C13 2.54291 12.8314 2.1359 12.5313 1.83581L11.1658 0.470225ZM5.2416 9.10314C5.58884 9.07855 5.91207 8.91695 6.17162 8.62006L10.1118 4.67983L8.32156 2.88944L4.35247 6.85723C4.08913 7.09015 3.92621 7.416 3.90001 7.71409V9.10191L5.2416 9.10314ZM9.24095 1.97035L11.0311 3.76059L11.6121 3.17955C11.6684 3.12326 11.7 3.04691 11.7 2.9673C11.7 2.88769 11.6684 2.81134 11.6121 2.75505L10.2447 1.38766C10.1891 1.33156 10.1133 1.3 10.0343 1.3C9.95525 1.3 9.87949 1.33156 9.82383 1.38766L9.24095 1.97035Z"
            fill="#0085FF"
          />
        </svg>
      </button>
      {error && (
        <p className="ppxiss-message-errors">
          Campos obligatorios incompletos, favor de editarlos.
        </p>
      )}
    </div>
  );
};
