// import { MenuItem, InputLabel, FormControl, Select, Box } from "@mui/material";
// import { useCallback, useState } from "preact/hooks";
// interface ValidatedDropdownProps {
//   validator?: (value: string) => boolean;
//   errorMessage?: string;
//   onChange: (name: string, value: string, isValid: boolean) => void;
//   name: string;
//   label: string;
//   options: any[];
//   initialValue?: string;
//   onSendSelectedValue?: (value: {
//     code: string;
//     installments: number[];
//     name: string;
//   }) => void;
// }
// export default function BasicSelect({
//   validator,
//   errorMessage,
//   onChange,
//   name,
//   label,
//   options,
//   onSendSelectedValue,
// }: ValidatedDropdownProps) {
//   const [creditType, setCreditType] = useState<{
//     code: string;
//     name: string;
//     instalments?: number[];
//   }>({
//     code: "",
//     name: "",
//   });
//   const [error, setError] = useState("");

//   const handleChange = useCallback(
//     (event: any) => {
//       if (!event.target) return "";
//       const newValue = event.target.value;
//       console.log("newValue", newValue);
//       setCreditType(newValue);
//       const selectedValue: any = options.find(
//         (option) => option.code === newValue
//       );
//       if (onSendSelectedValue) {
//         onSendSelectedValue(selectedValue);
//       }
//       let isValid = true;
//       let errorMsg: string | undefined = "";
//       if (validator) {
//         isValid = validator(newValue);
//         errorMsg = isValid ? "" : errorMessage;
//       }
//       setError(errorMsg as string);
//       onChange(name, newValue, isValid);
//     },
//     [validator, errorMessage, onChange, name]
//   );

//   return (
//     <Box className="ppxiss-box-element" sx={{ m: 1, minWidth: 120 }}>
//       <FormControl className="ppxiss-form-multi-select" size="small" fullWidth>
//         <InputLabel id="ppxiss-multiselect-label">{label}</InputLabel>
//         <Select
//           labelId="ppxiss-multiselect-label"
//           id="demo-simple-select"
//           value={creditType}
//           label={label}
//           onChange={handleChange}
//         >
//           {options.map((option: any) => {
//             return <MenuItem value={option.code}>{option.name}</MenuItem>;
//           })}
//         </Select>
//         {error && <span className="ppxiss-error-message">{error}</span>}
//       </FormControl>
//     </Box>
//   );
// }
