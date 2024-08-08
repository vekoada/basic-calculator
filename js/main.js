const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys"); //emphasizing that these elements are children of calculator
const display = calculator.querySelector(".calculator__display");

keys.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return; //closest() can travel up the element hierarchy, but matches() stays on the same element

  const key = event.target;
  const keyValue = key.textContent; //gets text content of the selected element (this a property)
  const displayValue = display.textContent; //again, a property
  const type = key.dataset.type; // dataset exposes a map of strings with read/write access for custom attributes: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  const previousKeyType = calculator.dataset.previousKeyType;

  if (type === "clear") {
    display.textContent = "0";
    delete calculator.dataset.firstNumber;
    delete calculator.dataset.operator;
  }

  if (type === "number") {
    //Handle numbers differently from operators. Modeled after iPhone calculator behavior
    if (displayValue === "0" || previousKeyType === "operator") {
      display.textContent = keyValue;
    } else {
      display.textContent = displayValue + keyValue; // concat the entered values
    }
  }

  if (type === "operator") {
    const operatorKeys = keys.querySelectorAll('[data-type="operator"');
    operatorKeys.forEach((el) => {
      el.dataset.state = "";
    });
    key.dataset.state = "selected";

    calculator.dataset.firstNumber = displayValue;
    calculator.dataset.operator = keyValue;
  }

  if (type === "equal") {
    const firstNumber = calculator.dataset.firstNumber;
    const operation = calculator.dataset.operator;
    const secondNumber = displayValue;

    display.textContent = getResult(firstNumber, operation, secondNumber); //getResult() defined on line 57
    calculator.dataset.firstNumber = displayValue;
  }

  calculator.dataset.previousKeyType = type; // sets to either "number" or "operator" depending on key pressed
});

/* We need to be able to save the calculator's state to check what the previous entry was. If it was an operator, we want to clear the display so that
the next enter numerical sequence is displayed. Then, on pressing equals, we want to clear the display and show the result of the calculation.

Getting the second number is easy - it's whatever is displayed. After the operator key is pressed and the second number is pressed, we lose the information about
the first number and the operator. So, we need to save these in the operator if statement.
*/

function getResult(firstNumber, operation, secondNumber) {
  // Called on line 43
  const a = parseFloat(firstNumber);
  const b = parseFloat(secondNumber);

  switch (operation) { // Handles operations
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return a / b;
  }
}

// ==============================
// TESTING
// ==============================
function clearCalculator() { // used to clear the calculator for testing
  const clearKey = document.querySelector('[data-type="clear"]');
  clearKey.click();
  operatorKeys.forEach(key => { key.dataset.state = ""; }); // Also needs to get rid of the selected state
}

function testClear() {
  clearCalculator();
  console.assert(display.textContent === "0", "display is 0");
  console.assert(!calculator.dataset.firstNumber, "firstNumber is undefined");
  console.assert(!calculator.dataset.operator, "operator is undefined");
}

function testSequence(test) { // Create repeatable test structure for many different key combinations
  clearCalculator();
  test.keys.forEach((key) => {
    document.querySelector(`[data-key="${key}"]`).click();
  });
  console.assert((display.textContent === test.result), test.message);
  clearCalculator();
  testClear();
}

const tests = [{
  keys: ["1"],
  result: "1",
  message: "Clicked 1" // Simple click test
}, {
  keys: ["1", "2"],
  result: "12",
  message: "Clicked 1 and 2" // Double click test
}, {
  keys: ["1", "plus", "2", "equals"],
  result: "3",
  message: "Clicked 1 + 2" // Addition test
}, {
  keys: ["2", "times", "3", "equals"],
  result: "6",
  message: "Clicked 2 * 3" // Multiplication test
}, {
  keys: ["9", "divide", "3", "equals"],
  result: "3",
  message: "Clicked 9 / 3" // Division test
}, {
  keys: ["3", "5", "8", "times", "192", "equals"],
  result: "6720",
  message: "Clicked 358 * 192" // Bigger multiplication test
}, {
  keys: ["3", ".", "1", "4", "1", "5", "9", "times", "3", ".", "1", "4", "1", "5", "9", "equals"],
  result: "9.8695877281",
  message: "Clicked 3.14159 * 3.14159" // Decimal test
}, {
  keys: ["1", "divide", "0", "equals"],
  result: "Infinity",
  message: "Clicked 1 / 0" // Division by zero test
}];

tests.forEach(testSequence);

// ==============================
// There are still some edge cases. We need to make sure that if the user clickes the equals key twice in a row, the calculator will clear itself. 
// Also, we should add support for multiples ways of clearing. Right now, we clear everything, but we should also be able to clear the last number or the last operator.
// Also, we should add support for chaining operations. Users should be able to click an operator, then click a number, then click an operator again, etc, and the calculator should display the result at each segment of the operation.
// It would be good to add parentheses to the calculator for clear order of operations.
// It would also be nice to add support for keyboard input.
// ==============================





