import { TextField } from "@mui/material"

export default function AutocompleteRenderField({ ...props }: { [x: string]: any }): React.ReactElement {
  return <TextField {...props} />
}