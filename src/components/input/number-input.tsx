import { useRef } from "react"
import { TextField, Stack, Button } from "@mui/material";
import { isNumber } from "@/utils/number-utils";

export default function NumberInput(
  { 
    onChange,
    initialValue,
    value,
    disabled = false,
    label,
    error,
    helperText
  }:
  {
    onChange: (value: string | number) => void,
    initialValue: number,
    value: string | number,
    disabled?: boolean,
    label: string,
    error: boolean,
    helperText?: string | undefined
  }
): React.ReactElement {
  const currentInputRef = useRef<number>(initialValue && 0.0)
  const previousInputRef = useRef<number>(initialValue && 0.0)

  function validateInput() {
    if (!isNumber(currentInputRef.current) || currentInputRef.current < 0) {
      currentInputRef.current = previousInputRef.current
    } else {
      previousInputRef.current = currentInputRef.current
    }

    onChange(currentInputRef.current)
  }

  function setNumberInput(value: string | number) {
    currentInputRef.current = Number(value)
    onChange(value)
  }

  function incrementInput(deltaValue: number) {
    previousInputRef.current = Number(value)
    setNumberInput(Math.max(0, Number(value) + deltaValue))
  }

  return (
    <Stack direction="row">
      <Button variant="contained" color="error" onClick={() => incrementInput(-1)} disabled={disabled}>-</Button>
      <TextField
        value={value}
        onChange={(e) => setNumberInput(e.target.value)} onBlur={validateInput}
        disabled={disabled}
        label={label}
        error={error}
        helperText={helperText}
      />
      <Button variant="contained" color="success" onClick={() => incrementInput(1)} disabled={disabled}>+</Button>
    </Stack>
  )
}