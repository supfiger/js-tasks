const randomNumberWithDecimalInRange = ({ min, max, decimal = 0 }) =>
  Number((Math.random() * (max - min + 1) + min).toFixed(decimal));

const numberToArray = (num) =>
  Array(num)
    .fill()
    .map((item, index) => index);

const setNestedKey = (obj, path, value) => {
  if (path.length === 1) {
    obj[path] = value;
    return obj;
  }

  let objNestedField = {
    [path[0]]: {},
  };
  console.log("objNestedField:", objNestedField);

  return setNestedKey(objNestedField, path.slice(1), value);
};

const getAmountOfChildren = ({ min = 1, max, decimal = 0, ratio }) => {
  const integer = randomNumberWithDecimalInRange({ min, max, decimal });
  const areTwins = integer === ratio || min > 1;

  if (areTwins) {
    const newMin = min > 1 ? min : min + 1;
    const twinsAmount = randomNumberWithDecimalInRange({ newMin, max, decimal });
    return twinsAmount;
  } else {
    return integer;
  }
};

class Animal {
  constructor({ ...args }) {
    const { type, props, treeDepthAmount, parent, childIndex } = args;
    console.log(`Animal (${childIndex})-> this:`, this);

    this.type = type;
    this.treeDepthAmount = treeDepthAmount;
    this.parent = parent || null;
    this.childIndex = childIndex;
    this.lifeDuration = props.lifeDuration;
    this.pregnancyStartsFrom = props.pregnancyStartsFrom;
    this.pregnancyDuration = props.pregnancyDuration;
    this.givingBirthAmount = props.givingBirthAmount;
    this.childrenAmountBornAtTime = props.childrenAmountBornAtTime;
  }

  downgradeTree() {
    this.treeDepthAmount -= 1;
  }

  get name() {
    const singularAnimal = this.type.slice(0, -1);
    const postfix = `-${this.childIndex}`;
    const initialName = this.parent?.name ? this.parent.name : singularAnimal;

    return initialName + postfix;
  }

  get age() {
    const min = this.lifeDuration.min;
    const decimal = 2;

    let max;
    if (this.parent?.age) {
      max = this.parent.age - this.pregnancyDuration;
    } else {
      max = this.lifeDuration.max;
    }

    return randomNumberWithDecimalInRange({ min, max, decimal });
  }

  get canGiveBirth() {
    return this.treeDepthAmount > 0 && this.age > 1.5;
  }

  animalCreate() {
    this.downgradeTree();

    const name = this.name;
    const age = this.age;
    // const children = this.canGiveBirth ? new AnimalChildren({ parent: { name, age } }).animalChildrenCreate() : [];
    const children = [];

    return { name, age, children };
  }
}

class AnimalChildren {
  constructor({ ...args }) {
    const { type, props, treeDepthAmount, parent } = args;

    this.type = type;
    this.parent = parent || null;
    this.treeDepthAmount = treeDepthAmount;
    this.props = props;

    console.log("AnimalChildren -> this:", this);
  }

  get childrenArray() {
    const childrenAmount = randomNumberWithDecimalInRange({ min: 1, max: 18 });
    return numberToArray(childrenAmount);
  }

  animalChildrenCreate() {
    return this.childrenArray.reduce((obj, curr, index) => {
      const args = {
        parent: this.parent,
        type: this.type,
        treeDepthAmount: this.treeDepthAmount,
        childIndex: index + 1,
      };

      console.log("reduce:", {
        ...args,
      });

      const child = new Animal({ ...args }).animalCreate();

      return { ...obj, [child.name]: child };
    }, {});
  }
}

class Farm {
  constructor(animals) {
    this.animals = animals;
  }

  generateAnimalTree(type, props) {
    const treeDepthAmount = randomNumberWithDecimalInRange({ min: 1, max: 4 });
    return new AnimalChildren({ type, props, treeDepthAmount }).animalChildrenCreate();
  }

  create() {
    return Object.entries(this.animals).reduce(
      (obj, [type, props]) => ({
        ...obj,
        [type]: this.generateAnimalTree(type, props),
      }),
      {}
    );
  }
}

const animals = {
  Dogs: {
    lifeDuration: {
      min: 10,
      max: 13,
    },
    pregnancyStartsFrom: {
      min: 1.5,
      max: 1.83,
    },
    pregnancyDuration: {
      min: 0.15,
      max: 0.19,
    },
    childrenAmountBornAtTime: {
      min: 3,
      max: 8,
    },
    givingBirthAmount: 6,
  },
  // Cats: {
  //   pregnancy: {
  //     childrenAmountBornAtTime: {
  //       max: 4,
  //       ratio: 1000,
  //     },
  //     startsFrom: {
  //       min: 1.33,
  //       max: 1.49,
  //     },
  //     duration: {
  //       min: 0.68,
  //       max: 0.84,
  //     },
  //   },
  //   lifeDuration: {
  //     min: 18,
  //     max: 22,
  //   },
  // },
  // Cows: {
  //   pregnancy: {
  //     childrenAmountBornAtTime: {
  //       max: 2,
  //       ratio: 1000,
  //     },
  //     startsFrom: {
  //       min: 1.33,
  //       max: 1.49,
  //     },
  //     duration: {
  //       min: 0.68,
  //       max: 0.84,
  //     },
  //   },
  //   lifeDuration: {
  //     min: 18,
  //     max: 22,
  //   },
  // },
};

const farm1 = new Farm(animals).create();
console.log("farm1:", farm1);
