class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.expressionDisplay = document.getElementById('expression');
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;

        this.initEventListeners();
    }

    initEventListeners() {
        // Button event listeners
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.decimal) {
                    this.addDecimal();
                } else {
                    this.addNumber(btn.dataset.number);
                }
            });
        });

        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setOperator(btn.dataset.operator);
            });
        });

        document.querySelectorAll('.btn-clear').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.action === 'clear') {
                    this.clear();
                } else if (btn.dataset.action === 'backspace') {
                    this.backspace();
                }
            });
        });

        document.querySelector('.btn-equals').addEventListener('click', () => {
            this.calculate();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    addNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentInput = num;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput += num;
        }
        this.updateDisplay();
    }

    addDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    setOperator(op) {
        if (this.currentInput === '') return;

        if (this.previousInput !== '' && this.operator !== null) {
            this.calculate();
        }

        this.operator = op;
        this.previousInput = this.currentInput;
        this.currentInput = '';
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    calculate() {
        if (this.currentInput === '' || this.previousInput === '' || this.operator === null) {
            return;
        }

        let result;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }

        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;

        this.currentInput = result.toString();
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    backspace() {
        this.currentInput = this.currentInput.toString().slice(0, -1);
        this.updateDisplay();
    }

    updateDisplay() {
        // Update main display
        this.display.value = this.currentInput || '0';

        // Update expression display
        if (this.operator) {
            this.expressionDisplay.textContent = `${this.previousInput} ${this.operator}`;
        } else {
            this.expressionDisplay.textContent = '';
        }
    }

    handleKeyboard(e) {
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.addNumber(e.key);
        }

        // Decimal point
        if (e.key === '.') {
            e.preventDefault();
            this.addDecimal();
        }

        // Operators
        if (e.key === '+') {
            e.preventDefault();
            this.setOperator('+');
        }

        if (e.key === '-') {
            e.preventDefault();
            this.setOperator('-');
        }

        if (e.key === '*') {
            e.preventDefault();
            this.setOperator('×');
        }

        if (e.key === '/') {
            e.preventDefault();
            this.setOperator('÷');
        }

        if (e.key === '%') {
            e.preventDefault();
            this.setOperator('%');
        }

        // Equals
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        }

        // Clear
        if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            this.clear();
        }

        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.backspace();
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
