//.....import.....//
import {
    /***** Function *****/
    recursive,
    homeApi,
    GETelement,
    POSTelement,
    PUTelement,
    DELETEelement,
    formatMoney,
    select,
    rippleBtn,

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


} from "./end_point.js"
//***** Global *****/
console.log(window.location)

const app = {
    start: function () {
        logout.start()
        logHistory.start()
        rippleBtn($$('.rippleBtn'))
    }
}
setTimeout(() => { app.start() }, 0);



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
                    type: 'T??n t??i kho???n',
                    value: usernames
                },
                {
                    type: 'M???t kh???u',
                    value: passWords
                },
                {
                    type: 'M???t kh???u x??c nh???n',
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
                messageExceedLength = 'qu?? d??i, vui l??ng nh???p l???i',
                messageFormatErorr = 'ph???i l?? c??c k?? t??? a-Z v?? 0-9</p>',
                messageEmailErorr = 'ch??a ????ng</p>',
                messageEmtpy = 'kh??ng ???????c ????? tr???ng</p>',
                messageImportPlease = 'Vui l??ng nh???p',
                messageTooShort = 'qu?? ng???n</p>',
                messagePasswordConfirmErorr = 'kh??ng kh???p</p>',
                MessageMain = '<p class="register-error-message erorr-user">',
                passWordRegister =
                    $('.menu-logReg__input-password.register');

            //Create Content
            function createContent(message) {
                return `${MessageMain} ${style} ${message}`
            }
            //Check password confirm
            if (style === 'M???t kh???u x??c nh???n' && passWordRegister.value !== '') {
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
                        if (!usernameFormat.test(value) && style === 'T??n t??i kho???n') {
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
                                        this.History = ''
                                        this.Block = false
                                        this.DateCreated = logHistory.getRealTime()
                                    }

                                    // newAccount
                                    let createUser = new NewAccount(
                                        inputResult.Username,
                                        inputResult.Password,
                                        inputResult.Email)

                                    POSTelement(homeApi, createUser, (value) => {
                                        if (value.Username === createUser.Username) {
                                            GETelement(homeApi, (accounts) => {
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
                                        '????ng k?? ho??n t???t',
                                        'Nh???n ????? ????ng nh???p nhanh!',
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
                                        });
                                })
                                .catch(() => {
                                    notificationWindow(
                                        false,
                                        '????ng k?? th???t b???i',
                                        'T??i kho???n ???? t???n t???i!',
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
                                        '????ng nh???p th???t b???i',
                                        'T??i kho???n ho???c m???t kh???u kh??ng ch??nh x??c',
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
let i = -10

//FLash sale
const flashSale = {
    productContain: $('.product-item__list'),
    btnLeft: $('.flash-sale__btn.left'),
    btnRight: $('.flash-sale__btn.right'),
    countdownTime: 10000,

    // Render product
    render: function (product, indexStart, indexEnd) {

        let listProduct = product.slice(indexStart, indexEnd)

        this.productContain.innerHTML = renderProduct(listProduct)
    },

    slide: function (value) {
        let slot = value
        let indexStart = 0
        let indexEnd = slot


        GETelement(productAPi, (Products) => {

            filter(Products, {flashSale: 'Yes'}, (newProduct) => {
                Products = newProduct



            let listLeng = Math.ceil(Products.length / slot)
            let iList = 0

            indexList(iList)
            this.process()
            this.render(Products, 0, slot)
            rippleBtn($$('.rippleBtn'))
            flashSale.productContain.classList.add('loadProduct')

            this.btnRight.addEventListener('click', nextList)
            function nextList() {
                flashSale.btnRight.removeEventListener('click', nextList)
                flashSale.productContain.classList.add('loadProduct')

                indexStart += slot
                indexEnd += slot

                if (indexEnd <= Products.length) {
                    flashSale.render(Products, indexStart, indexEnd)
                }
                else {
                    if (indexStart < Products.length) {

                        flashSale.render(Products, indexStart, indexStart + (Products.length - indexStart))
                    }
                    else {
                        indexStart = 0
                        indexEnd = slot
                        flashSale.render(Products, indexStart, indexEnd)
                    }
                }

                iList += 1
                if (iList < listLeng) {
                    indexList(iList)
                }
                else {
                    iList = 0
                    indexList(iList)
                }

                flashSale.btnRight.addEventListener('click', nextList)
            }


            this.btnLeft.addEventListener('click', backList)
            function backList() {
                flashSale.btnLeft.removeEventListener('click', backList)
                flashSale.productContain.classList.add('loadProduct')

                indexStart -= slot
                indexEnd -= slot

                if (indexStart < 0) {
                    let index = 1

                    indexEnd = Products.length
                    while ((Products.length - index) % slot !== 0) {
                        ++index
                    }

                    indexStart = Products.length - index
                    flashSale.render(Products, indexStart, indexEnd)

                    indexEnd = indexStart + slot
                }
                else {
                    flashSale.render(Products, indexStart, indexEnd)
                }

                iList -= 1
                if (iList >= 0) {
                    indexList(iList)
                }
                else {
                    iList = listLeng - 1
                    indexList(iList)
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
        const processE = $('.flash-sale__slide-process')
        const keyframes = [
            { 'width': '0%' },
            { 'width': '100%' }
        ]
        const options = {
            duration: this.countdownTime,
            iterations: 1,
        }
        const animate = processE.animate(keyframes, options)

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
            console.log(clear)
            animate.cancel()
        }
        this.btnRight.onclick = () => {
            animate.cancel()
            animate.play()
        }
        this.btnLeft.onclick = () => {
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




    start: function () {
        setInterval(() => { this.timer() }, 1000);

        //Screen width case
        let screenWidth = window.innerWidth

        if (screenWidth > 1200) {
            flashSale.slide(5)
        }
        if (screenWidth < 1200 && screenWidth > 960) {
            this.countdownTime = 8000
            flashSale.slide(4)
        }
        if (screenWidth < 960 && screenWidth > 720) {
            this.countdownTime = 6000
            flashSale.slide(3)
        }
        if (screenWidth < 720 && screenWidth > 480) {
            this.countdownTime = 5000
            flashSale.slide(2)
        }
        if (screenWidth < 480) {
            this.countdownTime = 3000
            flashSale.slide(1)
        }
    }
}
flashSale.start()

//Stall
const stall = {
    productContain: $('.stall__product-contain'),
    navItems: $$('.stall__navbar-item'),
    options: $$('.stall__navbar-item-options'),

    renderProduct: function () {
        GETelement(productAPi, (products) => {
            this.productContain.innerHTML = renderProduct(products)

        })
    },


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


    },

    start: function () {
        this.renderProduct()
        this.activeBtn()
    }
}

stall.start()
