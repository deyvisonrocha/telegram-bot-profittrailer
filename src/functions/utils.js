const BNB_NAME = 'BNB'

const propsBalance = [
  'realBalance',
  'totalDCACurrentValue',
  'totalPairsCurrentValue',
  'totalPendingCurrentValue',
  'totalDustCurrentValue'
]

const totalBalance = (resultApi) =>
  propsBalance
    .map(name => parseFloat(resultApi[name]))
    .reduce((a, b) => a + b)

const totalBinanceCoin = (resultApi) => {
  var bnbObjs =
    resultApi.watchModeLogData.filter(obj => obj.currency === BNB_NAME)
  var obj = bnbObjs[0]
  // Caso não encontre BNB no watchmode
  if (obj == null) {
    return null
  }
  return parseFloat(obj.averageCalculator.totalAmount)
}

const marketColumn = () => {
  return 'Moeda'.leftJustify(7, ' ')
}

const marketRows = (market) => {
  return market.slice(0, -3).leftJustify(7, ' ') + ' | '
}

module.exports = {
  totalBalance: totalBalance,
  totalBinanceCoin: totalBinanceCoin,
  marketColumn,
  marketRows
}
