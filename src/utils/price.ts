import { MOCK_TOKENS } from "@/lib/constants"

export interface IPriceAPIResponse {
  usdPrice: number
  blockId: number
  decimals: number
  priceChange24h: number
}

export async function getPricesFromTokens(): Promise<{ [x:string]: IPriceAPIResponse }> {
  const solToken = MOCK_TOKENS.find(({ symbol }) => symbol == "SOL")
  const usdcToken = MOCK_TOKENS.find(({ symbol }) => symbol == "USDC")

  const fetchUrl = `https://lite-api.jup.ag/price/v3?ids=${solToken?.address},${usdcToken?.address}`

  const response = await fetch(fetchUrl)
  const price = await response.json()

  return price
}

export function calculatePriceRange(price: number, lowerPercentage: number, upperPercentage: number) {
    const absPrice = Math.abs(price)
    const lowerPriceDelta = absPrice * (lowerPercentage / 100)
    const upperPriceDelta = absPrice * (upperPercentage / 100)
    const minPrice = price - lowerPriceDelta
    const maxPrice = price + upperPriceDelta

    return [minPrice, maxPrice]
  }