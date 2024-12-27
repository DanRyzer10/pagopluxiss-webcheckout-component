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
          width="14"
          height="11"
          viewBox="0 0 14 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.0833 1.83333C13.5896 1.83333 14 1.42293 14 0.916667C14 0.410406 13.5896 0 13.0833 0H0.916666C0.410406 0 0 0.410406 0 0.916667C0 1.42293 0.410405 1.83333 0.916666 1.83333H13.0833ZM13.0833 4.58333C13.5896 4.58333 14 4.99374 14 5.5C14 6.00626 13.5896 6.41667 13.0833 6.41667H0.916667C0.410406 6.41667 0 6.00626 0 5.5C0 4.99374 0.410405 4.58333 0.916666 4.58333H13.0833ZM13.0833 9.16667C13.5896 9.16667 14 9.57707 14 10.0833C14 10.5896 13.5896 11 13.0833 11H0.916666C0.410405 11 0 10.5896 0 10.0833C0 9.57707 0.410405 9.16667 0.916666 9.16667H13.0833Z"
            fill="#212121"
          />
        </svg>
      </button>
      {error && (
        <p className="ppxiss-message-errors">
          parametros invalidos, por favor revisar
        </p>
      )}
    </div>
  );
};
