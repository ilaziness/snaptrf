import api from "@/api/request";


export const createMsg = async (data) => {
    return await api.post('/msg', data).then(resp => resp.data)
}

export const getMsg = async (id, pwd) => {
    let url = `/msg/${id}/`
    if (pwd !== undefined) {
        url = `${url}${pwd}`
    }
    return await api.get(url).then(resp => resp.data)
}