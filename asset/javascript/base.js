// //Account storage//
// export let accountApi = "https://6392b4a0ac688bbe4c6929fb.mockapi.io/Accounts";
// //Product storage//
// export const productAPi = "https://6392b4a0ac688bbe4c6929fb.mockapi.io/Products"

// // /firebase api
//Account storage//
export let accountApi = "https://hbstore26-default-rtdb.firebaseio.com/accounts";

//Admin account storage//
export let admin_accountApi = "https://hbstore26-default-rtdb.firebaseio.com/admin_accounts";
//Product storage//
export const productAPi = "https://hbstore26-default-rtdb.firebaseio.com/products"

//Get element/api
export function GETelement(url, callback) {
    console.log(url)
    fetch(`${url}.json`)
        .then((element) => { return element.json() })
        .then(callback)

};
//Post element/api
export function POSTelement(url, value, callback) {
    console.log(url)
    fetch(`${url}.json`, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
        .then((element) => { return element.json() })
        .then(callback)
};
//Put element/api
export function PUTelement(url, value, callback) {
    console.log(url)
    fetch(`${url}.json`, {
        method: "PUT",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
        .then((element) => { return element.json() })
        .then(callback)
};
//Patch element/api
export function PATCHelement(url, value, callback) {
    console.log(url)
    fetch(`${url}.json`, {
        method: "PATCH",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
        .then((element) => { return element.json() })
        .then(callback)
};
//Delete element/api
export function DELETEelement(url, callback) {
    console.log(url)
    fetch(`${url}.json`, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
    })
        .then((element) => { return element.json() })
        .then(callback)
}
//Remove null api
export function removeNull(url, callback) {
    fetch(`${url}.json`)
        .then((element) => { return element.json() })
        .then(vl => {
            const result = vl.reduce((acc, v) => {
                if (v != null) {
                    acc.push(v)
                }
                return acc
            }, [])
            fetch(`${url}.json`, {
                method: "PUT",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(result)
            })
                .then((element) => { return element.json() })
                .then(callback)

        })
}

let i = 0 
// GETelement(accountApi, v => {
//     let i = -1
//     const output = v.map((e) => {
//         ++i
//         return {
//             ...e,
//             UserID: i
//         }
//     })
//     console.log(output)
//     PUTelement(accountApi, output)
// })



