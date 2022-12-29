/***** Import *****/
import {$,$$} from "../end_point.js"

//Notification window
export let notificationWindowBody = $('.notification');
export function notificationWindow(status = 'close', title, content, callback, contentBtn = null) {
    let titleElement = $('.notification__title'),
        contentElement = $('.notification__content'),
        agreeBox = $('.notification__btn'),
        close = $('.notification__close');
        
    //Notification close
    if (status === 'close') {
        notificationWindowBody.classList.remove('on', 'success', 'fail');
    }
    else {
        //Notification Form
        if (status) {
            notificationWindowBody.classList.add('success');
            agreeBox.innerHTML = contentBtn === null ? 'Đồng ý'  : contentBtn;
        }
        else {
            notificationWindowBody.classList.add('fail');
            agreeBox.innerHTML =contentBtn === null ?  'Thử lại': contentBtn;
        }

        //Render content
        titleElement.innerHTML = title;
        contentElement.innerHTML = content;

        notificationWindowBody.classList.add('on');
        //Listen event
        agreeBox.onclick = () => { callback(true) }
        close.onclick = () => { callback(false) }
    }
};