function isInstanceOf(constructor, value) {
  // instanceof is not a good candidate because it ignores
  // primitives like string/number/boolean.
  return !isUndefined(value) && !isNull(value) && value.constructor === constructor;
}

function isArray(value) {
  return isInstanceOf(Array, value);
}

function isFunction(value) {
  return isInstanceOf(Function, value);
}

function isString(value) {
  return isInstanceOf(String, value);
}

function isRegExp(value) {
  return isInstanceOf(RegExp, value);
}

function isUndefined(value) {
  return value === undefined;
}

function isNull(value) {
  return value === null;
}

function isNumber(value) {
  return isInstanceOf(Number, value);
}

function isBoolean(value) {
  return isInstanceOf(Boolean, value);
}

function equal(a, b) {
  return a == b;
}

function matchNumber(a, b) {
  return isNumber(a) && isNumber(b) && equal(a, b);
}

function matchString(a, b) {
  return isString(a) && isString(b) && equal(String(a), String(b));
}

function matchBoolean(a, b) {
  return isBoolean(a) && isBoolean(b) && equal(a, b);
}

function matchRegExp(string, regexp) {
  return isString(string) && isRegExp(regexp) && regexp.test(string);
}

function match(input, condition) {
  if (matchRegExp(input, condition)) {
    return true;
  } else if (matchBoolean(input, condition)) {
    return true;
  } else if (matchNumber(input, condition)) {
    return true;
  } else if (matchString(input, condition)) {
    return true;
  } else if (isArray(condition)) {
    return condition.some(cond => match(input, cond));
  } else {
    return input === condition;
  }
}

export class Check {
  constructor(input) {
    this.input = input;
    this.conditions = [];
  }

  case(condition, func, stop = true) {
    this.conditions.push({condition, func, stop});
    return this;
  }

  test(fallback = () => {}) {
    let matched = false;
    const input = isFunction(this.input) ? this.input() : this.input;

    for (let info of this.conditions) {
      const {condition, func, stop} = info;

      if (match(input, condition)) {
        matched = true;
        func(input);

        if (stop) {
          break;
        }
      }
    }

    if (!matched) {
      fallback(input);
    }
  }
}

export default function check(input) {
  return new Check(input);
}
