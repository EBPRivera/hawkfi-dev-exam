import { useState, use } from "react"
import { Alert, Box, Button, CircularProgress, Snackbar, Stack } from "@mui/material"
import PoolForm from "./pool-form"
import PositionForm from "./position-form"
import TransactionReceiptModal from "@/components/modals/transaction-receipt-modal"
import { ITransactionResponse, sendTransaction, TransactionError } from "@/utils/send-transaction"
import { calculatePriceRange, IPriceAPIResponse } from "@/utils/price"
import { isEmptyObject } from "@/utils/object-utils"
import { MOCK_TOKENS, BASE_FEE_OPTIONS, BIN_STEP_OPTIONS } from "@/lib/constants"
import { IAutocompleteOptions } from "@/lib/interfaces"
import { IBalanceResponse } from "@/utils/wallet"

export const SOL_SYMBOL: string = "SOL"
export const USDC_SYMBOL: string = "USDC"

export interface ISnipeFields {
  address: string,
  symbol: string,
  binStep: IAutocompleteOptions,
  baseFee: IAutocompleteOptions,
  price: number,
  preset: IPreset | null,
  minPrice: number,
  maxPrice: number,
  depositAmount: number,
  walletBalance: number | undefined,
}

export interface IFieldErrors {
  address?: string,
  symbol?: string,
  binStep?: string,
  baseFee?: string,
  price?: string,
  minPrice?: string,
  maxPrice?: string,
  depositAmount?: string,
}

export interface IPreset {
  id: number,
  code: string,
  label: string,
  name: string,
  lowerPercentage: number,
  upperPercentage: number,
  solAmount: number,
}

export default function SnipeForm(
  { initialPrices, balance }: { initialPrices: Promise<{ [x: string]: IPriceAPIResponse }>, balance: Promise<IBalanceResponse> }
): React.ReactElement {
  const allPrices = use(initialPrices)
  const currentBalance = use(balance)
  const initialToken = MOCK_TOKENS.find(({ symbol }) => symbol == SOL_SYMBOL)
  const initialPrice = allPrices[initialToken?.address || ""].usdPrice
  const [initialMinPrice, initialMaxPrice] = calculatePriceRange(initialPrice, 10, 10)

  const INITIAL_FIELDS: ISnipeFields = {
    address: "",
    symbol: SOL_SYMBOL,
    binStep: BIN_STEP_OPTIONS[0],
    baseFee: BASE_FEE_OPTIONS[0],
    price: initialPrice,
    preset: null,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    depositAmount: 0.0,
    walletBalance: currentBalance[SOL_SYMBOL].uiAmount
  }

  const [snipeFields, setSnipeFields] = useState<ISnipeFields>(INITIAL_FIELDS)
  const [transactionResponse, setTransactionResponse] = useState<ITransactionResponse>({
    ...INITIAL_FIELDS,
    poolAddress: "",
    positionAddress: "",
  })
  const [fieldErrors, setFieldErrors] = useState<IFieldErrors>({})
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  function updateSnipeFields(fields: ISnipeFields) {
    setSnipeFields((prevState) => ({
      ...prevState,
      ...fields
    }))
  }

  function updateByPreset(preset: IPreset) {
    if (typeof preset == "undefined") return

    const { lowerPercentage, upperPercentage } = preset
    setPriceRange(lowerPercentage, upperPercentage, preset)
  }

  function resetPriceRange() {
    const lowerPercentage = 10
    const upperPercentage = 10
    setPriceRange(lowerPercentage, upperPercentage)
  }

  function setPriceRange(lowerPercentage: number, upperPercentage: number, preset: IPreset | null = null) {
    const { price } = snipeFields
    const [minPrice, maxPrice] = calculatePriceRange(price, lowerPercentage, upperPercentage)

    updateSnipeFields({
      ...snipeFields,
      preset,
      minPrice,
      maxPrice,
    })
  }

  function resetFields() {
    setSnipeFields(INITIAL_FIELDS)
    setFieldErrors({})
  }

  function handleSubmit() {
    setIsSubmitting(true)

    // Simulate an async submit function
    setTimeout(() => {
      try {
        const transaction = sendTransaction(snipeFields)
        setTransactionResponse(transaction)
        setFieldErrors({})
      } catch (error) {
        const transactionErrors = (error as TransactionError).fieldErrors
        setFieldErrors((prevState) => {
          let fieldErrors = {}
          transactionErrors.map(({ field, message }) => {
            fieldErrors = {
              ...fieldErrors,
              [field]: message
            }
          })

          return {
            ...prevState,
            ...fieldErrors
          }
        })
        setTransactionResponse(snipeFields)
      } finally {
        setIsModalOpen(true)
        setIsSubmitting(false)
        setIsAlertOpen(true)
      }
    }, 1000)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        p: 4,
        gap: "2rem",
        backgroundColor: "#070E0A",
        color: "#C4CAC8",
        alignSelf: "center",
        width: "65%"
      }}
    >
      <PoolForm
        onChange={updateSnipeFields}
        fields={snipeFields}
        initialPrices={allPrices}
        errors={fieldErrors}
      />
      <PositionForm
        onChange={updateSnipeFields}
        fields={snipeFields}
        onPresetSelect={updateByPreset}
        onResetPriceRange={resetPriceRange}
        errors={fieldErrors}
        balance={currentBalance[SOL_SYMBOL].uiAmount}
      />
      <Stack direction="row" gap="1rem">
        <Button variant="contained" color="warning" onClick={resetFields}>Reset Fields</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {!isSubmitting ? "Submit" : <CircularProgress />}
        </Button>
      </Stack>
      <TransactionReceiptModal
        open={isModalOpen}
        fields={transactionResponse}
        errors={fieldErrors}
        onClose={() => setIsModalOpen(false)}
      />
      <Snackbar open={isAlertOpen} autoHideDuration={6000} onClose={() => setIsAlertOpen(false)}>
        <Alert
          onClose={() => setIsAlertOpen(false)}
          severity={isEmptyObject(fieldErrors) ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {isEmptyObject(fieldErrors) ? "Successfully Created Transaction" : "An Error Occured"}
        </Alert>
      </Snackbar>
    </Box>
  )
}