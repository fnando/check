import {condition} from "./index";
import {isFunction} from "./utils";

export const lt = condition((expect, actual) => actual < expect);
export const lte = condition((expect, actual) => actual <= expect);
export const gt = condition((expect, actual) => actual > expect);
export const gte = condition((expect, actual) => actual >= expect);
export const within = condition((lower, upper, actual) => actual >= lower && actual <= upper);

export const includes = condition((expected, actual) => {
  return actual && isFunction(actual.includes) && actual.includes(expected);
});

export const startsWith = condition((expected, actual) => {
  return actual && isFunction(actual.startsWith) && actual.startsWith(expected);
});

export const endsWith = condition((expected, actual) => {
  return actual && isFunction(actual.endsWith) && actual.endsWith(expected);
});
