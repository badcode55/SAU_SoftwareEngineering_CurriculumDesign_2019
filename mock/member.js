const { param2Obj } = require('./utils')
const Mock = require('mockjs')



module.exports = [
    {
        url: '/vue-admin-template/member/list',
        type: 'get',
        response: (req, res) => {
            const [pageNum, pageSize] = [Number(param2Obj(req.url).pageNum), Number(param2Obj(req.url).pageSize)]
            const data = Mock.mock({
                'items|40': [{
                    id: '@id',
                    name: '@name',
                    birthday: '@date',
                    'point|1-4': 1,
                    'grade|1-5': 1,
                    'royalty|10-50.2': 1,
                    'cardType|1-5': 1
                }]
            })
            const items = data.items.slice(0, pageSize)
            for(i in items){
                items[i].grade = String(items[i].grade);
                items[i].royalty = String(items[i].royalty);
                items[i].cardType = String(items[i].cardType);
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
        url: '/vue-admin-template/member',
        type: 'post',
        response: (req, res) => {

            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/member',
        type: 'put',
        response: (req, res) => {
            console.log(req.body)
            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/member',
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