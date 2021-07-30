function createRandomIntegerArrayInRange(min, max) {
  return Array(max - min + 1)
    .fill()
    .map((_, index) => min + index)
    .sort(() => Math.random() - 0.5);
}

const compare = ({ array, index0, index1, _givenSum, pair = {}, obj }) => {
  index1 = (index1 || index0) + 1;

  const num0 = { value: array[index0], index: index0 };
  const num1 = { value: array[index1], index: index1 };

  const getPairObject = () => ({ num0, num1, _sumOfIndexes: index0 + index1, _givenSum });
  const recursion = () => compare({ array, index0, index1, _givenSum, pair, obj });
  const comparePairs = () => (pair = isPreviousPairLess ? pair : getPairObject());

  const isPair = Object.keys(pair).length;
  const isPreviousPairLess = isPair && pair.sumOfIndexes < index0 + index1;
  const isSum = array[index0] + array[index1] === _givenSum;
  const isEnd = index1 === array.length;

  if (isEnd) {
    return pair || obj;
  } else {
    isSum && comparePairs();
    return recursion();
  }
};

const findPairWithGivenSums = (arr, _givenSum) =>
  arr.reduce((obj, _, index, array) => {
    const currentPair = compare({ array, index0: index, _givenSum, obj });
    const resultPair = obj.sumOfIndexes < currentPair.sumOfIndexes ? obj : currentPair;

    return { ...obj, ...resultPair };
  }, {});

const arr = createRandomIntegerArrayInRange(1, 30);
const sum = findPairWithGivenSums(arr, 15);

console.log("------------");
console.log("arr:", arr);
console.log("sum:", sum);
