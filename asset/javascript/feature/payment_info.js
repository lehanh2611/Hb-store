import { $ } from "../end_point.js"

export function paymentInfo(title, value, callback) {

    //remove window
    if (arguments.length <= 0) {
        $('.payment-info').remove()
        return
    }
    //create window
    const html = `<div class="payment-info">
    <div class="payment-info__wrap">
        <i class="payment-info__close fa-solid fa-xmark"></i>
        <h3 class="payment-info__title">Đơn hàng ${value.code} tạo thành công!</h3>
        <p class="payment-info__title-sub">Vui lòng thanh toán theo bên dưới</p>
        <div class="payment-info__bank">
            <h3 class="payment-info__bank-title">Thông tin thanh toán</h3>
            <ul class="payment-info__bank-list">
                <li class="payment-info__bank-item">
                    <p class="payment-info__bank-item-title">Tên chủ tải khoản</p>
                    <p class="payment-info__bank-item-value">LE NGOC HANH</p>
                </li>
                <li class="payment-info__bank-item">
                    <p class="payment-info__bank-item-title">Số tài khoản</p>
                    <p class="payment-info__bank-item-value">
                    ${value.bank}
                        <i class="payment-info__bank-icon fa-regular fa-copy"></i>
                    </p>
                </li>
                <li class="payment-info__bank-item">
                    <p class="payment-info__bank-item-title">${title.bank}</p>
                    <p class="payment-info__bank-item-value">${value.bankName}</p>
                </li>
                <li class="payment-info__bank-item">
                    <p class="payment-info__bank-item-title">Số tiền</p>
                    <p class="payment-info__bank-item-value">
                    ${value.money}
                        <i class="payment-info__bank-icon fa-regular fa-copy"></i>
                    </p>
                </li>
                <li class="payment-info__bank-item">
                    <p class="payment-info__bank-item-title">Nội dung</p>
                    <p class="payment-info__bank-item-value">
                    ${value.content}
                        <i class="payment-info__bank-icon fa-regular fa-copy"></i>
                    </p>
                </li>
                <li class="payment-info__bank-item">
                    <p class="payment-info__bank-item-title">Mã đơn hàng</p>
                    <p class="payment-info__bank-item-value">${value.code}</p>
                </li>
            </ul>
        </div>
        <div class="payment-info__qr">
            <p class="payment-info__qr-text">Quý khách có thể dùng ứng dụng 
            ${value.bankName === 'Momo' ? value.bankName : title.bank} và quét mã QR này</p>
            <img src="${value.qr}" class="payment-info__qr-img">
        </div>
        <button class="btn rippleBtn payment-info__submit">
            <p class="btn-loading__text">Đã thanh toán</p>
            <div class="btn-loading__icon"></div>
        </button>
    </div>
</div>`
    let element = document.createElement('div')
    $('#modal').appendChild(element)
    element.outerHTML = html

    // element = $('.payment-info')
    $('.payment-info__submit').onclick = () => {callback()}
}