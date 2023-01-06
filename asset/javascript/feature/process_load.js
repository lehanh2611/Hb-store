export const processLoad = {
    processLine: document.querySelector('.process-load__line'),
    processTitle: document.querySelector('.process-load__title'),
    processAcc: 0,
    processStep: 0,
    totalStep: 0,
    currentStep: 0,

    end: function () {
        setTimeout(() => {
            this.processLine.style.display = 'none'
        }, 200);

        setTimeout(() => {
            this.processLine.classList.remove('ready')
            this.processLine.style.width = 0 + 'px'
            this.processLine.style.display = 'block'
            this.totalStep = 0
            this.currentStep = 0
        }, 300);

    },
    continue: function () {
        if (this.currentStep === this.totalStep) { return this.end() }
        this.currentStep++

        this.processLine.style.width = 
        `${Number.parseInt(this.currentStep / this.totalStep * 100)}%`
        
        this.processTitle.innerText = 
        `${Number.parseInt(this.currentStep / this.totalStep * 100)}%`
    },
    start: function () {
        this.continue()
    },

    run: function (totalStep) {
        this.totalStep = totalStep
        if (this.processLine.classList.value.includes('ready')) {
            this.continue()
        }
        else {
            this.processLine.classList.add('ready')
            this.start()
        }
    }
}
// processLoad.run(totalStep)
