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
          xmlns="http://www.w3.org/2000/svg"
          width="25px"
          viewBox="0 0 24 24"
        >
          <g id="id-card" style={{ fill: "#0085FF" }}>
            <path d="M19,18.75H5A1.76,1.76,0,0,1,3.25,17V7A1.76,1.76,0,0,1,5,5.25H19A1.76,1.76,0,0,1,20.75,7V17A1.76,1.76,0,0,1,19,18.75ZM5,6.75A.25.25,0,0,0,4.75,7V17a.25.25,0,0,0,.25.25H19a.25.25,0,0,0,.25-.25V7A.25.25,0,0,0,19,6.75Z" />
            <path d="M9,11.75a2,2,0,1,1,2-2A2,2,0,0,1,9,11.75Zm0-2.5a.5.5,0,1,0,.5.5A.5.5,0,0,0,9,9.25Z" />
            <path d="M12,15.75a.76.76,0,0,1-.75-.75c0-.68-.17-1.25-2.25-1.25S6.75,14.32,6.75,15a.75.75,0,0,1-1.5,0c0-2.75,2.82-2.75,3.75-2.75s3.75,0,3.75,2.75A.76.76,0,0,1,12,15.75Z" />
            <path d="M17,10.75H14a.75.75,0,0,1,0-1.5h3a.75.75,0,0,1,0,1.5Z" />
            <path d="M16,13.75H14a.75.75,0,0,1,0-1.5h2a.75.75,0,0,1,0,1.5Z" />
          </g>
        </svg>
      </button>
      {error && (
        <p className="ppxiss-message-errors">
          Completa tu información, para continuar presiona el ícono
        </p>
      )}
    </div>
  );
};
