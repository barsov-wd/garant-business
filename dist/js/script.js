document.addEventListener('DOMContentLoaded', () => {
    const sumInput = document.querySelector('.calc__input--sum'),
        timeInput = document.querySelector('.calc__input--time'),
        payt = document.querySelector('.calc__pt'),
        rangeTimeInput = document.querySelector('.range__input--time'),
        rangeSumInput = document.querySelector('.range__input--sum'),
        dateText = document.querySelector('.calc__input-text-right--date');

    // range + calc

    // маска
    function prettify(num) {
        var n = num.toString();
        return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    function getPayment(sum, period, rate) {
        // *
        // * sum - сумма кредита
        // * period - срок в годах
        // * rate - годовая ставка в процентах
        // * payt - поле, куда будет вывобиться платеж
        let i,
            koef;

        // ставка в месяц
        i = (rate / 12) / 100;

        // коэффициент аннуитета
        koef = (i * (Math.pow(1 + i, period * 12))) / (Math.pow(1 + i, period * 12) - 1);

        // итог
        payt.textContent = (sum * koef).toFixed().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    function range(input, progress, content) {
        const input$ = document.querySelector(input);
        const progress$ = document.querySelector(progress);
        if (input$) {
            const val = input$.value;
            const min = input$.getAttribute('min');
            const max = input$.getAttribute('max');
            const step = input$.getAttribute('step');
            const position = 100 / (max - step) * (val - step);
            updateRangePosition(progress$, position);

            input$.addEventListener('input', () => {
                const val = input$.value;
                const min = input$.getAttribute('min');
                const max = input$.getAttribute('max');
                const step = input$.getAttribute('step');
                const position = 100 / (max - step) * (val - step);
                updateRangePosition(progress$, position);
                content.value = prettify(val);
            });
        }
    }

    function updateRangePosition(progress$, position) {
        if (progress$) {
            progress$.style.width = `${position}%`;
        }
    }

    function calc() {
        let sum = +sumInput.value.replace(/\D/g, ''),
            period = +timeInput.value.replace(/\D/g, '');

        getPayment(sum, period, 6.5);
    }



    function checkSymbols(input, event, maxValue) {
        input.addEventListener(event, () => {
            if (maxValue) {
                if (input.value[0] == 0) {
                    input.value = input.value.replace(/./g, '');
                }

                input.value = input.value.replace(/\D/g, '');

                input.value = prettify(input.value);

                if (+input.value.replace(/\D/g, '') > maxValue) {
                    input.value = prettify(maxValue);
                }
            }
            if ((+sumInput.value.replace(/\D/g, '') >= 100000 && +sumInput.value.replace(/\D/g, '') <= 100000000) && (+timeInput.value.replace(/\D/g, '') >= 1 && +timeInput.value.replace(/\D/g, '') <= 10)) {
                calc();
            } else {
                payt.textContent = '0';
            }

            switch (timeInput.value) {
                case '1':
                    dateText.textContent = 'год';
                    break;

                case '2':
                case '3':
                case '4':
                    dateText.textContent = 'года';
                    break;
                default:
                    dateText.textContent = 'лет';
            }
        });
    }

    range('.range__input--sum', '.range__track--sum', sumInput);
    range('.range__input--time', '.range__track--time', timeInput);
    checkSymbols(sumInput, 'input', 100000000);
    checkSymbols(timeInput, 'input', 10);
    checkSymbols(rangeSumInput, 'change');
    checkSymbols(rangeTimeInput, 'change');
});