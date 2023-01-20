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

/*
   *  1 会员
   * 2 教练
   * 3 场地
   * 4 课程
   * */
export function orderExist(params) {
    return request({
        url: '/order/exist',
        method: 'get',
        params
    })
}