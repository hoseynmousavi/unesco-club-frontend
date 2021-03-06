import axios from "axios"
import {NotificationManager} from "react-notifications"

// export const REST_URL = "http://localhost:1445"
export const REST_URL = "https://api.irteuc.com"

function get(url, param = "", dontToast)
{
    const token = !localStorage.hasOwnProperty("admin") ? null : JSON.parse(localStorage.getItem("admin")).token
    return axios.get(encodeURI(REST_URL + "/" + url + "/" + param), {headers: token ? {"Authorization": `${token}`} : null})
        .then((res) =>
        {
            localStorage.setItem(url + "/" + param, JSON.stringify(res.data))
            return res.data
        })
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            const cacheData = localStorage.getItem(url + "/" + param)
            if (cacheData)
            {
                if (err?.response?.status !== 404 && !dontToast)
                {
                    const lang = localStorage.getItem("language")
                    NotificationManager.warning(lang && lang === "en" ? "lack of internet access, offline loading ..." : "عدم دسترسی به اینترنت، بارگزاری آفلاین...")
                }
                return JSON.parse(cacheData)
            }
            else
            {
                if (err?.response?.status !== 404 && !dontToast)
                {
                    const lang = localStorage.getItem("language")
                    NotificationManager.error(lang && lang === "en" ? "error in receiving information!" : "برنامه در گرفتن اطلاعات با خطا مواجه شد!")
                }
                throw err
            }
        })
}

function post(url, data, param = "", progress)
{
    const token = !localStorage.hasOwnProperty("admin") ? null : JSON.parse(localStorage.getItem("admin")).token
    return axios.post(encodeURI(REST_URL + "/" + url + "/" + param), data, {
        headers: token ? {"Authorization": `${token}`} : null,
        onUploadProgress: e => progress ? progress(e) : null,
    })
        .then((res) => res.data)
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

function patch(url, data, param = "", progress)
{
    const token = JSON.parse(localStorage.getItem("admin")).token
    const sendUrl = param === "" ? REST_URL + "/" + url + "/" : REST_URL + "/" + url + "/" + param + "/"
    return axios.patch(encodeURI(sendUrl), data, {
        headers: {"Authorization": `${token}`},
        onUploadProgress: e => progress ? progress(e) : null,
    })
        .then((res) => res.data)
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

function del(url, data, param = "")
{
    const token = JSON.parse(localStorage.getItem("admin")).token
    const sendUrl = param === "" ? REST_URL + "/" + url + "/" : REST_URL + "/" + url + "/" + param + "/"
    return axios.delete(encodeURI(sendUrl), {headers: {"Authorization": `${token}`}, data})
        .then((res) => res.data)
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

const api = {
    get, post, patch, del,
}

export default api