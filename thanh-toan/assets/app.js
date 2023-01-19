import {
    $, $$,
    accountApi,
    formatMoney,
    Get,
    GETelement,
    gift_codeAPi,
    iconShadow,
    notificationWindow,
    Patch,
    processLoad,
    productAPi,
    Put,
    rippleBtn,
    select,
    simpleNoti
} from "../../asset/javascript/end_point.js"





const app = {
    info: JSON.parse(sessionStorage.getItem('order')),
    account: '',
    product: '',
    giftCode: '',

    renderInfo: async function () {
        const [account, product] =
            await Promise.all([Get(`${accountApi}/${this.info.UserID}`),
            Get(`${productAPi}/${this.info.ProductID}`)])

        $('.content__info-product-text.uid.value').innerText = product.UID
        $('.content__info-product-text.server.value').innerText = product.Server
        $('.payment-method-title.money').innerText = `Số dư: ${formatMoney(account.Money)}`

        this.account = account
        this.product = product
        this.handlePayment()
    },
    handlePayment: function () {
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

        $('.content__payment.price.value').innerText = formatMoney(priceOld)
        $('.content__payment.discount-gift.value').innerText = `${giftCode === 0 ? '' : '-'} ${formatMoney(giftCode)}`
        $('.content__payment.flash-sale.value').innerText = `${flashSale === 0 ? '' : '-'}  ${formatMoney(flashSale)}`
        $('.content__payment.total-gift.value').innerText = `${discountTotal === 0 ? '' : '-'}  ${formatMoney(discountTotal)}`
        $('.content__payment.total.value').innerText = formatMoney(priceOld - discountTotal)
    },

    submitGiftCode: function () {
        const btn = $('.content__payment-giftcode-submit')
        const input = $('.content__payment-giftcode-input')
        btn.onclick = () => {
            const giftCode = input.value

            if (!giftCode) { return }

            //show btn loading
            btn.classList.add('active')
            GETelement(`${gift_codeAPi}/${giftCode}`, v => {
                if (v) {
                    this.giftCode = v
                    simpleNoti('Mã giảm giá đã được áp dụng', true)
                    this.handlePayment()
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
    }
}
app.start()
// Put(`https://hbstore26-default-rtdb.firebaseio.com/gift_code/GIFTCODE10`, {
//     Type: 'percent',
//     Value: '10',
//     Amount: '100'
// })
document.querySelector('body').addEventListener('click',  e => {
    navigator.clipboard.writeText('hello world')
    console.log(navigator.clipboard)
})