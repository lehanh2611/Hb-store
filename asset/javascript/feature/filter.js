import { toLowerCaseNonAccentVietnamese } from "../end_point.js"

export function filter(dataFil, rulesFil, callback) {

    const filter = {

        rules: function (value) {
            new Promise((resolve) => {
                resolve(value)
            })
                // filter server
                .then(value => {
                    //not mactch skip filter => return value
                    const rule = rulesFil['server']
                    if (!rule) { return value }
                    return filter.handle.server(value, rule)
                })

                //Filter type
                .then(value => {
                    const rule = rulesFil['type']
                    if (!rule) { return value }
                    return filter.handle.type(value, rule)
                })

                //Filter type
                .then(value => {
                    const rule = rulesFil['sold']
                    if (!rule) { return value }
                    return filter.handle.sold(value, rule)
                })

                // filter price
                .then(value => {
                    const rule = rulesFil['price']
                    if (!rule) { return value }
                    return filter.handle.price(value, rule)
                })

                //Filter discount
                .then(value => {
                    const rule = rulesFil['discount']
                    if (!rule) { return value }
                    return filter.handle.price(value, rule)
                })

                //Filter UID 
                .then(value => {
                    const rule = rulesFil['uid']
                    if (!rule) { return value }
                    return filter.handle.uid(value, rule)
                })

                //Filter Flash sale 
                .then(value => {
                    const rule = rulesFil['flashSale']
                    if (!rule) { return value }
                    return filter.handle.flashSale(value, rule)
                })

                // Filter everything related
                .then(value => {
                    const rule = rulesFil['all']
                    if (!rule) { return value }
                    return filter.handle.all(value, rule)
                })

                //filter done => return result
                .then(value => callback(value))

        },

        handle: {
            server: function (value, rule) {
                return new Promise((resolve) => {
                    const output = value.filter(data => data.Server === rule)
                    resolve(output)
                })
            },

            type: function (value, rule) {
                return new Promise((resolve) => {
                    resolve(value.filter(data => data.Type === rule))
                })
            },

            sold: function (value, rule) {
                return new Promise((resolve) => {

                    resolve(value.filter(data => data.Sold == rule))
                })
            },

            // handle price and discount
            price: function (value, rule) {
                return new Promise((resolve) => {
                    let output = []

                    if (rule === 'price') {
                        rule = 'Price'
                    }
                    else {
                        rule = 'Discount'
                    }
                    let prices = value.map(data => {
                        return data[rule]
                    })

                    if (rule === '>') {
                        prices = prices.sort((a, b) => b - a)
                    }
                    else {
                        prices = prices.sort((a, b) => a - b)
                    }

                    prices.forEach(price => {
                        output.push(value.find(data => {
                            return data[rule] == price

                        }))
                    });

                    resolve(output)
                })
            },

            uid: function (value, rule) {
                return new Promise((resolve) => {
                    const output = value.filter(data => data.UID.includes(rule))
                    resolve(output)
                })
            },

            flashSale: function (value, rule) {
                return new Promise((resolve) => {
                    resolve(value.filter(data => data.Flashsale == rule))
                })
            },
            all: function (value, rule) {
                return new Promise((resolve) => {
                    const result = value.filter(data => {

                        return (toLowerCaseNonAccentVietnamese(Object.values(data).toString())
                            .includes(toLowerCaseNonAccentVietnamese(rule.trim())))
                    })
                    resolve(result)
                })
            }
        },

        start: function () {
            this.rules(dataFil)
        }
    }

    filter.start()
}
