function sanitizeStrings(strArray) {
  if (strArray == null || typeof strArray !== 'string') return strArray;

  return strArray
    .split(',')
    .map(value => value.trim())
    .filter((value, index, self) => self.indexOf(value) === index && value !== '');
}

function sanitizeNumbers(numArray) {
  if (numArray == null || typeof numArray !== 'string') return numArray;

  return numArray
    .split(',')
    .map(value => (value.trim() ? Number(value.trim()) : -1))
    .filter(value => !Number.isNaN(value) && value >= 0 && value <= 100)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a - b);
}

function hoursBetween(dateFrom, dateTo, absoluteValue = false) {
  if (Object.prototype.toString.call(dateFrom) !== '[object Date]')
    throw new TypeError('`dateFrom` must be a date object');

  if (Object.prototype.toString.call(dateTo) !== '[object Date]')
    throw new TypeError('`dateTo` must be a date object');

  let timeDifference = dateTo.getTime() - dateFrom.getTime();
  if (absoluteValue) timeDifference = Math.abs(timeDifference);
  return timeDifference / (1000 * 3600);
}

function percentiles(values, percentilePoints) {
  if (!Array.isArray(values)) throw new TypeError('`values` must be an array');

  if (!Array.isArray(percentilePoints) || percentilePoints.length === 0)
    throw new TypeError('`percentilePoints` must be a non-empty array');

  return percentilePoints
    .map(percentilePoint => _calculatePercentile(values, percentilePoint))
    .reduce((result, value, index) => {
      result[percentilePoints[index]] = value; //result.push({ percentile: percentilePoints[index], value: value });
      return result;
    }, {});
}

function _calculatePercentile(values, percentile) {
  if (!values || values.length === 0) return 0;
  if (typeof percentile !== 'number') throw new TypeError('`percentile` must be a number');

  let rank = (percentile / 100) * (values.length + 1);

  if (rank > values.length) return values[values.length - 1];
  if (rank < 1) return values[0];
  if (Number.isInteger(rank)) return values[rank - 1];

  const ir = Math.trunc(rank);
  const fr = rank - ir;

  return (fr * (values[ir] - values[ir - 1]) + values[ir - 1]).round(2);
}

export default { hoursBetween, percentiles, sanitizeNumbers, sanitizeStrings };
