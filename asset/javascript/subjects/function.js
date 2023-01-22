import { $, $$, notificationWindow, validate } from "../end_point.js"

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

// Select one element to list
export function select(listElment, callback) {
    //Handle event click
    for (let element of listElment) {

        element.addEventListener('click', () => {
            if (element.classList.value.includes('disable')) { return }
            removeActive()

            element.classList.add('active')
            arguments.length >= 2 ? callback(element) : ''
        })
    }

    //Remove active
    var removeActive = () => {
        for (let element of listElment) {
            element.classList.remove('active')
        }
    }
}

//Ripple button

export function rippleBtn(elements) {

    for (let item of elements) {
        item.onclick = (e) => {
            const ripple = document.createElement('i')
            let pos = item.getBoundingClientRect()
            let x = e.clientX - pos.left
            let y = e.clientY - pos.top

            Object.assign(ripple.style, {
                'position': 'absolute',
                'background-color': 'transparent',
                'width': '10px',
                'height': '10px',
                'border-radius': '50%',
                'transform': 'translateX(-100%) translateY(-100%)',
                'mix-blend-mode': 'screen',
                'background-color': 'rgba(255, 255, 255, 0.291)',
                'animation': 'rippleBtn 1250ms ease-out forwards'
            })



            Object.assign(ripple.style, {
                'top': `${y}px`,
                'left': `${x}px`,
            })

            Object.assign(item.style, {
                position: 'relative',
                overflow: 'hidden'
            })

            item.appendChild(ripple)
            setTimeout(() => {
                ripple.remove()
            }, 1250);

        }
    }

}

export function toLowerCaseNonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}


export function fastAtc() {
    let clicks = 0
    window.addEventListener('click', () => {
        ++clicks
        if (clicks >= 5) {
            notificationWindow(false,
                'Thao tác quá nhanh',
                'vui lòng thao tác chậm lại',
                () => { notificationWindow() })
        }
    })
    setInterval(() => {
        clicks -= 6
        if (clicks < 0) { clicks = 0 }
    }, 1000);
}

//close with rules
export const closeWithRule = {
    rules: '',
    callback: '',
    ruleDefault: '.flash-sale__btn',

    run: function (e) {
        const elmActive = e.target

        if (!this.rules.some((v) => {
            return elmActive.closest(v)
        })) {
            this.callback()
        }
    },
    start: function (e, rules, callback) {
        this.rules = [...rules, this.ruleDefault]
        this.callback = callback
        this.run(e)
    }
}

// Simple notification 
let timeOutSimpleNotification
export function simpleNoti(content, status = true, timeOutClear) {
    const html = `<div class="simple-noti ${status === true ? '' : 'fail'}">${content}</p></div>`
    const notificationOld = $('.simple-noti')
    const notification = document.createElement('div')

    if (notificationOld) {
        clearTimeout(timeOutSimpleNotification)
        notificationOld.remove()
    }

    $('body').appendChild(notification)
    notification.outerHTML = html
    timeOutSimpleNotification = setTimeout(() => {
        $('.simple-noti').remove()
    }, 2000)
}

// Icon Shadow
export function iconShadow(selectors) {

    for (const selector of selectors) {
        const parent = selector
        const icon = selector.querySelector('img')
        const shadow = document.createElement('img')

        parent.style.position = 'relative'
        parent.appendChild(shadow)
        shadow.className = 'icon-shadow'
        shadow.src = icon.src

        Object.assign(shadow.style, {
            'position': 'absolute',
            'height': '100%',
            'width': '80%',
            'left': '10%',
            'bottom': '-10%',
            'opacity': '.5',
            'filter': 'blur(5px)',
            'border-radius': '20%',
            'z-index': '-1',
        })
    }
}

//New notification user
export function newNotiUser(newNoti = false) {
    const userContain = $('.header__user-contain')
    if (newNoti) {
        if(window.innerWidth >= 600){return}
        userContain.classList.add('showNewNoti')
    }
    else {
        userContain.classList.remove('showNewNoti')
    }
}

//Footer
export const footer = {
    submit: function () {
        const form = $('.submitForm')
        const submit = $('.footer__get-new-submit')
        const selector = {
            input: form.querySelector('input'),
            message: form.querySelector('message'),
        }
        let result

        form.addEventListener('submit', (e) => { e.preventDefault() })

        selector.input.oninput = () => {
            selector.message.innerText = ''
        }

        submit.onclick = () => {
            result = validate.start(selector, ['required', 'email'])

            if (result) {
                simpleNoti('Đã đăng ký nhận tin')
            }
        }
    },

    start: function () {
        this.submit()
    }
}