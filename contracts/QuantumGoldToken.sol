/*
This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20) as well as the following OPTIONAL extras intended for use by humans.

In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans.
Imagine coins, currencies, shares, voting weight, etc.
Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.

1) Initial Finite Supply (upon creation one specifies how much is minted).
2) In the absence of a token registry: Optional Decimal, Symbol & Name.
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

.*/

import "./StandardToken.sol";
import "./SafeMath.sol";
import "./QuantumGoldTokenConfig.sol";
import "./Owned.sol";

pragma solidity ^0.4.11;

contract QuantumGoldToken is StandardToken, Owned, QuantumGoldTokenConfig {
    using SafeMath for uint;

    /* Public variables of the token */

    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                  //fancy name: eg Simon Bucks
    uint8 public decimals;                                 //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
    string public symbol;                               //An identifier: eg SBX
    uint256 public totalSupply;
    address public wallet;

    string public version = 'H0.1';                             //human 0.1 standard. Just an arbitrary versioning scheme.
    bool public finalised = false;
    bool public lucky = false;

    // ------------------------------------------------------------------------
    // Number of tokens per 1,000 ETH
    //
    // Indicative rate of ETH per token of 0.002
    //
    // This is the same as 1 / 0.002 = 500 QTG per ETH
    //
    // Discounted Price:
    // 1st Week Price = 1 / 0.0016 = 625 QTG per ETH, tokensPerKEther = 625,000
    // 2nd Week Price = 1 / 0.0018 = 555.555556 QTG per ETH, tokensPerKEther = 555,556
    // 3rd Week Price = 1 / 0.0019 = 526.315789 QTG per ETH, tokensPerKEther = 526,316
    // After 3rd Week Price = 1 / 0.002 = 500 QTG per ETH, tokensPerKEther = 500,000
    //
    // Regular Price:
    // tokensPerEther  = 500
    // tokensPerKEther = 500
    // tokensPerKEther = 500,000 rounded to an uint, six significant figures
    //
    // *All the ETH and QTG should be call with (integer value + Decimal factor),
    //  i.e. Total Supply call should be 200,000,000,000,000,000,000,000,000
    // ------------------------------------------------------------------------
    uint public tokensPerKEther = 500000;

    function QuantumGoldToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol,
        address _wallet
        ) {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        wallet = _wallet;
    }

    /* Approves and then calls the receiving contract */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        //call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
        //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        //it is assumed that when does this that the call *should* succeed, otherwise one would use vanilla approve instead.
        require(_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData));
        return true;
    }


    // ------------------------------------------------------------------------
    // Accept ethers to buy tokens during the crowdsale
    // ------------------------------------------------------------------------
    function () payable {
      EtherReceived(msg.value);
      proxyPayment(msg.sender);
    }
    event EtherReceived(uint ethers);

    // ------------------------------------------------------------------------
    // Accept ethers from one account for tokens to be created for another
    // account. Can be used by exchanges to purchase tokens on behalf of
    // it's user
    // ------------------------------------------------------------------------
    function proxyPayment(address participant) payable {
        // No contributions after the crowdsale is finalised
        require(!finalised);

        // No contributions before the start of the crowdsale
        //require(now >= START_DATE);
        // No contributions after the end of the crowdsale
        //require(now <= END_DATE);

        // No contributions below the minimum (can be 0 ETH)
        require(msg.value >= CONTRIBUTIONS_MIN);
        // No contributions above a maximum (if maximum is set to non-0)
        require(CONTRIBUTIONS_MAX == 0 || msg.value < CONTRIBUTIONS_MAX);

        // Calculate number of tokens for contributed ETH
        // `18` is the ETH decimals
        // `- decimals` is the token decimals
        // `+ 3` for the tokens per 1,000 ETH factor
        uint tokens = msg.value * tokensPerKEther / 10**uint(18 - decimals + 3);

        // Check if the hard cap will be exceeded
        require(totalSupply + tokens <= TOKENS_HARD_CAP);

        // Add tokens purchased to account's balance and total supply
        balances[participant] = balances[participant].add(tokens);
        totalSupply = totalSupply.add(tokens);

        // Log the tokens purchased
        Transfer(0x0, participant, tokens);
        TokensBought(participant, msg.value, this.balance, tokens,
             totalSupply, tokensPerKEther);

        // Transfer the contributed ethers to the crowdsale wallet
        //if (!wallet.send(msg.value)) throw;
        wallet.transfer(msg.value);
    }
    event TokensBought(address indexed buyer, uint ethers,
        uint newEtherBalance, uint tokens, uint newTotalSupply,
        uint _tokensPerKEther);


    // ------------------------------------------------------------------------
    // Quantum Gold Foundation to finalise the crowdsale - to adding the locked tokens to
    // this contract and the total supply
    // ------------------------------------------------------------------------
    function finalise() onlyOwner {
        // Can only finalise if raised > soft cap or after the end date
        //require(totalSupply >= TOKENS_SOFT_CAP || now > END_DATE);

        // Can only finalise once
        require(!finalised);

        // Total tokens to be created
        uint remainingTokens = TOKENS_TOTAL;
        // Minus precommitments and public crowdsale tokens
        remainingTokens = remainingTokens.sub(totalSupply);

        // Add tokens purchased to account's balance and total supply
        balances[wallet] = balances[wallet].add(remainingTokens);
        totalSupply = totalSupply.add(remainingTokens);

        // Can only finalise once
        finalised = true;
    }

    // ------------------------------------------------------------------------
    // Quantum Gold Foundation to add precommitment funding token balance before the crowdsale
    // commences
    // ------------------------------------------------------------------------
    function addPrecommitment(address participant, uint balance) onlyOwner {
        require(balance > 0);
        balances[participant] = balances[participant].add(balance);
        totalSupply = totalSupply.add(balance);
        Transfer(0x0, participant, balance);
    }

    // ------------------------------------------------------------------------
    // Quantum Gold Foundation can set number of tokens per 1,000 ETH
    // Can only be set before the start of the crowdsale
    // ------------------------------------------------------------------------
    function setTokensPerKEther(uint _tokensPerKEther) onlyOwner {
        require(_tokensPerKEther > 0);
        tokensPerKEther = _tokensPerKEther;
        TokensPerKEtherUpdated(tokensPerKEther);
    }
    event TokensPerKEtherUpdated(uint _tokensPerKEther);

    /*function setWallet(address _wallet) onlyOwner {
        wallet = _wallet;
        WalletUpdated(wallet);
    }
    event WalletUpdated(address newWallet);*/


}
