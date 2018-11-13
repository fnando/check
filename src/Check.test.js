import {check, condition} from "./index";
import {strict as assert} from "assert";
import {lt, lte, gt, gte, within, includes, startsWith, endsWith} from "./conditions";

function test(description, callback) {
  try {
    callback();
    console.log(`\u001B[32m✅ ${description}\u001B[0m`);
  } catch (error) {
    console.log(`\u001B[31m❌ ${description}\u001B[0m`);
    console.log(error.stack.replace(/^/gm, "   "));
    process.exit(1);
  }
}

function call() {
  const func = function func(input) {
    func.called = true;
    func.input = input;
  };

  func.called = false;

  return func;
}

test("calls function for matched float", () => {
  const func1 = call();
  const func2 = call();

  check(1.3)
    .case(1.2, func1)
    .case(1.3, func2)
    .test();

  assert.ok(func2.called);
  assert.ok(!func1.called);
});

test("calls function for matched integer", () => {
  const func1 = call();
  const func2 = call();

  check(1)
    .case(1, func1)
    .case(2, func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("calls function for matched string", () => {
  const func1 = call();
  const func2 = call();

  check("hello")
    .case("hi", func1)
    .case("hello", func2)
    .test();

  assert.ok(!func1.called);
  assert.ok(func2.called);
});

test("calls function for matched boolean (true)", () => {
  const func1 = call();
  const func2 = call();

  check(true)
    .case(false, func1)
    .case(true, func2)
    .test();

  assert.ok(!func1.called);
  assert.ok(func2.called);
});

test("calls function for matched boolean (false)", () => {
  const func1 = call();
  const func2 = call();

  check(true)
    .case(true, func1)
    .case(false, func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("calls function for matched regexp", () => {
  const func1 = call();
  const func2 = call();

  check("hello")
    .case(/ll/, func1)
    .case("hello", func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("calls function for matched null", () => {
  const func1 = call();
  const func2 = call();

  check(null)
    .case(null, func1)
    .case("hello", func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("calls function for matched undefined", () => {
  const func1 = call();
  const func2 = call();

  check(undefined)
    .case(undefined, func1)
    .case("hello", func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("calls several matching functions when stop is false", () => {
  const func1 = call();
  const func2 = call();
  const func3 = call();

  check("hello")
    .case(/ll/, func1, false)
    .case("hello", func2, false)
    .case(3, func3, false)
    .test();

  assert.ok(func1.called);
  assert.ok(func2.called);
  assert.ok(!func3.called);
});

test("calls function for conditions array", () => {
  const func1 = call();
  const func2 = call();

  check("hello")
    .case([/ll/, "hello"], func1)
    .case("hello", func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("calls input function with value", () => {
  const func = call();

  check(1234)
    .case(1234, func)
    .test();

  assert.equal(func.input, 1234);
});

test("calls input function with value (input as function)", () => {
  const func = call();

  check(() => 1234)
    .case(1234, func)
    .test();

  assert.equal(func.input, 1234);
});

test("calls input function and compare its value", () => {
  const func1 = call();
  const func2 = call();

  check(() => 1)
    .case(1, func1)
    .case(2, func2)
    .test();

  assert.ok(func1.called);
  assert.ok(!func2.called);
});

test("don't call function for unmatched conditions array", () => {
  const func1 = call();
  const func2 = call();

  check("asdf")
    .case([/ll/, "hello"], func1)
    .case("hello", func2)
    .test();

  assert.ok(!func1.called);
  assert.ok(!func2.called);
});

test("don't call function when types are different", () => {
  const func = call();

  check("1")
    .case(1, func)
    .test();

  assert.ok(!func.called);
});

test("calls default function when nothing matches", () => {
  const func1 = call();
  const func2 = call();

  check("1")
    .case(1, func1)
    .test(func2);

  assert.ok(!func1.called);
  assert.ok(func2.called);
  assert.equal(func2.input, "1")
});

test("calls default function without case", () => {
  const func = call();

  check(1234)
    .test(func);

  assert.ok(func.called);
  assert.equal(func.input, 1234)
});

[
  // input, expected, result
  [1, 2, true],
  [2, 1, false],
  [1, 1, false]
].forEach(([input, expected, result]) => {
  test(`tests lt (${input} < ${expected} == ${result})`, () => {
    const func = call();

    check(input)
      .case(lt(expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

[
  // input, expected, result
  [1, 2, true],
  [2, 1, false],
  [1, 1, true]
].forEach(([input, expected, result]) => {
  test(`tests lte (${input} <= ${expected} == ${result})`, () => {
    const func = call();

    check(input)
      .case(lte(expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

[
  // input, expected, result
  [1, 2, false],
  [2, 1, true],
  [1, 1, false]
].forEach(([input, expected, result]) => {
  test(`tests gt (${input} > ${expected} == ${result})`, () => {
    const func = call();

    check(input)
      .case(gt(expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

[
  // input, expected, result
  [1, 2, false],
  [2, 1, true],
  [1, 1, true]
].forEach(([input, expected, result]) => {
  test(`tests gte (${input} > ${expected} == ${result})`, () => {
    const func = call();

    check(input)
      .case(gte(expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

[
  // input, expected, result
  [2, [1, 3], true],
  [4, [1, 3], false],
].forEach(([input, expected, result]) => {
  test(`tests within (${input} within ${expected.join("..")} == ${result})`, () => {
    const func = call();

    check(input)
      .case(within(...expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

[
  // input, expected, result
  ["hello", "ll", true],
  ["", "hello", false],
  [[1, 2, 3], 1, true],
  [[], 1, false],
  [undefined, 1, false],
  [null, 1, false],
  [true, 1, false],
  [false, 1, false],
].forEach(([input, expected, result]) => {
  test(`tests includes (${JSON.stringify(input)}.includes(${expected}) == ${result})`, () => {
    const func = call();

    check(input)
      .case(includes(expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

[
  // input, expected, result
  ["hello", "he", true],
  ["hello", "ll", false],
  [null, "he", false],
  [undefined, "he", false],
  [false, "he", false],
  [true, "he", false],
].forEach(([input, expected, result]) => {
  test(`tests startsWith (${JSON.stringify(input)}.startsWith(${expected}) == ${result})`, () => {
    const func = call();

    check(input)
      .case(startsWith(expected), func)
      .test();

    assert.ok(func.called === result);
  });
});

test("defines custom condition (no args)", () => {
  const func = call();
  const email = condition(actual => `${actual}`.match(/^.+@.+$/));

  check("john@example.com")
    .case(email(), func)
    .test();

  assert.ok(func.called);
});

test("defines custom condition (with args)", () => {
  const func = call();
  const range = condition((lower, upper, actual) => actual >= lower && actual <= upper);

  check(2)
    .case(range(1, 3), func)
    .test();

  assert.ok(func.called);
});
