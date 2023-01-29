import {
    $, $$,
    accountApi,
    depositAPi,
    footer,
    formatMoney,
    Get,
    iconShadow,
    logHistory,
    notificationWindow,
    Patch,
    paymentInfo,
    processLoad,
    select,
    validate,

} from "../../asset/javascript/end_point.js"

const app = {
    user: sessionStorage.getItem('desposit')?.toString(),
    result: false,
    method: 'MB',
    data: $('.desposit__menthod-item.active')?.getAttribute('menthod'),
    submitBtn: '',
    mbbankInfo: {
        title: {
            bank: 'Ngân hàng'
        },
        value: {
            bank: '91086768366668',
            bankName: 'MB Bank',
            money: 0,
            content: 'MB',
            code: 'MB',
            qr: '../thanh-toan/assets/icon/mb-bank--qr.jpg'
        },
    },
    momoInfo: {
        title: {
            bank: 'Ví điện tử'
        },
        value: {
            bank: '0353489648',
            bankName: 'Momo',
            money: 0,
            content: 'M',
            code: 'M',
            qr: '../thanh-toan/assets/icon/momo--qr.jpg'
        },
    },
    selector: {
        input: $('.desposit__input-input'),
        message: $('.desposit__input-box').querySelector('message'),
    },
    rules: ['required', 'number', 'money_50000', 'maxMoney_100000000',],
    inputHandle: function () {
        this.selector.input.addEventListener('focus', () => {
            this.selector.message.innerText = ''
        })
        this.selector.input.addEventListener('focusout', () => {
            this.handleData()
        })
    },
    renderPi: async function () {
        const user = this.user
        const infoOld = $('.payment-info')
        let data = this.data

        if (!data) { return }
        if (data.money !== 0) {
            switch (data) {
                case 'MB': {
                    data = this.mbbankInfo
                    this.data = data
                    this.method = 'MB'
                }
                    break;

                case 'MM': {
                    data = this.momoInfo
                    this.data = data
                    this.method = 'MM'
                }
                    break;
            }
        }
        if (infoOld) { infoOld.remove() }
        if (!this.result) { data = this.mbbankInfo }
        paymentInfo(data.title, data.value, () => {
            if (this.user.Block == 'true') {
                notificationWindow(
                    false,
                    'Tài khoản bị khóa',
                    'Chi tiết liên hệ quản trị viên',
                    () => {
                        notificationWindow()
                        this.goBack()
                    }, 'Đóng'
                )
            }
            else { this.submit() }
        }, $('.content'))
        this.submitBtn = $('.payment-info__submit')
        this.user = user

        let name = user?.Nickname

        if (!name) { name = user.Username }
        const avt = user?.Avatar
        $('.header__nav-user-avt').src = Boolean(avt) == true ? '.' + avt : '../asset/img/user-avt/user-default.png'
        $('.header__nav-user-name').innerText = name
        $('.desposit__money-info-user').innerText = name
    },
    handleData: function () {
        this.validate()
        if (!this.result) { return }
        this.method = $('.desposit__menthod-item.active')?.getAttribute('menthod')

        const value = this.selector.input.value
        const data = this.data
        const code = `${this.method}U${this.user.UserID}M${value}`
        const methodBl = this.method === 'MB' ? true : false
        this.data = {
            title: { ...data.title },
            value: {
                ...data.value,
                bank: methodBl ? '9108678366668' : '0353489648',
                bankName: methodBl ? 'MB BANK' : 'Momo',
                money: value,
                content: code,
                Ordercode: code,
                qr: methodBl ? '../thanh-toan/assets/icon/mb-bank--qr.jpg' : '../thanh-toan/assets/icon/momo--qr.jpg'
            }
        }
        $('.desposit__money-info-new-money').innerText = formatMoney(value)
        this.renderPi()
    },
    moneyOptions: function () {
        for (const op of $$('.desposit__input-option-item')) {
            op.addEventListener('click', () => {
                this.selector.input.value = op.getAttribute('option')
                this.handleData()
            })
        }
    },
    validate: function () {
        const Depwarning = $('.desposit__money-info-box')
        const submit = $('.payment-info__submit')
        this.selector.message.innerText = ''
        if (validate.start(this.selector, this.rules)) {
            this.result = true
        }
        else {
            this.result = false
        }
        //show deposit warning messsage & error input
        if (this.result) {
            Depwarning.classList.add('active')
            this.selector.message.classList.remove('active')
            submit.classList.remove('disable')
        }
        else {
            Depwarning.classList.remove('active')
            this.selector.message.classList.add('active')
            submit.classList.add('disable')
        }
    },
    submit: async function () {
        this.handleData()
        if (!this.result) { return }
        this.submitBtn.classList.add('active')
        let data = this.data.value
        data = {
            orderCode: data.Ordercode,
            status: 'Unpaid',
            method: data.bankName,
            money: data.money,
            userId: this.user.UserID,
            date: logHistory.getRealTime()
        }
        const userDepApi = `${accountApi}/${data.userId}`
        this.user = await Get(userDepApi)

        //Get length
        let leng = [
            await Get(depositAPi),
            this.user?.Deposit,
            this.user?.Notification]

        let [depLeng, userDepLeng, notiLeng] = leng.map(v => {
            if (v) { return Object.keys(v).length }
            else { return 0 }
        })
        // Push data
        await Promise.all([
            Patch(depositAPi, { [depLeng]: data }),
            Patch(`${userDepApi}/Deposit`, { [userDepLeng]: data }),
            Patch(`${userDepApi}/Notification`, {
                [notiLeng]: {
                    Seen: "No",
                    Type: "Money",
                    content: "Chúng tôi đang xử lý yêu cầu nạp tiền của bạn",
                    title: `Đơn nạp ${formatMoney(data.money)} đang được xử lý`
                }
            })
        ])

        notificationWindow(
            true,
            'Gửi yêu cầu thành công',
            'Chờ Hb store xử lý',
            (isSuccess) => {
                notificationWindow()
                if (isSuccess) {
                    this.goBack()
                }
            }, 'Trang chủ')

        this.submitBtn.classList.remove('active')
    },
    goBack: function () {
        processLoad.run(2)
        sessionStorage.removeItem('desposit')
        this.user = null
        setTimeout(() => {
            processLoad.run(2)
        }, 200);
        setTimeout(() => {
            processLoad.run(2)
            window.location.href = window.location.origin
        }, 600)
    },
    atc: function () {
        //Go back
        $('.header__nav-go-back').onclick = () => { this.goBack() }
    },

    start: async function () {
        footer.start()
        paymentInfo(this.mbbankInfo.title, this.mbbankInfo.value, () => { }, $('.content'))

        processLoad.run(2)
        setTimeout(() => { processLoad.run(2) }, 100)
        setTimeout(() => { processLoad.run(2) }, 399)
        if (!this.user) {
            this.goBack()
            return
        }
        this.user = await Get(`${accountApi}/${this.user}`)
        this.renderPi(this.mbbankInfo)
        this.inputHandle()
        this.moneyOptions()
        iconShadow($$('.desposit__menthod-item-icon-box'))
        $('.payment-info__submit').classList.add('disable')
        select($$('.desposit__menthod-item'), (e) => {
            this.handleData()
        })
        this.atc()
    }
}
app.start()