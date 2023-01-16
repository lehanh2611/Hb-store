/***** Import *****/
import {
    $,
    $$,
    modalLogReg,
    accountApi,
    plateBlurBody,
    PATCHelement,
    defaultAvt,
    logHistory,
    formatMoney,
    cart
}
    from "../end_point.js"
export let userActiveID = null,
    userAvt = $('.header__user-avt')
//Login user//
export function userLogin(UserID, accounts) {
    let NotificationWelcome = $('.notification-welcome'),
        userBox = $('.header__user-box'),
        usernameBox = $('.header__user-name'),
        welcomeName = $('.notification-welcome__user-name'),
        welcomeAvt = $('.notification-welcome__user-avt'),
        moneyBox = $('.header__user-title'),
        User = accounts[Number(UserID)],
        cartLocal = JSON.parse(localStorage.getItem('cart'))


    if (!User) { return }
    userActiveID = User.UserID;

    //Reset input value
    $$('.menu-logReg-modal input').forEach(
        (element) => element.value = '')

    Object.assign(userBox.style, {
        'flex-direction': ' column-reverse',
    });

    if (User?.Nickname !== '') {
        let nickName = User.Nickname;
        usernameBox.innerHTML = nickName;
        welcomeName.innerHTML = nickName;
    }
    else {
        let username = User.Username
        usernameBox.innerHTML = username;
        welcomeName.innerHTML = username;
    };

    if (User?.Avatar !== '') {
        let avatar = User.Avatar;
        userAvt.src = avatar;
        welcomeAvt.src = avatar;
    }
    else {
        userAvt.src = defaultAvt;
        welcomeAvt.src = defaultAvt;
    };

    moneyBox.innerHTML = formatMoney(User.Money);
    NotificationWelcome.classList.remove('on')
    
    if (User.Cart?.length === 0 && cartLocal !== null) {
        PATCHelement(`${accountApi}/${UserID}`, { Cart: cartLocal })
    } else {
        cart.cartData = User.Cart
    }
    setTimeout(() => { NotificationWelcome.classList.add('on') }, 30)
};

//Login succsessful
export function loginSuccess(UserID, accounts) {

    userLogin(UserID, accounts)
}

//Logout 
export const logout = {
    start: function () {
        let contentDefault = $('.header__user-box').outerHTML
        const logoutBtn = $('.header__user-menu .logout')
        logoutBtn.onclick = (e) => {
            //Reset value
            // e.stopPropagation()
            $('.header__user-box').outerHTML = contentDefault
            userAvt.src = "./asset/img/user-avt/default.png"
            sessionStorage.clear()
            plateBlurBody.click()

            // Delete remember
            logHistory.deleteTrustedDevice()
            userActiveID = null
            sessionStorage.removeItem('rememberLogInfo')
            localStorage.removeItem('rememberLogInfo')
            localStorage.removeItem('cart')
            cart.cartData = ''
            cart.renderCart([])
        }
    }
}