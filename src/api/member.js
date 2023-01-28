import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/member/list',
        method: 'get',
        params
    })
}

export function getLikeList(params) {
    return request({
        url: '/member',
        method: 'get',
        params
    })
}

export function isMemberExist(params) {
    return request({
        url: '/member/exist',
        method: 'get',
        params
    })
}

export function isBirthday(params) {
    return request({
        url: '/member/birthday',
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