import { $, $$ } from "../end_point.js"

// Format money
export function formatMoney(value) {
    let moneyFormat = new Intl.NumberFormat('vi-VN',
        { style: 'currency', currency: 'VND' })
        .format(value);
    return moneyFormat
}

//Recursive//
export function recursive(timeOut, list, e, value1, value2, value3, value4,) {
    let listLength = list.length,
        i = 0;
    callBack()
    function callBack() {
        if (i <= listLength - 1) {
            e(list[i], i, value1, value2, value3, value4,);
            setTimeout(() => {
                callBack();
            }, timeOut);
        }
        else {
            return;
        };
        i++
    };
};