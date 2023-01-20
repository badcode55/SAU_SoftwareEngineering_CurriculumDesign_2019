<template>
    <div>
        <div style="text-align:right">
            <el-row>
                <el-button type="primary" v-if="this.len" @click="handlePay()">购买</el-button>
                <el-button type="primary" @click="handleCreate()">添加商品类别</el-button>
            </el-row>
        </div>

        <el-table ref="table" v-loading="listLoading" :data="list" @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="名称" width="180">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="180">
                <template slot-scope="scope">
                    {{ scope.row.price }}
                </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="180">
                <template slot-scope="scope">
                    {{ scope.row.stock }}
                </template>
            </el-table-column>
            <el-table-column prop="bonus" label="积分值" width="180">
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
        <div>
            <el-row>
                <el-button type="primary" v-if="this.len" @click="handlePay()">购买</el-button>
            </el-row>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
            <el-form ref="form" :model="form" label-position="left" label-width="70px"
                style="width: 400px; margin-left:50px;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input-number v-model="form.stock" :min="1" ></el-input-number>
                </el-form-item>
                <el-form-item label="积分值" prop="bonus">
                    <el-input v-model="form.bonus"></el-input>
                </el-form-item>
                <el-form-item label="详情" prop="info">
                    <el-input type="textarea" :rows="2" v-model="form.info"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? add() : update()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="购买商品" :visible.sync="dialogPayVisible">
            <el-form ref="payForm" :model="payForm" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
                <el-form-item label="会员id" prop="memberId">
                    <el-input v-model="payForm.memberId"></el-input>
                </el-form-item>
                <el-form-item prop="goods" label="商品">
                    <div v-for="(item, index) in payForm.goods" :key="'payForm'+index">
                        <el-form-item :prop="'goods.' + index + '.sum'" :label="item.goodsName">
                            <el-input-number v-model="payForm.goods[index].sum" :min="1"></el-input-number>
                        </el-form-item>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogPayVisible = false">取 消</el-button>
                <el-button type="primary" @click="open()">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { deleteById, getList, addGoods, updateGoods } from '@/api/goods'
import { addPayment } from '@/api/payment'
export default {
    data() {
        return {
            list: null,
            listLoading: true,
            dialogVisible: false,
            dialogPayVisible:false,
            selection: [],
            len:0,
            initForm: {
                id: undefined,
                name: "",
                price: "",
                stock:"",
                bonus: "",
                info: ""
            },
            form: {
                id: undefined,
                name: "",
                price: "",
                stock: "",
                bonus: "",
                info: ""
            },
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            payForm:{
                id:undefined,
                memberId:"",
                goods:[]
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.listLoading = true
            getList().then(response => {
                this.list = response.data.items
                this.total = response.data.total
            })
            this.listLoading = false
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
            addGoods(this.form).then(responce => {
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
            updateGoods(this.form).then(responce => {
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
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.payForm.goods=[]
            for(var i in val){
                this.payForm.goods.push({
                    goodsId:val[i].id,
                    goodsName:val[i].name,
                    sum:1,
                    price:val[i].price
                })
            }
            this.len = val.length;
            console.log(this.payForm)
        },
        handlePay(){
            this,this.dialogPayVisible=true
        },
        toPay(){
            const payment = {
                id:undefined,
                memberId:this.payForm.memberId,
                info: JSON.stringify({
                    goods: this.payForm.goods
                }) 
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
            this.$confirm('需支付12.00元，请确认已付款后再点击确认', '付款', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.toPay()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消付款'
                });
            });
        }
    }
}
</script>