# HS Technical Exam (Frontend)

Please refer to the Notion page provided via email for guidelines and tasks. Best of luck!

## Getting Started

### Prerequisites

- Node v20.18.0 or higher
- npm v10.8.2 or yarn v1.22.22
- Create an `.env` file on the root folder and populate with these environment variables:
   ```json
   NEXT_PUBLIC_MAINNET_RPC="your_rpc_url_here"
   ```
### Form Flow
Users must first connect to a wallet to begin filling up the form. Upon doing so the form becomes visible to the user.

After filling up the form and clicking "Submit", the form gets validated via Zod and custom validation checks for `address`, `minPrice`, `maxPrice`, and `depositAmount`.

AFter submitting the transaction, a modal pops out, along with an alert at the bottom left, to show the user the details of the transaction. If there were any validation errors, the user is informed that the transaction failed and shows the user which fields caused the validation errors.

### Valid Solana Addresses
For testing purposes, a set of mock addresses have been added to the project for the user to use to get around the validation check for the `address` field.

```
H2UjFR5S8Jkn6HGZmtkN3ku2FFiQyCeW6hawgo8M3XdL,
a2wrT2WndE65R5a5eDefnehk8JLMdpbjyM6Ds7tzNMx,
EyoRXh1sQNjPaXf3KGBszMCJCv1Lt2nzYoEG4T53WUHb,
23uCg5eZvrLY3tR5cXBZwEXuUAUryxvr4XxroHPdgoVM,
HodxZmtjw7wAD2eFS447NJ48oFJ2VgTEyCe2yZR1Qj3J,
mockvalidsolanaaddress
```
