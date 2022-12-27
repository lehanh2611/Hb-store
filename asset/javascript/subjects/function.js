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

// Select one element to list
export function select(listElment, callback) {

    //Handle event click
    for (let element of listElment) {
        element.onclick = () => {
            
            removeActive()
            element.classList.add('active')
            arguments.length >= 2 ? callback(element) : ''
        }
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