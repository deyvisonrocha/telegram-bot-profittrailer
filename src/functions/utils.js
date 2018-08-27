const totalBalance = resultApi => {
  return parseFloat(resultApi.realBalance) + parseFloat(resultApi.totalDCACurrentValue) + parseFloat(resultApi.totalPairsCurrentValue) + parseFloat(resultApi.totalPendingCurrentValue) + parseFloat(resultApi.totalDustCurrentValue)
}

const totalBinanceCoin = resultApi => {
  return parseFloat(resultApi.watchModeLogData[0].averageCalculator.totalAmount)
}

module.exports = {
  totalBalance: totalBalance,
  totalBinanceCoin: totalBinanceCoin
}

