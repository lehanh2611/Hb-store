import { Get, Put, trafficAPi } from "../base.js"

export default function traffic() {
    const get = async () => await Get(trafficAPi)
    const increase = async () => {
        const currentValue = await get()
        const newValue = + currentValue + 1

        setTimeout(() => Put(trafficAPi, newValue), 10000)

    }
    return { get, increase }
}