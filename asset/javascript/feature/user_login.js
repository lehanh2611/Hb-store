/***** Import *****/
import {
    $,
    $$,
    modalLogReg,
    homeApi,
    plateBlurBody,
    PUTelement
}
    from "../end_point.js"
export let userActiveID = null,
    userAvt = $('.header__user-avt')
//Login user//
let contentDefault = $('.header__user-box').outerHTML
export function userLogin(UserID, acccounts) {
    let NotificationWelcome = $('.notification-welcome'),
        userBox = $('.header__user-box'),
        usernameBox = $('.header__user-name'),
        welcomeName = $('.notification-welcome__user-name'),
        welcomeAvt = $('.notification-welcome__user-avt'),
        moneyBox = $('.header__user-title');
    UserID = Number(UserID);
    userActiveID = UserID;

    Object.assign(userBox.style, {
        'flex-direction': ' column-reverse',
    });
    if (acccounts[UserID].Nickname !== undefined) {
        let nickName = acccounts[UserID].Nickname;
        usernameBox.innerHTML = nickName;
        welcomeName.innerHTML = nickName;
    }
    else {
        let username = acccounts[UserID].Username
        usernameBox.innerHTML = username;
        welcomeName.innerHTML = username;
    };
    if (acccounts[UserID].Avatar !== undefined) {
        let avatar = acccounts[UserID].Avatar;
        userAvt.src = avatar;
        welcomeAvt.src = avatar;
    }
    else {
        let defaultAvt = './asset/img/user-avt/user-default.png';
        userAvt.src = defaultAvt;
        welcomeAvt.src = defaultAvt;
    };
    let moneyFormat = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(acccounts[UserID].Money);
    moneyBox.innerHTML = `Số dư : ${moneyFormat}`;
    NotificationWelcome.classList.remove('on')
    setTimeout(() => { NotificationWelcome.classList.add('on') }, 30)
};

//Login succsessful
export function loginSuccess(UserID, acccounts) {
    // menuUser.classList.add('active')
    // modalLogReg.classList.add('hide', 'opacity')
    userLogin(UserID, acccounts)
}

//Logout 
export const logout = {
    start: function () {
        const logoutBtn = $('.header__user-menu .logout')
        logoutBtn.onclick = (e) => {
            //Reset value
            e.stopPropagation()
            $('.header__user-box').outerHTML = contentDefault
            userAvt.src = "./asset/img/user-avt/default.png"
            sessionStorage.clear()
            plateBlurBody.click()
            
            //Delete remember
            PUTelement(`${homeApi}/${userActiveID}`, {Devices: []})
            userActiveID = null
        }
    }
}

logout.start()