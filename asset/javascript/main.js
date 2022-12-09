//.....import.....//
import { acccounts, recursive } from "./base.js";
// import { acccounts } from "./base.js";
import { homeApi } from "./base.js";
import { GETelement } from "./base.js";
import { POSTelement } from "./base.js";
import { PUTelement } from "./base.js";
import { DELETEelement } from "./base.js";
//***** Global *****/

//Variable//
let userActiveID = '';
//Listen button Notification window
let notificationWindowBtn = document.querySelector('.notification__btn');

//Close button Notification Window
let closeNotificationWindowBtn = document.querySelector('.notification__close');
//Function//
//Notification window
let notificationWindow = document.querySelector('.notification');
function openNotificationWindow(status, title, content, contentBtn) {
    let titleElement = document.querySelector('.notification__title'),
        contentElement = document.querySelector('.notification__content'),
        contentBtnElement = document.querySelector('.notification__btn');

    switch (status) {
        case 'success': {
            notificationWindow.classList.add('success');
        }
            break

        case 'fail': {
            notificationWindow.classList.add('fail');
        }
            break
    };
    notificationWindow.classList.add('on');
    titleElement.innerHTML = title;
    contentElement.innerHTML = content;
    contentBtnElement.innerHTML = contentBtn;
};
//Notification window - message erorr
function notificationWindowErorr() {
    openNotificationWindow(
        'fail',
        'Có lỗi sảy ra',
        'Vui lòng thử lại sau!',
        'Đóng');
}
//Close Notification Window
closeNotificationWindowBtn.addEventListener('click', closeNotificationWindow)
function closeNotificationWindow() {
    notificationWindow.classList.remove('on', 'success', 'fail');
};

//PlateBlur
let PlateBlur = document.querySelector('.plateBlur');
function offPlateBlur() {
    PlateBlur.classList.add('opacity');
    setTimeout(() => {
        PlateBlur.classList.add('hide');
    }, 500);
};
function onPlateBlur() {
    PlateBlur.classList.remove('hide');
    setTimeout(() => {
        PlateBlur.classList.remove('opacity');
    }, 30);
};

//Loading
let modalLoading = document.querySelector('.loading')
loading()
function loading() {
    let title = document.querySelector('.loading__title'),
        content = title.innerHTML,
        i = 0;
    setInterval(() => {
        if (i < 3) {
            title.innerHTML += '.';
            i++;
        }
        else {
            setTimeout(() => {
                title.innerHTML = content;
                i = 0;
            }, 500);
        }
    }, 1000);
}

