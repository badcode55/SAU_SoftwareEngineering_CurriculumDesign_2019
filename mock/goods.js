const { param2Obj } = require('./utils')
const Mock = require('mockjs')


module.exports = [
    {
        url: '/vue-admin-template/goods/list',
        type: 'get',
        response: (req, res) => {
            const data = Mock.mock({
                'items|40': [{
                    id: '@id',
                    name: '@name',
                    'price|10-50.2': 1,
                    'stock|0-100':1,
                    'bonus|1-5': 1,
                    info: '@sentence'
                }]
            })
            for (i in data.items) {
                data.items[i].price = String(data.items[i].price)
            }
            return {
                code: 20000,
                data: {
                    total: 40,
                    items: data.items
                }

            }
        }
    },
    {
        url: '/vue-admin-template/goods',
        type: 'post',
        response: (req, res) => {

            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/goods',
        type: 'put',
        response: (req, res) => {
            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/goods',
        type: 'delete',
        response: (req, res) => {
            const str = req.url.split('/');
            const id = str[str.length - 1]
            return {
                code: 20000,
                message: id
            }
        }
    }
]