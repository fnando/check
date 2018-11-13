import {Check} from "./Check";

export function condition(func) {
  return (...expected) => (actual => func(...expected, actual));
}

export function check(input) {
  return new Check(input);
}

export default check;
