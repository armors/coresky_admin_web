<template>
  <el-dialog title="订阅管理" :visible.sync="open" width="980px" :close-on-click-modal="false">
    <el-form :model="queryParams" ref="queryForm" size="mini" :inline="true">
      <el-form-item label="订阅名称">
        <el-input v-model="queryParams.name" clearable style="width: 160">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" class="ml20" plain size="mini" @click="createDialog">新增项目</el-button>

      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList" fit highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="70" />
      <el-table-column label="平台" align="center" width="140">
        <template #default="scope">
          <el-select clearable v-model="scope.row.pid" disabled size="mini" style="width:130px">
            <el-option label="opensea" :value="1" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="订阅名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="启用状态" width="80" prop="state">
        <template #default="scope">
          {{ scope.row.status===1?'开启':'未开启'  }}
        </template>
      </el-table-column>
      <el-table-column label="订阅状态" align="center" prop="create_time" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope.row.revStatus }}
        </template>
      </el-table-column>
      <el-table-column label="订阅日志" align="center" prop="create_time" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope.row.log }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="90" prop="state">
        <template #default="scope">
          <el-button size="mini" type="text" @click="changeStatusOption(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" /> -->
    <!-- 对话框 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">返 回</el-button>
      <!-- <el-button type="primary" @click="submitForm">开奖</el-button> -->
    </div>
    <el-dialog title="配置信息" :visible.sync="dialogFormVisible" append-to-body width="480px">
      <el-form label-position="top" size="small" ref="basicInfoForm" :rules="rules" label-width="80px" :model="form">
        <el-form-item label="订阅平台" prop="pid">
          <el-select clearable v-model="form.pid" size="mini" style="width:130px">
            <el-option label="opensea" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="订阅名称" prop="name">
          <el-input v-model="form.name" size="small"></el-input>
          <span></span>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.status">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">保存</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { contractSubscribeList, contractDelSubscribe, contractAddSubscribe, contractUpdateSubscribe } from '@/api/common'

import base from "@/mixins/base";
export default {
  name: 'subscribeDialog',
  mixins: [base],
  components: {},
  data () {
    return {
      codeUrl: "",
      loading: false,
      open: false,
      total: 0,
      dataList: [],
      status: '',
      queryParams: {
        page: 1,
        limit: 10,
        cid: ''
      },
      form: {
        id: '',
        cid: '',
        name: '',
        status: '',
        pid: ''
      },
      rules: {
        pid: [{ required: true, message: "聚合平台不能为空", trigger: "change" }],
        name: [{ required: true, message: "订阅名称不能为空", trigger: "blur" }],
      },
      dialogFormVisible: false,
      verifyStatus: '',
      temData: undefined,
    }
  },

  created () {

  },
  methods: {
    createDialog () {
      this.form.id = ''
      this.form.pid = ''
      this.form.name = ''
      this.form.status = 1
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.basicInfoForm.clearValidate()
      })
    },
    submitHandle () {
      this.$refs.basicInfoForm.validate().then(val => {
        if (!val) return
        let data = JSON.parse(JSON.stringify(this.form))
        let fun = data.id ? contractUpdateSubscribe : contractAddSubscribe
        fun(data).then(res => {
          this.$modal.msgSuccess('操作成功')
          this.getList()
          this.dialogFormVisible = false
        })
      })
    },
    changeStatusOption (item) {
      this.form.id = item.id
      this.form.cid = item.cid
      this.form.pid = item.pid
      this.form.name = item.name
      this.form.status = item.status
      this.dialogFormVisible = true
    },
    dateParse (time) {
      return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    show (id) {
      this.queryParams.cid = id
      this.form.cid = id
      this.handleQuery()
      this.open = true
    },
    handleQuery () {
      this.queryParams.page = 1
      this.getList()
    },
    getList () {
      this.loading = true;
      contractSubscribeList(this.queryParams).then(res => {
        this.dataList = res.data
        this.loading = false
      })
    },

    /** 删除按钮操作 */
    submitForm (row) {
      this.$refs.basicInfoForm.validate().then(val => {
        if (!val) return
        this.$modal.confirm(`是否确认开奖?`).then(() => {
          return launchpadBetresult({ lp_id: this.dataInfo.id, code: this.form.code })
        }).then(() => {
          this.$modal.msgSuccess('操作成功')
          this.open = false
        }).catch(() => {
          this.form.code = ''
        });
      })
    },
    handleDelete (row) {
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return contractDelSubscribe({ id: row.id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        })
        .catch(() => { });
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 20px 20px 20px 30px;
}
::v-deep .el-form-item--small {
  .el-form-item__label {
    padding-bottom: 2px;
    font-weight: 400;
  }
  .el-radio {
    font-weight: 400;
  }
}
</style>