import {match, isFunction} from "./utils";

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
