import {
    $, $$,
    accountApi,
    footer,
    Get,
    iconShadow,
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
            this.validate()
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
        console.log(this.result)
        if(!this.result) {data = this.mbbankInfo}
        paymentInfo(data.title, data.value, () => {
            this.handleData()
            this.submit()
        }, $('.content'))

        this.user = user
        let name = user?.Nickname

        if (!name) { name = user.Username }


        $('.header__nav-user-avt').src = '.' + user.Avatar
        $('.header__nav-user-name').innerText = name
    },
    handleData: function () {
        if (!this.result) { return }
        this.method = $('.desposit__menthod-item.active')?.getAttribute('menthod')

        const value = this.selector.input.value
        const data = this.data
        const code = `${this.method}U${this.user.UserID}M${value}`

        this.data = {
            title: { ...data.title },
            value: {
                ...data.value,
                bankName: this.method === 'MB' ? 'MB BANK' : 'Momo',
                money: value,
                content: code,
                code: code,
            }
        }
        this.renderPi()
    },
    moneyOptions: function () {
        for (const op of $$('.desposit__input-option-item')) {
            op.onclick = () => {
                this.selector.input.value = op.getAttribute('option')
                this.validate()
                this.renderPi()
                this.handleData()
            }
        }
    },
    validate: function () {
        this.selector.message.innerText = ''
        if (validate.start(this.selector, this.rules)) {
            this.result = true
        }
        else {
            this.result = false
        }
    },
    submit: function () {
        const btn = $('.payment-info__submit')

        if (!this.result) { return }
        let data = this.data.value
        data = {
            method: data.bankName,
            money: data.money,
            userId: this.user.UserID
        }
        console.log(data)
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
        select($$('.desposit__menthod-item'), (e) => {
            this.validate()
            this.handleData()
        })
        this.atc()
    }
}
app.start()