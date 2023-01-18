import { formatMoney } from "../end_point.js"

export function renderProduct(products, disStatus = true, uid) {
    //Render all Product
    if (arguments.length <= 2) {
        let output = products.reduce((accmulate, element) => {
            return accmulate += body(element.ProductID, element.UID, element.Server, element.Price, disStatus, element.Discount, element.Sold)
        }, '')
        return output
    }
    //Render one product
    else {
        const product = products.find((element) => element.UID == uid)
        return body(product.ProductID, product.UID, product.Server, product.Price, disStatus, element.Discount, element.Sold)
    }
}

//Render
function body(id, uid, server, price, disStatus, discount = undefined, sold) {
    discount = Number(discount.replace('%', ''))

    if (discount !== undefined && disStatus) {
        var discountRatio = discount
        discount = price - ((price / 100) * discount)
    }
    else {
        discount = price
    }

    return `<div item_id="${id}" class="product-item ${sold}">
    <div class="product-item__box-top">
        <div class="product-item__img-box">
        <img class="product-item__img" src="./asset/img/660000000.png">
        </div>
        <span class="product-item__discounts-wrap">
            <p class="product-item__discounts">-${discountRatio}%</p>
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
            <p class="product-item__price-old">${formatMoney(price)}</p>
            <p class="product-item__price"> ${formatMoney(discount)
        }</p >
        </div >
    <div class="box">
        <button class="btn rippleBtn product-item__buy">Mua ngay</button>
        <span class="product-item__add-cart-box">
            <i class="product-item__add-cart fa-solid fa-cart-circle-plus"></i>
        </span>
    </div>
    </div >
</div > `
}
