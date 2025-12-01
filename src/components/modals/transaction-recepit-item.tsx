import { Stack, Typography } from "@mui/material"

export default function TransactionReceiptItem({ title, value, error }: { title: string, value: string | number, error: string | undefined }) {
  return (
    <Stack direction="row" gap="5px">
      <Typography fontWeight="bold">{title}: </Typography>
      <Typography>{value}</Typography>
      {error && <Typography variant="caption" color="error" alignSelf="flex-end">{error}</Typography>}
    </Stack>
  )
}