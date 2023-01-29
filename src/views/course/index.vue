<template>
    <div>
        <div style="text-align:right">
            <el-row>
                <el-button type="primary" @click="handleCreate()">添加课程</el-button>
            </el-row>
        </div>

        <el-table v-loading="listLoading" :data="list" style="width: 100%">
            <el-table-column prop="name" label="名称" width="180">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="380">
                <template slot-scope="scope">
                    {{ scope.row.price }}
                </template>
            </el-table-column>
            <el-table-column prop="bonus" label="积分值" width="380">
                <template slot-scope="scope">
                    {{ scope.row.bonus }}
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="详情">
                            <span>{{ props.row.info }}</span>
                        </el-form-item>
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
            <el-pagination :hide-on-single-page="pageShow" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-form :rules="rules" ref="form" :model="form" label-position="left" label-width="70px"
                style="width: 400px; margin-left:50px;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input-number size="medium" v-model="form.price" :precision="2" :step="0.1" :max="99999999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="积分值" prop="bonus">
                    <el-input-number v-model="form.bonus" :max="9999999999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="详情" prop="info">
                    <el-input type="textarea" :rows="2" v-model="form.info" maxlength="200" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? add() : update()">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { deleteById, getList, addCourse, updateCourse } from '@/api/course'
import { orderExist } from '@/api/order'
export default {
    data() {
        return {
            list: null,
            listLoading: true,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            dialogVisible: false,
            initForm: {
                id: undefined,
                name:"",
                price:"",
                bonus:"",
                info:""
            },
            form: {
                id: undefined,
                name: "",
                price: "",
                bonus: "",
                info: ""
            },
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            rules: {
                name: [
                    { required: true, message: '请输入课程名称', trigger: 'blur' }
                ]
            },
            pageShow: true
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
        add() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    addCourse(this.form).then(responce => {
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
                    updateCourse(this.form).then(responce => {
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
                flag: 4,
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