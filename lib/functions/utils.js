'use strict';

var marketColumn = function marketColumn() {
  return 'Moeda'.leftJustify(7, ' ');
};

var marketRows = function marketRows(market) {
  return market.slice(0, -3).leftJustify(7, ' ') + ' | ';
};

module.exports = {
  marketColumn: marketColumn,
  marketRows: marketRows
};