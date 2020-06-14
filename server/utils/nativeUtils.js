Array.prototype.pushSorted = function (value, comparatorFn) {
  let idx = insertionIndex(this, value, comparatorFn);
  this.splice(idx, 0, value);
  return this.length;

  function insertionIndex(array, value, comparator) {
    let low = 0;
    let high = array.length;
    let mid = -1;
    let c = 0;

    while (low < high) {
      mid = (low + high) >>> 1;
      c = comparator(array[mid], value);
      if (c < 0) low = mid + 1;
      else if (c > 0) high = mid;
      else return mid;
    }

    return low;
  }
};

Array.prototype.sortAndLimit = function (sortKeys, sortDir, limit) {
  if (sortKeys) {
    this.sort((o1, o2) => {
      for (let key of sortKeys) {
        const sorted = sortByKey(o1, o2, key.trim());
        if (sorted !== 0) return sorted;
      }
      return Math.random() >= 0.5 ? 1 : -1;
    });
  }

  function sortByKey(p1, p2, key) {
    if (p1.getNestedProperty(key) < p2.getNestedProperty(key)) return sortDir === 'desc' ? 1 : -1;
    if (p1.getNestedProperty(key) > p2.getNestedProperty(key)) return sortDir === 'desc' ? -1 : 1;
    return 0;
  }

  if (Number.isInteger(limit) && limit > 0 && limit <= this.length) {
    this.splice(limit);
  }
};

Object.prototype.getNestedProperty = function (propertyName) {
  let obj = this;
  for (const prop of propertyName.split('.')) {
    obj = obj[prop];
  }
  return obj;
};

Number.prototype.round = function (decimalPoints = 0) {
  if (!Number.isInteger(decimalPoints)) throw new TypeError('argument value must be an integer');
  if (decimalPoints < 0) throw new RangeError('argument value must be greater than or equal to 0');
  const n = Math.pow(10, decimalPoints);
  return Math.round(this * n) / n;
};
