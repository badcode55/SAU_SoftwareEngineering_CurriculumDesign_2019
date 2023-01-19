import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/member/list',
        method: 'get',
        params
    })
}

export function addMember(data) {
    return request({
        url: '/member',
        method: 'post',
        data: data
    })
}

export function updateMember(data) {
    return request({
        url: '/member',
        method: 'put',
        data: data
    })
}

export function deleteById(params) {
    return request({
        url: '/member/' + params.id,
        method: 'delete',
    })
}