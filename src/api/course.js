import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/course/list',
        method: 'get',
        params
    })
}

export function addCourse(data) {
    return request({
        url: '/course',
        method: 'post',
        data: data
    })
}

export function updateCourse(data) {
    return request({
        url: '/course',
        method: 'put',
        data: data
    })
}

export function deleteById(params) {
    return request({
        url: '/course/' + params.id,
        method: 'delete',
    })
}