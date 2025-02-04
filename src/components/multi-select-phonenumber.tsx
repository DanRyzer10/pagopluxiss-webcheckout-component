import { useEffect, useState } from "preact/hooks";
import useGetCountries from "../api/use-get-countries";
interface ValidatedSelectCountryProps {
  validator: (value: string) => boolean;
  errorMessage?: string;
  onChange: (
    name: any,
    value: any,
    //@ts-ignore
    isValid: any,
    target: "card" | "buyer"
  ) => void;
  name: string;
  label: string;
  type?: "card" | "buyer";
  initialValue?: CountryOption;
}
interface CountryOption {
  attributes: {
    code: string;
    name: string;
    number: string;
    createdAt: string;
    updatedAt: string;
    timezone: string;
    gmt: string;
    currency: string;
    tax: number;
    icon: string;
  };
}

const ValidatedMultiSelectPhoneNumber = ({
  validator,
  errorMessage,
  type,
  onChange,
  name,
  initialValue = {
    attributes: {
      code: "",
      name: "",
      number: "",
      createdAt: "",
      updatedAt: "",
      timezone: "",
      gmt: "",
      currency: "",
      tax: 0,
      icon: "",
    },
  },
}: ValidatedSelectCountryProps) => {
  const [options, setOptions] = useState<CountryOption[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<CountryOption>(initialValue);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const currCountrie = localStorage.getItem("c_cc");
  useEffect(() => {
    if (currCountrie) {
      setSelectedOption(JSON.parse(currCountrie));
    }
  }, []);
  const fetchOptions = async (page: number) => {
    try {
      const callCountries = useGetCountries(page);
      const data: any = await callCountries.getCountries();
      if (data.data.length > 0) {
        setOptions((prevOptions) => [...prevOptions, ...data.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleFocus = () => {
    if (options.length === 0) {
      fetchOptions(currentPage);
    }
  };
  const handleScroll = (event: any) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom && hasMore && currentPage < 3) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchOptions(nextPage);
    }
  };

  const handleSelect = (option: CountryOption) => {
    setSelectedOption(option);
    const isValid = validator(option.attributes.code);
    const errorMsg = isValid ? "" : errorMessage;
    setError(errorMsg || "");
    onChange(name, option.attributes.code, isValid, type || "card");
    setIsOpen(false);
  };

  return (
    <div className="ppxiss-input-field-container ">
      <label className="ppx-iss-input-label">Celular</label>
      <div
        className={`custom-dropdown-alter w-100 ${
          error ? "ppxiss-input-component-error" : "ppxiss-input-component-ok"
        }`}
        onClick={handleFocus}
      >
        <div
          className="dropdown-header-alter"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedOption.attributes?.code ? (
            <span>{`+${selectedOption.attributes.number} `}</span>
          ) : (
            "+"
          )}
        </div>
        {isOpen && (
          <ul className="dropdown-list" onScroll={handleScroll}>
            {options.map((option: any) => (
              <li
                key={option.attributes.code}
                className="dropdown-item"
                onClick={() => handleSelect(option)}
              >
                {`+${option.attributes.number}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="ppxiss-error-message">{error}</div>}
    </div>
  );
};

export default ValidatedMultiSelectPhoneNumber;