/***** Header *****/
header();
function header() {
    let input = document.querySelector('.header__input')
    changeSize();
    function changeSize() {
        let logo = document.querySelector('.header__logo'),
            leftHeader = document.querySelector('.header__logo-box'),
            rightHeader = document.querySelector('.header__navigation')

        setInterval(() => {
            if (window.innerWidth < 840) {
                logo.setAttribute('src', './asset/img/logo-mobile.png');
                leftHeader.classList.add('m-3');
                rightHeader.classList.add('m-4');
            }
            else {
                logo.setAttribute('src', './asset/img/logo.png');
                leftHeader.classList.remove('m-3');
                rightHeader.classList.remove('m-4');
            }
        }, 200);
    };

    headerInput();
    function headerInput() {
        let cursor = document.querySelector('.header__input-cursor')

        setInterval(() => { cursor.classList.toggle('flicker') }, 600);
        input.addEventListener('input', (e) => {
            cursor.style.display = 'none';
            input.style.caretColor = 'unset';
            if (e.target.value == '') {
                cursor.style.display = 'block';
                input.style.caretColor = 'transparent';
            };
            if (e.target.value.length > 9) {
                e.target.value = e.target.value.slice(0, 9);
            };
        });

    };

    //Go head
    goHead();
    function goHead() {
        let headBtn = document.querySelector('.header__logo-box .btn-gohead');
        headBtn.onclick = () => {
            window.scroll({
                top: 0,
                behavior: 'smooth'
            });
        };
    };

    // MenuSearch
    let menuSearch = document.querySelector('.header__menu-search'),
        keySearchs = document.querySelectorAll('.header__menu-search-key'),
        keyLength = keySearchs.length - 1,
        arrayKey = [],
        marginKey = 0,
        i = 0,
        colors = [
            'rgb(255, 0, 0)',
            'rgb(255, 0, 132)',
            'rgb(255, 242, 0)',
            'rgb(0, 21, 255)',
            'rgb(0, 255, 47)',
            'rgb(255, 0, 132)',
            'rgb(255, 242, 0)',
            'rgb(0, 255, 47)',
            'rgb(255, 0, 0)'
        ];

    // PositionToSearch
    recursive(0, keySearchs, position)
    function position(element) {
        marginKey += 15
        element.style.opacity = 1;
        if (element.innerText === 'c') {
            element.style.left = (marginKey -= 4) + 'px';
        }
        if (element.innerText === 's') {
            element.style.left = (marginKey += 8) + 'px';
        }
        element.style.left = marginKey + 'px';
        i++
    }

    // AimationIn
    input.addEventListener('click', animationInput)
    function animationInput() {
        // Random/copy Array
        for (let item of keySearchs) {
            if (Number.parseInt(Math.random() * keyLength) % 2 != 0) {
                arrayKey.push(item)
            }
            else {
                arrayKey.unshift(item)
            }
        }
        // menuSearch.style.display = 'flex';
        setTimeout(() => {
            recursive(100, arrayKey, step1)
            function step1(element, index) {
                element.style.top = '10%'

            }

        }, 0)
    };

    //  Login/register menu
    LogRegMenu()
    function LogRegMenu() {
        let modalLogRegBtn = document.querySelector('.header__user-contain'),
            openLoginBtn = document.querySelector('.menu-logReg--register .openLogin'),
            openRegisterBtn = document.querySelector('.menu-logReg--login .openRegister'),
            notifictionBtn = document.querySelector('.header__user-notification-icon'),
            registerMenu = document.querySelector('.menu-logReg--register'),
            loginMenu = document.querySelector('.menu-logReg--login'),
            hidePassWordBtns = document.querySelectorAll('.menu-logReg__hidePWBtn'),
            inputPassWords = document.querySelectorAll('.menu-logReg__input-password');

        // Show/Hide pass word
        for (let hidePassWordBtn of hidePassWordBtns) {
            hidePassWordBtn.addEventListener('click', showHidePassWord);
        }

        function showHidePassWord() {
            let btnTop = (this.getBoundingClientRect()).top;
            let btnBottom = (this.getBoundingClientRect()).bottom;
            for (let inputPassWord of inputPassWords) {
                let inputTop = (inputPassWord.getBoundingClientRect()).top
                let inputBotom = (inputPassWord.getBoundingClientRect()).bottom;;
                if (btnTop <= inputTop && btnBottom >= inputBotom) {
                    this.classList.toggle('fa-eye-slash');
                    if (inputPassWord.type === 'password') {
                        inputPassWord.type = 'text';
                    }
                    else {
                        inputPassWord.type = 'password';
                    };
                };
            };
        };

        // Close login/register
        function closeLogin() {
            loginMenu.classList.add('hide', 'opacity');
        }
        function closeRegister() {
            registerMenu.classList.add('hide', 'opacity');
        }

        //Stop propagation
        let modalLogReg = document.querySelector('.menu-logReg-modal')
        modalLogReg.onclick = (e) => { e.stopPropagation() }

        //Wait For execution
        function OpenModalLoading() {
            document.querySelector('.loading .loading__box')
                .style.transform = 'translateY(55px)'
            modalLoading.style.display = 'flex';
        };
        //Done execution
        function CloseModalLoading() {
            modalLoading.style.display = 'none';
        };



        // Open modal login/register
        modalLogRegBtn.addEventListener('click', openmodalLogReg)
        function openmodalLogReg() {
            setTimeout(() => {
                onPlateBlur()
            }, 300);
            modalLogReg.classList.remove('hide');
            setTimeout(() => {
                modalLogReg.classList.remove('opacity');
            }, 30);
            //Add modal loading
            let LogRegWrap = document.querySelector('.menu-logReg__wrap')
            LogRegWrap.appendChild(modalLoading)
            //Add notification window
            LogRegWrap.appendChild(notificationWindow);
        };

        //Animation sticker
        let sticker = document.querySelector('.menu-logReg__sub-sticker')
        let iUp = 0,
            iDown = 0,
            spaceUp = -4,
            spaceDown = -4;

        modalLogRegBtn.addEventListener('click', animationSickerUp)
        function animationSickerUp() {
            modalLogRegBtn.removeEventListener('click', animationSickerUp)
            if (iUp < 7) {
                setTimeout(() => {
                    sticker.style.top = spaceUp + 'px'
                    animationSickerUp()
                }, 1000);
            }
            else {
                setTimeout(() => {
                    animationSickerDown()
                }, 2000);
            }
            spaceUp -= 10;
            iUp++;
        };

        function animationSickerDown() {
            sticker.style.top = spaceDown + 'px';
            iUp = 0;
            spaceUp = -4;
            animationSickerUp()
        };

        // Close modal login/register
        function closemodalLogReg() {
            offPlateBlur()
            closeNotificationWindow()
            modalLogReg.classList.add('hide');
            setTimeout(() => {
                modalLogReg.classList.add('opacity');
            }, 30);
        };

        // Close modal login/register
        let close = document.querySelectorAll('.menu-logReg .close-btn');
        for (let btn of close) {
            btn.onclick = () => { closemodalLogReg() }
        }

        // Open menu login
        openLoginBtn.addEventListener('click', openLogin);
        function openLogin() {
            closeRegister()
            removeMessageErorr()
            setTimeout(() => {
                loginMenu.classList.remove('opacity');
            }, 60);
            loginMenu.classList.remove('hide');
        };

        // Open menu register
        openRegisterBtn.addEventListener('click', openRegister);
        function openRegister() {
            closeLogin()
            removeMessageErorr()
            setTimeout(() => {
                registerMenu.classList.remove('opacity');
            }, 60);
            registerMenu.classList.remove('hide');
        };

        //Check input value
        let usernames = document.querySelectorAll('.menu-logReg__input-username'),
            passWords = document.querySelectorAll('.menu-logReg__input-password'),
            passWordConfirm = document.querySelectorAll('.menu-logReg__input-password.confirm'),
            emails = document.querySelectorAll('.menu-logReg__input-email'),
            parentElement,
            oldParentElement,
            box,
            createFollowers = [
                {
                    type: 'Tên tài khoản',
                    value: usernames
                },
                {
                    type: 'Mật khẩu',
                    value: passWords
                },
                {
                    type: 'Mật khẩu xác nhận',
                    value: passWordConfirm
                },
                {
                    type: 'Email',
                    value: emails
                }
            ];

        //Check input
        createFollowers.forEach((elements) => {
            elements.value.forEach((element) => {
                element.oninput = (e) => { sendMessage(e.target, elements.type) }
            });
        });
        function sendMessage(element, style) {
            let value = element.value,
                usernameFormat = new RegExp("^[a-zA-Z0-9 ]+$"),
                emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                messageExceedLength = 'có độ dài tối đa là 30 ký tự',
                messageFormatErorr = 'phải là các ký tự a-Z và 0-9</p>',
                messageEmailErorr = 'sai định dạng</p>',
                messageEmtpy = 'không được để trống</p>',
                messageImportPlease = 'Vui lòng nhập',
                messageTooShort = 'quá ngắn</p>',
                messagePasswordConfirmErorr = 'không khớp</p>',
                MessageMain = '<p class="register-error-message erorr-user">',
                passWordRegister =
                    document.querySelector('.menu-logReg__input-password.register');


            //Check password confirm
            if (style === 'Mật khẩu xác nhận' && passWordRegister.value !== '') {
                if (value !== passWordRegister.value) {
                    createElement().innerHTML =
                        `${MessageMain} ${style} ${messagePasswordConfirmErorr}`
                }
                else {
                    if (value === '') {
                        createElement().innerHTML =
                            `${MessageMain} ${style} ${messageEmtpy}`
                    }
                    else {
                        createElement().remove();
                    };
                };
            }
            else {
                // there are space
                if (/ /.test(value)) {
                    element.value = element.value.slice(0, (element.value.length - 1));
                    value = element.value;
                }
                else {
                    //Emtpy style
                    if (value === '') {
                        //Ramdom message
                        let randomNumber = Number.parseInt(Math.random() * 10)
                        if (randomNumber <= 5) {
                            createElement().innerHTML =
                                `${MessageMain} ${style} ${messageEmtpy}`;
                        }
                        else {
                            createElement().innerHTML =
                                `${MessageMain}  ${messageImportPlease} ${style.toLowerCase()}</p>`;
                        }

                    }
                    else {
                        if (value.length < 5) {
                            createElement().innerHTML =
                                `${MessageMain} ${style} ${messageTooShort}`;
                        }
                        else {
                            //exceed length
                            if (value.length >= 30) {
                                element.value = element.value.slice(0, 29);
                                value = element.value;
                                createElement().innerHTML =
                                    `${MessageMain} ${style} ${messageExceedLength}`;
                            }
                            else {
                                //Erorr style
                                if (!usernameFormat.test(value) && value !== ''
                                    && style !== 'Email' && style !== 'Mật khẩu') {
                                    createElement().innerHTML =
                                        `${MessageMain} ${style} ${messageFormatErorr}`;
                                }
                                else {
                                    //Wrong email format 
                                    if (!emailFormat.test(value) && style === 'Email') {
                                        createElement().innerHTML =
                                            `${MessageMain} ${style} ${messageEmailErorr}`;
                                    }
                                    //Right style
                                    else {
                                        createElement().remove();
                                    };
                                };
                            };
                        };
                    };
                };
            };

            //Text format

            for (let element of document.querySelectorAll('.messageErorr')) {
                // element.style.textTransform = ''
            }
            //Create message
            function createElement() {
                parentElement = element.closest('.menu-logReg__account');
                if (parentElement.querySelector('.messageErorr') === null) {
                    return create()
                }
                else {
                    if (oldParentElement !== parentElement) {
                        parentElement.querySelector('.messageErorr').remove()
                        return create()
                    }
                    else {
                        oldParentElement = parentElement
                        return box
                    };
                };
                function create() {
                    box = document.createElement('p');
                    box.className = 'messageErorr';
                    parentElement.appendChild(box);
                    oldParentElement = parentElement;
                    return box
                };
            };
        };

        //Remove message
        function removeMessageErorr() {
            let boxs = document.querySelectorAll('.messageErorr');
            boxs.forEach((element) => {
                element.remove()
            })
        };


        //New account//
        let newAccount = {
            'Username': '',
            'Password': '',
            'Money': 0,
            'Email': '',
        }
        //Register / Login account//
        let register = document.querySelector('.menu-logReg__btn.register-btn'),
            login = document.querySelector('.menu-logReg__btn');
        login.addEventListener('click', registerLogin)
        register.addEventListener('click', registerLogin);

        //Keyboard event//
        document.onkeydown = (e) => {
            if (modalLogReg.getBoundingClientRect().width !== 0) {
                switch (e.which) {
                    case 27: closemodalLogReg();
                        break;
                    case 13: registerLogin();
                        break;
                };
            };
        };

        //Get value input
        function getValueInput(inputs) {
            let temporaryAccount = {}
            inputs.forEach((elements) => {
                temporaryAccount[elements.type] = elements.element.value
            });
            return temporaryAccount
        };

        //Check value input
        function registerLogin() {
            OpenModalLoading()
            //Get list account
            let getAccounts = new Promise((resolve) => {
                GETelement(homeApi, (element) => {
                    console.log(element)
                    resolve(element)
                })
            })
            getAccounts.then((acccounts) => {
                //Check value
                let checkAgain = new Promise((resolve, reject) => {
                    createFollowers.forEach((elements) => {
                        elements.value.forEach((element) => {
                            if (element.getBoundingClientRect().top > 0) {
                                sendMessage(element, elements.type);
                            }
                        });
                    });
                    if (document.querySelector('.messageErorr') === null) {
                        //Wait For execution
                        resolve()
                    }
                    else {
                        reject()
                    }
                });
                //classify
                if (loginMenu.getBoundingClientRect().top <= 0) {
                    //Register
                    checkAgain
                        .then(() => {
                            let register = new Promise((resolve, reject) => {
                                //Input of Register
                                let inputRegisters = [
                                    {
                                        type: 'Username',
                                        element: document.querySelector('.menu-logReg__input-username.register')
                                    },
                                    {
                                        type: 'Password',
                                        element: document.querySelector('.menu-logReg__input-password.register')
                                    },
                                    {
                                        type: 'Email',
                                        element: document.querySelector('.menu-logReg__input-email.register')
                                    }
                                ];

                                //Check existence
                                let inputResult = getValueInput(inputRegisters),
                                    existenceResult = acccounts.every((acccount) => {
                                        return acccount['Username'] !== inputResult.Username
                                    })
                                //Register successful
                                if (existenceResult) {
                                    let createAccount = Object.assign(newAccount, inputResult);
                                    POSTelement(homeApi, createAccount, (value) => {
                                        if (value.Username === createAccount.Username) {
                                            resolve(createAccount.UserID)
                                        }
                                    })
                                    // acccounts.push(createAccount)
                                }
                                //Register fail
                                else {
                                    reject()
                                };
                            });
                            register
                                .then((UserID) => {
                                    openNotificationWindow(
                                        'success',
                                        'Đăng ký hoàn tất',
                                        'Nhấn để đăng nhập nhanh!',
                                        'Đồng ý');
                                    let accepted = new Promise((resolve, reject) => {
                                        notificationWindowBtn.onclick = () => { resolve() };
                                        closeNotificationWindowBtn.onclick = () => { reject() }
                                    })
                                    accepted
                                        .then(() => {
                                            closemodalLogReg()
                                            userLogin(UserID)
                                        })
                                        .catch(() => {

                                        })
                                })
                                .catch(() => {
                                    openNotificationWindow(
                                        'fail',
                                        'Đăng ký thất bại',
                                        'Tài khoản đã tồn tại!',
                                        'Thử lại')
                                })
                                .finally(() => {
                                    CloseModalLoading()
                                })
                        })
                        .catch(() => {
                            // notificationWindowErorr()
                        })
                }
                else {
                    //Login
                    checkAgain
                        .then(() => {
                            let inputLogins = [
                                {
                                    type: 'Username',
                                    element: document.querySelector('.menu-logReg__input-username.login')
                                },
                                {
                                    type: 'Password',
                                    element: document.querySelector('.menu-logReg__input-password.login')
                                },
                            ],
                                inputResult = getValueInput(inputLogins),
                                checkAccount = new Promise((resolve, reject) => {
                                    let getUser,
                                        username = acccounts.find((acccount) => {
                                            if (acccount.Username === inputResult.Username) {
                                                getUser = acccount.UserID;
                                                return true
                                            }
                                        });
                                    if (username !== undefined) {
                                        if (username.Password === inputResult.Password) {
                                            resolve({
                                                UserID: getUser,
                                                Acccounts: acccounts
                                            });
                                        }
                                        else {
                                            reject(inputResult);
                                        };
                                    }
                                    else {
                                        reject(inputResult);
                                    };
                                });
                            checkAccount
                                .then((value) => {
                                    // openNotificationWindow(
                                    //     'success',
                                    //     'Đăng nhập thành công',
                                    //     'Đang di chuyển đến trang chủ',
                                    //     'Đồng ý');
                                    userLogin(value.UserID, value.Acccounts)
                                    closemodalLogReg()

                                })
                                .catch((acccounts) => {
                                    console.log('catch')
                                    openNotificationWindow(
                                        'fail',
                                        'Đăng nhập thất bại',
                                        'Tài khoản hoặc mật khẩu không chính xác',
                                        'Thử lại')
                                })
                                .finally(() => {
                                    CloseModalLoading()
                                })
                        })
                        .catch(() => {
                            // notificationWindowErorr()
                        })
                };
            })
        };
        //Login user//
        let NotificationWelcome = document.querySelector('.notification-welcome'),
            userBox = document.querySelector('.header__user-box')
        function userLogin(UserID, acccounts) {
            let usernameBox = document.querySelector('.header__user-name'),
                userAvt = document.querySelector('.header__user-avt'),
                welcomeName = document.querySelector('.notification-welcome__user-name'),
                welcomeAvt = document.querySelector('.notification-welcome__user-avt'),
                moneyBox = document.querySelector('.header__user-title');
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
    };
};

/***** Content *****/
content();
function content() {

    /*** Content top ***/
    //Animation title top recharge//
    // animationTitile();
    function animationTitile() {
        let title = document.querySelector('.top-recharge__title'),
            string = (title.innerText.replace(/ /g, '')),
            titleDetached = "";
        for (let item of string) {
            let accmulate = `<p class="top-recharge__title">${item}</p>`;
            titleDetached += accmulate;
        };
        title.innerHTML = titleDetached;
        let titles = document.querySelectorAll('.top-recharge__title')
        recursive(300, titles, titleDance)
        function titleDance(element) {
            element.style.color = 'blue'
        }

    };

    //Animation user top recharge//
    animationUser();
    function animationUser() {
        let users = document.querySelectorAll('.top-recharge__item'),
            TimeDelay = 0;
        for (let user of users) {
            user.style.animationDelay = TimeDelay + 's';
            TimeDelay += 0.15;
        };
    };
};
