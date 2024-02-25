import api from "@/api/request";


export const createMsg = async (data) => {
    return await api.post('/msg', data).then(resp => resp.data)
}

export const getMsg = async (id, pwd) => {
    let url = `http://127.0.0.1:8080/msg/${id}/`
    if (pwd !== undefined) {
        url = `${url}${pwd}`
    }
    return await fetch(url).then(resp => resp.json())
}