import { z, ZodError } from "zod";
import { Keypair } from "@solana/web3.js";
import { ISnipeFields } from "@/components/forms/snipe-form";
import { MOCK_SOLANA_ADRESSES } from "@/lib/constants";

const snipeFieldsSchema = z.object({
  address: z.string(),
  symbol: z.string(),
  binStep: z.object({
    label: z.string(),
    value: z.coerce.string()
  }),
  baseFee: z.object({
    label: z.string(),
    value: z.coerce.string()
  }),
  price: z.number(),
  minPrice: z.number(),
  maxPrice: z.number(),
  depositAmount: z.number(),
})

export interface ITransactionResponse extends ISnipeFields {
  poolAddress?: string,
  positionAddress?: string
}

export interface ITransactionError {
  field: string | number,
  message: string,
}

export class TransactionError extends Error {
  fieldErrors: ITransactionError[];

  constructor(fieldErrors: ITransactionError[], ...params: any[]) {
    super(...params)
    this.fieldErrors = fieldErrors
  }
}

export const sendTransaction = (fields: ISnipeFields): ITransactionResponse => {
  try {
    const transactionErrors: ITransactionError[] = []
    snipeFieldsSchema.parse(fields)

    if (!addressExists(fields.address)) {
      transactionErrors.push({
        field: "address",
        message: "Address is not a valid Solana Address"
      })
    }

    if (fields.minPrice > fields.maxPrice) {
      transactionErrors.push({
        field: "minPrice",
        message: "Minimum Price must be less then Maximum Price"
      },
      {
        field: "maxPrice",
        message: "Maximum Price must be greater than Minimum Price"
      })
    }

    if (fields.depositAmount > Number(fields.walletBalance)) {
      transactionErrors.push({
        field: "depositAmount",
        message: `Insufficient balance. You have ${Number(fields.walletBalance)} SOL in your wallet`
      })
    }

    if (transactionErrors.length != 0) throw new TransactionError(transactionErrors)

    // Generate keypair for demonstration purposes
    const poolKeypair = Keypair.generate()
    const positionKeypair = Keypair.generate()
    const poolAddress = poolKeypair.publicKey.toBase58()
    const positionAddress = positionKeypair.publicKey.toBase58()

    return {
      ...fields,
      poolAddress,
      positionAddress,
    }
  } catch (error) {
    var transactionErrors: ITransactionError[] = []

    if (error instanceof ZodError) {
      error.issues.map((issue) => {
        transactionErrors.push({
          field: issue.path[0],
          message: issue.message,
        })
      })
    } else if (error instanceof TransactionError) {
      const { fieldErrors } = error

      transactionErrors = fieldErrors
    }


    throw new TransactionError(transactionErrors)
  }

};

function addressExists(address: string): boolean {
  return MOCK_SOLANA_ADRESSES.includes(address)
}