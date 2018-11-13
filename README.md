# check

[![NPM package version](https://img.shields.io/npm/v/@fnando/check.svg)](https://www.npmjs.com/package/@fnando/check)
![License: MIT](https://img.shields.io/npm/l/@fnando/check.svg)
![Minified size](http://img.badgesize.io/fnando/check/master/dist/check.web.js.svg?label=min+size)
![Minified+Gzip size](http://img.badgesize.io/fnando/check/master/dist/check.web.js.svg?compression=gzip&label=min%2Bgzip+size)

An alternative for `switch` that resembles [Ruby](https://ruby-lang.org)'s `case`.

## Install

If you're using yarn:

    yarn add @fnando/check

If you're using npm:

    npm install @fnando/check

## Usage

The following example shows all supported type checkings:

```js
import check from "@fnando/check";

// `input` can be either a value or a function.
// When providing a function, the function is called only once
// before running `case`s.
const input = 1;

check(input)
  .case(1, () => console.log("Received one!"))
  .case(/^hello$/, () => console.log("Hello!"))
  .case("Hi", () => console.log("Hi!"))
  .case(undefined, () => console.log("input is undefined"))
  .case(null, () => console.log("input is null"))
  .case([true, false], () => console.log("boolean received"))
  .test(() => console.log("This is the default statement"));
```

Both `case` and `default` functions receive the input value.

```js
check(1)
  .case(1, number => console.log(`Received ${number}`))
  .test();

check(1)
  .test(number => console.log(`Received ${number}`));
```

You can also use custom conditions for more complex comparisons. [check](https://github.com/fnando/check) comes with a few util functions:

```js
import check from "@fnando/check";
import {within} from "@fnando/check/conditions";

check(2)
    .case(within(1, 3), () => console.log(`input is >= 1 and input <= 3`))
    .test();
```

To create your own condition function, use `condition` like the following:

```js
import {check, condition} from "@fnando/check";

const email = condition(actual => `${actual}`.match(/^.+@.+$/));
const range = condition((lower, upper, actual) => actual >= lower && actual <= upper);

check(someFunction())
  .case(email(), () => console.log("Email provided"))
  .case(range(1, 3), () => console.log("Number within 1..3 range"))
  .test();
```

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
