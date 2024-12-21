import { MenuItem, InputLabel, FormControl, Select, Box } from "@mui/material";
import { useCallback, useState, useEffect } from "preact/hooks";
import useGetCountries from "../api/use-get-countries";

interface ValidatedDropdownProps {
  validator?: (value: { code: string; name: string }) => boolean;
  errorMessage?: string;
  onChange: (name: string, value: string, isValid: boolean) => void;
  name: string;
  label: string;
  options: any[];
  value?: {
    code: string;
    name: string;
  };
  initialValue?: string;
  onSendSelectedValue?: (value: {
    code: string;
    installments: number[];
    name: string;
  }) => void;
}

export default function MultiselectDefer({
  validator,
  errorMessage,
  onChange,
  value,
  name,
  label,
  options,
  initialValue,
  onSendSelectedValue,
}: ValidatedDropdownProps) {
  const [selectValue, setSelectValue] = useState<any>(
    initialValue || value?.code || ""
  );

  useEffect(() => {
    if (initialValue) {
      setSelectValue(initialValue);
    }
  }, [initialValue]);

  const [error, setError] = useState("");
  const fetchCountries = useCallback(async () => {
    let pageCount = 1;
    const { getCountries } = useGetCountries(pageCount);
    const response = await getCountries();
    pageCount++;
    console.log("response", response);
  }, []);

  const handleChange = useCallback(
    (event: any) => {
      if (!event.target) return "";
      const newValue = event.target.value;
      console.log("newValue", newValue);
      setSelectValue(newValue);
      const selectedValue: any = options.find(
        (option) => option.code === newValue
      );
      if (onSendSelectedValue) {
        onSendSelectedValue(selectedValue);
      }
      let isValid = true;
      let errorMsg: string | undefined = "";
      if (validator) {
        isValid = validator(newValue);
        errorMsg = isValid ? "" : errorMessage;
      }
      setError(errorMsg as string);
      onChange(name, newValue, isValid);
    },
    [validator, errorMessage, onChange, name, options, onSendSelectedValue]
  );

  return (
    <Box className="ppxiss-box-element" sx={{ m: 1, minWidth: 120 }}>
      <FormControl className="ppxiss-form-multi-select" size="small" fullWidth>
        <InputLabel id="ppxiss-multiselect-label">{label}</InputLabel>
        <Select
          labelId="ppxiss-multiselect-label"
          displayEmpty
          id="demo-simple-select"
          value={selectValue}
          label={label}
          renderValue={(value) => {
            return value;
          }}
          onOpen={fetchCountries}
          onChange={handleChange}
        >
          {options.map((option: any) => (
            <MenuItem key={option.code} value={option.code}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        {error && <span className="ppxiss-error-message">{error}</span>}
      </FormControl>
    </Box>
  );
}
