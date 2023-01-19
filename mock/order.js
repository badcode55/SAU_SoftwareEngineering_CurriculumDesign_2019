const { param2Obj } = require('./utils')
const Mock = require('mockjs')



module.exports = [
    {
        url: '/vue-admin-template/order/list',
        type: 'get',
        response: (req, res) => {
            const [pageNum, pageSize] = [Number(param2Obj(req.url).pageNum), Number(param2Obj(req.url).pageSize)]
            const data = Mock.mock({
                'items|40': [{
                    id: '@id',
                    memberId:'@id',
                    memberName:'@name',
                    coachId:'',
                    coachName:'@name',
                    fieldId:'@id',
                    fieldName:'@name',
                    courseId:'',
                    courseName:'@name',
                    startDate:'@date',
                    startTime:'08:30',
                    endTime:'10:30'
                }]
            })
            const items = data.items.slice(0, pageSize)
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
        url: '/vue-admin-template/order',
        type: 'post',
        response: (req, res) => {

            return {
                code: 20000,
                message: req.body.name
            }
        }
    },
    {
        url: '/vue-admin-template/order',
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
        url: '/vue-admin-template/order',
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