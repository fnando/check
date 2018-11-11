import check from "./check";
import {strict as assert} from "assert";

function test(description, callback) {
  callback();
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
