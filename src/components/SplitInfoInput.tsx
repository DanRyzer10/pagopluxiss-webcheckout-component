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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#1451BE"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.9069 4.92989C18.0112 4.82535 18.2012 4.74414 18.4458 4.74963C18.6905 4.75513 18.8987 4.84637 19.0183 4.9662C19.1471 5.09512 19.2398 5.30622 19.2492 5.54097C19.2586 5.77467 19.1839 5.95399 19.082 6.05628L19.0818 6.05648L11.5919 13.5561L10.319 13.6718L10.4192 12.4273L17.9068 4.92999L17.9069 4.92989ZM20.0799 3.90643C19.6427 3.46848 19.0428 3.26267 18.4795 3.25001C17.916 3.23735 17.2979 3.41685 16.8454 3.87002L16.8453 3.87012L9.16307 11.5623C9.03732 11.6882 8.96044 11.8548 8.94616 12.0322L8.75242 14.4392C8.73467 14.6597 8.81518 14.8768 8.97242 15.0324C9.12967 15.1881 9.34759 15.2663 9.56791 15.2463L11.9984 15.0253C12.1733 15.0094 12.3371 14.9326 12.4612 14.8084L20.1435 7.11606L20.1439 7.11566C20.5988 6.6595 20.7705 6.04292 20.748 5.48094C20.7256 4.91987 20.508 4.3353 20.0799 3.90643ZM5.81198 4.74999C4.40089 4.74999 3.24948 5.9014 3.24948 7.31249V18.1875C3.24948 19.5986 4.40089 20.75 5.81198 20.75H16.687C18.0981 20.75 19.2495 19.5986 19.2495 18.1875V12.75C19.2495 12.3358 18.9137 12 18.4995 12C18.0853 12 17.7495 12.3358 17.7495 12.75V18.1875C17.7495 18.7702 17.2696 19.25 16.687 19.25H5.81198C5.22932 19.25 4.74948 18.7702 4.74948 18.1875V7.31249C4.74948 6.72983 5.22932 6.24999 5.81198 6.24999H11.2495C11.6637 6.24999 11.9995 5.9142 11.9995 5.49999C11.9995 5.08578 11.6637 4.74999 11.2495 4.74999H5.81198Z"
            fill="#1451BE"
          />
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
