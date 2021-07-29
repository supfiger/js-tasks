function currying(c) {
  const sum = (a, b) => a + b + c;
  const getValue = (args) => args.reduce((a, b) => sum(a, b), 0);

  return function next(...args) {
    return function (...calls) {
      return !calls.length ? getValue(args) : next(...args, getValue(calls));
    };
  };
}

console.log(currying(2)(1)(1)());
