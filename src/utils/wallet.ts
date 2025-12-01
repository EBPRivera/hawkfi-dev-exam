export interface IBalanceResponse {
  [x:string]: {
    amount: string,
    uiAmount: number,
    slot: number,
    isFrozen: boolean
  }
}

export async function getBalance(address: string | undefined): Promise<IBalanceResponse> {
  if (typeof address == "undefined") return {}

  const balancesResponse = await(
    await fetch(`https://lite-api.jup.ag/ultra/v1/balances/${address}`)
  );

  return balancesResponse.json()
}