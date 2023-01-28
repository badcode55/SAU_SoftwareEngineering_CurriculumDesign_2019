import request from '@/utils/request'

export function getList(params) {
    
    return request({
        url: '/field/list',
        method: 'get',
        params
    })
}

export function getLikeList(params) {
    return request({
        url: '/field',
        method: 'get',
        params
    })
}

export function isFieldExist(params) {
    return request({
        url: '/field/exist',
        method: 'get',
        params
    })
}

export function addField(data) {
    return request({
        url: '/field',
        method: 'post',
        data: data
    })
}

export function updateField(data) {
    return request({
        url: '/field',
        method: 'put',
        data: data
    })
}

export function deleteById(params) {
    return request({
        url: '/field/' + params.id,
        method: 'delete',
    })
}