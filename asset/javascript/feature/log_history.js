/***** Import *****/
import {
    accountApi,
    GETelement,
    PATCHelement,
    loginSuccess,
    userActiveID
} from "../end_point.js"

// localStorage.clear()
export const logHistory = {
    logInfo: JSON.parse(localStorage.getItem('deviceInfo')),
    rememberId: sessionStorage.getItem('rememberLogInfo'),
    localId: localStorage.getItem('rememberLogInfo'),

    //Auto login from login history
    autoLogin: function () {
        if (this.rememberId || this.localId) {

            GETelement(accountApi, (accounts) => {

                if (this.rememberId) {
                    loginSuccess(this.rememberId, accounts)
                }
                else {
                    loginSuccess(this.localId, accounts)
                }

            })

        }
    },
    //Get real time
    getRealTime: function () {
        const date = new Date
        const fullDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
        }
        return fullDate
    },

    //Create info device + time active
    createDeviceInfo: function () {

        const getDeviceOS = () => {
            let device = "Unknown";
            const ua = {
                "Generic Linux": /Linux/i,
                "Android": /Android/i,
                "BlackBerry": /BlackBerry/i,
                "Bluebird": /EF500/i,
                "Chrome OS": /CrOS/i,
                "Datalogic": /DL-AXIS/i,
                "Honeywell": /CT50/i,
                "iPad": /iPad/i,
                "iPhone": /iPhone/i,
                "iPod": /iPod/i,
                "macOS": /Macintosh/i,
                "Windows": /IEMobile|Windows/i,
                "Zebra": /TC70|TC55/i,
            }
            Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));
            return device;
        }
        const createDeviceId = Number.parseInt(Math.random() * 1e9)
        return {
            Device: getDeviceOS(),
            DeviceId: createDeviceId,
            ActiveTime: this.getRealTime()
        }

    },

    //Save login info
    saveLogInfo: function (userId, accounts, isRemember = false) {
        const url = `${accountApi}/${userId}`
        const loginHistory = accounts[userId]?.LoginHistory
        const trustedDevice = accounts[userId]?.TrustedDevice

        // Check Login info from client
        if (!this.logInfo) {
            this.logInfo = this.createDeviceInfo()
            // Save to client
            localStorage.setItem('deviceInfo', JSON.stringify(this.logInfo))
        }

        // Save

        // Save login info to API and client
        Promise.all([
            new Promise((resolve) => {
                if (loginHistory === 'undefined' || loginHistory === '') {
                    PATCHelement(url, { LoginHistory: [] }, () => resolve())
                }
                else {
                    resolve()
                }
            }),
            new Promise((resolve) => {
                if (trustedDevice === 'undefined' || trustedDevice === '') {
                    PATCHelement(url, { TrustedDevice: [] }, () => resolve())
                } else {
                    resolve()
                }
            })
        ])
            .then(() => {
                GETelement(url, (account) => {

                    if (account?.LoginHistory?.length === 0 || !account.LoginHistory) {
                        PATCHelement(url, { LoginHistory: [this.logInfo] })
                    }
                    else {

                        // Check for existence
                        const result = account.LoginHistory.some((device) => {
                            return device.DeviceId === this.logInfo.DeviceId
                        })

                        // Add info login to login history
                        if (!result) {
                            let oldLogHistory = account.LoginHistory

                            //Save the last 5 login info
                            if (oldLogHistory.length >= 5) { oldLogHistory = oldLogHistory.slice(0, 9) }

                            PATCHelement(url, { LoginHistory: [this.logInfo, ...oldLogHistory,] })
                        }

                    }

                    // Add info login to trusted device
                    if (isRemember) {
                        localStorage.setItem('rememberLogInfo', userId)

                        if (account?.TrustedDevice?.length === 0 || !account.TrustedDevice) {
                            PATCHelement(url, { TrustedDevice: [this.logInfo] })
                        }
                        else {

                            // Check for existence
                            const result = account.TrustedDevice.some((device) => {
                                return device.DeviceId === this.logInfo.DeviceId
                            })
                            if (!result) {
                                PATCHelement(url, { TrustedDevice: [...trustedDevice, this.logInfo] })
                            }
                        }

                    }
                    else {
                        sessionStorage.setItem('rememberLogInfo', userId)
                    }
                })
            })
    },

    //Remove from trusted device
    deleteTrustedDevice: function () {
        if(!userActiveID) { return}
        const url = `${accountApi}/${userActiveID}`

        GETelement(url, (account) => {
            if (typeof account.TrustedDevice !== 'undefined'
                && account?.TrustedDevice?.length !== 0) {
                account.TrustedDevice.forEach((element, index) => {

                    if (element.DeviceId === this.logInfo.DeviceId) {
                        let trustedDevice = account.TrustedDevice

                        trustedDevice.splice(index, 1)
                        PATCHelement(url, {
                            TrustedDevice: trustedDevice
                        })
                        this.logInfo = null
                    }

                })
            }
        })

    },
    start: function () {
        this.autoLogin()
    }
}
