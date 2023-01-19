import request from '@/utils/request'
/*
{
  username:"xxx",
  password:"1234"
}
*/
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token:token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}





