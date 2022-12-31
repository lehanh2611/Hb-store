import {
    /***** Function *****/
    recursive,
    GETelement,
    POSTelement,
    PUTelement,
    DELETEelement,
    formatMoney,
    select,

    /***** Constant *****/
    $,
    $$,

    /***** Variable *****/
    homeApi,

    /***** Feature *****/
    notificationWindow

} from "../../asset/javascript/end_point.js"

let admin


/***** Body *****/
const body = {
    bodyHTML: [
        {
            key: { parent: 'TÀI KHOẢN', child: 'Manage' },
            value: ` <div class="body__app">
            <div class="app__top">
                <h3 class="app__top-title">Manage</h3>
                <div class="app__top-feature-contain">
                    <div class="app__top-feature">
                        <i class="app__top-feature-icon fa-solid fa-message"></i>
                        <p class="app__top-feature-text">Nhắn tin</p>
                    </div>
                    <div class="app__top-feature">
                        <i class="app__top-feature-icon fa-solid fa-credit-card"></i>
                        <p class="app__top-feature-text">Nạp tiền</p>
                    </div>
                    <div class="app__top-feature">
                        <i class="app__top-feature-icon fa-sharp fa-solid fa-screwdriver-wrench"></i>
                        <p class="app__top-feature-text">Chỉnh sửa</p>
                    </div>
                    <div class="app__top-feature">
                        <i class="app__top-feature-icon fa-solid fa-user-lock"></i>
                        <p class="app__top-feature-text">Tạm khóa</p>
                    </div>
                    <div class="app__top-feature delete">
                        <i class="app__top-feature-icon fa-solid fa-user-minus"></i>
                        <p class="app__top-feature-text">Xóa bỏ</p>
                    </div>
                    <div class="app__top-feature">
                        <i class="app__top-feature-icon fa-solid fa-user-plus"></i>
                        <p class="app__top-feature-text">Tạo mới</p>
                    </div>
                </div>
            </div>
            <div class="app__mid">
                <div class="app__mid-nav">
                    <div class="app__mid-nav-search-box">
                        <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                        <input class="app__mid-nav-search" type="text"
                            placeholder="Tìm kiếm với ID, tên tài khoản, biệt danh...">
                    </div>
                    <div class="app__mid-nav-ft">
                        <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                        Bộ lọc
                    </div>
                    <div class="app__mid-nav-ft">
                        <i class="app__mid-nav-icon fa-solid fa-file-arrow-down"></i>
                        Xuất ra
                    </div>
                </div>
                <div class="app-board grid">
                    <ul class="app-board__nav">
                        <li class="app-board__nav-item l-1">User ID</li>
                        <li class="app-board__nav-item l-2">User Name</li>
                        <li class="app-board__nav-item l-3">Email</li>
                        <li class="app-board__nav-item l-6">Money</li>
                    </ul>
                    <div class="app-borad__contain">
                        <ul class="app-board__data">
                            <li class="app-board__data-item userId l-1">0</li>
                            <li class="app-board__data-item userName l-2">admin</li>
                            <li class="app-board__data-item email l-3">hbstore@gmail.com</li>
                            <li class="app-board__data-item money l-6">999.999.999đ</li>
                        </ul>
                    </div>
                </div>
                <!-- <div class="app__mid-nav-page">
                    <p class="app__mid-nav-page-info">1-9 of 99 pages</p>
                    <div class="app__mid-nav-page-btn-box">
                        <i class="app__mid-nav-page-btn fa-sharp fa-solid fa-arrow-left"></i>
                        <i class="app__mid-nav-page-btn fa-sharp fa-solid fa-arrow-right"></i>
                    </div>
                </div> -->
            </div>
            <div class="app-bot">
                <h3 class="app-bot__title">
                    <i class="fa-solid fa-address-card"></i>
                    <p>Information</p>
                    <!-- <i class="app-bot__title-resize fa-solid fa-arrow-down"></i> -->
                </h3>
                <div class="app-bot__info-contain">
                    <ul class="app-bot__info-list">
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title userid">1.User ID:</p>
                            <p class="app-bot__info-data value userid">0</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title username">2.User Name:</p>
                            <p class="app-bot__info-data value username">admin</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title nickname">3.Nick Name:</p>
                            <p class="app-bot__info-data value nickname">Lê Hạnh</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title email">4.Email:</p>
                            <p class="app-bot__info-data value email">hbstore@gmail.com</p>
                        </li>
                    </ul>
                    <ul class="app-bot__info-list">
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title money">5.Money:</p>
                            <p class="app-bot__info-data value money">999.999.999đ</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title moneySpent">6.Money Spent:</p>
                            <p class="app-bot__info-data value moneySpent">N/A</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title totalDeposit">7.Total Deposit:</p>
                            <p class="app-bot__info-data value totalDeposit">999.999.999đ</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title date">8.Date created:</p>
                            <p class="app-bot__info-data value date">26/11/2002</p>
                        </li>
                    </ul>
                    <ul class="app-bot__info-list history">
                        <li class="app-bot__info history">
                            <p class="app-bot__info-data title history-title">Mua thành công:</p>
                            <p class="app-bot__info-data value history">N/A</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`
        }
    ],
    bodyMain: $('#body'),

    //Handle from branching structure
    handle: {
        account: {
            manage: function () {
                const urlAccounts = 'https://6392b4a0ac688bbe4c6929fb.mockapi.io/Accounts'
                const featureBtns = $$(".app__top-feature")
                //get the account
                GETelement(urlAccounts,
                    (accounts) => {
                        const manage = {
                            appBoradContain: $('.app-borad__contain'),

                            //Render the account
                            render: function () {

                                const output = accounts.reduce((accmulate, account) => {
                                    return accmulate += `<ul id="${account.UserID}" ${account.Block === "true" ? 'block = "true" ' : 'block = "false"'} class="app-board__data">
                                    <li class="app-board__data-item userId l-2 m-2">
                                    ${account.Block === "true" ? '<i class="app-board__data-lock fa-solid fa-lock"></i>' : ''}
                                    ${account.UserID}
                                    </li>
                                    <li class="app-board__data-item userName l-3 m-3">${account.Username}</li>
                                    <li class="app-board__data-item email l-3 m-3">${account.Email === undefined ? 'Emtpy' : account.Email}</li>
                                    <li class="app-board__data-item money">
                                    ${formatMoney(account.Money)}</li>
                                </ul>`
                                }, '')

                                this.appBoradContain.innerHTML = output

                                const appboradElement = $$('.app-board__data')

                                //Callback return element in process active
                                select(appboradElement, (element) => {
                                    this.fullInfoRender(element)
                                })

                                // render done
                                setTimeout(() => {
                                    this.renderDone()
                                }, 0);

                            },

                            fullInfoRender: function (element, reload = false) {
                                //render full information
                                const getId = element.getAttribute('id')

                                new Promise((resolve) => {
                                    //get new data account
                                    if (reload) {
                                        GETelement(urlAccounts, (newAccounts) => {
                                            resolve(newAccounts)
                                        })
                                    }
                                    else {
                                        resolve(accounts)
                                    }

                                }).then((data) => {
                                    const result = data.find(account => {
                                        return account.UserID == getId
                                    })
                                    const date = result.DateCreated

                                    $('.app-bot__info-contain').innerHTML =
                                        `<ul class="app-bot__info-list">
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title userid">1.User ID:</p>
                                        <p class="app-bot__info-data value userid">${result.UserID}</p>
                                    </li>
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title username">2.User Name:</p>
                                        <p class="app-bot__info-data value username">${result.Username}</p>
                                    </li>
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title nickname">3.Nick Name:</p>
                                        <p class="app-bot__info-data value nickname">${result.Nickname === undefined ? 'N/A' : result.Nickname}</p>
                                    </li>
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title email">4.Email:</p>
                                        <p class="app-bot__info-data value email">${result.Email}</p>
                                    </li>
                                </ul>
                                <ul class="app-bot__info-list">
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title money">5.Money:</p>
                                        <p class="app-bot__info-data value money">${formatMoney(result.Money)}</p>
                                    </li>
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title moneySpent">6.Money Spent:</p>
                                        <p class="app-bot__info-data value moneySpent">${result.MoneySpent === undefined ? 'N/A' : formatMoney(result.MoneySpent)}</p>
                                    </li>
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title totalDeposit">7.Total Deposit:</p>
                                        <p class="app-bot__info-data value totalDeposit">${formatMoney(result.TotalDeposit)}</p>
                                    </li>
                                    <li class="app-bot__info">
                                        <p class="app-bot__info-data title date">8.Date created:</p>
                                        <p class="app-bot__info-data value date">
                                        ${`${date.date}/${date.month}/${date.year}`}
                                            </p>
                                    </li>
                                </ul>
                                <ul class="app-bot__info-list history">
                                    <li class="app-bot__info history">
                                        <p class="app-bot__info-data title history-title">Mua thành công:</p>
                                        <p class="app-bot__info-data value history">N/A</p>
                                    </li>
                                </ul>`

                                    // Check lock status
                                    const parentIcon = $('.app__top-feature.block')

                                    if (element.getAttribute('block') === 'true') {
                                        parentIcon.classList.add('unlock')
                                    }
                                    else {
                                        parentIcon.classList.remove('unlock')
                                    }
                                })
                            },


                            //Delete data from app-borad
                            delete: function () {

                                $('.app__top-feature.delete').onclick =
                                    function () {
                                        const elementActive = $('.app-board__data.active')

                                        if (elementActive) {
                                            notificationWindow(
                                                false,
                                                'Bạn chắc chắn muốn xóa',
                                                'Sẽ không thể khôi phục lại',
                                                (isSuccess) => {
                                                    if (isSuccess) {
                                                        const Id = elementActive.querySelector('.userId').innerText

                                                        //Delete data from api
                                                        DELETEelement(`${homeApi}/${Id}`)

                                                        //Delete from DOM
                                                        elementActive.outerHTML = ''
                                                        notificationWindow()
                                                    }
                                                    else {
                                                        notificationWindow()
                                                    }
                                                }, 'Tiếp tục')

                                        }
                                    }
                            },

                            lock: function () {
                                const lockBtn = $('.app__top-feature.block')

                                lockBtn.addEventListener('click', lockHandle)

                                function lockHandle() {
                                    const elementActive = $('.app-board__data.active')


                                    // Check select, not select => skip logic 
                                    if (!elementActive) {
                                        return
                                    }
                                    lockBtn.removeEventListener('click', lockHandle)

                                    const containId = elementActive.closest('.app-board__data').getAttribute('id')
                                    const lockBox = elementActive.querySelector('.app-board__data-item.userId')

                                    if (elementActive) {

                                        GETelement(`${homeApi}/${containId}`,
                                            (account) => {


                                                if (account.Block == "false") {

                                                    PUTelement(`${homeApi}/${containId}`, {
                                                        Block: "true"
                                                    })

                                                    //add icon lock
                                                    lockBox.innerHTML = `<i class="app-board__data-lock fa-solid fa-lock"></i>${lockBox.innerHTML}`

                                                    //change icon button lock
                                                    lockBtn.classList.add('unlock')

                                                }
                                                else {

                                                    PUTelement(`${homeApi}/${containId}`, {
                                                        Block: "false"
                                                    })

                                                    //remove icon lock
                                                    const lockIcon = elementActive.querySelector('.app-board__data-lock')

                                                    if (lockIcon) {
                                                        lockIcon.remove()
                                                    }

                                                    //change icon button lock
                                                    lockBtn.classList.remove('unlock')
                                                }
                                                setTimeout(() => {
                                                    lockBtn.addEventListener('click', lockHandle)
                                                }, 1000);
                                            })
                                    }
                                }
                            },

                            deposit: function () {
                                const depositBtn = $('.app__top-feature.depositBtn')
                                const depositBox = $('.deposit')
                                const depositClose = $('.deposit__close')
                                const nameContain = $('.deposit__title-sub')
                                const depositSubmit = $('.deposit__button')

                                depositBtn.onclick = () => {
                                    const elementActive = $('.app-board__data.active')

                                    // Check select, not select => skip logic 
                                    if (!elementActive) {
                                        return
                                    }

                                    //show deposit box
                                    depositBox.style.display = 'flex'

                                    //close deposit box
                                    depositClose.onclick = () => {
                                        depositBox.style.display = 'none'
                                    }

                                    $('.deposit__contain').onclick = (e) => e.stopPropagation()

                                    depositBox.onclick = () => {
                                        depositBox.style.display = 'none'
                                    }

                                    //show username deposit
                                    nameContain.innerText =
                                        elementActive.querySelector('.userName').innerText

                                    // send request deposit
                                    depositSubmit.onclick = () => {

                                        //activated animate button
                                        depositSubmit.classList.add('active')

                                        //check password admin 
                                        GETelement(`https://6392b4a0ac688bbe4c6929fb.mockapi.io/AdminAccount/${admin.UserId}`,
                                            (account) => {

                                                //password ok => continue deposit
                                                //password not ok => stop deposit
                                                if ($('.deposit__input.password').value === account.Password) {

                                                    //Get value deposit
                                                    const depositValue = Number($('.deposit__input.money').value)

                                                    // not value => exit deposit request
                                                    if (depositValue === 0 || depositValue === NaN) {
                                                        //stop animate button
                                                        depositSubmit.classList.remove('active')
                                                        return
                                                    }

                                                    const url = `https://6392b4a0ac688bbe4c6929fb.mockapi.io/Accounts/${elementActive.getAttribute('id')}`

                                                    //deposit...
                                                    GETelement(url, (account) => {
                                                        const currentMoney = account.Money
                                                        const newMoney = currentMoney + depositValue

                                                        //deposit successful
                                                        PUTelement(url, { Money: newMoney, TotalDeposit: account.TotalDeposit + depositValue }, () => {

                                                            //show new money
                                                            elementActive.querySelector('.app-board__data-item.money').innerText =
                                                                formatMoney(newMoney)

                                                            notificationWindow(true, 'Nạp tiền hoàn tất', '', () => {
                                                                notificationWindow()
                                                                depositBox.style.display = 'none'
                                                            })

                                                            depositBox.click()

                                                            //update full info
                                                            this.fullInfoRender(elementActive, true)

                                                            //stop animate button
                                                            depositSubmit.classList.remove('active')

                                                            // clear value
                                                            depositBox.querySelectorAll('input').forEach(element => {
                                                                element.value = ''
                                                            });
                                                        })
                                                    })
                                                }
                                                else {
                                                    notificationWindow(false, 'Mật khẩu Quản trị viên sai', 'Vui lòng thử lại', () => {
                                                        //stop animate button
                                                        depositSubmit.classList.remove('active')
                                                        notificationWindow()
                                                    }, 'Thử lại')
                                                }
                                            })
                                    }

                                }

                                //remove default submit
                                depositBox.querySelector('form').addEventListener
                                    ('submit', (e) => e.preventDefault())
                            },

                            ui: function () {
                                const boardGrid = $('.app-board')
                                const boardContain = $('.app-borad__contain')

                                //Set height contain
                                boardContain.style.height =
                                    (boardGrid.getBoundingClientRect().height - 30) + 'px'

                            },

                            shared: {
                                //notification not select
                                notSelect: function () {
                                    featureBtns.forEach(element => {
                                        element.addEventListener('click', () => {
                                            if ($('.app-board__data.active') === null
                                                && !element.classList.value.includes('disable')) {
                                                notificationWindow(false,
                                                    'Bạn chưa chọn mục tiêu để thực hiện',
                                                    'vui lòng chọn một mục và thử lại',
                                                    () => {
                                                        notificationWindow()
                                                    }, 'Thử lại')
                                            }
                                        })
                                    });
                                },
                                featureNotAvailable: function () {
                                    $$(".app__top-feature.disable").forEach(element => {
                                        element.addEventListener('click', () => {
                                            notificationWindow(false,
                                                'Chức năng chưa sẵn sàng',
                                                'vẫn đang trong quá trình phát triển, vui lòng thử lại sau',
                                                () => {
                                                    notificationWindow()
                                                }, 'Quay lại')
                                        })
                                    });
                                }
                            },

                            renderDone: function () {
                                this.shared.notSelect()
                                this.shared.featureNotAvailable()
                            },

                            start: function () {
                                this.ui()
                                this.render()
                                this.delete()
                                this.lock()
                                this.deposit()
                            }
                        }

                        manage.start()
                    })

            }
        }
    },

    //Branching structure
    account: {
        manage: function () {
            body.handle.account.manage()
        }
    },

    //Render body HTML
    renderHTML: function (key) {
        this.bodyHTML.forEach((element) => {
            if (element.key.parent == key.parent
                && element.key.child == key.child) {
                this.bodyMain.innerHTML = element.value
                this.account.manage()
            }
        })
    },

    login: function () {
        admin = JSON.parse(sessionStorage.getItem('adminInfo'))

        if (admin !== null) {
            const avtContain = $('.user__avt')
            const nameContain = $('.user__name')

            if (admin.Avatar) {
                avtContain.src = admin.Avatar
            }
            else {
                avtContain.src = "../asset/img/user-avt/user-default.png"
            }

            if (admin.Nickname) {
                nameContain.innerText = admin.Nickname
            }
            else {
                nameContain.innerText = admin.Username
            }

        }
        else {
            window.location.href = window.location.origin + '/admin/login'
        }
    },

    start: function () {
        this.login()
        this.account.manage()
    }
}
body.start()

