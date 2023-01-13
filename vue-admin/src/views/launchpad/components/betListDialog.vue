<template>
  <el-dialog title="中奖管理" :visible.sync="open" width="980px" :close-on-click-modal="false">
    <el-form :model="queryParams" ref="queryForm" size="mini" :inline="true">
      <el-form-item label="用户地址">
        <el-input v-model="queryParams.address" clearable style="width: 160">
        </el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="status" style="width:160px">
          <el-option label="未定义" value="0" />
          <el-option label="黑明单" value="1" />
          <el-option label="中奖" value="2" />
          <el-option label="白名单" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList" fit highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="70" />
      <el-table-column label="用户地址" align="center" prop="address" width="360" :show-overflow-tooltip="true" />
      <el-table-column label="彩票标识" align="center" prop="uuid" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="状态" width="80" prop="state">
        <template #default="scope">
          {{ changeStatus(scope.row.status)  }}
        </template>
      </el-table-column>
      <el-table-column label="下注时间" align="center" prop="create_time" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ dateParse(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="90" prop="state">
        <template #default="scope">
          <el-button size="mini" type="text" @click="changeStatusOption(scope.row)">修改状态</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />
    <!-- 对话框 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">返 回</el-button>
      <!-- <el-button type="primary" @click="submitForm">开奖</el-button> -->
    </div>
    <el-dialog title="中奖状态" :visible.sync="dialogFormVisible" append-to-body width="480px">

      <el-form label-position="top" size="small" ref="basicInfoForm" :rules="rules" label-width="80px" :model="form">
        <el-form-item prop="code">
          <el-radio v-model="verifyStatus" :label="0">
            未定义</el-radio>
          <el-radio v-model="verifyStatus" :label="1">
            黑明单</el-radio>
          <el-radio v-model="verifyStatus" :label="2">
            中奖</el-radio>
          <el-radio v-model="verifyStatus" :label="3">
            白名单</el-radio>
        </el-form-item>

        <el-row :gutter="60">
          <el-col :span="18" :xs="24">
            <el-form-item label="验证吗" prop="code">
              <div style="display:flex;">
                <el-input v-model="form.code" size="small"></el-input>
                <div class="login-code ml10">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" style="height: 32px;" />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
import { launchpadBetList, launchpadChangeStatus } from '@/api/common'
import { getCodeImg } from "@/api/login";

import base from "@/mixins/base";
export default {
  name: 'betListDialog',
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
        lp_id: '',
        address: '',
        fromStatus: '',
        toStatus: '',
      },
      form: {
        code: ''
      },
      rules: {
        code: [{ required: true, message: "验证吗不能为空", trigger: "blur" }],
      },
      dialogFormVisible: false,
      verifyStatus: '',
      temData: undefined,
    }
  },

  created () {

  },
  methods: {
    changeStatus (status) {
      switch (status) {
        case 0:
          return '未定义';
        case 1:
          return '黑明单';
        case 2:
          return '中奖';
        case 3:
          return '白名单';
        default:
          return '';
      }
    },
    submitHandle () {
      this.$refs.basicInfoForm.validate().then(val => {
        if (!val) return
        launchpadChangeStatus({ ids: this.temData.id, status: this.verifyStatus, code: this.form.code }).then(res => {
          this.$modal.msgSuccess('操作成功')
          this.getList()
          this.dialogFormVisible = false
        })
      })
    },
    changeStatusOption (item) {
      this.verifyStatus = item.status
      this.form.code = ''
      this.getCode()
      this.temData = item
      this.dialogFormVisible = true
    },
    dateParse (time) {
      return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    show (id) {
      this.queryParams.lp_id = id
      this.handleQuery()
      // this.dataInfo = data
      this.open = true
    },
    handleQuery () {
      this.queryParams.page = 1
      this.getList()
    },
    getList () {
      this.loading = true;
      this.queryParams.fromStatus = this.status
      this.queryParams.toStatus = this.status
      launchpadBetList(this.queryParams).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    getCode () {
      getCodeImg().then(res => {
        this.codeUrl = res.data
      });
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
          this.getCode()
        });
      })

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