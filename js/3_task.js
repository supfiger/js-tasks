function createRandomIntegerArrayInRange(min, max) {
  return Array(max - min + 1)
    .fill()
    .map((item, index) => min + index)
    .sort(() => Math.random() - 0.5);
}

function findPairWithSpecificSums2(arr, specificSum) {
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

const compare = ({ array, initialIndex, nextIndex, givenSum, pair, prev }) =>
  (nextIndex = (nextIndex || initialIndex) + 1) === array.length
    ? pair || prev
    : (array[initialIndex] + array[nextIndex] === givenSum &&
        (initialIndex + nextIndex < pair?.sumOfIndexes
          ? (pair = {
              num1: { value: array[initialIndex], index: initialIndex },
              num2: { value: array[nextIndex], index: nextIndex },
              sumOfIndexes: initialIndex + nextIndex,
            })
          : pair),
      compare({ array, initialIndex, nextIndex, givenSum, pair, prev }));

const findPairWithGivenSums = (arr, givenSum) => {
  return arr.reduce((prev, _, index, array) => {
    const curr = compare({ array, initialIndex: index, givenSum, prev });
    const result = prev.sumOfIndexes < curr.sumOfIndexes ? prev : curr;

    return { ...prev, ...result };
  }, {});
};

const arr = createRandomIntegerArrayInRange(1, 10);
const sum = findPairWithGivenSums(arr, 10);

console.log("------------");
console.log("arr:", arr);
console.log("sum:", sum);
