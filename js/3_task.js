function createRandomIntegerArrayInRange(min, max) {
  return Array(max - min + 1)
    .fill()
    .map((item, index) => min + index)
    .sort(() => Math.random() - 0.5);
}

function findPairWithSpecificSums(arr, specificSum) {
  return arr.reduce((prev, value, index) => {
    const currIndex = index;
    const currValue = value;

    let inSumWithNumber;

    const prevData = Object.values(prev);
    // const isSum = prevValue?.currValue + value === specificSum;
    // const sumOfIndexes = prevValue?.currIndex < index;
    // const sumOfPrevIndexes = prevValue?.currIndex < index;
    // let isPair = isSum && sumOfIndexes < sumOfPrevIndexes;

    const compare = (currValue, prevData) => {
      if (prevData) {
        const prevValue = prevData.currValue;
        const deepPrevData = prevData.prevData;
        const isSum = currValue + prevValue === specificSum;

        if (isSum) {
        }

        if (deepPrevData) {
          compare(currValue);
        }
        if (isSum) {
          inSumWithNumber;
        }
        return;
      } else {
        return;
      }
    };

    if (inSumWithNumber) {
      return "hello";
    }

    return {
      ...prev,
      [currValue]: {
        currIndex,
        currValue,
        ...(inSumWithNumber ? { inSumWithNumber } : { prevData }),
      },
    };
  }, {});
}

const arr = createRandomIntegerArrayInRange(1, 5);
const sum = findPairWithSpecificSums(arr, 7);

console.log("arr:", arr);
console.log("sum:", sum);
