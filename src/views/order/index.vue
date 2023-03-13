<template>
    <div>
        <div style="text-align:right">
            <el-row>
                <el-button type="primary" @click="handleCreate()">添加预约</el-button>
            </el-row>
        </div>
        <el-table v-loading="listLoading" :data="list" style="width: 100%">
            <el-table-column prop="memberId" label="会员id" width="150">
                <template slot-scope="scope">
                    {{ scope.row.memberId }}
                </template>
            </el-table-column>
            <el-table-column prop="memberName" label="会员姓名" width="150">
                <template slot-scope="scope">
                    {{ scope.row.memberName }}
                </template>
            </el-table-column>
            <el-table-column prop="coachName" label="教练姓名" width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.coachId==''">-</template>
                    <template v-else>
                        {{ scope.row.coachName }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="fieldName" label="场地名称" width="150">
                <template slot-scope="scope">
                    {{ scope.row.fieldName }}
                </template>
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称" width="150">
                <template slot-scope="scope">
                    <template  v-if="scope.row.courseId==''">-</template>
                    <template  v-else>
                        {{ scope.row.courseName }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="startDate" label="日期" width="140">
                <template slot-scope="scope">
                    {{ scope.row.startDate }}
                </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="140">
                <template slot-scope="scope">
                    {{ scope.row.startTime }}
                </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="140">
                <template slot-scope="scope">
                    {{ scope.row.endTime }}
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
            <el-pagination :hide-on-single-page="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-form  ref="form" :model="form" :rules="rules" label-position="left" label-width="90px"
                style="width: 400px; margin-left:50px;">
                <el-form-item label="会员id" prop="memberId">
                    <el-input v-model.number="form.memberId" :disabled='show'></el-input>
                </el-form-item>
                <el-form-item label="场地id"  prop="fieldId">
                    <el-input v-model.number="form.fieldId" :disabled='show'></el-input>
                </el-form-item>
                <el-form-item v-if="show" label="课程id" prop="courseId">
                    <el-input v-model.number="form.courseId"></el-input>
                </el-form-item>
                <el-form-item v-if="show" label="教练id" prop="coachId">
                    <el-input v-model.number="form.coachId"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="startDate">
                    <el-date-picker :picker-options="pickerOptions" v-model="form.startDate" :disabled='show' type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-time-select :picker-options="{ start: '08:00', step: '00:30', end: '21:30', maxTime: form.endTime }" :disabled='show'  v-model="form.startTime" format="HH:mm" placeholder="选择日期"></el-time-select>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-time-select :picker-options="{ start: '08:30', step: '00:30', end: '22:00', minTime: form.startTime }" :disabled='show' v-model="form.endTime" format="HH:mm" placeholder="选择日期"></el-time-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="open()">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { getList, addOrder, updateOrder, deleteById } from '@/api/order'
import { addPayment ,getPaySum} from '@/api/payment'
import { isCoachExist } from '@/api/coach'
import { isCourseExist } from '@/api/course'
import { isFieldExist } from '@/api/field'
import { isMemberExist } from '@/api/member'
export default {
    data() {
        var validateCoach = (rule, value, callback) => {
            if (value !== '') {
                if(this.form.courseId===''){
                    callback(new Error("课程id不能为空，请先输入课程id"))
                }else{
                    isCoachExist({
                        id: value
                    }).then(response => {
                        if (!response.data.exist) {
                            callback(new Error("教练不存在，请输入正确的id"))
                        } else {
                            callback();
                        }
                    })
                }
            } else {
                callback();
            }
        };
        var validateCourse = (rule, value, callback) => {
            if (value !== '') {
                if (this.form.coachId === '') {
                    callback(new Error("教练id不能为空，请先输入教练id"))
                }else{
                    isCourseExist({
                        id: value
                    }).then(response => {
                        if (!response.data.exist) {
                            callback(new Error("课程不存在，请输入正确的id"))
                        } else {
                            callback();
                        }
                    })
                }
            } else {
                callback();
            }
        };
        var validateField = (rule, value, callback) => {
            if (value !== '') {
                isFieldExist({
                    id: value
                }).then(response => {
                    if (!response.data.exist) {
                        callback(new Error("场地不存在，请输入正确的id"))
                    } else {
                        callback();
                    }
                })
            } else {
                callback();
            }
        };
        var validateMember = (rule, value, callback) => {
            if (value !== '') {
                isMemberExist({
                    id: value
                }).then(response => {
                    if (!response.data.exist) {
                        callback(new Error("会员不存在，请输入正确的id"))
                    } else {
                        callback();
                    }
                })
            } else {
                callback();
            }
        };
        return {
            list: null,
            listLoading: true,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 3600 * 1000 || time.getTime() > Date.now() + 6*24*3600*1000;
                }
            },
            initForm: {
                id: undefined,
                memberId: "",
                coachId: "",
                fieldId: "",
                courseId: "",
                startDate: "",
                startTime: "",
                endTime: ""
            },
            form: {
                id: undefined,
                memberId: "",
                coachId: "",
                fieldId: "",
                courseId: "",
                startDate:"",
                startTime: "",
                endTime: ""
            },
            dialogPayVisible:false,
            dialogVisible: false,
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            show:true,
            account:'12.00',
          rules: {
              memberId: [
                  { required: true, message: '请输入会员id', trigger: 'blur' },
                  { type: 'number', min: 1, max: 9999999999, message: '请输入长度在 1 到 10 个的数字', trigger: 'blur' },
                  { validator: validateMember, trigger: 'blur' }
              ],
              coachId: [
                  // { required: true, message: '请输入教练id', trigger: 'blur' },
                  { type: 'number', min: 1, max: 9999999999, message: '请输入长度在 1 到 10 个的数字', trigger: 'blur' },
                  { validator: validateCoach, trigger: 'blur' }
              ],
              fieldId: [
                  { required: true, message: '请输入场地id', trigger: 'blur' },
                  { type: 'number', min: 1, max: 9999999999, message: '请输入长度在 1 到 10 个的数字', trigger: 'blur' },
                  { validator: validateField, trigger: 'blur' }
              ],
              courseId: [
                  // { required: true, message: '请输入课程id', trigger: 'blur' },
                  { type: 'number', min: 1, max: 9999999999, message: '请输入长度在 1 到 10 个的数字', trigger: 'blur' },
                  { validator: validateCourse, trigger: 'blur' }
              ],
              startDate: [
                  { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              startTime: [
                  { required: true, message: '请选择时间', trigger: 'change' }
              ],
              endTime: [
                  { required: true, message: '请选择时间', trigger: 'change' }
              ]
            },
            pageShow: true,
            bonus:0
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
            this.show=false
            this.resetForm()
            this.dialogStatus = 'create'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        handleUpdate(row) {
            if (row.courseId!=null) {
                this.$alert('已购买课程，无法编辑', '提示', {
                    confirmButtonText: '确定'
                });
            }else{
                this.show = true
                this.form = JSON.parse(JSON.stringify(row))
                this.form.courseId=null
                this.form.coachId=null
                if (this.form.startDate!=''){
                    this.form.startDate = new Date(this.form.startDate + ' 00:00:00')
                }
                // if (this.form.startTime!=''){
                //     this.form.startTime = new Date('2016-01-01 ' + this.form.startTime + ':00')
                // }
                // if(this.form.endTime!=''){
                //     this.form.endTime = new Date('2016-01-01 ' + this.form.endTime + ':00')
                // }
                this.dialogStatus = 'update'
                this.dialogVisible = true
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }
        },
        getDateTime(datetime){
            var year = date.getFullYear() // 获取年
            year = year < 10 ? '0' + year : year
            var month = date.getMonth() + 1 // 获取月
            month = month < 10 ? '0' + month : month
            var strDate = date.getDate() // 获取日
            strDate = strDate < 10 ? '0' + strDate : strDate
            var h = time.getHours();
            h = h < 10 ? '0' + h : h;
            var m = time.getMinutes();
            m = m < 10 ? '0' + m : m;
            var s = time.getSeconds();
            s = s < 10 ? '0' + s : s;
            return year + '-' + month + '-' + strDate + ' ' + h + ':' + m + ':' + s
        },
        // getTime(time) {
        //     var h = time.getHours();
        //     h = h < 10 ? '0' + h : h;
        //     var m = time.getMinutes();
        //     m = m < 10 ? '0' + m : m;
        //     return h + ':' + m;
        // },
        getDate(date) {
            var year = date.getFullYear() // 获取年
            year = year < 10 ? '0' + year : year
            var month = date.getMonth() + 1 // 获取月
            month = month < 10 ? '0' + month : month
            var strDate = date.getDate() // 获取日
            strDate = strDate < 10 ? '0' + strDate : strDate
            return year + '-' + month + '-' + strDate
        },
        add() {
            const newForm = JSON.parse(JSON.stringify(this.form))
            newForm.startDate = newForm.startDate != "" ? this.getDate(new Date(newForm.startDate)) :""
            // newForm.startTime = newForm.startTime != "" ? this.getTime(new Date('2016-01-01 '+newForm.startTime)):""
            // newForm.endTime = newForm.endTime != "" ? this.getTime(new Date('2016-01-01 ' +newForm.endTime)):""
            addOrder(newForm).then(responce => {
                this.dialogVisible = false
                this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                })
                this.toPay({
                    order: {
                        account: this.account
                    }
                })
                this.fetchData()
            })
        },
        update() {
            const newForm = JSON.parse(JSON.stringify(this.form))
            newForm.startDate = newForm.startDate != "" ? this.getDate(new Date(newForm.startDate)) : ""
            // newForm.startTime = newForm.startTime != "" ? this.getTime(new Date('2016-01-01 ' + newForm.startTime)) : ""
            // newForm.endTime = newForm.endTime != "" ? this.getTime(new Date('2016-01-01 ' + newForm.endTime)) : ""
            updateOrder(newForm).then(responce => {
                this.dialogVisible = false
                this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                })
                this.toPay({
                    course: {
                        courseId:this.form.courseId,
                        account: this.account
                    }
                })
                this.fetchData()
            })
        },
        handleDelete(row) {
            deleteById(row).then(responce => {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                })
                this.listLoading = true
                getList({ "pageNum": this.currentPage, "pageSize": this.pageSize }).then(response => {
                    this.list = response.data.page.records
                    this.total = response.data.page.total
                })
                this.listLoading = false
            })
            
        },
        toPay(params) {
            const payment = {
                id: undefined,
                memberId: this.form.memberId,
                bonus: this.bonus,
                info: JSON.stringify(params)
            }
            addPayment(payment).then(responce => {
                this.dialogPayVisible = false
                this.$refs.table.clearSelection();
                this.$notify({
                    title: '成功',
                    message: '支付成功',
                    type: 'success',
                    duration: 2000
                })
            })
        },
        open() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    var params = {}
                    if (this.dialogStatus === 'create') {
                        params = {
                            order: {
                                fieldId: this.form.fieldId,
                                startTime: this.form.startTime,
                                endTime: this.form.endTime
                            }
                        }
                    } else {
                        params = {
                            course:{
                                courseId:this.form.courseId
                            }
                        }
                    }
                    getPaySum(params).then(responce=>{
                        this.account = responce.data.account
                        this.bonus = responce.data.bonus
                        this.$confirm('需支付'+this.account+'元，请确认已付款后再点击确认', '付款', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            if (this.dialogStatus === 'create') {
                                this.add();
                            } else {
                                this.update();
                            }

                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消付款'
                            });
                        });
                    } )                   
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>