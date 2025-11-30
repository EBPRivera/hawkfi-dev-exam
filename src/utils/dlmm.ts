import { BASIS_POINT_MAX } from "@/lib/constants";
import Decimal from "decimal.js";

export function getBinIdFromPrice(
  price: string | number | Decimal,
  binStep: number,
  min: boolean
): number {
  const binStepNum = new Decimal(binStep).div(new Decimal(BASIS_POINT_MAX));
  const binId = new Decimal(price)
    .log()
    .dividedBy(new Decimal(1).add(binStepNum).log());
  return (min ? binId.floor() : binId.ceil()).toNumber();
}

export function getBinCountBetweenMinAndMaxPrice(minPrice: number, maxPrice: number, binStep: number): number {
  const lowerBinId = getBinIdFromPrice(minPrice, binStep, true)
  const upperBinId = getBinIdFromPrice(maxPrice, binStep, false)

  return upperBinId - lowerBinId + 1
}
