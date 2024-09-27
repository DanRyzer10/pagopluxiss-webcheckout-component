
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useCallback, useState } from 'preact/hooks';
interface ValidatedDropdownProps {
    validator?: (value: string) => boolean;
    errorMessage?: string;
    onChange: (name: string, value: string, isValid: boolean) => void;
    name: string;
    label: string;
    options: object[];
    initialValue?: string;
  }
export default function BasicSelect({validator,errorMessage,onChange,name,label,options}: ValidatedDropdownProps) {
  const [creditType, setCreditType] = useState({});
  const [error,setError] = useState('');

  const handleChange = useCallback((event: any) => {
    if(!event.target) return null;
    const newValue = event.target.value;
    setCreditType(newValue);
    let isValid = true
    let errorMsg:string | undefined = '';
    if(validator){
        isValid = validator(newValue);
        errorMsg = isValid ? '' : errorMessage;
    }
    setError(errorMsg as string);
    onChange(name,newValue,isValid)
  },[validator,errorMessage,onChange,name]);

  return (
    <Box className='ppxiss-box-element' sx={{  m: 1, minWidth: 120 }}>
      <FormControl className='ppxiss-form-multi-select' size='small' fullWidth>
        <InputLabel id="ppxiss-multiselect-label">{label}</InputLabel>
        <Select
          labelId="ppxiss-multiselect-label"
          id="demo-simple-select"
          value={creditType}
          label={label}
          onChange={handleChange}
        >
         {options.map((option:any)=>{
              return <MenuItem value={option}>{option.name}</MenuItem>
         })}
        </Select>
        {error && <span className="ppxiss-error-message">{error}</span>}
      </FormControl>
    </Box>
  );
}