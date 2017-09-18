pragma solidity ^0.4.11;

// ----------------------------------------------------------------------------
// QTG 'Quantum Gold Token' token sale contract - ERC20 Token Interface
//
// The MIT Licence.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// QTG 'Quantum Token' token sale smart contract - configuration parameters
// ----------------------------------------------------------------------------
contract QuantumGoldTokenConfig {

    // ------------------------------------------------------------------------
    // Token symbol(), name() and decimals()
    // ------------------------------------------------------------------------
    string public constant SYMBOL = "QTG";
    string public constant NAME = "Quantum Gold Token";
    uint8 public constant DECIMALS = 18;

    // ------------------------------------------------------------------------
    // Decimal factor for multiplications from QTG unit to QTG natural unit
    // ------------------------------------------------------------------------
    uint public constant DECIMALSFACTOR = 10**uint(DECIMALS);

    // ------------------------------------------------------------------------
    // Tranche 1 soft cap and hard cap, and total tokens
    // ------------------------------------------------------------------------
    uint public constant TOKENS_SOFT_CAP = 20000000 * DECIMALSFACTOR;
    uint public constant TOKENS_HARD_CAP = 40000000 * DECIMALSFACTOR;
    uint public constant TOKENS_TOTAL = 200000000 * DECIMALSFACTOR;

    // ------------------------------------------------------------------------
    // Tranche 1 token sale start date and end date
    // Do not use the `now` function here
    // Start - Thursday, 01-Oct-17 13:00:00 UTC / 1pm GMT 22 Oct 2017
    // End - Saturday, 01-Nov-17 13:00:00 UTC / 1pm GMT 22 Nov 2017
    // ------------------------------------------------------------------------
    uint public constant START_DATE = 1506862800;
    uint public constant END_DATE = 1509541200;

    // ------------------------------------------------------------------------
    // 1 year abd 2 year dates for locked tokens
    // Do not use the `now` function here
    // ------------------------------------------------------------------------
    uint public constant LOCKED_1Y_DATE = START_DATE + 365 days;
    uint public constant LOCKED_2Y_DATE = START_DATE + 2 * 365 days;

    // ------------------------------------------------------------------------
    // Individual transaction contribution min and max amounts
    // Set to 0 to switch off, or `x ether`
    // ------------------------------------------------------------------------
    uint public CONTRIBUTIONS_MIN = 0 ether;
    uint public CONTRIBUTIONS_MAX = 0 ether;

    // ------------------------------------------------------------------------
    // Tokens for sale 2 in the following account
    // ------------------------------------------------------------------------
    address public WALLET_ACCOUNT = 0x0b68253abB37e900cfE8738fa25bFC51B243D10F;
}
