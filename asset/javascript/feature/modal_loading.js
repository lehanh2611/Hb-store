/***** Import *****/
import {$,$$} from "../end_point.js"

//ModalLoading
export let bodyModalLoading = $('.loading')
export function modalLoading(status = true) {
    if(status) {
        bodyModalLoading.style.display = 'flex';
    }
    else {
    bodyModalLoading.style.display = 'none';
    }
};