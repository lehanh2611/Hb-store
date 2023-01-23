//.....import.....//
import {
    /***** Function *****/
    recursive,
    accountApi,
    GETelement,
    PATCHelement,
    Put,
    DELETEelement,
    formatMoney,
    select,
    rippleBtn,
    footer,

    /***** Constant *****/
    $,
    $$,
    modalLogReg,
    menuUser,
    plateBlurBody,
    rechargeList,
    productAPi,

    /***** Variable *****/
    bodyModalLoading,
    notificationWindowBody,
    userActiveID,
    defaultAvt,

    /***** Feature *****/
    modalLoading,
    plateBlur,
    notificationWindow,
    userLogin,
    logout,
    loginSuccess,
    logHistory,
    renderProduct,
    filter,
    responsive,
    processLoad,
    cart,
    closeWithRule,
    validate,
    simpleNoti,
    newNotiUser,


} from "./end_point.js"
//***** Global *****/
let productsMain
let accountsMain
/***** Header *****/
header();
function header() {
    let input = $('.header__input')

    headerInput();
    function headerInput() {
        let cursor = $('.header__input-cursor')

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
    let goHeadBtn = $('.header__logo-box .goHomeBtn');

    goHeadBtn.addEventListener('click', goHead)
    function goHead() {
        goHeadBtn.removeEventListener('click', goHead)
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(() => { goHeadBtn.addEventListener('click', goHead) }, 1000)
    };

    //Render cart
    const cartBtn = $('.header__feature-box.cart')

    cartBtn.onmouseenter = (e) => {
        e.target.classList.add('active')
        renderCart()
    }
    cartBtn.onmouseleave = (e) => {
        e.target.classList.remove('active')
        renderCart()
    }

    $('.header__user-menu-item.cart').addEventListener('click', renderCart)
    let iWait = 0
    function renderCart() {
        if (!productsMain || !cart.cartData) {
            if (iWait < 100) {
                setTimeout(() => { renderCart() }, 100);
                iWait++
            }
        }
        else {
            cart.renderCart(productsMain)
        }
    }
    renderCart()

    //Menu bar
    const menuBarBtn = $('.header__feature-box .menuBarBtn')
    const menuBarBody = $('.header__menu-bar')

    menuBarBtn.addEventListener('click', menuBar)

    function menuBar() {
        menuBarBody.classList.toggle('active')

        if (menuBarBody.classList.value.includes('active')) {
            plateBlur(true, menuBarBody)
        }
        else {
            plateBlur(false)
        }

        window.addEventListener('click', function close(e) {

            closeWithRule.start(e, ['.header__menu-bar', '.menuBarBtn'], () => {

                menuBarBody.classList.remove('active')
                window.removeEventListener('click', close)
                plateBlur(false)
            }, true)
        })

    }
    window.addEventListener('resize', () => {
        responsive.custom(() => {
            menuBarBody.classList.remove('active')
            plateBlur(false)
        }, 600, Infinity, 'menuBar')
        responsive.low(() => { }, 'menuBar')
    })

    // MenuSearch
    let menuSearch = $('.header__menu-search'),
        keySearchs = $$('.header__menu-search-key'),
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
        let modalLogRegBtn = $('.header__user-contain'),
            openLoginBtn = $('.menu-logReg--register .openLogin'),
            openRegisterBtn = $('.menu-logReg--login .openRegister'),
            registerMenu = $('.menu-logReg--register'),
            loginMenu = $('.menu-logReg--login'),
            hidePassWordBtns = $$('.menu-logReg__hidePWBtn'),
            inputPassWords = $$('.menu-logReg__input-password');

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
        modalLogReg.onclick = (e) => { e.stopPropagation() }

        // Open modal login/register and on/off menu user

        function showMenuUserML() {
            if (window.innerWidth >= 600 && userActiveID !== null) {
                menuUser.classList.add('show-ml')
                menuUser.classList.remove('active')
                plateBlur(false)
            }
            else {
                menuUser.classList.remove('show-ml')
            }
        }
        modalLogRegBtn.addEventListener('mouseenter', showMenuUserML)
        window.addEventListener('resize', showMenuUserML)

        menuUser.addEventListener('click', () => {
            menuUser.classList.remove('show-ml')
        })

        modalLogRegBtn.onclick = () => {

            if (userActiveID === null) {
                openmodalLogReg()
            }
            else {
                if (window.innerWidth >= 600) { return }

                menuUser.classList.toggle('active')

                if (menuUser.classList.value.includes('active')) {
                    plateBlur(true, menuUser)
                }
                else {
                    plateBlur(false)
                }
            }



        }

        window.addEventListener('click', function close(e) {
            closeWithRule.start(
                e,
                ['.header__user-menu',
                    '.flash-sale__btn',
                    '.header__user-contain'],
                () => {
                    if (menuUser.classList.value.includes('active')) {
                        menuUser.classList.remove('active')
                        plateBlur(false)
                    }
                })
        })
        function openmodalLogReg() {
            setTimeout(() => {
                plateBlur()
            }, 300);
            modalLogReg.classList.remove('hide');
            setTimeout(() => {
                modalLogReg.classList.remove('opacity');
            }, 30);
            //Add modal loading
            let LogRegWrap = $('.menu-logReg__wrap')
            LogRegWrap.appendChild(bodyModalLoading)
            //Add notification window
            LogRegWrap.appendChild(notificationWindowBody);
        };

        //Animation sticker
        let sticker = $('.menu-logReg__sub-sticker')
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
            plateBlur(false)
            notificationWindow()
            modalLogReg.classList.add('hide');
            setTimeout(() => {
                modalLogReg.classList.add('opacity');
            }, 30);
            $('modal').appendChild(notificationWindowBody);
        };

        // Close modal login/register
        let close = $$('.menu-logReg__close-btn');
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
        let usernames = $$('.menu-logReg__input-username'),
            passWords = $$('.menu-logReg__input-password'),
            passWordConfirm = $$('.menu-logReg__input-password.confirm'),
            emails = $$('.menu-logReg__input-email'),
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
                messageExceedLength = 'quá dài, vui lòng nhập lại',
                messageFormatErorr = 'phải là các ký tự a-Z và 0-9</p>',
                messageEmailErorr = 'chưa đúng</p>',
                messageEmtpy = 'không được để trống</p>',
                messageImportPlease = 'Vui lòng nhập',
                messageTooShort = 'quá ngắn</p>',
                messagePasswordConfirmErorr = 'không khớp</p>',
                MessageMain = '<p class="register-error-message erorr-user">',
                passWordRegister =
                    $('.menu-logReg__input-password.register');

            //Create Content
            function createContent(message) {
                return `${MessageMain} ${style} ${message}`
            }
            //Check password confirm
            if (style === 'Mật khẩu xác nhận' && passWordRegister.value !== '') {
                if (value !== passWordRegister.value) {
                    createElement().innerHTML = createContent(messagePasswordConfirmErorr)
                }
                else {
                    if (value === '') {
                        createElement().innerHTML = createContent(messageEmtpy)
                    }
                    else {
                        createElement().remove();
                    };
                };
            }
            else {
                //Erorr style

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
                            createElement().innerHTML = createContent(messageEmtpy)
                        }
                        else {
                            createElement().innerHTML =
                                `${MessageMain}  ${messageImportPlease} ${style.toLowerCase()}</p>`;
                        }

                    }
                    else {
                        if (!usernameFormat.test(value) && style === 'Tên tài khoản') {
                            createElement().innerHTML = createContent(messageFormatErorr)
                        }
                        else {
                            if (value.length < 5) {
                                createElement().innerHTML = createContent(messageTooShort)
                            }
                            else {
                                //exceed length
                                if (value.length >= 30) {
                                    element.value = element.value.slice(0, 29);
                                    value = element.value;
                                    createElement().innerHTML = createContent(messageExceedLength)
                                }
                                else {
                                    //Wrong email format 
                                    if (!emailFormat.test(value) && style === 'Email') {
                                        createElement().innerHTML = createContent(messageEmailErorr)
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
            let boxs = $$('.messageErorr');
            boxs.forEach((element) => {
                element.remove()
            })
        };



        //Register / Login account//
        let register = $('.menu-logReg__btn.register-btn'),
            login = $('.menu-logReg__btn');
        login.addEventListener('click', registerLogin)
        register.addEventListener('click', registerLogin);

        //Keyboard event//
        document.onkeydown = (e) => {
            if (modalLogReg.getBoundingClientRect().width !== 0
                && bodyModalLoading.getBoundingClientRect().width === 0
                && notificationWindowBody.getBoundingClientRect().width === 0
            ) {
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
        // Register login
        function registerLogin() {
            //Check value
            let checkAgain = new Promise((resolve, reject) => {
                createFollowers.forEach((elements) => {
                    elements.value.forEach((element) => {
                        if (element.getBoundingClientRect().top > 0) {
                            sendMessage(element, elements.type);
                        }
                    });
                });
                if ($('.messageErorr') === null) {
                    modalLoading()
                    resolve()
                }
                else {
                    reject()
                }
            });
            checkAgain
                .then(() => {
                    // check value remember checkbox
                    let checked
                    $$('.menu-logReg__memorize').forEach((element) => {
                        if (element.checked === true) {
                            checked = true
                        }
                    })
                    //Get list account
                    let getAccounts = new Promise((resolve) => {
                        GETelement(accountApi, (element) => {
                            resolve(element)
                        })
                    })
                    getAccounts.then((accounts) => {
                        //classify
                        if (loginMenu.getBoundingClientRect().top <= 0) {
                            //Register

                            let register = new Promise((resolve, reject) => {
                                //Input of Register
                                let inputRegisters = [
                                    {
                                        type: 'Username',
                                        element: $('.menu-logReg__input-username.register')
                                    },
                                    {
                                        type: 'Password',
                                        element: $('.menu-logReg__input-password.register')
                                    },
                                    {
                                        type: 'Email',
                                        element: $('.menu-logReg__input-email.register')
                                    }
                                ];

                                let inputResult = getValueInput(inputRegisters),
                                    existenceResult = accounts.every((account) => {
                                        return account.Username !== inputResult.Username
                                    })
                                //Register successful
                                if (existenceResult) {

                                    // Account contructor
                                    function NewAccount(Username, Password, Email) {
                                        this.UserID = accounts.length
                                        this.Username = Username
                                        this.Password = Password
                                        this.Email = Email
                                        this.Nickname = ''
                                        this.Avatar = ''
                                        this.LoginHistory = ''
                                        this.TrustedDevice = ''
                                        this.Money = 0
                                        this.MoneySpent = 0
                                        this.TotalDeposit = 0
                                        this.Cart = ''
                                        this.Order = ''
                                        this.Notification = ''
                                        this.History = ''
                                        this.Block = false
                                        this.DateCreated = logHistory.getRealTime()
                                    }

                                    // newAccount
                                    let createUser = new NewAccount(
                                        inputResult.Username,
                                        inputResult.Password,
                                        inputResult.Email)
                                    console.log(createUser)
                                    PATCHelement(`${accountApi}/${createUser.UserID}`, createUser, (value) => {

                                        if (value.Username === createUser.Username) {
                                            GETelement(accountApi, (accounts) => {
                                                //Save info login
                                                if (checked) {
                                                    logHistory.saveLogInfo(value.UserID, accounts, true)
                                                }
                                                else {
                                                    logHistory.saveLogInfo(value.UserID, accounts)
                                                }
                                            })
                                            resolve(createUser.UserID)
                                        }
                                    })
                                }
                                //Register fail
                                else {
                                    reject()
                                };
                            });
                            register
                                .then((userId) => {
                                    notificationWindow(
                                        true,
                                        'Đăng ký hoàn tất',
                                        'Nhấn để đăng nhập nhanh!',
                                        (isSuccess) => {
                                            if (isSuccess) {
                                                GETelement(accountApi, (accounts) => {
                                                    closemodalLogReg()
                                                    loginSuccess(userId, accounts)
                                                })
                                            }
                                            else {
                                                notificationWindow()
                                            }
                                        });
                                })
                                .catch(() => {
                                    notificationWindow(
                                        false,
                                        'Đăng ký thất bại',
                                        'Tài khoản đã tồn tại!',
                                        () => {
                                            notificationWindow()
                                        })
                                })
                                .finally(() => {
                                    modalLoading(false)
                                })
                        }
                        else {
                            //Login
                            let inputLogins = [
                                {
                                    type: 'Username',
                                    element: $('.menu-logReg__input-username.login')
                                },
                                {
                                    type: 'Password',
                                    element: $('.menu-logReg__input-password.login')
                                },
                            ],
                                inputResult = getValueInput(inputLogins),
                                checkAccount = new Promise((resolve, reject) => {
                                    let getUser,
                                        username = accounts.find((account) => {
                                            if (account.Username === inputResult.Username) {
                                                getUser = account.UserID;
                                                return true
                                            }
                                        });
                                    if (username !== undefined) {
                                        if (username.Password === inputResult.Password) {
                                            resolve({
                                                UserID: getUser,
                                                Accounts: accounts
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
                                    //Save remember device
                                    if (checked) {
                                        logHistory.saveLogInfo(value.UserID, value.Accounts, true)
                                    }
                                    else {
                                        logHistory.saveLogInfo(value.UserID, value.Accounts)
                                    }
                                    loginSuccess(value.UserID, value.Accounts)
                                    closemodalLogReg()
                                })
                                .catch(() => {
                                    notificationWindow(
                                        false,
                                        'Đăng nhập thất bại',
                                        'Tài khoản hoặc mật khẩu không chính xác',
                                        () => {
                                            notificationWindow()
                                        })
                                })
                                .finally(() => {
                                    modalLoading(false)
                                })
                        };
                    })

                })
                .catch(() => {
                })
        };
    };

};

const notication = {
    account: 0,
    btn: $('.header__feature-box.noti'),
    btnM: $('.header__user-menu-item.noti'),
    render: function () {
        const output = this.account.Notification.reduce((a, v) => {
            let iconUrl = ''
            switch (v.Type) {
                case 'Product': {
                    iconUrl = './asset/icon/cart.png'
                }
                    break
                case 'Coin': {
                    iconUrl = './thanh-toan/assets/icon/coin.png'
                }
                    break

                case 'Other': {
                    iconUrl = './asset/icon/message.png'
                }
                    break
            }
            return a += `
            <li class="header__noti-item ${v.Seen === 'No' ? 'active' : ''}">
             <img class="header__noti-item-icon" src="${iconUrl}">
             <span><h3 class="header__noti-item-title">${v.title}</h3>
             <span class="header__noti-item-content">${v.content}</span>`
        }, '')

        $('.header__noti-item-list').innerHTML = output
    },

    newNoti: function () {
        const result = this.account.Notification.some(v => v.Seen != 'Yes')
        if (result) {
            this.btn.classList.add('newNoti')
            this.btnM.classList.add('newNoti')
            newNotiUser(true)

        }
        else {
            this.btn.classList.remove('newNoti')
            this.btnM.classList.remove('newNoti')
            newNotiUser()
        }
    },

    seenUpdate: function () {
        const closeBtnM = $('.header__noti-close')

        function update() {
            let newNoti = notication.account.Notification
            newNoti = newNoti.map(v => {
                return {
                    ...v,
                    Seen: 'Yes'
                }
            })

            Put(`${accountApi}/${userActiveID}/Notification`, newNoti)
            notication.account.Notification = newNoti
            notication.render()
            notication.newNoti()
            notication.btn.removeEventListener('mouseleave', update)
            closeBtnM.removeEventListener('click', update)
        }
        notication.btn.addEventListener('mouseleave', update)
        closeBtnM.addEventListener('click', update)
    },
    atc: function () {
        const notiMenu = $('.header__noti-box')

        this.btnM.onclick = () => {
            $('#header').appendChild(notiMenu)
            notiMenu.classList.add('show-m')
            plateBlur(true, notiMenu)
        }
        window.addEventListener('click', function closeNoti(e) {
            closeWithRule.start(e, ['.header__user-menu-item.noti'],
                () => {
                    notiMenu.classList.remove('show-m')
                    plateBlur(false)
                })
        })

        this.btn.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 600) {
                this.btn.appendChild(notiMenu)
            }
        })
    },

    callback: function () {
        if (!this.account || userActiveID === null) {
            setTimeout(() => {
                this.account = accountsMain
                this.callback()
            }, 100);
        }
        else {
            this.start()
        }
    },
    start: function () {
        if (!this.account) {
            this.callback()
            return
        }
        this.account = this.account[userActiveID]
        if (!this.account.Notification) { return }
        this.atc()
        this.render()
        this.newNoti()
        this.seenUpdate()
    }
}
notication.start()

const desposit = {
    start: function () {
        if (userActiveID !== null) {
            $('.header__feature-box.desposit').onclick = () => {
                processLoad.run(2)
                setTimeout(() => {
                    processLoad.run(2)
                    sessionStorage.setItem('desposit', userActiveID)
                }, 100)
                setTimeout(() => {
                    window.location.href = window.location.origin + '/nap-tien'
                    processLoad.run(2)
                }, 600)
            }
        }
        else { setTimeout(() => { this.start() }, 100) }
    }
}
desposit.start()

/***** Content *****/
content()
function content() {

    /*** Content top ***/

    //Render top recharge
    const renderTopRecharge = {
        balance: function () {
            let getBalance = new Promise((resolve) => {
                GETelement(accountApi, (value) => {
                    accountsMain = value
                    let money = value.map(element => element.Money)
                    resolve([money, value])
                })
            })
            getBalance
                .then((value) => {
                    this.rankings(value[0], value[1])
                })
        },
        rankings: function (money, accounts) {
            let balanceList = (money.sort((a, b) => b - a)).slice(0, 9),
                name,
                avt,
                i = 0,
                oldMoney,
                output = balanceList.reduce((accmulate, money) => {
                    if (oldMoney !== money) {
                        accounts.forEach((account) => {
                            if (account.Money === money && i < 9) {
                                let moneyFormat = new Intl.NumberFormat('vi-VN',
                                    { style: 'currency', currency: 'VND' })
                                    .format(account.Money)

                                i++
                                if (account?.Nickname !== undefined) {
                                    name = account.Nickname
                                }
                                else {
                                    name = account.Username
                                }
                                if (account?.Avatar !== undefined) {
                                    avt = account.Avatar

                                }
                                else {
                                    avt = defaultAvt
                                }
                                accmulate += `<li class="top-recharge__item">
                                <img src="${avt}" class="top-recharge__order-icon">
                                <p class="top-recharge__username">${name}</p>
                                <p class="top-recharge__money">${moneyFormat}</p>
                            </li>`
                            }
                        })
                        return accmulate
                    }
                    oldMoney = money
                }, '')
            this.render(output)
        },
        render: function (value) {
            rechargeList.innerHTML = value
            rechargeAnimate()
        },
        start: function () {
            this.balance()
        }
    }
    renderTopRecharge.start()

    //Animation user top recharge//
    function rechargeAnimate() {
        const rechargeList = $('.top-recharge__list')

        //Animate min width >= 960px
        const animateMobilePc = {
            start: function () {
                let timeDelay = 0
                rechargeList.style.marginLeft = 0
                rechargeList.classList.remove('animate')
                for (let userBox of $$('.top-recharge__item')) {
                    userBox.style.animationDelay = timeDelay + 's';
                    timeDelay += 0.15;
                }
            }
        }

        //Animate max width <= 959px;
        const animateMobile = {
            start: function () {
                const space = $('.top-recharge__title-box').clientWidth
                rechargeList.addEventListener('animationend', () => {
                    rechargeList.classList.add('animate')
                })
                //Position
                rechargeList.style.marginLeft = space + 'px'
            }
        }

        //Start
        rechargeList.classList.add('active')
        window.addEventListener('resize', start)
        function start() {
            window.innerWidth >= 960 ? animateMobilePc.start() : animateMobile.start()
        }
        start()
    }
}
let i = -10

//FLash sale
const flashSale = {
    productContain: $('.product-item__list'),
    btnLeft: $('.flash-sale__btn.left'),
    btnRight: $('.flash-sale__btn.right'),
    slot: 0,
    indexStart: 0,
    indexEnd: 0,
    iList: 0,
    countdownTime: 10000,

    // Render product
    render: function (product, indexStart, indexEnd) {
        let listProduct = product.slice(indexStart, indexEnd)
        this.productContain.innerHTML = renderProduct(listProduct)
    },

    slide: function (value) {
        flashSale.slot = value
        this.indexStart = 0
        this.indexEnd = flashSale.slot


        GETelement(productAPi, (Products) => {
            productsMain = Products

            filter(Products, { flashSale: 'Yes' }, (newProduct) => {
                Products = newProduct

                let listLeng = Math.ceil(Products.length / flashSale.slot)

                indexList(flashSale.iList)
                this.process()
                this.render(Products, 0, flashSale.slot)
                rippleBtn($$('.rippleBtn'))
                flashSale.productContain.classList.add('loadProduct')

                this.btnRight.addEventListener('click', nextList)
                function nextList() {
                    flashSale.btnRight.removeEventListener('click', nextList)
                    flashSale.productContain.classList.add('loadProduct')

                    flashSale.indexStart += flashSale.slot
                    flashSale.indexEnd += flashSale.slot

                    if (flashSale.indexEnd <= Products.length) {
                        flashSale.render(Products, flashSale.indexStart, flashSale.indexEnd)
                    }
                    else {
                        if (flashSale.indexStart < Products.length) {

                            flashSale.render(Products, flashSale.indexStart, flashSale.indexStart + (Products.length - flashSale.indexStart))
                        }
                        else {
                            flashSale.indexStart = 0
                            flashSale.indexEnd = flashSale.slot
                            flashSale.render(Products, flashSale.indexStart, flashSale.indexEnd)
                        }
                    }

                    flashSale.iList += 1
                    if (flashSale.iList < listLeng) {
                        indexList(flashSale.iList)
                    }
                    else {
                        flashSale.iList = 0
                        indexList(flashSale.iList)
                    }

                    flashSale.btnRight.addEventListener('click', nextList)
                }


                this.btnLeft.addEventListener('click', backList)
                function backList() {
                    flashSale.btnLeft.removeEventListener('click', backList)
                    flashSale.productContain.classList.add('loadProduct')

                    flashSale.indexStart -= flashSale.slot
                    flashSale.indexEnd -= flashSale.slot

                    if (flashSale.indexStart < 0) {
                        let index = 1

                        flashSale.indexEnd = Products.length
                        while ((Products.length - index) % flashSale.slot !== 0) {
                            ++index
                        }

                        flashSale.indexStart = Products.length - index
                        flashSale.render(Products, flashSale.indexStart, flashSale.indexEnd)

                        flashSale.indexEnd = flashSale.indexStart + flashSale.slot
                    }
                    else {
                        flashSale.render(Products, flashSale.indexStart, flashSale.indexEnd)
                    }

                    flashSale.iList -= 1
                    if (flashSale.iList >= 0) {
                        indexList(flashSale.iList)
                    }
                    else {
                        flashSale.iList = listLeng - 1
                        indexList(flashSale.iList)
                    }

                    flashSale.btnLeft.addEventListener('click', backList)
                }

                function indexList(index) {
                    const itemBox = $('.flash-sale__list-index-box')
                    let items = $$('.flash-sale__list-index')

                    rippleBtn($$('.rippleBtn'))

                    for (let item of items) {
                        item.classList.remove('active')
                    }

                    setTimeout(() => {

                        if (!itemBox.querySelector('span')) {
                            createIndex()
                        }
                        else {
                            for (let element of items) {
                                element.remove()
                            }
                            createIndex()
                        }

                        function createIndex() {
                            let i = 0
                            let accElement = ''

                            while (i < listLeng) {
                                accElement += `<span class="flash-sale__list-index"></span>`
                                i++
                            }
                            itemBox.innerHTML = accElement
                        }

                        items = $$('.flash-sale__list-index')
                        items[index].classList.add('active')
                    }, 200);
                }
                window.addEventListener('scroll', showNoti)

                function showNoti() {
                    let notifi = $('.flash-sale__notification')
                    if (window.scrollY >= 260) {
                        notifi.classList.add('active')
                        setTimeout(() => { notifi.classList.remove('active') }, 5000);
                        window.removeEventListener('scroll', showNoti)
                    }
                }
            })

        })

    },

    process: function () {
        var processE = $('.flash-sale__slide-process')
        var keyframes = [
            { 'width': '0%' },
            { 'width': '100%' }
        ]
        var options = {
            duration: this.countdownTime,
            iterations: 1,
        }
        var animate = processE.animate(keyframes, options)

        animate.onfinish = () => {
            this.btnRight.click()
        }

        this.productContain.addEventListener('mouseover', () => {
            const products = $$('.flash-sale .product-item')
            for (let product of products) {

                //Pause
                product.addEventListener('mouseenter', () => {
                    animate.pause()
                })

                //Play
                product.addEventListener('mouseleave', () => {
                    animate.play()
                })
            }
        })

        //Cancel
        if (animate.currentTime > 100) {
            animate.cancel()
        }
        this.btnRight.addEventListener('click', cancel)
        this.btnLeft.addEventListener('click', cancel)
        function cancel() {
            animate.cancel()
            animate.play()
        }
    },

    timer: function () {
        const time = new Date
        const hours = time.getHours()
        const minute = time.getMinutes()
        const seconds = time.getSeconds()

        $('.flash-sale__countdown-times.hours').innerHTML =
            23 - hours <= 9 ? `0${23 - hours}` : 23 - hours

        $('.flash-sale__countdown-times.minute').innerHTML =
            60 - minute <= 9 ? `0${60 - minute}` : 60 - minute

        $('.flash-sale__countdown-times.seconds').innerHTML =
            60 - seconds <= 9 ? `0${60 - seconds}` : 60 - seconds
    },
    responsive: function () {
        responsive.custom(() => {
            flashSale.slot = 5
            flashSale.indexStart = 0
            flashSale.indexEnd = 5
            flashSale.iList = 0
            flashSale.btnLeft.click()
            flashSale.btnRight.click()
        }, 1200, Infinity, 'flashSale_slide')

        responsive.custom(() => {
            flashSale.slot = 4
            flashSale.indexStart = 0
            flashSale.indexEnd = 4
            flashSale.iList = 0
            flashSale.countdownTime = 8000
            flashSale.btnLeft.click()
            flashSale.btnRight.click()
        }, 960, 1119.9, 'flashSale_slide')

        responsive.custom(() => {
            flashSale.slot = 3
            flashSale.indexStart = 0
            flashSale.indexEnd = 3
            flashSale.iList = 0
            flashSale.countdownTime = 6000
            flashSale.btnLeft.click()
            flashSale.btnRight.click()
        }, 720, 959.9, 'flashSale_slide')

        responsive.custom(() => {
            flashSale.slot = 2
            flashSale.indexStart = 0
            flashSale.indexEnd = 2
            flashSale.iList = 0
            flashSale.countdownTime = 3999
            flashSale.btnLeft.click()
            flashSale.btnRight.click()
        }, 480, 719.9, 'flashSale_slide')

        responsive.custom(() => {
            flashSale.slot = 1
            flashSale.indexStart = 0
            flashSale.indexEnd = 1
            flashSale.iList = 0
            flashSale.countdownTime = 3999
            flashSale.btnLeft.click()
            flashSale.btnRight.click()
        }, 0, 480, 'flashSale_slide')
    },


    start: function () {
        flashSale.slide(5)
        setTimeout(() => {
            this.responsive()
        }, 0);

        //countdown timer
        setInterval(() => { this.timer() }, 1000);


        window.addEventListener('resize', () => {
            this.responsive()
        })
    }
}

flashSale.start()



//Stall
const stall = function () {
    GETelement(productAPi, products => {
        const stall = {
            productContain: $('.stall__product-contain'),
            filterBtn: $('.stall__filter-btn'),
            navItems: $$('.stall__navbar-item'),
            options: $$('.stall__navbar-item-options'),
            iStart: 0,
            iEnd: 0,
            slot: 0,
            iCheck: 0,
            productsFil: products,

            activeBtn: function () {
                //event select navbar
                select(this.navItems)
                select(this.options, (element) => {
                    let parent = element.closest('.stall__navbar-menu')
                    let title = parent.querySelector('.stall__navbar-menu-title')
                    let titleText = title.innerText
                    let exist = titleText.indexOf(':')

                    if (exist !== -1) {
                        title.innerText =
                            `${titleText.slice(0, exist)}: ${element.innerText}`
                    }
                    else {
                        title.innerText =
                            `${titleText}: ${element.innerText}`
                    }
                })

                //filer btn
                this.filterBtn.addEventListener('click', (e) => {
                    e.stopPropagation()
                    this.filterBtn.classList.toggle('active')
                })

                window.onclick = (e) => {
                    if (!e.target.closest('.stall__filter')
                        && this.filterBtn.classList.value.includes('active')
                        && e.target !== $('.flash-sale__btn.right')) {

                        this.filterBtn.classList.remove('active')
                    }
                }

            },

            filterProduct: function () {
                const options = $$('.stall__navbar-item')
                const optionsSv = $('#stall__filter-menu-server')
                const opntionPrice = $('#stall__filter-menu-price')
                sessionStorage.setItem('filter_sort', JSON.stringify(products))
                const productsOld = JSON.parse(sessionStorage.getItem('filter_sort'))
                let ruleFil = {}

                //turn on filter
                this.responsive()
                optionsSv.onchange = () => {
                    startFil()
                }
                opntionPrice.onchange = () => {
                    startFil()
                }
                for (const option of options) {
                    option.onclick = () => { startFil() }
                }

                //turn off filter
                $('.stall__filter-menu-clear').onclick = () => {
                    const menuFils = $$('.stall__filter-menu select')

                    startFil(true)
                    //reset default select
                    for (const menuFil of menuFils) {
                        menuFil.querySelector('option').selected = true
                    }
                    $('.stall__navbar-item').click()

                    //hide menu filter
                    this.filterBtn.classList.remove('active')
                }

                function startFil(clear = false) {
                    const optionActive = $('.stall__navbar-item.active')
                    const iconFil = $('.stall__filter-icon')

                    ruleFil.price = opntionPrice.value
                    ruleFil.server = optionsSv.value

                    ruleFil.type = optionActive.innerText

                    if (ruleFil.type === 'Tất cả') {
                        delete ruleFil.type
                    }
                    if (ruleFil.server === 'default') {
                        delete ruleFil.server
                    }
                    if (ruleFil.price === 'default') {
                        delete ruleFil.price
                    }

                    if (clear) {
                        delete ruleFil.server
                        delete ruleFil.price
                    }

                    if (Object.values(ruleFil).length >= 1) {
                        iconFil.classList.add('active')
                    }
                    else {
                        iconFil.classList.remove('active')
                    }

                    filter(products, ruleFil, (v) => {
                        stall.productsFil = v
                        stall.renderPdtStall()

                        if (clear) {
                            stall.productsFil = productsOld
                        }
                        else {
                            products = productsOld
                        }
                    })
                }

            },

            nextPage: function () {
                const btnLeft = $('.stall__page-return')
                const btnRight = $('.stall__page-next')

                function iSearch() {
                    let searchI = products.length - 1

                    while (searchI % stall.slot !== 0) {
                        searchI--
                    }
                    stall.iStart = searchI
                    stall.iEnd = products.length
                }

                btnRight.onclick = () => {
                    this.iStart += this.slot
                    this.iEnd = this.iStart + this.slot

                    if (this.iEnd > products.length) {
                        iSearch()
                        if (this.iCheck !== 0) {
                            this.iStart = 0
                            this.iEnd = this.slot
                            this.iCheck = -1
                        }
                        this.iCheck++
                    }
                    this.goUp()
                    stall.renderPdtStall(this.iStart, this.iEnd)
                }

                btnLeft.onclick = () => {
                    // this.iCheck = 0
                    this.iStart -= this.slot
                    this.iEnd = this.iStart + this.slot

                    if (this.iStart < 0) {
                        iSearch()
                    }
                    this.goUp()
                    stall.renderPdtStall(this.iStart, this.iEnd)
                }
            },

            indexPage: function () {
                let indexs = Array.from($$('.stall__page-index'))
                const indexStart = $('.stall__page-index-start')
                const indexEnd = $('.stall__page-index-last')
                const moreFirst = $('.stall__page-index-more.first')
                const moreLast = $('.stall__page-index-more.last')
                const totalPageNum = Math.ceil(products.length / this.slot)
                const indexCurrent = Math.ceil(this.iEnd / this.slot)

                //update box index page
                indexs.forEach((elm, i) => {
                    if (i >= totalPageNum) {
                        elm.remove()
                    }
                })
                indexs = Array.from($$('.stall__page-index'))

                //act select page
                for (let index of indexs) {
                    index.onclick = () => {
                        const iActive = Number(index.innerText)
                        indexHandle(iActive)

                        ++this.iCheck

                        this.goUp()
                        this.renderPdtStall()
                    }
                }

                indexHandle(indexCurrent)
                function indexHandle(j) {
                    indexEnd.innerText = totalPageNum
                    // if (indexEnd.innerText <= 5) {
                    //     console.log(indexEnd.innerText)
                    //     moreLast.style.display = 'none'
                    //     indexEnd.style.display = 'none'
                    // }
                    // else {
                    //     console.log(indexEnd.innerText)
                    //     moreLast.style.display = 'flex'
                    //     indexEnd.style.display = 'flex'
                    // }


                    function removeActive() {
                        for (let elm of indexs) {
                            elm.classList.remove('active')
                        }
                    }

                    if (j <= 4) {
                        indexs.forEach((elm, i) => {
                            const index = ++i
                            elm.innerText = index
                            removeActive()
                            if (index === j) { elm.classList.add('active') }
                        })
                    }
                    else {
                        removeActive()
                        indexs[2].classList.add('active')
                        indexs[0].innerText = j - 2
                        indexs[1].innerText = j - 1
                        indexs[2].innerText = j
                        indexs[3].innerText = j + 1
                        indexs[4].innerText = j + 2
                    }

                    if (j === totalPageNum) {
                        let i = indexs.length - 1
                        for (let e of indexs) {
                            e.innerText = totalPageNum - i--
                        }

                        indexEnd.style.display = 'none'
                        moreLast.style.display = 'none'

                        removeActive()
                        indexs[4].classList.add('active')
                    }
                    else {
                        indexEnd.style.display = 'flex'
                    }

                    if (indexs[3].innerText >= totalPageNum) {
                        indexs[3].style.display = 'none'
                    }
                    else {
                        indexs[3].style.display = 'flex'
                    }

                    if (indexs[4].innerText >= totalPageNum
                        && indexEnd.style.display !== 'none') {

                        indexs[4].style.display = 'none'
                    }
                    else {
                        indexs[4].style.display = 'flex'
                    }

                    if (indexs[4].innerText <= totalPageNum - 2) {
                        moreLast.style.display = 'flex'
                    }
                    else {
                        moreLast.style.display = 'none'
                    }

                    if (j >= 6) {
                        indexStart.classList.add('active')
                        moreFirst.classList.add('active')
                    }
                    else {
                        indexStart.classList.remove('active')
                        moreFirst.classList.remove('active')
                    }

                    //active current page
                    for (let i of indexs) {
                        if (i.innerText == indexCurrent) {
                            removeActive()
                            i.classList.add('active')
                        }
                        else {
                            i.classList.remove('active')
                        }
                    }
                    stall.iEnd = j * stall.slot
                    stall.iStart = stall.iEnd - stall.slot
                }
                indexStart.onclick = () => {
                    indexs[2].innerText = 3
                    indexs[2].click()
                }

                indexEnd.onclick = () => {
                    indexs[2].innerText = totalPageNum
                    indexs[2].click()
                }

            },
            goUp: function () {
                window.scroll({ top: window.scrollY + this.productContain.getBoundingClientRect().top - 200 })
            },

            renderPdtStall: function (iStart = this.iStart, iEnd = this.iEnd) {
                processLoad.run(1)
                this.productContain.innerHTML = renderProduct(stall.productsFil.slice(iStart, iEnd), false)

                sessionStorage.setItem('iSStallPage', this.iStart)
                let timeDelay = 0
                for (const pdt of $$('.stall .product-item')) {
                    pdt.style.animationDelay += timeDelay + 'ms'
                    timeDelay += 50
                }

                this.indexPage()
                processLoad.run(1)
            },
            responsive: function () {
                const iStart = Number(sessionStorage.getItem('iSStallPage'))
                if (!iStart) { this.iStart = iStart }

                responsive.custom(() => {
                    this.slot = 20
                    this.iEnd = this.iStart + this.slot
                    stall.renderPdtStall()
                }, 1200, Infinity, 'stall_renderProduct')

                responsive.custom(() => {
                    this.slot = 16
                    this.iEnd = this.iStart + this.slot
                    stall.renderPdtStall()
                }, 960, 1199.9, 'stall_renderProduct')

                responsive.custom(() => {
                    this.slot = 12
                    this.iEnd = this.iStart + this.slot
                    stall.renderPdtStall()
                }, 720, 959.9, 'stall_renderProduct')

                responsive.custom(() => {
                    this.slot = 12
                    this.iEnd = this.iStart + this.slot
                    stall.renderPdtStall()
                }, 529, 719.9, 'stall_renderProduct')

                responsive.custom(() => {
                    this.slot = 10
                    this.iEnd = this.iStart + this.slot
                    stall.renderPdtStall()
                }, 0, 528.9, 'stall_renderProduct')

                this.nextPage()
            },
            ui: function () {

            },

            start: function () {
                this.activeBtn()
                this.nextPage()
                this.responsive()

                window.onresize = () => {
                    this.responsive()
                }
                this.filterProduct()
            }
        }
        stall.start()
    })
}
stall()


const app = {
    start: function () {
        logout.start()
        logHistory.start()
        rippleBtn($$('.rippleBtn'))
        cart.start()
        footer.start()
    }
}
setTimeout(() => { app.start() }, 0);

