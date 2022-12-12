/***** Import *****/
import {$,$$} from "../end_point.js"

//Register / Login account//
export let register = $('.menu-logReg__btn.register-btn'),
    login = $('.menu-logReg__btn');
login.addEventListener('click', registerLogin)
register.addEventListener('click', registerLogin);

//Keyboard event//
document.onkeydown = (e) => {
    if (modalLogReg.getBoundingClientRect().width !== 0
        && bodyModalLoading.getBoundingClientRect().width === 0
        && notificationWindowBody.getBoundingClientRect().width === 0
    ) {
        switch (e.which) {
            case 27: closemodalLogReg();
                break;
            case 13: registerLogin();
                break;
        };
    };
};

//Get value input
function getValueInput(inputs) {
    let temporaryAccount = {}
    inputs.forEach((elements) => {
        temporaryAccount[elements.type] = elements.element.value
    });
    return temporaryAccount
};
// Register login
export function registerLogin() {
    //Check value
    let checkAgain = new Promise((resolve, reject) => {
        createFollowers.forEach((elements) => {
            elements.value.forEach((element) => {
                if (element.getBoundingClientRect().top > 0) {
                    sendMessage(element, elements.type);
                }
            });
        });
        if ($('.messageErorr') === null) {
            //Wait For execution
            modalLoading()
            resolve()
        }
        else {
            reject()
        }
    });
    //Get list account
    checkAgain
        .then(() => {
            let getAccounts = new Promise((resolve) => {
                GETelement(homeApi, (element) => {
                    resolve(element)
                })
            })
            getAccounts.then((acccounts) => {
                //classify
                if (loginMenu.getBoundingClientRect().top <= 0) {
                    //Register
                    //New account//
                    let newAccount = {
                        'UserID': acccounts.length,
                        'Username': '',
                        'Password': '',
                        'Money': 0,
                        'Email': '',
                    };
                    checkAgain
                    let register = new Promise((resolve, reject) => {
                        //Input of Register
                        let inputRegisters = [
                            {
                                type: 'Username',
                                element: $('.menu-logReg__input-username.register')
                            },
                            {
                                type: 'Password',
                                element: $('.menu-logReg__input-password.register')
                            },
                            {
                                type: 'Email',
                                element: $('.menu-logReg__input-email.register')
                            }
                        ];

                        //Check existence
                        let inputResult = getValueInput(inputRegisters),
                            existenceResult = acccounts.every((acccount) => {
                                return acccount['Username'] !== inputResult.Username
                            })
                        //Register successful
                        if (existenceResult) {
                            let createAccount = Object.assign(newAccount, inputResult);
                            POSTelement(homeApi, createAccount, (value) => {
                                if (value.Username === createAccount.Username) {
                                    resolve({
                                        UserID: createAccount.UserID,
                                        Acccounts: acccounts,
                                    })
                                }
                            })
                        }
                        //Register fail
                        else {
                            reject()
                        };
                    });
                    register
                        .then((arr) => {
                            notificationWindow(
                                true,
                                'Đăng ký hoàn tất',
                                'Nhấn để đăng nhập nhanh!',
                                (isSuccess) => {
                                    if (isSuccess) {
                                        GETelement(homeApi, (acccounts) => {
                                            closemodalLogReg()
                                            loginSuccess(value.UserID, value.Acccounts)
                                        })
                                    }
                                    else {
                                        notificationWindow()
                                    }
                                });
                        })
                        .catch(() => {
                            notificationWindow(
                                false,
                                'Đăng ký thất bại',
                                'Tài khoản đã tồn tại!',
                                () => {
                                    notificationWindow()
                                })
                        })
                        .finally(() => {
                            modalLoading(false)
                        })
                }
                else {
                    //Login
                    checkAgain
                    let inputLogins = [
                        {
                            type: 'Username',
                            element: $('.menu-logReg__input-username.login')
                        },
                        {
                            type: 'Password',
                            element: $('.menu-logReg__input-password.login')
                        },
                    ],
                        inputResult = getValueInput(inputLogins),
                        checkAccount = new Promise((resolve, reject) => {
                            let getUser,
                                username = acccounts.find((acccount) => {
                                    if (acccount.Username === inputResult.Username) {
                                        getUser = acccount.UserID;
                                        return true
                                    }
                                });
                            if (username !== undefined) {
                                if (username.Password === inputResult.Password) {
                                    resolve({
                                        UserID: getUser,
                                        Acccounts: acccounts
                                    });
                                }
                                else {
                                    reject(inputResult);
                                };
                            }
                            else {
                                reject(inputResult);
                            };
                        });
                    checkAccount
                        .then((value) => {
                            console.log('aok')
                            loginSuccess(value.UserID, value.Acccounts)
                            closemodalLogReg()
                        })
                        .catch(() => {
                            notificationWindow(
                                false,
                                'Đăng nhập thất bại',
                                'Tài khoản hoặc mật khẩu không chính xác',
                                () => {
                                    notificationWindow()
                                })
                        })
                        .finally(() => {
                            modalLoading(false)
                        })
                };
            })

        })
        .catch(() => {
        })
};