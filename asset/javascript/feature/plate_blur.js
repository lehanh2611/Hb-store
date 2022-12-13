/***** Import *****/
import {$,$$} from "../end_point.js"

//plateBlur
export let plateBlurBody = $('.plateBlur');
export function plateBlur(value = true,) {
    if (value !== true) {
        plateBlurBody.classList.add('opacity');
        setTimeout(() => {
            plateBlurBody.classList.add('hide');
        }, 500);
    }
    else {
        plateBlurBody.classList.remove('hide');
        setTimeout(() => {
            plateBlurBody.classList.remove('opacity');
        }, 30);
    };
};