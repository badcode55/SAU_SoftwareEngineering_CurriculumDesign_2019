<template>
    <div>
        <div style="text-align:right">
            <el-row>
                <el-button type="primary" @click="handleCreate()">添加教练</el-button>
            </el-row>
        </div>
        
        <el-table v-loading="listLoading" :data="list" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="380">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="grade" label="等级" width="380">
                <template slot-scope="scope">
                    <template v-if="scope.row.grade==1">等级一</template>
                    <template v-else-if="scope.row.grade==2">等级二</template>
                    <template v-else-if="scope.row.grade==3">等级三</template>
                    <template v-else-if="scope.row.grade==4">等级四</template>
                    <template v-else-if="scope.row.grade==5">等级五</template>
                    <template v-else>{{ scope.row.grade }}</template>
                </template>
            </el-table-column>
            <el-table-column prop="royaltyRatio" label="提成比例" width="380">
                <template slot-scope="scope">
                    {{ scope.row.royaltyRatio }}
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" >
            <el-form :rules="rules" ref="form" :model="form" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="等级" prop="grade">
                    <el-select v-model="form.grade" placeholder="请选择教练等级">
                        <el-option label="等级一" value="1"></el-option>
                        <el-option label="等级二" value="2"></el-option>
                        <el-option label="等级三" value="3"></el-option>
                        <el-option label="等级四" value="4"></el-option>
                        <el-option label="等级五" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提成比例" prop="royaltyRatio">
                    <el-input maxlength="4" v-model="form.royaltyRatio"></el-input>
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
import { deleteById, getList, addCoach, updateCoach } from '@/api/coach'
import { orderExist } from '@/api/order'
export default {
    data() {
        var validateRatio = (rule, value, callback) => {
            if (value !== '') {
                var regPos = /^\d+(\.\d+)?$/
                var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
                if (regPos.test(value) || regNeg.test(value)) {
                    var str = value.split('.')[0]
                    if(Number(str)!=0){
                        callback(new Error('请输入0到1之间的数'));
                    }else{
                        callback();
                    }
                } else {
                    callback(new Error('请输入数值'));
                }
            } else {
                
                callback();
            }
        };
        return {
            list: null,
            listLoading: true,
            currentPage: 1,
            pageSize: 10,
            total:0,
            dialogVisible: false,
            initForm:{
                id: undefined,
                name: "",
                grade: "",
                royaltyRatio: ""
            },
            form:{
                id:undefined,
                name:"",
                grade:"",
                royaltyRatio:""
            },
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                grade: [
                    { required: true, message: '请选择等级', trigger: 'change' }
                ],
                royaltyRatio:[
                    { validator: validateRatio, trigger: 'blur' }
                ]
            },
            pageShow:true
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            // {
            //     "succes": true,
            //         "code": 20000,
            //             "message": "成功",
            //                 "data": {
            //         "page": {
            //             "records": [
            //                 {
            //                     "id": 1,
            //                     "name": "zhangsan",
            //                     "grade": 2,
            //                     "royaltyRatio": "0.2"
            //                 }
            //             ],
            //                 "total": 1,
            //                     "size": 10,
            //                         "current": 1,
            //                             "orders": [],
            //                                 "optimizeCountSql": true,
            //                                     "hitCount": false,
            //                                         "countId": null,
            //                                             "maxLimit": null,
            //                                                 "searchCount": true,
            //                                                     "pages": 1
            //         }
            //     }
            // }
            this.listLoading = true
            getList({ "pageNum": this.currentPage, "pageSize": this.pageSize }).then(response => {
                this.list = response.data.page.records
                this.total = response.data.page.total
                if (response.data.page.pages==1){
                    this.pageShow=true
                }else{
                    this.pageShow=false
                }
            })
            this.listLoading = false
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.listLoading = true
            getList({"pageNum":this.currentPage,"pageSize":this.pageSize}).then(response => {
                this.list = response.data.page.records
                this.total = response.data.page.total
            })
            this.listLoading = false
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
            this.form = JSON.parse(JSON.stringify(row))
            this.dialogStatus = 'update'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        add(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    addCoach(this.form).then(responce => {
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
        update(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    updateCoach(this.form).then(responce => {
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
        handleDelete(row){
            orderExist({
                flag:2,
                id:row.id
            }).then(responce=>{
                if(responce.data.sum!=0){
                    this.$notify({
                        title: '警告',
                        message: '存在有效订单',
                        type: 'warning',
                        duration: 2000
                    })
                }else{
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
