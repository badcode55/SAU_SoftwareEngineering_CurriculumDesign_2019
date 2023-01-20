<template>
    <div>
        <div style="text-align:right">
            <el-row>
                <el-button type="primary" @click="handleCreate()">添加会员</el-button>
            </el-row>
        </div>
        <el-table v-loading="listLoading" :data="list" style="width: 100%">
            <el-table-column prop="name" label="名称" width="200">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="birthday" label="生日" width="200">
                <template slot-scope="scope">
                    {{ scope.row.birthday }}
                </template>
            </el-table-column>
            <el-table-column prop="point" label="积分" width="180">
                <template slot-scope="scope">
                    {{ scope.row.point }}
                </template>
            </el-table-column>
            <el-table-column prop="royalty" label="提成" width="180">
                <template slot-scope="scope">
                    {{ scope.row.royalty }}
                </template>
            </el-table-column>
            <el-table-column prop="grade" label="等级" width="180">
                <template slot-scope="scope">
                    <template v-if="scope.row.grade==1">等级一</template>
                    <template v-else-if="scope.row.grade==2">等级二</template>
                    <template v-else-if="scope.row.grade==3">等级三</template>
                    <template v-else-if="scope.row.grade==4">等级四</template>
                    <template v-else-if="scope.row.grade==5">等级五</template>
                    <template v-else>{{ scope.row.grade }}</template>
                </template>
            </el-table-column>
            <el-table-column prop="cardType" label="会员卡类型" width="180">
                <template slot-scope="scope">
                    <template v-if="scope.row.cardType ==1">类型一</template>
                    <template v-else-if="scope.row.cardType ==2">类型二</template>
                    <template v-else-if="scope.row.cardType ==3">类型三</template>
                    <template v-else-if="scope.row.cardType ==4">类型四</template>
                    <template v-else-if="scope.row.cardType ==5">类型五</template>
                    <template v-else>{{ scope.row.cardType }}</template>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-form ref="form" :model="form" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="积分" prop="point">
                    <el-input v-model="form.point"></el-input>
                </el-form-item>
                <el-form-item label="提成" prop="royalty">
                    <el-input v-model="form.royalty"></el-input>
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
                <el-form-item label="会员卡类型" prop="cardType">
                    <el-select v-model="form.cardType" placeholder="请选择教练等级">
                        <el-option label="类型一" value="1"></el-option>
                        <el-option label="类型二" value="2"></el-option>
                        <el-option label="类型三" value="3"></el-option>
                        <el-option label="类型四" value="4"></el-option>
                        <el-option label="类型五" value="5"></el-option>
                    </el-select>
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
import { getList, addMember, updateMember, deleteById } from '@/api/member'
export default {
    data() {
        return {
            list: null,
            listLoading: true,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            initForm: {
                id: undefined,
                name: "",
                birthday: "",
                point: "",
                royalty: "",
                grade: "",
                cardType: ""
            },
            form: {
                id: undefined,
                name: "",
                birthday:"",
                point: "",
                royalty:"",
                grade:"",
                cardType:""
            },
            dialogVisible: false,
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            }
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
            })
            this.listLoading = false
        },
        handleSizeChange(val) {
            this.fetchData()
        },
        handleCurrentChange(val) {
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
            this.form = JSON.parse(JSON.stringify(row))
            this.form.birthday = new Date(this.form.birthday+' 00:00:00')
            this.dialogStatus = 'update'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        getDate(date){
            var year = date.getFullYear() // 获取年
            year = year<10? '0'+year:year
            var month = date.getMonth() + 1 // 获取月
            month = month<10? '0'+month:month
            var strDate = date.getDate() // 获取日
            strDate = strDate<10? '0'+strDate:strDate
            return year+'-'+month+'-'+strDate
        },
        add() {
            const newForm = JSON.parse(JSON.stringify(this.form))
            newForm.birthday = this.getDate(new Date(newForm.birthday))
            addMember(newForm).then(responce => {
                this.dialogVisible = false
                this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                })
                this.fetchData()
            })
        },
        update() {
            const newForm = JSON.parse(JSON.stringify(this.form))
            newForm.birthday = this.getDate(new Date(newForm.birthday))
            updateMember(newForm).then(responce => {
                this.dialogVisible = false
                this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
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
                this.fetchData()
            })
        }
    }
}
</script>