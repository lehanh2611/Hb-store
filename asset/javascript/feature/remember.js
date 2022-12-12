/***** Import *****/
import {
    $,
    $$,
    homeApi,
    GETelement,
    PUTelement,
    loginSuccess
} from "../end_point.js"

//Remember login/add
export const remember = {
    rememberCode: localStorage.getItem('remember'),
    rememberTemporaryid: sessionStorage.getItem('remember'),
    //Check remember code
    checkCode: function () {
        if (this.rememberCode === null) {
            this.handleCode()
        }
        else {
            //Auto login
            //Get devices
            const devices = GETelement(homeApi, (value) => {
                for (let element of value) {
                    if (element.Devices !== undefined) {
                        element.Devices.forEach((device) => {
                            if (device === localStorage.getItem('remember')) {
                                loginSuccess(element.UserID, value)
                            }
                        })
                    }
                }
            })
        }
    },
    //Handle code remeber 
    handleCode: function () {
        //Create remember code
        const infoDevice = navigator.appVersion
        const indexStart = infoDevice.indexOf('(') + 1
        const indexEnd = infoDevice.indexOf(';')

        this.rememberCode =
            `${infoDevice.slice(indexStart, indexEnd)} - ${Math.floor(Math.random() * 1e9)}`

        //Save the local storage remember code to the client
        localStorage.setItem('remember', this.rememberCode)
    },
    addCode: function (UserID) {
        //add remember code to account
        const url = `${homeApi}/${UserID}`
        GETelement(url, (value) => {
            if (value.Devices === undefined) {
                PUTelement(url, {
                    Devices: [remember.rememberCode]
                })
            }
            else {
                //device already exists / exist => dont add
                if (!value.Devices.some((element) => element ===
                    remember.rememberCode)) {
                    PUTelement(url, {
                        Devices: value.Devices.concat(remember.rememberCode)
                    })
                }
            }
        })
    },
    //Automatically log in from temporary data
    rememberTemporary: function () {
        if (this.rememberTemporaryid !== null) {
            GETelement(homeApi, (value) =>
                loginSuccess(this.rememberTemporaryid, value))
        }
        else {
            this.checkCode()
        }
    },

    start: function () {
        this.rememberTemporary()

    }
}