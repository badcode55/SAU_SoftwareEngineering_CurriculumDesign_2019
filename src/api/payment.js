import request from '@/utils/request'

export function addPayment(data) {
    return request({
        url: '/payment',
        method: 'post',
        data: data
    })
}

export function getPaySum(data) {
    return request({
        url: '/payment/getPaySum',
        method: 'post',
        data:data
    })
}