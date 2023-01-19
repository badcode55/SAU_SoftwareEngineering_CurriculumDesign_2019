const { param2Obj } = require('./utils')
const Mock = require('mockjs')


module.exports = [
    {
        url: '/vue-admin-template/coach/list',
        type: 'get',
        response: (req, res) => {
            const [pageNum, pageSize] = [Number(param2Obj(req.url).pageNum), Number(param2Obj(req.url).pageSize)]
            const data = Mock.mock({
                'items|40': [{
                    id: '@id',
                    name: '@name',
                    'grade|1-5': 1,
                    'royaltyRatio|0.1': 1
                }]
            })
            const items = data.items.slice(0,pageSize)
            for (i in items) {
                items[i].grade = String(items[i].grade);
                items[i].royaltyRatio = String(items[i].royaltyRatio);
            }
            return {
                code: 20000,
                data: {
                    total: 40,
                    items: items,
                    pageNum: pageNum + 1,
                    pageSize:pageSize
                }
                
            }
        }
    }, 
    {
        url: '/vue-admin-template/coach',
        type: 'post',
        response: (req, res) => {
            
            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/coach',
        type: 'put',
        response: (req, res) => {
            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/coach',
        type: 'delete',
        response: (req, res) => {
            const str = req.url.split('/');
            const id = str[str.length-1]
            return {
                code: 20000,
                message:id
            }
        }
    }
]