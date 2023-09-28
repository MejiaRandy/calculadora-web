let isNewCalculation = true;
let lastInputWasOperator = false;

function storeCalculation(expression, result) {
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    calculations.push({ expression, result });
    localStorage.setItem('calculations', JSON.stringify(calculations));
}

function displayStoredCalculations() {
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const historyElement = document.getElementById('history');
    
    // Clear existing content
    historyElement.innerHTML = '';

    // Display stored calculations
    calculations.forEach((calculation, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Calculation ${index + 1}: ${calculation.expression} = ${calculation.result}`;
        historyElement.appendChild(listItem);
    });
}

// Function to clear stored calculations
function clearStoredCalculations() {
    localStorage.removeItem('calculations');
    displayStoredCalculations(); // Clear the displayed history
}

// Initialize and display stored calculations when the page loads
document.addEventListener("DOMContentLoaded", function () {
    displayStoredCalculations();
    
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

    // Add event listener for the "Clear History" button
    const clearHistoryButton = document.getElementById('clearHistory');
    clearHistoryButton.addEventListener("click", clearStoredCalculations);
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
            isNewCalculation = true;
            lastInputWasOperator = false;
            storeCalculation(input, result);
            displayStoredCalculations();
        } else {
            display.value = 'Error';
            setTimeout(clearDisplay, 1000);
        }
    } catch (error) {
        display.value = error.message;
        setTimeout(clearDisplay, 1000);
    }
}
