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

  switch (operation) {
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
