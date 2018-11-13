export function isInstanceOf(constructor, value) {
  // instanceof is not a good candidate because it ignores
  // primitives like string/number/boolean.
  return !isUndefined(value) && !isNull(value) && value.constructor === constructor;
}

export function isArray(value) {
  return isInstanceOf(Array, value);
}

export function isFunction(value) {
  return isInstanceOf(Function, value);
}

export function isString(value) {
  return isInstanceOf(String, value);
}

export function isRegExp(value) {
  return isInstanceOf(RegExp, value);
}

export function isUndefined(value) {
  return value === undefined;
}

export function isNull(value) {
  return value === null;
}

export function isNumber(value) {
  return isInstanceOf(Number, value);
}

export function isBoolean(value) {
  return isInstanceOf(Boolean, value);
}

export function equal(a, b) {
  return a == b;
}

export function matchNumber(a, b) {
  return isNumber(a) && isNumber(b) && equal(a, b);
}

export function matchString(a, b) {
  return isString(a) && isString(b) && equal(String(a), String(b));
}

export function matchBoolean(a, b) {
  return isBoolean(a) && isBoolean(b) && equal(a, b);
}

export function matchRegExp(string, regexp) {
  return isString(string) && isRegExp(regexp) && regexp.test(string);
}

export function match(input, condition) {
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