//Handle from branching structure


//Top
const appTop = {
    feature: $$('.app__top-feature'),

    start: function () {
        select(this.feature)
    }
}
appTop.start()

//Mid
/***** Nav *****/
const nav = {
    navMain: $('.nav'),
    navTop: $('.nav-top'),
    navMid: $('.nav-mid'),
    optElement: $$('.nav__category-options'),

    resize: function () {
        let titleOld = []
        let contentOld = []
        let userInfo = $('.user__info')
        let logOutText = $('.log-out__text')
        const button = $('.nav-top-resize')

        //Zoom out
        const resize = () => {
            const titles = $$('.nav__category-title')
            const optTexts = $$('.nav__category-options-tx')
            const logo = $('.nav-logo')

            this.navMain.classList.toggle('resize')
            this.navTop.classList.toggle('resize')
            this.navMid.classList.toggle('resize')



            if (this.navTop.classList.value.match(/resize/) !== null) {

                const handleText = (element, accmulate) => {
                    let current = element.innerText

                    accmulate.push(current)
                    return current
                }

                titleOld = []
                contentOld = []

                logo.src = "./assets/image/logo-mini.png"

                for (let item of optTexts) {
                    item.style.opacity = 0
                    item.style.display = 'none'
                    handleText(item, contentOld)
                }

                for (let item of titles) {
                    item.innerText = handleText(item, titleOld).slice(0, 1)
                }

                userInfo.style.opacity = 0
                userInfo.style.display = 'none'

                logOutText.style.opacity = 0
                logOutText.style.display = 'none'
            }
            else {
                logo.src = "./assets/image/logo.png"

                setTimeout(() => {

                    for (let i = 0; i < titleOld.length; i++) {
                        titles[i].innerText = titleOld[i]
                    }

                    for (let i = 0; i < contentOld.length; i++) {
                        optTexts[i].innerText = contentOld[i]

                        userInfo.style.display = 'block'
                        logOutText.style.display = 'block'
                        optTexts[i].style.display = 'block'
                        setTimeout(() => {
                            userInfo.style.opacity = 1
                            logOutText.style.opacity = 1
                            optTexts[i].style.opacity = 1
                        }, 30);
                    }

                }, 50);

            }

        }

        button.addEventListener('click', resize)
    },

    //Create key and call render body
    open: function () {
        this.optElement.forEach(element => {
            element.onclick = () => {
                const parent = element.closest('.nav__category')
                const key = {
                    parent: parent.querySelector('.nav__category-title').innerText,
                    child: parent.querySelector('.nav__category-options-tx').innerText
                }
                body.renderHTML(key)
            }
        });
    },

    logout: function () {
        //remove data and navigation to login page
        $('.nav_bot__log-out').onclick = () => {
            sessionStorage.removeItem('adminInfo')
            admin = ''
            window.location.href = window.location.origin + '/admin/login'
        }
    },

    start: function () {
        select(this.optElement)
        this.open()
        this.resize()
        this.logout()
    }
}
nav.start()