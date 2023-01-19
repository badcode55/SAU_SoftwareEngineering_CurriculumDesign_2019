const { param2Obj } = require('./utils')
const Mock = require('mockjs')



module.exports = [
    {
        url: '/vue-admin-template/field/list',
        type: 'get',
        response: (req, res) => {
            const [pageNum, pageSize] = [Number(param2Obj(req.url).pageNum), Number(param2Obj(req.url).pageSize)]
            const data = Mock.mock({
                'items|40': [{
                    id: '@id',
                    name: '@name',
                    'priceInfo|1-5': [{
                        startTime: '@time("HH:mm")',
                        endTime: '@time("HH:mm")',
                        'price|1-2.2': 1
                    }]
                }]
            })
            const items = data.items.slice(0, pageSize)
            for (i in items) {
                for(j in items[i].priceInfo){
                    items[i].priceInfo[j].price = String(items[i].priceInfo[j].price)
                }
            }
            return {
                code: 20000,
                data: {
                    total: 40,
                    items: items,
                    pageNum: String(Number(pageNum) + 1),
                    pageSize: pageSize
                }

            }
        }
    },
    {
        url: '/vue-admin-template/field',
        type: 'post',
        response: (req, res) => {

            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/field',
        type: 'put',
        response: (req, res) => {
            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/field',
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