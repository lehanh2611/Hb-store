/***** Import *****/
import { $, $$ } from "../end_point.js"

//plateBlur
let i = 0
export let plateBlurBody = $('.plateBlur');
export function plateBlur(value = true,) {
    if (value === true) {
        ++i
        plateBlurBody.classList.remove('hide');
        setTimeout(() => {
            plateBlurBody.classList.remove('opacity');
        }, 30);
    }
    else {
        --i
        if (i <= 0) {
            plateBlurBody.classList.add('opacity');
            setTimeout(() => {
                plateBlurBody.classList.add('hide');
            }, 500);
        }
    };
};