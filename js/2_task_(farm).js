/*

  Project name: Farm

  Requirements:
  1. Create a farm based given types and props of animals
  2. Names of animals should go in order, e.g: "Dog-1", "Dog-2", "Dog-3"
  3. Names of animal children should go in order, based on the all tree, based on the parent name, e.g: "Dog-1-2-4-1", "Dog-1-2-4-2", "Dog-1-2-4-3"
  4. There are two genders: "boy" and "girl"
  5. Give a birth can animals only with a gender "girl"
  6. Children must be younger than their parents
  7. Twins should be the same age
  8. If children are twins, show it (in a simple and understandable way)
  9. Family tree depth should be unique for each animal type (e.g. "Dogs" will have 5 generations, "Cats" - 3, "Cows" - 6)
  10. Animal cannot give a birth until it grew up to the age minimum age by field "pregnancyStartsFrom"
  11. All animal props must be taken into account
  12. You can choose output farm type up to you (objects or arrays), but it should be understandable
  13. All number values should be generated randomly (family tree depth/age/amount of children, etc)
  14. Empty fields should not be in an output
  15. You should use numbers with two decimal where it needed (for generating age)
  16. Animal should consist such fields: 1) name; 2) age; 3) gender; 4) children (if there is a possibility)
  17. Farm should be able to be displayed in the console

  Input:
  {
    Dogs: {
      deathYear: {
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
  }

  Output example:
  {
    Dogs: [
      {
        name: "Dog-1",
        age: 9.04,
        gender: "girl",
        children: {
          "twins-1": [
            {name: "Dog-1-2", age: 3.55, gender: "girl", children: {...}},
            {name: "Dog-1-2", age: 3.55, gender: "boy"},
            {name: "Dog-1-3", age: 3.55, gender: "boy"},
          ],
          "twins-2": [
            {...},
            {...},
            {...},
          ],
        },
      },
      {
        name: "Dog-1",
        age: 4.87,
        gender: "boy",
      }
    ],
    Cats: [...],
    Cows: [...],
  }

*/

const randomNumberWithDecimalInRange = ({ min, max, decimal = 0 }) =>
  (Math.random() * (max - min + min)).toFixed(decimal) * 1;

const numberToArray = (num) =>
  Array(num)
    .fill()
    .map((item, index) => index);

class Animal {
  constructor({ ...args }) {
    const { type, props, treeDepthAmount, parent, childIndex } = args;

    this.type = type;
    this.gender = ["boy", "girl"][randomNumberWithDecimalInRange({ min: 0, max: 1 })];
    this.treeDepthAmount = treeDepthAmount;
    this.parent = parent || null;
    this.childIndex = childIndex;
    this.props = props;

    this.deathYear = this.setRandomValue("deathYear");
    this.pregnancyStartsFrom = this.setRandomValue("pregnancyStartsFrom");
    this.pregnancyDuration = this.setRandomValue("pregnancyDuration");
    this.childrenAmountBornAtTime = this.setRandomValue("childrenAmountBornAtTime", 0);
    this.givingBirthAmount = props?.givingBirthAmount || null;
  }

  downgradeTree() {
    this.treeDepthAmount -= 1;
  }

  setRandomValue(field, decimal = 2) {
    return this.props[field]
      ? randomNumberWithDecimalInRange({ min: this.props[field].min, max: this.props[field].max, decimal })
      : null;
  }

  get name() {
    const singularAnimal = this.type.slice(0, -1);
    const postfix = `-${this.childIndex}`;
    const initialName = this.parent?.name ? this.parent.name : singularAnimal;

    return initialName + postfix;
  }

  get generateAge() {
    const isParentAge = this?.parent?.age;
    const min = 0;
    const decimal = 2;
    const max = isParentAge ? this.parent.age - this.pregnancyDuration : this.deathYear;

    return (this.age = randomNumberWithDecimalInRange({ min, max, decimal }));
  }

  get canGiveBirth() {
    return this.gender === "girl" && this.treeDepthAmount > 0 && this.age > this.pregnancyDuration;
  }

  get animalInfo() {
    const { givingBirthAmount, age, name, childrenAmountBornAtTime } = this;

    return { givingBirthAmount, age, name, childrenAmountBornAtTime };
  }

  get children() {
    return this.canGiveBirth
      ? new AnimalChildren({
          parent: this.animalInfo,
          props: this.props,
          type: this.type,
          childIndex: this.childIndex,
          treeDepthAmount: this.treeDepthAmount,
        }).create()
      : false;
  }

  create(twinsAge) {
    this.downgradeTree();

    const name = this.name;
    const age = (this.age = twinsAge || this.generateAge);
    const gender = this.gender;
    const children = this.children;

    return { name, age, gender, ...(children && { children }) };
  }
}

class AnimalChildren {
  constructor({ ...args }) {
    const { type, props, treeDepthAmount, parent } = args;

    this.type = type;
    this.parent = parent || null;
    this.treeDepthAmount = treeDepthAmount;
    this.props = props;
  }

  get children() {
    let min = 0;
    let max = 18;

    if (this.parent) {
      max = this.parent.givingBirthAmount;

      const givingBirthAmount = randomNumberWithDecimalInRange({ min, max });
      const givingBirthArray = numberToArray(givingBirthAmount);

      const arr = givingBirthArray.map(() => {
        return numberToArray(this.parent.childrenAmountBornAtTime);
      });

      return arr;
    }

    return numberToArray(randomNumberWithDecimalInRange({ min, max }));
  }

  createChild({ twinsAge, index }) {
    return new Animal({
      parent: this.parent,
      type: this.type,
      treeDepthAmount: this.treeDepthAmount,
      childIndex: index + 1,
      props: this.props,
    }).create(twinsAge);
  }

  areTwins(birth) {
    return Object.keys(birth).length;
  }

  getTwinsName(index) {
    return `twins-${index + 1}`;
  }

  getTwinsAge({ prev, index }) {
    return prev.length ? prev[index - 1].age : null;
  }

  getTwins(arr) {
    return arr.reduce((prev, _, index) => {
      const twinsAge = this.getTwinsAge({ prev, index });
      const child = this.createChild({ twinsAge, index });

      return { ...prev, [child.name]: child };
    }, {});
  }

  create() {
    return this.children.reduce((prev, curr, index) => {
      let key, value;

      if (this.areTwins(curr)) {
        key = this.getTwinsName(index);
        value = this.getTwins(curr);
      } else {
        value = this.createChild({ index });
        key = value.name;
      }

      return { ...prev, [key]: value };
    }, {});
  }
}

class Farm {
  constructor(animals) {
    this.animals = animals;
  }

  generateAnimalTree(type, props) {
    const treeDepthAmount = randomNumberWithDecimalInRange({ min: 2, max: 5 });
    return new AnimalChildren({ type, props, treeDepthAmount }).create();
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
    deathYear: {
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

console.log("---------------");
console.log("farm1:", farm1);
