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

            if (selector.input.value === '') {
                type = 'required'
            }
            return this.validateTypes[type].handle(selector, subType)
        })

        return result
    }
}