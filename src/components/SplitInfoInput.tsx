import { useState } from "preact/hooks";
interface SplitInfoInputProps {
  validator?: (value: string) => boolean;
  errorMessage?: string;
  onChange: (value: boolean) => void;
  name?: string;
  label?: string;
  reset?: boolean;
  placeholder?: string;
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
    state: string;
    city: string;
    Zipcode: string;
    street: string;
  };
}

export const SplitInfoInput = ({ ...props }: SplitInfoInputProps) => {
  const [showMore, setShowMore] = useState(false);

  const handleChange = (event: boolean) => {
    if (!props.onChange) return;
    props.onChange(event);
  };
  return (
    <div>
      <textarea
        name=""
        id=""
        style={{
          height: "50px",
          width: "100%",
          resize: "none",
          position: "relative",
        }}
      >
        {JSON.stringify(props.value)}
      </textarea>
      <button
        onClick={() => handleChange(true)}
        style={{ position: "absolute", top: "14px", left: "180px" }}
      >
        desplegar
      </button>
    </div>
  );
};
