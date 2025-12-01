import { Autocomplete, Button, Chip, Stack, Typography } from "@mui/material"
import { POSITION_PRESETS } from "@/lib/constants"
import { ISnipeFields, IPreset, IFieldErrors } from "./snipe-form"
import AutocompleteRenderField from "@/components/input/autocomplete-render"
import NumberInput from "@/components/input/number-input"
import { getBinCountBetweenMinAndMaxPrice } from "@/utils/dlmm"

export default function PositionForm(
  {
    onChange,
    fields,
    onPresetSelect,
    onResetPriceRange,
    errors,
    balance
  }:
  {
    onChange: (fields: ISnipeFields) => void,
    fields: ISnipeFields,
    onPresetSelect: Function,
    onResetPriceRange: Function,
    errors: IFieldErrors,
    balance: number | undefined
  }
): React.ReactElement {
  const { binStep, preset, minPrice, maxPrice, depositAmount } = fields

  function updateField(key: string, value: string | number | undefined) {
    if (typeof value == "undefined") return

    const updatedFields = {
      ...fields,
      [key]: value
    }
    onChange(updatedFields)
  }

  function setPreset(preset: null | IPreset) {
    onPresetSelect(preset)
  }

  function resetPriceRange() {
    onResetPriceRange()
  }

  return (
    <>
      <Chip label="New Position" color="success" sx={{ alignSelf: "flex-start" }} />
      <Autocomplete
        value={preset}
        options={POSITION_PRESETS}
        renderInput={(params) => <AutocompleteRenderField {...params} label="Preset" />}
        onChange={(e, option) => setPreset(option)}
      />
      <Stack
        direction="row"
        spacing={2}
        gap="5px"
        sx={{
          alignItems: "flex-end",
        }}
      >
        <NumberInput
          value={depositAmount}
          initialValue={depositAmount}
          onChange={(value) => updateField("depositAmount", value)}
          error={errors.depositAmount ? true : false}
          label="Deposit Amount (SOL)"
        />
        {Number(depositAmount) > Number(balance) && (
          <Typography variant="caption" color="error">
            Insufficient balance. You only have {Number(balance)} SOL in your wallet.
          </Typography>
        )}
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NumberInput
          value={minPrice}
          initialValue={minPrice}
          onChange={(value) => updateField("minPrice", value)}
          label="Min Price"
          error={errors.minPrice ? true : false}
          helperText={errors.minPrice}
        />
        <NumberInput
          value={maxPrice}
          initialValue={minPrice}
          onChange={(value) => updateField("maxPrice", value)}
          label="Max Price"
          error={errors.maxPrice ? true : false}
          helperText={errors.maxPrice}
        />
        <Button variant="contained" color="warning" onClick={() => resetPriceRange()}>Reset Price Range</Button>
      </Stack>
      <Typography>Bin Count: {getBinCountBetweenMinAndMaxPrice(Number(minPrice), Number(maxPrice), Number(binStep.value))}</Typography>
    </>
  )
}