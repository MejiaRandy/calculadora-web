// main.js
let isNewCalculation = true;
let lastInputWasOperator = false;

function calculate() {
    const display = document.getElementById('display');
    const input = display.value;

    try {
        if (!isNewCalculation && (lastInputWasOperator || /[+\-*/]/.test(input[0]))) {
            // Check if the last input was an operator or if the first character is an operator
            throw new Error('Invalid input');
        }

        // Additional validation to catch expressions like "5 ** 5" or "20 // 40"
        if (/(\*\*|\/\/)/.test(input)) {
            throw new Error('Invalid operation');
        }

        const result = eval(input);

        if (!isNaN(result)) {
            display.value = result;
            isNewCalculation = true; // Reset the calculation flag
            lastInputWasOperator = false; // Reset the operator flag
        } else {
            display.value = 'Error';
            setTimeout(clearDisplay, 1000);
        }
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1000);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("input[type='button']");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            if (button.value === '=') {
                calculate();
            } else if (button.value === 'C') {
                clearDisplay();
            } else {
                appendToDisplay(button.value);
            }
        });
    });
});

function appendToDisplay(value) {
    isNewCalculation = false;
    if (/[+\-*/]/.test(value)) {
        lastInputWasOperator = true;
    } else {
        lastInputWasOperator = false;
    }
    document.getElementById('display').value += value;
}

function clearDisplay() {
    isNewCalculation = true;
    lastInputWasOperator = false;
    document.getElementById('display').value = '';
}
