// // /firebase api
//Account storage//
export const accountApi = "https://hbstore26-default-rtdb.firebaseio.com/accounts";

//Admin account storage//
export const admin_accountApi = "https://hbstore26-default-rtdb.firebaseio.com/admin_accounts";
//Product storage//
export const productAPi = "https://hbstore26-default-rtdb.firebaseio.com/products"

//Gift storage//
export const gift_codeAPi = "https://hbstore26-default-rtdb.firebaseio.com/gift_code"

//Order storage//
export const orderAPi = "https://hbstore26-default-rtdb.firebaseio.com/order"

//Desposit storage//
export const depositAPi = "https://hbstore26-default-rtdb.firebaseio.com/deposit"

//Get element/api
export function GETelement(url, callback) {
    // console.log(url)
    fetch(`${url}.json`)
        .then((element) => { return element.json() })
        .then(callback)

};
//Post element/api
export function POSTelement(url, value, callback) {
    // console.log(url)
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
    // console.log(url)
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
    // console.log(url)
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
    // console.log(url)
    fetch(`${url}.json`, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
    })
        .then((element) => { return element.json() })
        .then(callback)
}

//Get element/api
export function Get(url, callback) {
    // console.log(url)
    return fetch(`${url}.json`)
        .then((element) => { return element.json() })


};
//Post element/api
export function Post(url, value, callback) {
    // console.log(url)
    return fetch(`${url}.json`, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
        .then((element) => { return element.json() })
};
//Put element/api
export function Put(url, value, callback) {
    // console.log(url)
    return fetch(`${url}.json`, {
        method: "PUT",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
        .then((element) => { return element.json() })
};
//Patch element/api
export function Patch(url, value, callback) {
    // console.log(url)
    return fetch(`${url}.json`, {
        method: "PATCH",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(value)
    })
        .then((element) => { return element.json() })
};
//Delete element/api
export function Delete(url, callback) {
    // console.log(url)
    return fetch(`${url}.json`, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
    })
        .then((element) => { return element.json() })
}

//Remove null api
// export function removeNull(url, callback) {
//     fetch(`${url}.json`)
//         .then((element) => { return element.json() })
//         .then(vl => {
//             const result = vl.reduce((acc, v) => {
//                 if (v != null) {
//                     acc.push(v)
//                 }
//                 return acc
//             }, [])
//             fetch(`${url}.json`, {
//                 method: "PUT",
//                 headers: { 'Content-type': 'application/json' },
//                 body: JSON.stringify(result)
//             })
//                 .then((element) => { return element.json() })
//                 .then(callback)

//         })
// }

// function NewProduct(uid, price, type, server, i) {
//     this.ProductID = i
//     this.UID = uid
//     this.Server = server
//     this.Price = price
//     this.Type = type
//     this.Discount = '0%'
//     this.Flashsale = 'No'
//     this.Sold = 'No'
// }
// async function start(j = 0) {
//     let total = j + 10
//     let ouput = []
//     for (let i = j; i < total; i++) {
//         let random = Number.parseInt(Math.random() * 1000009).toString()
//         random = random.slice(0, 3)
//         const uid = Number(random + '789789')
//         const type = 'Đặc biệt'
//         const price = 500000
//         const sv = Number.parseInt(Math.random() * 10) >= 5 ? 'Asia' : 'America'
//         const newProduct = new NewProduct(uid, price, type, sv, i)
//         ouput = [...ouput, { ...newProduct }]
//     }
//     const newp = [...await Get(productAPi), ...ouput]
//     // console.log(newp)
//     // Put(productAPi, newp)
// }


// GETelement(productAPi, v => start(v.length))

// GETelement(productAPi, v => {
//     const data = v.filter((e, i) => {
//         // return v.some(f => {
//             if (e === null ) {
//                 return false
//             }
//         //     return e.UID === f.UID && e.ProductID !== f.ProductID
//         // })
//         return e.ProductID !== i
//     })
//     for (let i = 0; i < v.length; i++) {

//         data.forEach(element => {
//             if (v[i] === null) { return }
//             if (v[i].UID === element.UID) {
//                 v[i] = null
//             }
//         });
//     }
//     // console.log(v)
//     // Put(productAPi, v)
// })
