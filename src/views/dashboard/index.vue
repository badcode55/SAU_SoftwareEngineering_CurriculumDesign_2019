<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">今日寿星：</div>
    <el-table ref="table" v-loading="listLoading" :data="list" style="width: 100%">
      <el-table-column prop="id" label="id" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isBirthday} from '@/api/member'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return{
      list: null,
      listLoading: true,
      form: {
        id: "",
        name: ""
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var date = this.getDate(new Date())
      console.log(date)
      isBirthday({
        key:date
      }).then(response => {
        this.list = response.data.items
      })
      this.listLoading = false
    },
    getDate(date) {
      // var year = date.getFullYear() // 获取年
      // year = year < 10 ? '0' + year : year
      var month = date.getMonth() + 1 // 获取月
      month = month < 10 ? '0' + month : month
      var strDate = date.getDate() // 获取日
      strDate = strDate < 10 ? '0' + strDate : strDate
      // return year + '-' + month + '-' + strDate
      return month + '-' + strDate
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
