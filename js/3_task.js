function createRandomIntegerArrayInRange({ min, max }) {
  return Array(max - min + 1)
    .fill()
    .map((_, index) => min + index)
    .sort(() => Math.random() - 0.5);
}

const findPairWithGivenSums = ({ arr, _givenSum }) =>
  arr.reduce((pair, item, index) =>
    pair.length || pair[_givenSum - item] >= 0
      ? pair
      : pair[item] >= 0
      ? [_givenSum - item, item]
      : { ...pair, [_givenSum - item]: index }
  );

const findPairWithGivenSums1 = ({ arr, _givenSum }) => {
  const viewed = new Map();

  for (let i = 0; i < arr.length; i++) {
    if (viewed.get(arr[i]) >= 0) {
      return [_givenSum - arr[i], arr[i]];
    }

    if (viewed.get(_givenSum - arr[i]) >= 0) {
      continue;
    }

    viewed.set(_givenSum - arr[i], i);
  }
};

// const arr = createRandomIntegerArrayInRange({ min: 1, max: 10 });
// const arr = [3, 1, 4, 7, 6, 8, 2, 5, 10, 9];
const arr = [4, 1, 2, 8, 7, 3, 10, 9, 5, 6];

const sum = findPairWithGivenSums({ arr, _givenSum: 11 });

console.log("------------");
console.log("arr:", arr);
console.log("sum:", sum);

// reduce
// 1: 8
// 2: 9
// aIndex: 4
// aValue: 6
// bIndex: 7
// bValue: 5
// _givenSum: 11
// _indexSum: 11
