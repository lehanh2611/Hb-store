import { formatMoney } from "../end_point.js"

export function renderProduct(products, uid, callback) {

    //Render all Product
    if (arguments.length <= 1) {
        let output = products.reduce((accmulate, element) => {
            return accmulate += body(element.UID, element.Server, element.Price)
        }, '')
        return output
    }
    //Render one product
    else {
        const product = products.find((element) => element.UID == uid)
        return body(product.UID, product.Server, product.Price)
    }
}

//Render
function body(uid, server, Price, oldPrice = Price) {
    return `<div class="product-item">
    <div class="product-item__box-top">
        <div class="product-item__img-box">
            <img class="product-item__img" src="./asset/img/bg.jpg">
        </div>
        <span class="product-item__discounts-wrap">
            <p class="product-item__discounts">-10%</p>
        </span>
        <p class="product-item__view">
            Xem ảnh thực tế
            <i class="fa-sharp fa-solid fa-arrow-up-right-from-square"></i>
        </p>
    </div>
    <div class="product-item__box-bottom">
        <div class="box">
            <div class="product-item__title">UID:</div>
            <p class="product-item-uid">${uid}</p>
        </div>
        <div class="box">
            <div class="product-item__title">Khu vực:</div>
            <p class="product-item__server">${server}</p>
        </div>
        <div class="box">
            <div class="product-item__title">Giá:</div>
            <p class="product-item__price-old">${formatMoney(oldPrice)}</p>
            <p class="product-item__price">${formatMoney(Price)}</p>
        </div>
        <div class="box">
            <button class="btn product-item__buy">Mua ngay</button>
            <span class="product-item__add-cart-box">
                <i class="product-item__add-cart fa-solid fa-cart-circle-plus"></i>
            </span>
        </div>
    </div>
</div>`
}
