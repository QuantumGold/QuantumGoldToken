# Quantum Gold Token Sale Smart Contract

<br />

<hr />

# Table of contents

* [Updates](#updates)
* [Requirements](#requirements)
* [TODO](#todo)
* [Operations On The Token Sale Contract](#operations-on-the-token sale-contract)
  * [Anytime](#anytime)
  * [Before Start Date](#before-start-date)
  * [After Start Date And Before End Date Or Finalised](#after-start-date-and-before-end-date-or-finalised)
  * [After Finalised](#after-finalised)
  * [After 1 Year](#after-1-year)
* [Testing](#testing)
* [Deployment Checklist](#deployment-checklist)

<br />

<hr />

# Updates

<br />

<hr />

# Requirements

* Token Identifier
  * symbol `QTG`
  * name `Quantum Gold Token`
  * decimals `18`
  * supply `250,000,000 QTG`

* Tranche 1 100,000,000 (50%) QTG Token Sale Dates
  * START_DATE = TBC
  * END_DATE = TBC

* Total of (250,000,000) QTG tokens
  * Tranche 1 (40%) QTG Token Sale
    * Soft cap of (20% - 50,000,000) QTG
    * Hard cap of (40% - 100,000,000) QTG
    * Tokens from precommitments funded via fiat and other currencies will be included in this tranche
  * Tranche 2  (40%) QTG - locked for 1 year from token launch for Additional Token Sale (ATS)
    * 100% Tranche 2 token sale - Additional Token Sale (ATS). These tokens are subject to a lock-up for 1 year from token launch and each priced at no less than 0.001 ETH
  *  (10%) QTG created during the Contribution Period will be allocated to the foundation for operation and development
  *  (10%) QTG created during the Contribution Period will be allocated to the management for free subject to:
    * 17,500,000 (70%) locked for 1 year from token launch
    * 7,500,000 (30%) locked for 2 years from token launch

* QTG Token Price
  * The price for an QTG token will be set as 0.001 ETH
  * The indicative price per QTG token is  ETH as of 8 June 2017
    * 1 QTG = 0.001 ETH
    * 1 ETH = 1 / 0.001 = 1000 QTG
  * This will be encoded as an unsigned integer, 1,000 ETH = 1,000,000 QTG with six significant figures
    * Before T-7d AND The first 10,000,000 tokens - tokensPerKEther = 850,000
    * Before T-7d - tokensPerKEther = 950,000
    * After T-7d tokensPerKEther = 1,000,000

* Precommitments
  * Some participants will be able to purchase the token sale tokens through precommitments using fiat and other currencies
  * Quantum Gold Foundation will allocate the tokens for these participants prior to the public token sale commencement

* Minimum Funding And Refunds
  * There is no minimum funding level in the smart contract as the precommitments already exceed the minimum funding level
  * There is therefore no requirements for this token sale contract to provide refunds to participants
    * ETH contributed to the token sale smart contract will be immediately transferred into a wallet specified by Quantum Gold Foundation

* Token Sale Wallet
  * The wallet receiving the ethers during the token sale has to be specifed as a parameter during the deployment of the token sale contract
  * This wallet address can be changed at any time during the token sale period

* Minimum and Maximum Contributions
  * There is the ability to set a minimum and maximum contribution per transaction. Set one or both of these to 0 if this restriction is not required

* Soft And Hard Cap
  * There will be a soft cap and a hard cap specified in the token sale smart contract
  * Quantum Gold Foundation will be able to execute the `finalise()` function to close the token sale once the number of issued tokens exceeds the soft cap
  * Quantum Gold Foundation will also be able to execute the `finalise()` function after the token sale end date if the soft cap is not reached

* `finalise()` The Token Sale
  * Quantum Gold Foundation calls `finalise()` to close the token sale, either after the soft cap is breached to the end of the token sale period, or after the token sale end date
  * The `finalise()` function will allocate the 1 and 2 year locked tokens, unsold tranche1 tokens and tranche2 tokens

* Unsold Tranche 1 Tokens
  * Any tokens unsold from the tranche 1 quota will be locked away for 1 year along with the tranche 2 tokens

* Locked Tokens
  * Accounts holding 1 or 2 year locked tokens will also be able to participant in the public token sale

<br />

<hr />

## TODO

* [] BK Testing different scenarios
  * [] Scenario where funding below soft cap and above soft cap
  * [] Unlocking of tokens in 1 year

<br />

<hr />

# Operations On The Token Sale Contract

Following are the functions that can be called at the different phases of the token sale contract

## Anytime

* Owner can call `setWallet(...)` to set the wallet address

## Before Start Date

* Owner can call `setTokensPerKEther(...)` to set the token issuance rate
* Owner can call `addPrecommitment(...)` to add precommitment balances

## After Start Date And Before End Date Or Finalised

* Participants can send ETH to the default `()` function and receive tokens
* Owner can call `finalise()` if soft cap breached or we are past the end date

## After Finalised

* Participant can call the normal `transfer(...)`, `approve(...)` and `transferFrom(...)` to transfer tokens

## After 1 Year

* Participants with locked tokens can called the `lockedTokens.unlock1Y()`
  * Find the address of the LockedTokens contract from the lockedTokens variable in the token contract
  * Watch the LockedTokens address using the LockedTokens Application Binary Interface
  * Execute `unlock1Y()` after 1 year has passed to unlock the tokens

<br />

<hr />

# Testing

See [test](test) for details.

<br />

<hr />

# Deployment Checklist

* Check START_DATE and END_DATE
* Check Solidity [release history](https://github.com/ethereum/solidity/releases) for potential bugs
* Deploy contract to Mainnet with specified wallet address as the deployment parameter
* Verify the source code on EtherScan.io
  * Verify the main Quantum Gold FoundationToken contract
  * Verify the LockedToken contract

<br />

<br />
