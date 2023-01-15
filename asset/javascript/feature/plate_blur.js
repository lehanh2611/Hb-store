/***** Import *****/
import { $, $$ } from "../end_point.js"

//plateBlur
let modals = []
export let plateBlurBody = $('.plateBlur');
export function plateBlur(value = true, selectModal) {
    if (selectModal) { modals = [...modals, selectModal] }

    if (value === true) {
        plateBlurBody.classList.remove('hide');
        setTimeout(() => {
            plateBlurBody.classList.remove('opacity');
        }, 30);
    }
    else {
        if (modals.some(v => v.classList.value.includes('active'))) { return }
        plateBlurBody.classList.add('hide', 'opacity');
        modals = []
    };
};