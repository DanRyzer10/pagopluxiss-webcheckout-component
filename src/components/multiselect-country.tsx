import { useEffect, useState, useRef } from "preact/hooks";
import useGetCountries from "../api/use-get-countries";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ValidatedSelectCountryProps {
  validator: (value: string) => boolean;
  errorMessage?: string;
  onChange: (
    name: any,
    value: any,
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

const ValidatedMultiselectCountry = ({
  validator,
  errorMessage,
  onChange,
  name,
  label,
  type,
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
  const [filteredOptions, setFilteredOptions] = useState<CountryOption[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<CountryOption>(initialValue);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedCountry = localStorage.getItem("c_cc");
    if (storedCountry) {
      setSelectedOption(JSON.parse(storedCountry));
    }
    handleFetchCountries();
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFetchCountries = async () => {
    try {
      setIsLoading(true);
      const promises = [1, 2, 3].map(fetchOptions);
      const results = await Promise.all(promises);
      const allOptions = results.flat();
      setOptions(allOptions);
      setFilteredOptions(allOptions);
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptions = async (page: number): Promise<CountryOption[]> => {
    const callCountries = useGetCountries(page);
    const data: any = await callCountries.getCountries();
    return data.data || [];
  };

  useEffect(() => {
    localStorage.setItem("c_cc", JSON.stringify(selectedOption));
  }, [selectedOption]);

  const handleSelect = (option: CountryOption) => {
    setSelectedOption(option);
    const isValid = validator(option.attributes.code);
    setError(isValid ? "" : errorMessage || "");
    onChange(name, option.attributes.code, isValid, type || "card");
    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const handleSearch = (event: any) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchText(searchValue);
    setFilteredOptions(
      options.filter((option) =>
        option.attributes.name.toLowerCase().includes(searchValue)
      )
    );
  };

  return (
    <div ref={dropdownRef}>
      {isLoading ? (
        <Skeleton height={34} style={{ borderRadius: 20 }} />
      ) : (
        <div className="ppxiss-input-field-container">
          <label className="ppx-iss-input-label">{label}</label>
          <div
            className={`custom-dropdown ${
              error
                ? "ppxiss-input-component-error"
                : "ppxiss-input-component-ok"
            }`}
          >
            <div
              className={isOpen ? "dropdown-header p-0" : "dropdown-header"}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? (
                <input
                  ref={inputRef}
                  style={{ width: "100%" }}
                  type="text"
                  value={searchText}
                  onChange={handleSearch}
                  placeholder="Buscar país"
                  className="dropdown-search"
                  autoFocus
                />
              ) : (
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: selectedOption.attributes.icon,
                    }}
                    style={{ marginRight: "8px" }}
                  />
                  {selectedOption.attributes.name.length > 8
                    ? selectedOption.attributes.name.substring(0, 8) + "..."
                    : selectedOption.attributes.name}
                </span>
              )}
            </div>
            {isOpen && (
              <ul className="dropdown-list">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option.attributes.code}
                      className="dropdown-item"
                      onClick={() => handleSelect(option)}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: option.attributes.icon,
                        }}
                        style={{ marginRight: "8px" }}
                      />
                      {option.attributes.name}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-not-found">Sin resultados</li>
                )}
              </ul>
            )}
          </div>
          {error && <div className="ppxiss-error-message">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default ValidatedMultiselectCountry;
