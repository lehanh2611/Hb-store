import {
    $,
    $$,
    userActiveID,
    PATCHelement,
    accountApi,
    formatMoney,
    select,
    PUTelement,
    plateBlur,
    closeWithRule
} from "../end_point.js";
export const cart = {
    cartData: JSON.parse(localStorage.getItem('cart')),
    products: '',
    meunuCart: $('.header__cart-box'),
    cartContain: $('.header__cart-list'),
    emptyHTML: ` <li class="header__cart-empty">
                <div class="empty-box">
                <img class="empty-img" src="./asset/img/empty.png">
                 <h3 class="empty-box-title">Chưa có sản phẩm trong giỏ hàng!</h3>
                    <p class="empty-box-title-sub"></p>
                    </div>
                    </li>`,

    click: function () {
        const meunuCartH = $('.header__feature-box.cart')


        window.addEventListener('click', (e) => {
            const elm = e.target
            const elmCN = elm.classList.value
            const addText = 'product-item__add-cart'
            const buyText = 'product-item__buy'
            let elmActive


            if (elmCN.includes(addText)) { elmActive = addText }
            if (elmCN.includes(buyText)) { elmActive = buyText }

            if (!elmActive) { return }
            const id = elm.closest('.product-item').getAttribute('item_id')

            switch (elmActive) {
                case buyText: { this.buyCart(Number(id)) }
                    break

                case addText: { this.addCart(Number(id)) }
            }
        })

        // Atc buy from cart
        $('.header__cart-btn.buy').addEventListener('click', () => {
            const elmActive = $('.header__cart-item.active')
            if (elmActive) {
                this.buyCart(elmActive.getAttribute('item_id'))
            }
        })

        this.meunuCart.addEventListener('mouseenter', (e) => {
            e.stopPropagation()
        })

        meunuCartH.addEventListener('mouseenter', () => {
            if (this.meunuCart.closest('.header__user-menu')) { return }

            this.meunuCart.classList.remove('show-m', 'active')
            meunuCartH.appendChild(this.meunuCart)
            plateBlur(false)
        })


        $('.header__user-menu-item.cart').onclick = () => {
            $('.header__contain').appendChild(this.meunuCart)
            this.meunuCart.classList.add('show-m', 'active')
            plateBlur(true, this.meunuCart)
        }
        $('.header__cart-close').onclick = () => {
            this.meunuCart.classList.remove('show-m', 'active')
            plateBlur(false)
        }

        window.addEventListener('click', (e) => {
            closeWithRule.start(e, ['.header__cart-box', '.header__user-menu-list'], (e) => {
                this.meunuCart.classList.remove('show-m', 'active')
                plateBlur(false)
            })
        })
    },

    addCart: function (id) {
        if (!this.cartData || this.cartData === '') { this.cartData = [] }
        if (this.cartData.includes(id)) { return }

        this.cartData = [...this.cartData, id]
        this.saveCart()
    },
    saveCart: function () {
        //login save data to server
        if (userActiveID !== null && this.cartData !== null) {
            PATCHelement(`${accountApi}/${userActiveID}`, { Cart: this.cartData.length === 0 ? '' : this.cartData })
        }
        //not login save data to localStorage
        else {
            localStorage.setItem('cart', JSON.stringify(this.cartData))
        }
    },
    removeCart: function () {
        const showRemove = $('.header__cart-btn.replace')
        const removeBtns = $$('.header__cart-item-remove')

        showRemove.onclick = () => {
            this.cartContain.classList.toggle('show')

            for (const removeBtn of removeBtns) {
                removeBtn.onclick = () => {
                    const elm = removeBtn.closest('.header__cart-item')
                    const id = elm.getAttribute('item_id')
                    let productI

                    if (!id) { return }
                    this.cartData.some((e, i) => {
                        if (e == id) {
                            productI = i.toString()
                            return true
                        }
                    })

                    if (!productI) { return }
                    this.cartData.splice(productI, 1)
                    localStorage.setItem('cart', JSON.stringify(this.cartData))
                    this.saveCart()

                    //update contain cart
                    elm.classList.add('remove')
                    elm.addEventListener('animationend', () => {
                        const cartLeng = this.cartData.length

                        elm.remove()
                        $('.header__cart-total').innerText = `Tất cả (${cartLeng})`
                        if (cartLeng === 0) {
                            this.cartContain.innerHTML = this.emptyHTML
                        }
                    })

                }
            }
        }

    },
    buyCart: function (id) {
        console.log(id)
    },

    renderCart: function (products) {
        const productCart = products.filter(v => {
            return this.cartData.some(e => v.ProductID == e)
        })

        this.cartContain.classList.remove('show')

        $('.header__cart-total').innerText = `Tất cả (${this.cartData.length})`

        if (productCart.length === 0) {
            this.cartContain.innerHTML = this.emptyHTML
            return
        }

        this.cartContain.innerHTML = productCart.reduce((acc, item) => {
            return acc += `<li item_id="${item.ProductID}" class="header__cart-item">
            <i class="header__cart-item-remove fa-solid fa-trash"></i>
        <img src="./asset/img/660000000.png" class="header__cart-item-img">
        <div class="header__cart-info-box">
            <span class="header__cart-info">
                <p class="header__cart-info-title uid">UID:</p>
                <p class="header__cart-info-value uid">${item.UID}</p>
                </span>
            <span class="header__cart-info">
                <p class="header__cart-info-title type">Loại:</p>
                <p class="header__cart-info-value type">${item.Type}</p>
            </span>
        </div>
        <span class="header__cart-info price">
            <p class="header__cart-info-title price">Giá bán:</p>
            <p class="header__cart-info-value price">${formatMoney(item.Price)}</p>
        </span>
    </li>`
        }, '')

        this.renderDone()
    },
    renderDone: function () {
        select($$('.header__cart-item'))
        this.removeCart()
    },
    ui: {
    },

    start: function () {
        this.click()
    },
}
