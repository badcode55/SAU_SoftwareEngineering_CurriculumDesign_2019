<template>
    <div>
        <div style="text-align:right">
            <el-row>
                <el-button type="primary" @click="handleCreate()">添加场地</el-button>
            </el-row>
        </div>
        <el-table v-loading="listLoading" :data="list" style="width: 100%">
            <el-table-column prop="name" label="名称" width="1100">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <div v-for="(item, index) in props.row.priceInfo" :key="index">
                            <el-form-item :label='"定价"+(index+1)'>
                                <span>开始时间:{{ item.startTime }}，截止时间:{{ item.endTime }}，价格：{{ item.price }}</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination :hide-on-single-page="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-form :rules="rules" ref="form" :model="form" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item prop="priceInfo">
                    <el-form-item v-for="(item, index) in form.priceInfo" :key="'form'+index">
                        <el-form-item :label='"定价"+(index+1)' :prop="'priceInfo.'+index">
                            <el-form-item :rules="timeRules" v-if="index==0" :prop="'priceInfo.' + index + '.startTime'" label="开始时间">
                                <el-time-select v-model="form.priceInfo[index].startTime" placeholder="选择时间" :picker-options="{ start: '08:00', step: '00:30', end: '21:30', maxTime: form.priceInfo[index].endTime }"
                                    format="HH:mm"></el-time-select>
                            </el-form-item>
                            <el-form-item :rules="timeRules" v-else :prop="'priceInfo.' + index + '.startTime'" label="开始时间">
                                <el-time-select v-model="form.priceInfo[index].startTime" placeholder="选择时间" :picker-options="{ start: form.priceInfo[index - 1].endTime, step: '00:30', end: '21:30', maxTime: form.priceInfo[index].endTime }" format="HH:mm"></el-time-select>
                            </el-form-item>
                            <el-form-item :rules="timeRules" :prop="'priceInfo.' + index + '.endTime'" label="截止时间">
                                <el-time-select v-model="form.priceInfo[index].endTime" placeholder="选择时间" :picker-options="{ start: '08:30', step: '00:30', end: '22:00', minTime: form.priceInfo[index].startTime }" format="HH:mm"></el-time-select>
                            </el-form-item>
                            <el-form-item :prop="'priceInfo.' + index + '.price'" label="价格">
                                <el-input-number size="medium" v-model="form.priceInfo[index].price" :precision="2" :step="0.1" :max="99999999"></el-input-number>
                            </el-form-item>
                            <el-button @click.prevent="removeItem(item)">删除</el-button>
                        </el-form-item>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addItem">新增定价</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogStatus==='create'?add():update()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
