import {
    $, $$,
    accountApi,
    formatMoney,
    Get,
    GETelement,
    gift_codeAPi,
    iconShadow,
    notificationWindow,
    orderAPi,
    Patch,
    paymentInfo,
    processLoad,
    productAPi,
    Put,
    rippleBtn,
    select,
    simpleNoti,
    validate
} from "../../asset/javascript/end_point.js"





const app = {
    info: JSON.parse(sessionStorage.getItem('order')),
    account: '',
    product: '',
    price: '',
    giftCode: '',
    giftCodeName: '',
    submit: $('.content__payment.pay'),
    handle: false,

    renderInfo: async function () {
        const [account, product] =
            await Promise.all([Get(`${accountApi}/${this.info.UserID}`),
            Get(`${productAPi}/${this.info.ProductID}`)])

        $('.content__info-product-text.uid.value').innerText = product.UID
        $('.content__info-product-text.server.value').innerText = product.Server
        $('.payment-method-title.money').innerText = `Số dư: ${formatMoney(account.Money)}`

        this.account = account
        this.product = product
        this.handlePaymentInfo()
    },
    handlePaymentInfo: function () {
        const priceOld = Number(this.product.Price)
        let price = this.product.Discount
        let giftCode = 0
        let discountTotal = 0
        let flashSale = 0

        price = Number(price.replace('%', ''))
        if (price !== undefined && this.product.Flashsale != 'No') {
            price = Math.ceil(priceOld - ((priceOld / 100) * price))
            flashSale = priceOld - price
        }
        else {
            price = priceOld
        }

        if (this.giftCode) {
            giftCode = this.giftCode
            if (giftCode.Type === 'percent') {
                giftCode = Math.ceil(price - ((price / 100) * Number(giftCode.Value)))
            }
            else {
                // giftCode = 0
            }
            giftCode = price - giftCode
        }
        discountTotal = giftCode + flashSale
        this.price = priceOld - discountTotal
        $('.content__payment.price.value').innerText = formatMoney(priceOld)
        $('.content__payment.discount-gift.value').innerText = `${giftCode === 0 ? '' : '-'}${formatMoney(giftCode)}`
        $('.content__payment.flash-sale.value').innerText = `${flashSale === 0 ? '' : '-'}${formatMoney(flashSale)}`
        $('.content__payment.total-gift.value').innerText = `${discountTotal === 0 ? '' : '-'}${formatMoney(discountTotal)}`
        $('.content__payment.total.value').innerText = formatMoney(this.price)

    },

    submitGiftCode: function () {
        const btn = $('.content__payment-giftcode-submit')
        const input = $('.content__payment-giftcode-input')
        btn.onclick = () => {
            const giftCode = input.value

            if (!giftCode) { return }

            this.giftCodeName = giftCode

            //show btn loading
            btn.classList.add('active')
            GETelement(`${gift_codeAPi}/${giftCode}`, v => {
                if (v) {
                    this.giftCode = v
                    simpleNoti('Mã giảm giá đã được áp dụng', true)
                    this.handlePaymentInfo()
                }
                else {
                    simpleNoti('Mã giảm giá không chính xác', false)
                }
                //hide btn loading
                btn.classList.remove('active')
            })
        }
        input.oninput = () => {
            if (input.value) {
                btn.classList.remove('disable')
            }
            else {
                btn.classList.add('disable')
            }
        }
    },
    paymentSubmit: async function () {
        const parent = $('.content__payment-email-box')
        const selector = {
            input: parent.querySelector('input'),
            message: parent.querySelector('message')
        }
        const rule = ['email', 'required']

        selector.input.addEventListener('focusin', () => { selector.message.innerText = '' })
        selector.input.addEventListener('focusout', () => { validate.start(selector, rule) })
        this.submit.addEventListener('click', () => {

            // if (!validate.start(selector, rule)) { return }

            //show btn loading
            this.submit.classList.add('active')
            //create Orde code
            const menthod = $('.payment-method.active').getAttribute('menthod')
            let orderCode = ''
            switch (menthod) {
                case 'shopMoney': {
                    orderCode = `HB${this.product.UID}`
                }
                    break

                case 'bank': {
                    orderCode = `BHB${this.product.UID}`
                }
                    break

                case 'momo': {
                    orderCode = `MHB${this.product.UID}`
                }
            }

            //create payment data
            const paymentData = {
                Ordercode: orderCode,
                Status: '',
                UserID: this.account.UserID,
                ProductID: this.product.ProductID,
                Price: this.price,
                Flashsale: this.product.Flashsale,
                Giftcode: this.giftCodeName,
                Menthod: menthod,
                Email: selector.input.value.trim(),
            }

            //handle request
            if (paymentData.Menthod !== 'shopMoney') {
                this.monthodOther(paymentData)
            }
            else {
                this.menthodShop(paymentData)
            }
            Patch(`${productAPi}/${paymentData.ProductID}`, { Sold: 'Yes' })
        })
    },
    menthodShop: async function (paymentData) {
        this.handle = true
        const url = `${accountApi}/${this.account.UserID}`
        const money = await Get(url + '/Money')
        const surplus = money - paymentData.Price

        if (surplus < 0) {
            notificationWindow(false,
                'Số dư không đủ',
                'Vui lòng bổ sung hoặc thay đổi phương thức khác',
                () => {
                    notificationWindow()
                    this.handle = false
                })

        }
        else {
            await Promise.all([
                Patch(`${accountApi}/${paymentData.UserID}/Order/`,
                    { [paymentData.Ordercode]: { ...paymentData, Status: 'Paid' } }),
                Patch(`${accountApi}/${paymentData.UserID}`, { Money: surplus })
            ])
            notificationWindow(true,
                'Thanh toán thành công',
                'Theo dõi trong phần đơn hàng'
                , () => {
                    notificationWindow()
                })
        }


        //hide btn loading
        this.submit.classList.remove('active')
    },
    monthodOther: async function (paymentData) {
        this.handle = true
        await Promise.all([
            Patch(`${orderAPi}`, { [paymentData.Ordercode]: paymentData }),
            Patch(`${accountApi}/${paymentData.UserID}/Order/`,
                { ...paymentData, Status: 'Unpaid' })
        ])


        if (paymentData.Menthod !== 'shopMoney') {
            let bankInfo

            if (paymentData.Menthod === 'bank') {
                bankInfo = {
                    title: { bank: 'Ngân hàng' },
                    value: {
                        bank: '9108678366668',
                        bankName: 'MB BANK',
                        qr: './assets/icon/mb-bank--qr.jpg'
                    }
                }
            }
            else {
                bankInfo = {
                    title: { bank: 'Ví điện tử' },
                    value: {
                        bank: '0353489648',
                        bankName: 'Momo',
                        qr: './assets/icon/momo--qr.jpg'
                    }
                }
            }
            paymentInfo({ ...bankInfo.title }, {
                ...bankInfo.value,
                money: paymentData.Price,
                content: paymentData.Ordercode,
                code: paymentData.Ordercode
            })
            //hide btn loading
            this.submit.classList.remove('active')
            return
        }


    },

    goBack: function () {
        processLoad.run(1)
        if (!this.info) {
            window.location.href = window.location.origin
        }
        $('.header__nav-go-back').onclick = () => {
            this.info = ''
            this.goBack()
        }
        processLoad.run(1)
    },

    select: function () {
        select($$('.payment-method'))
    },

    start: function () {
        this.goBack()
        this.select()
        this.renderInfo()
        rippleBtn($$('.rippleBtn'))
        iconShadow($$('.payment-method-icon-box'))
        this.submitGiftCode()
        this.paymentSubmit()
    }
}
app.start()
// Put(`https://hbstore26-default-rtdb.firebaseio.com/gift_code/GIFTCODE10`, {
//     Type: 'percent',
//     Value: '10',
//     Amount: '100'
// })
// document.querySelector('body').addEventListener('click',  e => {
//     navigator.clipboard.writeText('hello world')
// })