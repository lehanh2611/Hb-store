//.....import.....//
import {
    /***** Function *****/
    recursive,
    homeApi,
    GETelement,
    POSTelement,
    PUTelement,
    DELETEelement,

    /***** Constant *****/
    $,
    $$,
    modalLogReg,
    menuUser,
    plateBlurBody,
    rechargeList,

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
    remember,


} from "./end_point.js"
//***** Global *****/
const app = {
    start: function () {
        remember.start()
    }
}
app.start()



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

    //Menu bar
    const menuBarBtn = $('.header__feature-box .menuBarBtn')
    const menuBarBody = $('.header__menu-bar')

    menuBarBtn.addEventListener('click', menuBar)

    function menuBar() {
        menuBarBtn.removeEventListener('click', menuBar)
        menuBarBody.classList.toggle('active')

        if (menuBarBody.classList.value.indexOf('active') === -1) {
            plateBlur(false)
        }
        else {
            plateBlur()
        }

        plateBlurBody.addEventListener('click', () => {
            menuBarBody.classList.remove('active')
            plateBlur(false)
        })
        setTimeout(() => {
            menuBarBtn.addEventListener('click', menuBar)
        }, 399);
    }

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
        modalLogRegBtn.onclick = () => {
            if (userActiveID === null) {
                openmodalLogReg()
            }
            else {
                menuUser.classList.toggle('active')

                if (menuUser.classList.value.indexOf('active') !== -1) {
                    plateBlur()
                }
                else {
                    plateBlur(false)
                }

                plateBlurBody.onclick = () => {
                    plateBlur(false)
                    menuUser.classList.remove('active')
                }
            }

        }
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
                        GETelement(homeApi, (element) => {
                            resolve(element)
                        })
                    })
                    getAccounts.then((accounts) => {
                        //classify
                        if (loginMenu.getBoundingClientRect().top <= 0) {
                            //Register
                            //New account//
                            let newAccount = {
                                'UserID': accounts.length,
                                'Username': '',
                                'Password': '',
                                'Money': 0,
                                'Email': '',
                            };
                            checkAgain
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

                                //Check existence
                                let inputResult = getValueInput(inputRegisters),
                                    existenceResult = accounts.every((account) => {
                                        return account['Username'] !== inputResult.Username
                                    })
                                //Register successful
                                if (existenceResult) {
                                    let createAccount = Object.assign(newAccount, inputResult);
                                    POSTelement(homeApi, createAccount, (value) => {
                                        if (value.Username === createAccount.Username) {
                                            // remember temporary account
                                            sessionStorage.setItem('remember', value.UserID)
                                            if (checked) { remember.addCode(createAccount.UserID) }
                                            resolve(createAccount.UserID)
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
                                                GETelement(homeApi, (accounts) => {
                                                    closemodalLogReg()
                                                    loginSuccess(userId, accounts)
                                                })
                                            }
                                            else {
                                                notificationWindow()
                                            }
                                            //Reset input value
                                            // $$('.menu-logReg-modal input').forEach(
                                            //     (element) => element.value = '')
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
                            checkAgain
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
                                    // remember temporary account
                                    sessionStorage.setItem('remember', value.UserID)

                                    if (checked) { remember.addCode(value.UserID) }
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

/***** Content *****/
content()
function content() {

    /*** Content top ***/
    //Animation title top recharge//
    // animationTitile();
    function animationTitile() {
        let title = $('.top-recharge__title'),
            string = (title.innerText.replace(/ /g, '')),
            titleDetached = "";
        for (let item of string) {
            let accmulate = `<p class="top-recharge__title">${item}</p>`;
            titleDetached += accmulate;
        };
        title.innerHTML = titleDetached;
        let titles = $$('.top-recharge__title')
        recursive(300, titles, titleDance)
        function titleDance(element) {
            element.style.color = 'blue'
        }
    };

    //Render top recharge
    const renderTopRecharge = {
        balance: function () {
            let getBalance = new Promise((resolve) => {
                GETelement(homeApi, (value) => {
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
