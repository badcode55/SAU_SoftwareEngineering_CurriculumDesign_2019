import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/order/list',
        method: 'get',
        params
    })
}

export function addOrder(data) {
    return request({
        url: '/order',
        method: 'post',
        data: data
    })
}

export function updateOrder(data) {
    return request({
        url: '/order',
        method: 'put',
        data: data
    })
}

export function deleteById(params) {
    return request({
        url: '/order/' + params.id,
        method: 'delete',
    })
}