import { getList, addField, updateField, deleteById, isFullOver } from '@/api/field'
import { orderExist } from '@/api/order'
export default {
    data() {
        // var validatePrice = (rule, value, callback) => {
        //     var regPos = /^\d+(\.\d+)?$/
        //     var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
        //     if (regPos.test(value) || regNeg.test(value)) {
        //         var str = value.split('.')[0];
        //         if (str.length > 10) {
        //             callback(new Error('整数部分不能超过十位'));
        //         } else {
        //             callback();
        //         }
        //     } else {
        //         callback(new Error('请输入数值'));
        //     }
        // };
        return {
            list: null,
            listLoading: true,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            initForm:{
                id: undefined,
                name: "",
                priceInfo: [{
                    startTime: "",
                    endTime: "",
                    price: ""
                }]
            },
            form: {
                id:undefined,
                name:"",
                priceInfo: [{
                    startTime:"",
                    endTime:"",
                    price:""
                }]
            },
            dialogVisible: false,
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },
            timeRules:[
                {required: true, message: '请选择时间', trigger: 'change' }
            ],
            pageShow: true,
            fullOver: false
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.listLoading = true
            getList({ "pageNum": this.currentPage, "pageSize": this.pageSize }).then(response => {
                this.list = response.data.page.records
                for(let i in this.list){
                    this.list[i].priceInfo = JSON.parse(this.list[i].priceInfo);
                }
                this.total = response.data.page.total
                if (response.data.page.pages == 1) {
                    this.pageShow = true
                } else {
                    this.pageShow = false
                }
            })
            this.listLoading = false
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchData()
        },
        resetForm() {
            this.form = JSON.parse(JSON.stringify(this.initForm))
        },
        handleCreate() {
            this.resetForm()
            this.dialogStatus = 'create'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        handleUpdate(row) {
            // this.form = Object.assign({}, row) // copy obj
            this.form=JSON.parse(JSON.stringify(row))
            // this.form.startTime = new Date('2016-1-1 ' + this.form.startTime + ':00')
            // for (var i in this.form.priceInfo){
            //     this.form.priceInfo[i].startTime = new Date('2016-1-1 ' + this.form.priceInfo[i].startTime + ':00');
            //     this.form.priceInfo[i].endTime = new Date('2016-1-1 ' + this.form.priceInfo[i].endTime + ':00');
            // }
            // 封装一个函数返回当前的时分秒 格式 08: 08: 08
            // function getTime() {
            //     var times = new Date();
            //     var h = time.getHours();
            //     h = h < 10 ? '0' + h : h;
            //     var m = time.getMinutes();
            //     m = m < 10 ? '0' + m : m;
            //     var s = time.getSeconds();
            //     s = s < 10 ? '0' + s : s;
            //     return h + ':' + m + ':' + s;
            // }
            this.dialogStatus = 'update'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        getTime(time) {
            var h = time.getHours();
            h = h < 10 ? '0' + h : h;
            var m = time.getMinutes();
            m = m < 10 ? '0' + m : m;
            return h + ':' + m ;
        },
        removeItem(item) {
            var index = this.form.priceInfo.indexOf(item)
            if (index !== -1) {
                this.form.priceInfo.splice(index, 1)
            }
        },
        addItem() {
            this.form.priceInfo.push({
                startTime: "",
                endTime: "",
                price: "",
            });
        },
        validatePriceInfo(params){
            isFullOver(params).then(response=>{
               this.fullOver= response.data.fullOver
            })
            return this.fullOver;
        },
        add() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const newForm = JSON.parse(JSON.stringify(this.form))
                    if(newForm.priceInfo.length==0){
                        this.$message({
                            message: '请设置定价规则',
                            type: 'warning'
                        });
                        return false;
                    }else{
                        for(let i in newForm.priceInfo){
                            if(i>0){
                                if (Number(newForm.priceInfo[i - 1].endTime.split(':')[0]) > Number(newForm.priceInfo[i].startTime.split(':')[0])){
                                    this.$message({
                                        message: '定价规则冲突',
                                        type: 'warning'
                                    });
                                    return false;
                                }
                            }
                        }
                    }
                    newForm.priceInfo = JSON.stringify(newForm.priceInfo)
                    if(!this.validatePriceInfo(newForm)){
                        this.$message({
                            message: '请确保定价覆盖当天整个运营时间段(08:00-22:00)',
                            type: 'warning'
                        });
                        return false
                    }
                    addField(newForm).then(responce => {
                        this.dialogVisible = false
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.fetchData()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        },
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const newForm = JSON.parse(JSON.stringify(this.form))
                    if (newForm.priceInfo.length == 0) {
                        this.$message({
                            message: '请设置定价规则',
                            type: 'warning'
                        });
                        return false;
                    } else {
                        for (let i in newForm.priceInfo) {
                            if (i > 0) {
                                if (Number(newForm.priceInfo[i - 1].endTime.split(':')[0]) > Number(newForm.priceInfo[i].startTime.split(':')[0])) {
                                    this.$message({
                                        message: '定价规则冲突',
                                        type: 'warning'
                                    });
                                    return false;
                                }
                            }
                        }
                    }
                    newForm.priceInfo = JSON.stringify(newForm.priceInfo)
                    if (!this.validatePriceInfo(newForm)) {
                        this.$message({
                            message: '请确保定价覆盖当天整个运营时间段(08:00-22:00)',
                            type: 'warning'
                        });
                        return false
                    }
                    updateField(newForm).then(responce => {
                        this.dialogVisible = false
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.fetchData()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        },
        handleDelete(row) {
            orderExist({
                flag: 3,
                id: row.id
            }).then(responce => {
                if (responce.data.sum != 0) {
                    this.$notify({
                        title: '警告',
                        message: '存在有效订单',
                        type: 'warning',
                        duration: 2000
                    })
                } else {
                    deleteById(row).then(responce => {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.fetchData()
                    })
                }

            })

        }
    }
}
</script>