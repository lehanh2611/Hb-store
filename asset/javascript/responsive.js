export const responsive = {
    width: '',
    keyword: {},
    high: function (f, key) {
        this.getWidth()
        const currentWidth = this.keyword[key]

        if (this.width >= 960 && currentWidth !== 'high') {
            this.keyword[key] = 'high'
        }
        else { return }
        f()
    },
    medium: function (f, key) {
        this.getWidth()
        const currentWidth = this.keyword[key]

        if (this.width <= 959.9 && this.width >= 600 && currentWidth !== 'medium') {
            this.keyword[key] = 'medium'
        }
        else { return }
        f()
    },
    low: function (f, key) {
        this.getWidth()
        const currentWidth = this.keyword[key]

        if (this.width <= 559.9 && currentWidth !== 'low') {
            this.keyword[key] = 'low'
        }
        else { return }
        f()
    },
    custom: function (f, min, max, key) {
        this.getWidth()
        const currentWidth = this.keyword[key]

        if (this.width > min && this.width < max && currentWidth !== `${min}-${max}`) {
            this.keyword[key] = `${min}-${max}`
        }
        else { return }
        f()
    },
    getWidth: function () { this.width = window.innerWidth }
}