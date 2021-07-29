const randomNumberWithDecimalInRange = (min, max, decimal) =>
  Number((Math.random() * (max - min + 1) + min).toFixed(decimal));

const numberToArray = (num) =>
  Array(num)
    .fill()
    .map((item, index) => index);

const createAge = (parentAge = 29) =>
  randomNumberWithDecimalInRange(0.5, parentAge - 1, 1);

const setNestedKey = (obj, path, value) => {
  if (path.length === 1) {
    obj[path] = value;
    return obj;
  }

  let objNestedField = { [path[0]]: {} };
  console.log("objNestedField:", objNestedField);

  return setNestedKey(objNestedField, path.slice(1), value);
};

const getAmountOfChildren = ({ min = 1, max, decimal = 0, ratio }) => {
  const integer = randomNumberWithDecimalInRange(min, max, decimal);
  const areTwins = integer === ratio || min > 1;

  if (areTwins) {
    const newMin = min > 1 ? min : min + 1;
    const twinsAmount = randomNumberWithDecimalInRange(newMin, max, decimal);
    return twinsAmount;
  } else {
    return integer;
  }
};

function createName({ animalType, childIndex, parent }) {
  const singularAnimal = animalType.slice(0, -1);
  if (parent.name) {
    return parent.name + `-${childIndex}`;
  } else {
    return singularAnimal + `-${childIndex}`;
  }
}

function createChild({ animalType, name, treeDepthAmount, parent }) {
  const age = createAge(parent.age);
  const isDepth = treeDepthAmount > 0 && age > 1.5;

  treeDepthAmount -= 1;

  const children = isDepth
    ? createChildren({ animalType, treeDepthAmount, parent: { name, age } })
    : [];

  return { name, age, children };
}

function createChildren({ animalType, treeDepthAmount, parent = {} }) {
  const childrenAmount = randomNumberWithDecimalInRange(1, 18, 0);
  const children = numberToArray(childrenAmount);

  return children.reduce((obj, curr, index) => {
    const name = createName({ animalType, childIndex: index + 1, parent });

    return {
      ...obj,
      [name]: createChild({
        animalType,
        name,
        treeDepthAmount,
        childIndex: index,
        parent,
      }),
    };
  }, {});
}

function createAnimalTree(animalType) {
  const treeDepthAmount = randomNumberWithDecimalInRange(1, 4, 0);
  return createChildren({ animalType, treeDepthAmount });
}

function GenerateFarm(animals) {
  return animals.reduce((obj, animalType) => {
    return { ...obj, [animalType]: createAnimalTree(animalType) };
  }, {});
}

const getBreakBetweenBirth = (obj) => {
  return obj;
};

class Animal {
  constructor(type) {
    this.type = type;
    this.props = {};
  }

  addField(field) {
    this.props[field] = field;
    return this;
  }

  create() {
    return {
      [this.type]: this.props,
    };
  }
}

const Dog = new Animal("Dog");
Dog.addField(pregnancy.duration, { min: 0.15, max: 0.19 })
  .addField(pregnancy.duration, { min: 0.15, max: 0.19 })
  .addField(pregnancy.duration, { min: 0.15, max: 0.19 })
  .addField(pregnancy.duration, { min: 0.15, max: 0.19 });

const animals = {
  Dogs: {
    pregnancy: {
      childrenAmountBornAtTime: { min: 3, max: 8 },
      startsFrom: { min: 1.5, max: 1.83 },
      duration: { min: 0.15, max: 0.19 },
      get breakBetweenBirth() {
        console.log("getter → this:", this);
        return getBreakBetweenBirth(this);
      },
    },
    lifeDuration: { min: 10, max: 13 },
  },
  Cats: {
    pregnancy: {
      childrenAmountBornAtTime: { max: 4, ratio: 1000 },
      startsFrom: { min: 1.33, max: 1.49 },
      duration: { min: 0.68, max: 0.84 },
    },
    lifeDuration: { min: 18, max: 22 },
  },
  Cows: {
    pregnancy: {
      childrenAmountBornAtTime: { max: 4, ratio: 1000 },
      startsFrom: { min: 1.33, max: 1.49 },
      duration: { min: 0.68, max: 0.84 },
    },
    lifeDuration: { min: 18, max: 22 },
  },
};

console.log(animals.Dogs.pregnancy.breakBetweenBirth);

// const farm1 = new GenerateFarm(animals);
// console.log("farm1:", farm1);
