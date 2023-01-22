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
        const result = modals.some(v => {
            const value = v.classList.value
            return value.includes('active') || value.includes('show')
        })
        if (result) { return }
        plateBlurBody.classList.add('hide', 'opacity');
        modals = []
    };
};