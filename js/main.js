const keys = document.querySelector(".calculator__keys");
const display = document.querySelector(".calculator__display");

keys.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return; //closest() can travel up the element hierarchy, but matches() stays on the same element

  const key = event.target;
  const keyValue = key.textContent; //gets text content of the selected element (this a property)
  const displayValue = display.textContent; //again, a property

  if (displayValue === "0") {
    display.textContent = keyValue;
  } else {
    display.textContent = displayValue + keyValue; // concat the entered values
  }
});
