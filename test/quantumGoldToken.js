const expectThrow = require('./utils').expectThrow
const QuantumGoldTokenAbstraction = artifacts.require('QuantumGoldToken')
const SampleRecipientSuccess = artifacts.require('SampleRecipientSuccess')
const SampleRecipientThrow = artifacts.require('SampleRecipientThrow')
let QTG

// accounts[0] = Contract creator
// accounts[1] = receiver
// accounts[3] = Investors
// accounts[4] = Public Contributor
contract('QuantumGoldToken', function (accounts) {
  beforeEach(async () => {
    QTG = await QuantumGoldTokenAbstraction.new(0, 'Quantum Gold Token', 18, 'QTG', {from: accounts[0]})
  })

  it('creation: should create an initial balance of 0 for the creator', async () => {
    const balance = await QTG.balanceOf.call(accounts[0])
    assert.strictEqual(balance.toNumber(), 0)
  })

  it('creation: test correct setting of vanity information', async () => {
    const name = await QTG.name.call()
    assert.strictEqual(name, 'Quantum Gold Token')

    const decimals = await QTG.decimals.call()
    assert.strictEqual(decimals.toNumber(), 18)

    const symbol = await QTG.symbol.call()
    assert.strictEqual(symbol, 'QTG')

    const totalSupply = await QTG.totalSupply.call()
    assert.strictEqual(totalSupply.toNumber(), 0)

    const tokensPerKEther = await QTG.tokensPerKEther.call()
    assert.strictEqual(tokensPerKEther.toNumber(), 2000000)
  })

  it('creation: should succeed in creating over 2^256 - 1 (max) tokens', async () => {
    // 2^256 - 1
    let HST2 = await QuantumGoldTokenAbstraction.new('115792089237316195423570985008687907853269984665640564039457584007913129639935', 'Simon Bucks', 1, 'SBX', {from: accounts[0]})
    const totalSupply = await HST2.totalSupply()
    const match = totalSupply.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77')
    assert(match, 'result is not correct')
  })

  // // TRANSERS
  // // normal transfers without approvals
  // it('transfers: ether transfer should be reversed.', async () => {
  //   const balanceBefore = await QTG.balanceOf.call(accounts[0])
  //   assert.strictEqual(balanceBefore.toNumber(), 10000)
  //
  //   web3.eth.sendTransaction({from: accounts[0], to: QTG.address, value: web3.toWei('10', 'Ether')}, async (err, res) => {
  //     expectThrow(new Promise((resolve, reject) => {
  //       if (err) reject(err)
  //       resolve(res)
  //     }))
  //
  //     const balanceAfter = await QTG.balanceOf.call(accounts[0])
  //     assert.strictEqual(balanceAfter.toNumber(), 10000)
  //   })
  // })
  //
  // it('transfers: should transfer 10000 to accounts[1] with accounts[0] having 10000', async () => {
  //   await QTG.transfer(accounts[1], 10000, {from: accounts[0]})
  //   const balance = await QTG.balanceOf.call(accounts[1])
  //   assert.strictEqual(balance.toNumber(), 10000)
  // })
  //
  // it('transfers: should fail when trying to transfer 10001 to accounts[1] with accounts[0] having 10000', () => {
  //   return expectThrow(QTG.transfer.call(accounts[1], 10001, {from: accounts[0]}))
  // })
  //
  // it('transfers: should handle zero-transfers normally', async () => {
  //   assert(await QTG.transfer.call(accounts[1], 0, {from: accounts[0]}), 'zero-transfer has failed')
  // })

  // NOTE: testing uint256 wrapping is impossible in this standard token since you can't supply > 2^256 -1
  // todo: transfer max amounts

  // APPROVALS
  it('approvals: msg.sender should approve 100 to accounts[1]', async () => {
    await QTG.approve(accounts[1], 100, {from: accounts[0]})
    const allowance = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance.toNumber(), 100)
  })

  it('approvals: msg.sender should approve 100 to SampleRecipient and then NOTIFY SampleRecipient. It should succeed.', async () => {
    let SRS = await SampleRecipientSuccess.new({from: accounts[0]})
    await QTG.approveAndCall(SRS.address, 100, '0x42', {from: accounts[0]})
    const allowance = await QTG.allowance.call(accounts[0], SRS.address)
    assert.strictEqual(allowance.toNumber(), 100)

    const value = await SRS.value.call()
    assert.strictEqual(value.toNumber(), 100)
  })

  it('approvals: msg.sender should approve 100 to SampleRecipient and then NOTIFY SampleRecipient and throw.', async () => {
    let SRS = await SampleRecipientThrow.new({from: accounts[0]})
    return expectThrow(QTG.approveAndCall.call(SRS.address, 100, '0x42', {from: accounts[0]}))
  })

  // bit overkill. But is for testing a bug
  it('approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.', async () => {
    const balance0 = await QTG.balanceOf.call(accounts[0])
    assert.strictEqual(balance0.toNumber(), 10000)

    await QTG.approve(accounts[1], 100, {from: accounts[0]}) // 100
    const balance2 = await QTG.balanceOf.call(accounts[2])
    assert.strictEqual(balance2.toNumber(), 0, 'balance2 not correct')

    QTG.transferFrom.call(accounts[0], accounts[2], 20, {from: accounts[1]})
    await QTG.allowance.call(accounts[0], accounts[1])
    await QTG.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]}) // -20
    const allowance01 = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance01.toNumber(), 80) // =80

    const balance22 = await QTG.balanceOf.call(accounts[2])
    assert.strictEqual(balance22.toNumber(), 20)

    const balance02 = await QTG.balanceOf.call(accounts[0])
    assert.strictEqual(balance02.toNumber(), 9980)
  })

  // should approve 100 of msg.sender & withdraw 50, twice. (should succeed)
  it('approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.', async () => {
    await QTG.approve(accounts[1], 100, {from: accounts[0]})
    const allowance01 = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance01.toNumber(), 100)

    await QTG.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]})
    const allowance012 = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance012.toNumber(), 80)

    const balance2 = await QTG.balanceOf.call(accounts[2])
    assert.strictEqual(balance2.toNumber(), 20)

    const balance0 = await QTG.balanceOf.call(accounts[0])
    assert.strictEqual(balance0.toNumber(), 9980)

    // FIRST tx done.
    // onto next.
    await QTG.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]})
    const allowance013 = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance013.toNumber(), 60)

    const balance22 = await QTG.balanceOf.call(accounts[2])
    assert.strictEqual(balance22.toNumber(), 40)

    const balance02 = await QTG.balanceOf.call(accounts[0])
    assert.strictEqual(balance02.toNumber(), 9960)
  })

  // should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
  it('approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)', async () => {
    await QTG.approve(accounts[1], 100, {from: accounts[0]})
    const allowance01 = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance01.toNumber(), 100)

    await QTG.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]})
    const allowance012 = await QTG.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance012.toNumber(), 50)

    const balance2 = await QTG.balanceOf.call(accounts[2])
    assert.strictEqual(balance2.toNumber(), 50)

    const balance0 = await QTG.balanceOf.call(accounts[0])
    assert.strictEqual(balance0.toNumber(), 9950)

    // FIRST tx done.
    // onto next.
    await expectThrow(QTG.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]}))
  })

  it('approvals: attempt withdrawal from account with no allowance (should fail)', function () {
    return expectThrow(QTG.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]}))
  })

  it('approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.', async () => {
    QTG.approve(accounts[1], 100, {from: accounts[0]})
    QTG.transferFrom(accounts[0], accounts[2], 60, {from: accounts[1]})
    QTG.approve(accounts[1], 0, {from: accounts[0]})
    await expectThrow(QTG.transferFrom.call(accounts[0], accounts[2], 10, {from: accounts[1]}))
  })

  it('approvals: approve max (2^256 - 1)', async () => {
    await QTG.approve(accounts[1], '115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[0]})
    const allowance = await QTG.allowance(accounts[0], accounts[1])
    assert(allowance.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77'))
  })

  it('events: should fire Transfer event properly', async () => {
    const res = await QTG.transfer(accounts[1], '2666', {from: accounts[0]})
    const transferLog = res.logs.find(element => element.event.match('Transfer'))
    assert.strictEqual(transferLog.args._from, accounts[0])
    assert.strictEqual(transferLog.args._to, accounts[1])
    assert.strictEqual(transferLog.args._value.toString(), '2666')
  })

  it('events: should fire Transfer event normally on a zero transfer', async () => {
    const res = await QTG.transfer(accounts[1], '0', {from: accounts[0]})
    const transferLog = res.logs.find(element => element.event.match('Transfer'))
    assert.strictEqual(transferLog.args._from, accounts[0])
    assert.strictEqual(transferLog.args._to, accounts[1])
    assert.strictEqual(transferLog.args._value.toString(), '0')
  })

  it('events: should fire Approval event properly', async () => {
    const res = await QTG.approve(accounts[1], '2666', {from: accounts[0]})
    const approvalLog = res.logs.find(element => element.event.match('Approval'))
    assert.strictEqual(approvalLog.args._owner, accounts[0])
    assert.strictEqual(approvalLog.args._spender, accounts[1])
    assert.strictEqual(approvalLog.args._value.toString(), '2666')
  })

  it('addPrecommitment: should transfer token to contributor', async() => {
    await QTG.addPrecommitment(accounts[3], 10)
    const totalSupply = await QTG.totalSupply.call()
    const balanceOfInvestor = await QTG.balanceOf.call(accounts[3])
    assert.strictEqual(totalSupply.toNumber(), 10010)
    assert.strictEqual(balanceOfInvestor.toNumber(), 10)
  })

  it('proxyPayment: should pay 0.002 ETH to contract and get back 1 token', async() => {
    // await web3.eth.accounts[4].transfer(accounts[0], 10) // Notworking
    await QTG.proxyPayment()
    const balanceOfContributor = await QTG.balanceOf.call(accounts[4])
    assert.strictEqual(balanceOfContributor.toNumber(), 10)

    // TODO:
    // Pay 0
    // Pay Many eth
    // pay too liitle eth (near the decimals point)

    // Pay unknown object
    // Contribute before the start date
    // Contribute after the start date
  })

  it('finalise: ', async() => {
    // TODO:

    // Owner can interact with the contarct
    // SET TIME
    //await QTG.finalise()


    // others can't interact with the contract
    // The remainingTokens transferred to WALLET_ACCOUNT in correct amount
    //
  })

  it('finalise: only owner can do finalise', async()=>{
    await expectThrow(QTG.finalise({from: accounts[1]}))
  })

  it('setTokensPerKEther: owner should set 0.002 ETH per token', async()=>{
    await QTG.setTokensPerKEther(1000000)
    const tokensPerKEther = await QTG.tokensPerKEther.call()
    assert.strictEqual(tokensPerKEther.toNumber(), 1000000)

    // TODO:
    // 1. Pay ETH after setTokensPerKEther
    // 2. Pay ETH before setTokensPerKEther
    // 3. TEST in different sales period
  })

  it('setTokensPerKEther: only owner can set', async()=>{
    await expectThrow(QTG.setTokensPerKEther(1000000, {from: accounts[1]}))
    //const tokensPerKEther = await QTG.tokensPerKEther.call()
    //assert.strictEqual(tokensPerKEther.toNumber(), 1000000)

    // TODO:
    // 1. Pay ETH after setTokensPerKEther
    // 2. Pay ETH before setTokensPerKEther
    // 3. TEST in different sales period
  })

  // it('', async() => {
  //
  // })



})
