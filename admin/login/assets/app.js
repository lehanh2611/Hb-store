import {
    $, $$,
    GETelement,
    notificationWindow,

} from "../../../asset/javascript/end_point.js"

const login = {
    loginFrom: $('.login'),
    inputs: $$('.loginInput'),
    submitBtn: $('.loginButton'),
    textSubmit: $('.loginText'),
    loading: $('.load'),

    //Animate first focus
    animate: function () {
        this.inputs.forEach(element => {
            element.onfocus = () => {
                this.loginFrom.style.scale = '1'
            }
        });
    },

    //Animate submit
    animateSumbit: function (isStatus = true) {

        if (isStatus) {
            this.textSubmit.classList.add('active')
            this.loading.classList.add('active')
        }
        else {
            this.textSubmit.classList.remove('active')
            this.loading.classList.remove('active')
        }
    },

    submit: function () {

        //Remove act submit
        $('form').addEventListener('submit', (e) => { e.preventDefault() })

        //Animate

        this.animateSumbit()

        //Get submit
        const submitData = {
            Username: $('.loginInput.userName').value,
            Password: $('.loginInput.passWord').value,
        }

        //Check if submit
        GETelement('https://6392b4a0ac688bbe4c6929fb.mockapi.io/AdminAccount',
            (accounts) => {
                let result = false
                accounts.forEach((account) => {
                    if (account.Username === submitData.Username &&
                        account.Password === submitData.Password) {
                        result = {
                            Userid: account.Userid,
                            Username: account.Username,
                            Nickname: account.Nickname
                        }
                    }
                })

                setTimeout(() => {
                    if (!result) {

                        notificationWindow(
                            false,
                            'Incorrect account or password',
                            '',
                            (isSuccess) => {

                                if (isSuccess) {
                                    notificationWindow()
                                }
                                else {
                                    notificationWindow()
                                }

                            }
                            , 'Retry')
                        this.animateSumbit(false)
                    }
                    else {

                        //Clear animate
                        this.animateSumbit(false)

                        window.location.href = window.location.origin + '/admin'
                        sessionStorage.setItem('adminInfo', JSON.stringify(result))
                    }

                }, 1000);



            })
    },


    atc: function () {
        document.onkeydown = (e) => {
            e.which === 13 ? this.submitBtn.click() : ''
        }
    },

    start: function () {
        this.submitBtn.onclick = () => {
            this.submit()
            this.animateSumbit()
        }

        this.atc()
        this.animate()
    }
}
login.start()