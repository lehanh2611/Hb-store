import { formatMoney } from "../end_point.js"

export const validate = {

    validator: {
        required: function (selector, messageTx) {
            if (selector.input.value === '') {
                selector.message.innerText = messageTx
                return false
            }
            else { return true }
        },
        number: function (selector, messageTx) {

            if (!Number.isFinite(Number.parseInt(selector.input.value))) {
                selector.message.innerText = messageTx
                return false
            }
            else { return true }
        },
        maxLeng: function (selector, subType, messageTx) {

            if ((selector.input.value.length > Number.parseInt(subType))) {
                selector.message.innerText = `${messageTx} ${subType}`
                return false
            }
            else { return true }
        },
        leng: function (selector, subType, messageTx) {

            if (!(selector.input.value.length === Number.parseInt(subType))) {
                selector.message.innerText = `${messageTx} ${subType}`
                return false
            }
            else { return true }
        },
        maxMoney: function (selector, subType, messageTx) {
            if ((selector.input.value > Number.parseInt(subType))) {
                selector.message.innerText =
                    `${messageTx} ${formatMoney(subType)}`
                return false
            }
            else { return true }
        },
        money: function (selector, subType, messageTx) {


            if ((selector.input.value < Number.parseInt(subType))) {
                selector.message.innerText = 
                `${messageTx} ${formatMoney(subType)}`
                return false
            }
            else { return true }
        },

        email: function (selector, subType, messageTx) {

            if (!((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(selector.input.value))) {
                selector.message.innerText = `${messageTx}`
                return false
            }
            else { return true }
        }

    },

    validateTypes: {
        required: {
            message: "Trường này không đúng",
            handle: function (selector) {
                return validate.validator.required(selector, this.message)
            }
        },
        number: {
            message: "Trường này phải là số",
            handle: function (selector) {
                return validate.validator.number(selector, this.message)
            }
        },

        maxLeng: {
            message: "Trường này có độ dài ký tự tối đa là:",
            handle: function (selector, subType) {
                return validate.validator.maxLeng(selector, subType, this.message)
            }
        },

        leng: {
            message: "Trường này phải có độ dài ký tự là:",
            handle: function (selector, subType) {
                return validate.validator.leng(selector, subType, this.message)
            }
        },
        maxMoney: {
            message: "Số tiền tối đa có thể nạp là:",
            handle: function (selector, subType) {
                return validate.validator.maxMoney(selector, subType, this.message)
            }
        },

        money: {
            message: "Số tiền nạp tối thiểu là:",
            handle: function (selector, subType) {
                return validate.validator.money(selector, subType, this.message)
            }
        },
        email: {
            message: "Email không hợp lệ",
            handle: function (selector, subType) {
                return validate.validator.email(selector, subType, this.message)
            }
        }
    },

    start: function (selector, types) {
        let subType

        const result = types.every(type => {

            if (type.includes('maxLeng')) {
                subType = type.slice(type.indexOf('_') + 1)
                type = 'maxLeng'
            }
            else {
                if (type.includes('leng')) {
                    subType = type.slice(type.indexOf('_') + 1)
                    type = 'leng'
                }
            }
            if (type.includes('maxMoney')) {
                subType = type.slice(type.indexOf('_') + 1)
                type = 'maxMoney'
            }
            else {
                if (type.includes('money')) {
                    subType = type.slice(type.indexOf('_') + 1)
                    type = 'money'
                }
            }

            if (selector.input.value === '') {
                type = 'required'
            }
            return this.validateTypes[type].handle(selector, subType)
        })

        return result
    }
}