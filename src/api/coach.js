import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/coach/list',
        method: 'get',
        params
    })
}

export function addCoach(data) {
    return request({
        url: '/coach',
        method: 'post',
        data:data
    })
}

export function updateCoach(data) {
    return request({
        url: '/coach',
        method: 'put',
        data:data
    })
}

export function deleteById(params){
    return request({
        url:'/coach/'+params.id,
        method:'delete',
    })
}