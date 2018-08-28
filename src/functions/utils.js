
const propsBalance = [
  "realBalance",
  "totalDCACurrentValue",
  "totalPairsCurrentValue",
  "totalPendingCurrentValue",
  "totalDustCurrentValue"
]

const totalBalance = (resultApi) =>
  propsBalance
    .map(name => parseFloat(resultApi[name]))
    .reduce((a,b) => a+b)

const totalBinanceCoin = (resultApi) =>
  parseFloat(resultApi.watchModeLogData[0].averageCalculator.totalAmount)

module.exports = {
  totalBalance: totalBalance,
  totalBinanceCoin: totalBinanceCoin
}
