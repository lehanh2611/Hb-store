import {
    $, $$,
    admin_accountApi,
    GETelement,
    notificationWindow,

} from "../../../asset/javascript/end_point.js"

const login = {
    loginFrom: $('.login'),
    inputs: $$('.loginInput'),
    submitBtn: $('.btn-loading'),

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
            this.submitBtn.classList.add('active')
        }
        else {
            this.submitBtn.classList.remove('active')
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
        GETelement(admin_accountApi,
            (accounts) => {
                let result = false
                accounts.forEach((account) => {
                    if (account.Username === submitData.Username &&
                        account.Password === submitData.Password) {
                        result = {
                            UserId: account.UserId,
                            Username: account.Username,
                            Nickname: account.Nickname,
                            Avatar: account.Avatar
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

    start: function () {
        this.submitBtn.onclick = () => {
            this.submit()
            this.animateSumbit()
        }

        this.animate()
    }
}
login.start()