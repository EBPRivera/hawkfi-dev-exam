import { Box, Modal, Stack, Typography } from "@mui/material";
import TransactionReceiptItem from "./transaction-recepit-item";
import { ITransactionResponse } from "@/utils/send-transaction";
import { IFieldErrors } from "../forms/snipe-form";
import { isEmptyObject } from "@/utils/object-utils";

export default function TransactionReceiptModal(
  { open, fields, errors, onClose }:
  { open: boolean, fields: ITransactionResponse, errors: IFieldErrors, onClose: () => void }
): React.ReactElement {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-transaction-receipt"
      aria-describedby="transaction-receipt"
    >
      <Box
        flexDirection="column"
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          p: 4,
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold">Transaction Receipt</Typography>
        {!isEmptyObject(errors) && <Typography variant="caption" color="error" alignSelf="flex-start">Transaction Failed</Typography>}
        <Stack direction="row" alignItems="flex-end" gap="1rem" sx={{ backgroundColor: "lightgray" }}>
          <Typography variant="h5" align="center">Pool</Typography>
          <Typography variant="caption">to: {fields.poolAddress}</Typography>
        </Stack>
        <TransactionReceiptItem title="Symbol" value={fields.symbol} error={errors.symbol} />
        <TransactionReceiptItem title="Token Address" value={fields.address} error={errors.address} />
        <TransactionReceiptItem title="Bin Steps" value={fields.binStep.label} error={errors.binStep} />
        <TransactionReceiptItem title="Base Fees" value={fields.baseFee.label} error={errors.baseFee} />
        <TransactionReceiptItem title="Initial Price" value={fields.price} error={errors.price} />
        <Stack direction="row" alignItems="flex-end" gap="1rem" sx={{ backgroundColor: "lightgray" }}>
          <Typography variant="h5" align="center">Position</Typography>
          <Typography variant="caption">to: {fields.positionAddress}</Typography>
        </Stack>
        <TransactionReceiptItem title="Deposit Amount" value={`${fields.depositAmount} SOL`} error={errors.depositAmount} />
        <TransactionReceiptItem title="Min Price" value={fields.minPrice} error={errors.minPrice} />
        <TransactionReceiptItem title="Max Price" value={fields.maxPrice} error={errors.maxPrice} />
      </Box>
    </Modal>
  )
}