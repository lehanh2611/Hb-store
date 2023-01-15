import { $ } from "../end_point.js";

export const processLoad = {
    processLine: '',
    processTitle: '',
    processAcc: 0,
    processStep: 0,
    totalStep: 0,
    currentStep: 0,

    end: function () {
            setTimeout(() => {
                this.processLine.style.display = 'none'

                this.processLine.classList.remove('run')
                this.processLine.style.width = 0 + 'px'
                this.totalStep = 0
                this.currentStep = 0
            }, 600);

    },
    continue: function () {
        this.currentStep++
        if (this.currentStep > this.totalStep) { return this.end() }

        this.processLine.style.width =
            `${Number.parseInt(this.currentStep / this.totalStep * 100)}%`

        this.processTitle.innerText =
            `${Number.parseInt(this.currentStep / this.totalStep * 100)}%`
    },
    run: function (totalStep) {
        //render html core
        if (!$('.process-load')) {
            const core = document.createElement('div')
            $('#modal').appendChild(core)
            core.outerHTML =
                `<div class="process-load">
            <span class="process-load__line">
            <span class="process-load__title">100%</span>
            </span>
            </div>`
            this.processLine = $('.process-load__line')
            this.processTitle = $('.process-load__title')
        }

        //run
        this.processLine.style.display = 'block'
        this.totalStep = totalStep
        if (this.processLine.classList.value.includes('run')) {
            this.processLine.classList.add('run')
        }
        this.continue()
    }
}