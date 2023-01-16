<template>
  <el-dialog title="项目开奖" :visible.sync="open" width="680px" append-to-body :close-on-click-modal="false">
    <el-form label-position="top" size="small" ref="basicInfoForm" :rules="rules" label-width="80px" :model="form">
      <el-descriptions class="margin-top" direction="vertical" title="" :column="3">
        <!-- <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template> -->
        <el-descriptions-item label="项目名称">{{dataInfo.name}}</el-descriptions-item>
        <el-descriptions-item label="发售数量">{{dataInfo.total}}</el-descriptions-item>
        <el-descriptions-item label="奖池彩票总数">{{dataInfo.betCount}}</el-descriptions-item>
        <el-descriptions-item label="投注开始时间">{{dataInfo.startTime}}</el-descriptions-item>
        <el-descriptions-item label="投注结束时间">{{dataInfo.endTime}}</el-descriptions-item>
        <el-descriptions-item label="开奖时间">{{dataInfo.rewardTime}}</el-descriptions-item>
        <el-descriptions-item label="白名单数量">{{dataInfo.whiteCount}}</el-descriptions-item>
        <el-descriptions-item label="实际开奖数量">{{dataInfo.betTotal}}</el-descriptions-item>
      </el-descriptions>
      <el-row :gutter="60">
        <el-col :span="12" :xs="24">
          <el-form-item label="验证吗" prop="code">
            <div style="display:flex;">
              <el-input v-model="form.code" size="default"></el-input>
              <div class="login-code ml10">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">返 回</el-button>
      <el-button type="primary" @click="submitForm">开奖</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { launchpadBetresult, launchpadInfo, launchpadBindToken } from '@/api/common'
import { getCodeImg } from "@/api/login";

import base from "@/mixins/base";
export default {
  name: 'betResultDialog',
  mixins: [base],
  components: {},
  data () {
    return {
      codeUrl: "",
      loading: false,
      open: false,

      dataInfo: {},
      form: {
        code: '',
      },
      rules: {
        code: [{ required: true, message: "验证吗不能为空", trigger: "blur" }],
      }
    }
  },

  created () {

  },
  methods: {
    dateParse (time) {
      return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    show (data) {
      this.getCode()
      launchpadInfo({ id: data.id }).then(res => {
        this.loading = false
        this.dataInfo = res.data
        this.dataInfo.id = data.id
        this.dataInfo.rewardTime = dayjs.unix(this.dataInfo.rewardTime).format('YYYY-MM-DD HH:mm:ss')
        this.dataInfo.startTime = dayjs.unix(this.dataInfo.startTime).format('YYYY-MM-DD HH:mm:ss')
        this.dataInfo.endTime = dayjs.unix(this.dataInfo.endTime).format('YYYY-MM-DD HH:mm:ss')
        console.log(this.dataInfo)
      })
      // this.dataInfo = data
      this.open = true
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
          // launchpadBindToken({ lpId: this.dataInfo.id })
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