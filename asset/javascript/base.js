//Recursive//
export function recursive(timeOut, list, e, value1, value2, value3, value4,) {
    let listLength = list.length,
        i = 0;
    callBack()
    function callBack() {
        if (i <= listLength - 1) {
            e(list[i], i, value1, value2, value3, value4,);
            setTimeout(() => {
                callBack();
            }, timeOut);
        }
        else {
            return;
        };
        i++
    };
};
//Account storage//
export let acccounts = [
    [{
        "UserID": 0,
        "Username": "admin",
        "Password": "admin",
        "Money": 999999999,
        "Email": "hbstore@gmail.com",
        "Nickname": "Lê Hạnh",
        "Avatar": "./asset/img/user-avt/user-id0.jpg"
    }],
    [{
        "UserID": 1,
        "Username": "Hanhba",
        "Password": "admin",
        "Money": 888888888,
        "Email": "hbstore@gmail.com",
        "device": {

        }
    }],
];

export let homeApi = "https://6392b4a0ac688bbe4c6929fb.mockapi.io/Accounts";
//Get element/api
export function GETelement(url, callback) {
    fetch(url)
        .then((element) => { return element.json() })
        .then(callback)

};
//Post element/api
export function POSTelement(url, value, callback) {
    fetch(url, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
    .then((element) => { return element.json() })
    .then(callback)
};
//Put element/api
export function PUTelement(url, value, callback) {
    fetch(url, {
        method: "PUT",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
    .then((element) => { return element.json() })
    .then(callback)
};
//Delete element/api
export function DELETEelement(url,callback) {
    console.log(url)
    fetch(url, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
    })
    .then((element) => { return element.json() })
    .then(callback)
};

