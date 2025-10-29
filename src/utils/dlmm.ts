import { BASIS_POINT_MAX } from "@/lib/constants";
import Decimal from "decimal.js";

export function getBinIdFromPrice(
  price: string | number | Decimal,
  binStep: number,
  min: boolean
): number {
  console.log("Getting bin id from price...");
  return 0;
}
