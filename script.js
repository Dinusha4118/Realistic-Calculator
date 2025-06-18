document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    const equalsButton = document.getElementById('equals');

    let currentInput = '';

    // Function to handle button clicks
    buttons.forEach(button => {
        if (button.id !== 'clear' && button.id !== 'delete' && button.id !== 'equals') {
            button.addEventListener('click', () => {
                const value = button.dataset.value;

                // Avoid multiple operators next to each other
                if (isOperator(currentInput.slice(-1)) && isOperator(value)) {
                    return;
                }
                
                // Append value to the display
                currentInput += value;
                display.value = currentInput;
            });
        }
    });

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        currentInput = '';
        display.value = '';
    });

    // Delete button functionality
    deleteButton.addEventListener('click', () => {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
    });

    // Equals button functionality
    equalsButton.addEventListener('click', () => {
        if (currentInput === '') return;
        
        try {
            // Replace visual operators with evaluable ones
            let expression = currentInput.replace(/÷/g, '/').replace(/×/g, '*').replace(/%/g, '/100*');
            
            // Handle percentage calculation correctly
            if (expression.includes('/100*')) {
                 // Logic for expressions like '50+10%' which means 50 + (50 * 0.10)
                const parts = expression.split(/([+\-*/])/);
                if(parts.length === 3 && parts[2].endsWith('/100*')){
                    const base = parseFloat(parts[0]);
                    const percentVal = parseFloat(parts[2].replace('/100*',''));
                    const operator = parts[1];
                    switch(operator){
                         case '+': result = base + (base * percentVal / 100); break;
                         case '-': result = base - (base * percentVal / 100); break;
                         case '*': result = base * (percentVal / 100); break;
                         case '/': result = base / (percentVal / 100); break;
                    }
                } else {
                     result = eval(expression);
                }

            } else {
                 result = eval(expression);
            }
            
            display.value = roundResult(result);
            currentInput = display.value;
        } catch (error) {
            display.value = 'Error';
            currentInput = '';
        }
    });
    
    // Helper function to check if a value is an operator
    function isOperator(value) {
        return ['+', '-', '*', '/', '÷', '×', '%'].includes(value);
    }
    
    // Helper function to round the result if it's a float
    function roundResult(value) {
        return parseFloat(value.toFixed(10));
    }
});