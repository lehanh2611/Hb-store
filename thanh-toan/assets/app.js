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
    plateBlur,
    processLoad,
    productAPi,
    Put,
    rippleBtn,
    select,
    simpleNoti,
    validate,
    cart,
    footer,
    logHistory,
    introduce_codeAPi,
    fastAtc
} from "../../asset/javascript/end_point.js"

const app = {
    info: JSON.parse(sessionStorage.getItem('order')),
    account: '',
    product: '',
    orders: '',
    price: '',
    giftCode: '',
    giftCodeName: '',
    introduceCode: null,
    servicePrice: null,
    submit: $('.content__payment.pay'),
    handle: false,

    error: function () {
        sessionStorage.removeItem('order')
        this.info = null
        notificationWindow(
            false,
            'Có lỗi xảy ra',
            'Sẳn phẩm không tồn tại hoặc đã bán',
            () => {
                notificationWindow()
                this.goBack()
            },
            'Quay lại'
        )
    },
    renderInfo: async function () {
        if (!this.info) { return }

        const [account, product] =
            await Promise.all([Get(`${accountApi}/${this.info.UserID}`),
            Get(`${productAPi}/${this.info.ProductID}`)])

        let nickName = account.Nickname
        let avatar = account.Avatar
        $('.header__nav-user-name').innerText = nickName !== '' ? nickName : account.Username
        $('.header__nav-user-avt').src = avatar !== '' ? '.' + avatar : '../asset/img/user-avt/user-default.png'
        $('.content__info-product-text.uid.value').innerText = product?.UID
        $('.content__info-product-text.type.value').innerText = product?.Type
        $('.content__info-product-text.server.value').innerText = product?.Server
        $('.payment-method-title.money').innerText = `Số dư: ${formatMoney(account.Money)}`

        this.account = account
        this.product = product
        if (product.Sold === "Yes") {
            this.error()
        }
        this.handlePaymentInfo()
    },
    handlePaymentInfo: function () {
        const priceOld = Number(this.product?.Price)
        const image = $(".content__info-product-img")
        let price = this.product?.Discount
        let giftCode = 0
        let discountTotal = 0
        let flashSale = 0

        price = Number(price?.replace('%', ''))
        if (price !== undefined && this.product?.Flashsale != 'No') {
            price = Math.ceil(priceOld - ((priceOld / 100) * price))
            flashSale = priceOld - price
        }
        else {
            price = priceOld
        }

        if (this.giftCode) {
            giftCode = this.giftCode
            switch (giftCode.Type) {
                case 'percent': {
                    giftCode = Math.ceil(price - ((price / 100) * Number(giftCode.Value)))
                }
                    break
                case 'money': {
                    giftCode = price - Number(giftCode.Value)
                }
            }
            giftCode = price - giftCode
        }
        discountTotal = giftCode + flashSale
        this.price = priceOld - discountTotal + this.servicePrice


        image.src = this.product.ImageUrl
        image.addEventListener('error', () => image.src = "../asset/img/660000000.png")
        $('.content__payment.price.value').innerText = formatMoney(priceOld)
        $('.content__payment.service.value').innerText = formatMoney(this.servicePrice)
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
                    input.classList.add("success")
                }
                else {
                    simpleNoti('Mã giảm giá không chính xác', false)
                    input.classList.remove("success")
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
    submitIntroduceCode: function () {
        const input = $(".content__payment-introduce-input")
        const submitButton = $(".content__payment-introduce-submit")
        let inputCode

        input.addEventListener('input', ({ target }) => {
            inputCode = target.value
            inputCode !== "" ? submitButton.classList.remove('disable')
                : submitButton.classList.add('disable')
        })

        submitButton.onclick = async () => {
            if (inputCode === "") return

            submitButton.classList.add("active")

            try {
                const dataIntroCode = await Get(introduce_codeAPi)

                if (dataIntroCode === null) throw new Error

                if (dataIntroCode[inputCode] || dataIntroCode[inputCode] === 0) {
                    simpleNoti("Nhập mã giới thiệu thành công")
                    this.introduceCode = inputCode
                    input.classList.add("success")
                }
                else {
                    simpleNoti("Mã giới thiệu không chính xác", false)
                    // input.classList.remove("success")
                }
            }
            catch {
                simpleNoti("Có lỗi xảy ra!", false)
            }
            submitButton.classList.remove("active")
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

        const submitHandler = async () => {
            if (!await validate.start(selector, rule)) { return }
            if (this.account.Block === 'true') {
                notificationWindow(
                    false,
                    'Tài khoản bị khóa',
                    'Chi tiết liên hệ quản trị viên',
                    (isSuccess) => {
                        if (isSuccess) {
                            //clear order
                            sessionStorage.removeItem('order')
                            this.info = null
                            app.goBack()
                        }
                        notificationWindow()
                    }, 'Trở về'
                )
                return
            }
            this.submit.removeEventListener('click', submitHandler)
            //show btn loading
            this.submit.classList.add('active')
            //create Order code
            const menthod = $('.payment-method.active').getAttribute('menthod')
            let orderCode = ''
            switch (menthod) {
                case 'shopMoney': {
                    orderCode = `HB${this.product?.UID}`
                }
                    break

                case 'bank': {
                    orderCode = `BHB${this.product?.UID}`
                }
                    break

                case 'momo': {
                    orderCode = `MHB${this.product?.UID}`
                }
            }

            const fetchOrder = await Get(orderAPi)
            let orderCodeGenerator = orderCode

            if (fetchOrder !== null) {
                while (fetchOrder[orderCodeGenerator]) {
                    orderCodeGenerator = orderCode + "S" + Math.floor(Math.random() * 100)
                }
            }

            //create payment data
            const paymentData = {
                Ordercode: orderCodeGenerator,
                Status: '',
                UserID: this.account.UserID,
                ProductID: this.product?.ProductID,
                Price: this.price,
                ServicePrice: this.servicePrice,
                Flashsale: this.product?.Flashsale,
                Giftcode: this.giftCodeName,
                NitroduceCode: this.introduceCode,
                Menthod: menthod,
                Email: selector.input.value.trim(),
                Date: logHistory.getRealTime()
            }

            //handle request
            const urlUser = `${accountApi}/${paymentData.UserID}`
            let newCart = this.account?.Cart
            if (newCart) {
                newCart = newCart.filter(v => v != paymentData.ProductID)
            }

            cart.cartData = newCart
            cart.saveCart()

            //check order
            GETelement(orderAPi, v => {
                // if (v?.length === 0 || !v) { v = [] }
                // if (Object.keys(v).some(v => v.includes(app.product?.UID))) {
                //     this.error()
                // }
                // else {
                //     if (paymentData.Menthod !== 'shopMoney') {
                //         this.menthodOther(paymentData, newCart, urlUser)
                //     }
                //     else {
                //         this.menthodShop(paymentData, newCart, urlUser)
                //     }
                // }
                if (paymentData.Menthod !== 'shopMoney') {
                    this.menthodOther(paymentData, newCart, urlUser)
                }
                else {
                    this.menthodShop(paymentData, newCart, urlUser)
                }
            })
        }
        this.submit.addEventListener('click', submitHandler)
    },
    menthodShop: async function (paymentData, newCart, urlUser) {
        const money = await Get(urlUser + '/Money')
        const surplus = money - paymentData.Price
        const notification = {
            Type: 'Product',
            Seen: 'No',
            title: `Đơn hàng ${paymentData.Ordercode} đã đặt thành công`,
            content: 'Chúng tôi sẽ gửi thông báo khi có kết quả'
        }

        if (surplus < 0) {
            notificationWindow(false,
                'Số dư không đủ',
                'Vui lòng bổ sung hoặc thay đổi phương thức khác',
                () => { notificationWindow() })
        }
        else {
            await this.handleOrderApi(
                paymentData,
                newCart,
                urlUser,
                'Paid',
                notification)
            Patch(urlUser, { Money: surplus })

            notificationWindow(true,
                'Thanh toán thành công',
                'Theo dõi trong phần thông báo'
                , () => { this.goBack() })
        }
        //hide btn loading
        this.submit.classList.remove('active')
    },
    menthodOther: async function (paymentData, newCart, urlUser) {
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
        }, async () => {
            const submit = $('.payment-info__submit')
            const notification = {
                Type: 'Product',
                Seen: 'No',
                title: `Đơn hàng ${paymentData.Ordercode} đã được tiếp nhận`,
                content: 'Chúng tôi sẽ gửi thông báo khi có kết quả'
            }

            submit.classList.add('active')
            await this.handleOrderApi(
                paymentData,
                newCart,
                urlUser,
                'Unpaid',
                notification)

            submit.classList.remove('active')
            notificationWindow(true,
                'Hb store đang xử lý',
                'Theo dõi trong phần thông báo',
                () => { this.goBack() })
        })
        plateBlur(true)
        //close payment window
        $('.payment-info__close').onclick = () => {
            paymentInfo()
            plateBlur(false)
        }
        //hide btn loading
        this.submit.classList.remove('active')
    },

    handleOrderApi: function (paymentData, newCart, urlUser, status, notication) {
        const order = { ...paymentData, Status: status }
        let NotiLeng = this.account.Notification

        if (NotiLeng) {
            NotiLeng = this.account.Notification.length
        }
        else {
            NotiLeng = 0
        }

        //clear order
        sessionStorage.removeItem('order')
        this.info = null

        return Promise.all([
            //create order
            Patch(`${orderAPi}`, { [paymentData.Ordercode]: order }),
            Patch(`${urlUser}/Order/`, { [paymentData.Ordercode]: order }),

            // update cart and status product
            // Patch(`${productAPi}/${paymentData.ProductID}`, { Sold: 'Yes' }),
            Patch(urlUser, { Cart: newCart }),

            //create notification
            Patch(`${urlUser}/Notification`, { [NotiLeng]: notication })
        ])
    },

    goBack: function () {
        processLoad.run(2)
        setTimeout(() => {
            processLoad.run(2)
            processLoad.run(2)
        }, 100)
        setTimeout(() => {
            if (!this.info) { window.location.href = window.location.origin }
        }, 600);
    },

    atc: function () {
        $('.header__nav-go-back').onclick = () => {
            //clear order
            sessionStorage.removeItem('order')
            this.info = null
            this.goBack()
        }
    },

    select: function () {
        select($$('.payment-method'))
    },
    selectService: function () {
        const options = $$('.content__service-box')
        for (const option of options) {
            const button = option.querySelector('button')
            button.onclick = () => {
                option.classList.toggle("select")
                for (const newOption of options) {
                    const newButton = newOption.querySelector('button')
                    if (newButton !== button) {
                        newOption.classList.remove("select")
                        newButton.innerText = "Lựa chọn"
                    }
                }
                if (Array.from(option.classList).includes("select")) {
                    switch (option.getAttribute("type")) {
                        case "basic": this.servicePrice = 99000
                            break
                        case "plus": this.servicePrice = 199000
                            break
                        case "premium": this.servicePrice = 299000
                    }
                    button.innerText = "Bỏ chọn"
                }
                else {
                    this.servicePrice = 0
                    button.innerText = "Lựa chọn"
                }
                this.handlePaymentInfo()
            }
        }
    },

    start: async function () {
        this.orders = await Get(orderAPi)
        this.goBack()
        this.select()
        this.renderInfo()
        this.atc()
        rippleBtn($$('.rippleBtn'))
        iconShadow($$('.payment-method-icon-box'))
        this.submitGiftCode()
        this.paymentSubmit()
        this.submitIntroduceCode()
        this.selectService()
        footer.start()
    }
}
app.start()