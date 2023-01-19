import request from '@/utils/request'

export function getList() {
    return request({
        url: '/goods',
        method: 'get'
    })
}

export function addGoods(data) {
    return request({
        url: '/goods',
        method: 'post',
        data: data
    })
}

export function updateGoods(data) {
    return request({
        url: '/goods',
        method: 'put',
        data: data
    })
}

export function deleteById(params) {
    return request({
        url: '/goods/' + params.id,
        method: 'delete',
    })
}