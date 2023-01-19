import request from '@/utils/request'

export function addPayment(data) {
    return request({
        url: '/payment',
        method: 'post',
        data: data
    })
}