import { useMemo } from "react"
import { BASE_FEE_OPTIONS, BIN_STEP_OPTIONS, MOCK_TOKENS } from "@/lib/constants"
import { Autocomplete, Chip, Stack, TextField, Typography } from "@mui/material"
import { SOL_SYMBOL, USDC_SYMBOL, ISnipeFields, IFieldErrors } from "./snipe-form"
import NumberInput from "@/components/input/number-input"
import AutocompleteRenderField from "@/components/input/autocomplete-render"
import { IPriceAPIResponse, calculatePriceRange } from "@/utils/price"
import { IAutocompleteOptions } from "@/lib/interfaces"

export default function PoolForm(
	{ onChange, fields, initialPrices, errors }:
	{ onChange: Function, fields: ISnipeFields, initialPrices: { [x: string]: IPriceAPIResponse }, errors: IFieldErrors }
): React.ReactElement {
	const { address, baseFee, binStep, symbol, price } = fields

	function updateField(key: string, value: string | number | IAutocompleteOptions | undefined | null) {
		if (typeof value == "undefined") return

		const updatedFields = {
			...fields,
			[key]: value
		}
		onChange(updatedFields)
	}

	async function updateSymbol(value: string) {
		const token = MOCK_TOKENS.find(({ symbol }) => symbol == value)
		const price = initialPrices[token?.address || ""].usdPrice
		const [minPrice, maxPrice] = calculatePriceRange(price, 10, 10)

		const updatedFields = {
			...fields,
			symbol: value,
			price,
			minPrice,
			maxPrice
		}

		onChange(updatedFields)
	}

	return (
		<>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					justifyContent: "space-between",
					alignItems: "center",
					width: "100%"
				}}
			>
				<Chip label="New Pool" color="success" />
				<Stack
					direction="row"
					spacing={2}
					sx={{
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography>QUOTE TOKEN</Typography>
					<Chip
						label={SOL_SYMBOL}
						variant={symbol == SOL_SYMBOL ? "outlined" : "filled"}
						onClick={() => updateSymbol(SOL_SYMBOL)}
					/>
					<Chip
						label={USDC_SYMBOL}
						variant={symbol == USDC_SYMBOL ? "outlined" : "filled"}
						onClick={() => updateSymbol(USDC_SYMBOL)}
					/>
				</Stack>
			</Stack>
			<TextField
				value={address}
				label="Input base token"
				onChange={(e) => updateField("address", e.target.value)}
				error={errors.address ? true : false}
				helperText={errors.address}
			/>
			<Stack
				direction="row"
				spacing={4}
			>
				<Autocomplete
					value={baseFee}
					options={BASE_FEE_OPTIONS}
					sx={{
						width: "100%"
					}}
					renderInput={(params) => <AutocompleteRenderField {...params} label="Select base fee" />}
					onChange={(e, option) => updateField("baseFee", option)}
				/>
				<Autocomplete
					value={binStep}
					options={BIN_STEP_OPTIONS}
					sx={{
						width: "100%"
					}}
					renderInput={(params) => <AutocompleteRenderField {...params} label="Select bin step" />}
					onChange={(e, option) => updateField("binStep", option)}
				/>
			</Stack>
			<NumberInput
				value={price}
				initialValue={price}
				onChange={(value: number) => updateField("price", value)}
				label="Price"
				error={errors.price ? true : false}
				helperText={errors.price}
			/>
		</>
	)
}