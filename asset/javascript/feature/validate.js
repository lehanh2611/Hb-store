export const validate = {

    validator: {
        required: function (selector, messageTx) {

            if (selector.input.value === '') {
                selector.message.innerText = messageTx
            }
        },
        number: function (selector, messageTx) {

            if (!Number.isFinite(Number.parseInt(selector.input.value))) {
                selector.message.innerText = messageTx
            }
        },
        maxLeng: function (selector, subType, messageTx) {

            if (!(selector.input.value.length > Number.parseInt(subType))) {
                selector.message.innerText = `${messageTx} ${subType}`
            }
        },
        leng: function (selector, subType, messageTx) {
          
            if (!(selector.input.value.length === Number.parseInt(subType))) {
                selector.message.innerText = `${messageTx} ${subType}`
            }
        }
    },

    validateTypes: {
        required: {
            message: "Trường này không được để trống",
            handle: function (selector) {
                validate.validator.required(selector, this.message)
            }
        },
        number: {
            message: "Trường này phải là số",
            handle: function (selector) {
                validate.validator.number(selector, this.message)
            }
        },

        maxLeng: {
            message: "Trường này có độ dài ký tự tối đa là:",
            handle: function (selector, subType) {
                validate.validator.maxLeng(selector, subType, this.message)
            }
        },

        leng: {
            message: "Trường này phải có độ dài ký tự là:",
            handle: function (selector, subType) {
                validate.validator.leng(selector, subType, this.message)
            }
        }
    },
    
    start: function (selector, types) {
        let subType

        types.forEach(type => {

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
            this.validateTypes[type].handle(selector, subType)
        })
    }
}