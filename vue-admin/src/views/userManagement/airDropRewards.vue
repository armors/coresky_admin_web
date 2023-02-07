<template>
  <div class="app-container grey">
    <div class="page-center" v-loading="loading">
      <div class="page-title">彩票发放
        <div class="fr">
          <el-button type="primary" class="mr20" @click="submitForm">提交</el-button>
        </div>
      </div>
      <el-form label-position="top" size="small" ref="basicInfoForm" :rules="rules" label-width="80px" :model="form">
        <div class="page-wrap">
          <div class="page-wrap-content">
            <el-row :gutter="60">
              <el-col :span="24" :xs="24">
                <el-form-item label="用户地址" prop="ids">
                  <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" placeholder="请输入内容" v-model="form.ids">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="彩票数量" prop="amount">
                  <!-- <el-input v-model="form.amount" placeholder="请输入彩票数量" size="default"></el-input> -->
                  <el-input-number size="default" v-model="form.amount" :min="0" :max="9990000" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
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
          </div>
          <div class="page-fiexd">
          </div>
        </div>
      </el-form>
    </div>

  </div>
</template>
<script>
import Media from "@/components/Media";
import { getCodeImg } from "@/api/login";
import { userAirDrop } from '@/api/common'

import { nftList, nftDetail, nftOnsale, nftVerify, nftDisable } from '@/api/common'

export default {
  name: 'airDropRewards',
  components: { Media },
  data () {
    return {
      loading: false,
      codeUrl: "",
      form: {
        ids: '',
        amount: '',
        code: '',
      },
      rules: {
        ids: [{ required: true, message: "发放用户不能为空", trigger: "blur" }],
        amount: [{ required: true, message: "彩票数量不能为空", trigger: "blur" }],
        code: [{ required: true, message: "验证吗不能为空", trigger: "blur" }],
      }
    };
  },
  computed: {

  },
  created () {
    this.getCode()
  },
  methods: {
    submitForm () {
      this.$refs.basicInfoForm.validate().then(val => {
        if (!val) return
        let data = {
          ids: this.form.ids.split('\n').filter(el => el !== '').join(','),
          amount: this.form.amount,
          code: this.form.code
        }
        userAirDrop(data).then(res => {
          this.$modal.msgSuccess("操作成功");
          this.form.code = ''
          this.form.amount = ''
          this.form.ids = ''
          this.getCode()
        })
      })

    },
    getCode () {
      getCodeImg().then(res => {
        this.codeUrl = res.data
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
}
.page-center {
  width: 820px;
  padding: 0 10px 10px;
  margin: 0 auto;
  background: #f2f2f2;
  padding-bottom: 60px;
  height: calc(100vh - 84px);
  overflow-y: auto;
  .page-title {
    padding: 16px 10px;
    font-size: 20px;
    color: #015478;
    font-weight: 600;
  }
  .page-wrap {
    background: #ffffff;
    margin-bottom: 10px;
    border-radius: 5px;
    overflow: hidden;
    .page-wrap-title {
      font-size: 16px;
      padding: 16px 30px;
      border-bottom: 1px solid #e9e9e9;
      .el-icon-arrow-down {
        font-size: 16px;
        transition: all 0.3s;
        &:hover {
          cursor: pointer;
        }
        &.down {
          transform: rotate(180deg);
        }
      }
    }
    .page-wrap-content {
      padding: 10px 30px;
    }
  }
  .el-form--label-top {
    .el-form-item__label {
      padding-bottom: 2px;
      font-weight: 400;
    }
    .el-radio {
      font-weight: 400;
    }
  }
}
</style>
