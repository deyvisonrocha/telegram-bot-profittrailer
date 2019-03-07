const marketColumn = () => {
  return 'Moeda'.leftJustify(7, ' ')
}

const marketRows = (market) => {
  return market.slice(0, -3).leftJustify(7, ' ') + ' | '
}

module.exports = {
  marketColumn,
  marketRows
}
