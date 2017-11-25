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
    string public constant _SYMBOL = "QTG";
    string public constant _NAME = "Quantum Gold Token";
    uint8 public constant _DECIMALS = 18;

    // ------------------------------------------------------------------------
    // Decimal factor for multiplications from QTG unit to QTG natural unit
    // ------------------------------------------------------------------------
    uint public constant DECIMALSFACTOR = 10**uint(_DECIMALS);

    // ------------------------------------------------------------------------
    // Tranche 1 soft cap and hard cap, and total tokens
    // ------------------------------------------------------------------------
    uint public constant TOKENS_SOFT_CAP = 20000000 * DECIMALSFACTOR;
    uint public constant TOKENS_HARD_CAP = 40000000 * DECIMALSFACTOR;
    uint public constant TOKENS_TOTAL = 200000000 * DECIMALSFACTOR;

    // ------------------------------------------------------------------------
    // Tranche 1 token sale start date and end date
    // Do not use the `now` function here
    // Start - Nov. 30, 2017 @ 12:00 am (UTC)
    // End - Dec. 30, 2017 @ 12:00 am (UTC
    // ------------------------------------------------------------------------
    uint public constant START_DATE = 1512000000;
    uint public constant END_DATE = 1514592000;

    // ------------------------------------------------------------------------
    // 1 year abd 2 year dates for locked tokens
    // Do not use the `now` function here
    // ------------------------------------------------------------------------
    uint public constant LOCKED_HALFYEAR_DATE = START_DATE + 182 days;
    uint public constant LOCKED_1Y_DATE = START_DATE + 365 days;
    uint public constant LOCKED_2Y_DATE = START_DATE + 2 * 365 days;

    // ------------------------------------------------------------------------
    // Individual transaction contribution min and max amounts
    // Set to 0 to switch off, or `x ether`
    // ------------------------------------------------------------------------
    uint public CONTRIBUTIONS_MIN = 0 ether;
    uint public CONTRIBUTIONS_MAX = 0 ether;

}
