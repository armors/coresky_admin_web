<template>
  <div class="app-container">
    <div class="page-center">
      <div class="right-wrap">
        <el-button type="primary" plain size="mini" icon="el-icon-document-checked" @click="saveData">保存</el-button>
        <el-button plain size="mini" icon="el-icon-back" @click="cancel('/launchpad/launchpadList')">返回</el-button>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="基本信息" name="1">
          <el-form ref="basicInfoForm" :model="formData" :rules="rules" size="small" label-width="105px">
            <el-divider content-position="left">项目信息</el-divider>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="项目名称" prop="name">
                  <el-input placeholder="输入项目名称" v-model="formData.name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发行数量" prop="total">
                  <el-input-number v-model="formData.total" :controls="false" :step="1" :step-strictly="true" :min="1"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="发售价格" prop="price">
                  <el-input v-input-limit="4" placeholder="输入发售价格" v-model="formData.price" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
                  <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.startTime"
                    format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
                  <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.endTime"
                    format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开奖时间" prop="rewardTime">
                  <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.rewardTime"
                    format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开奖时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-divider content-position="left">合约信息</el-divider> -->
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="项目作者" prop="ownerName">
                  <el-input placeholder="输入项目作者" v-model="formData.ownerName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目作者地址" prop="owner">
                  <el-input placeholder="输入项目作者地址" v-model="formData.owner" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="合约地址" prop="contract">
                  <el-input placeholder="输入合约地址" v-model="formData.contract" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合约类型" prop="contractType">
                  <el-select style="width:100%" v-model="formData.contractType" placeholder="选择合约类型">
                    <el-option label="ERC721" :value="0" />
                    <el-option label="ERC1155" :value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="项目币种" prop="payment">
                  <el-select style="width:100%" v-model="formData.payment" placeholder="选择项目币种">
                    <el-option label="USDT" value="0x55d398326f99059fF775485246999027B3197955" />
                    <el-option label="ETH" value="0x0000000000000000000000000000000000000000" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否认证" prop="isCertification">
                  <el-switch :active-value="1" :inactive-value="0" v-model="formData.isCertification">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="背景图" prop="bannerImage">
                  <el-upload class="avatar-uploader" :action="uploadAction" accept="image/jpg, image/jpeg, image/png, image/gif"
                    :show-file-list="false" :on-success="(res)=>uploadSuccessCoustom(res,'bannerImage')" :before-upload="beforeUpload">
                    <img v-if="formData.bannerImage" :src="formData.bannerImage" class="bannerImage" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合集头像" prop="image">
                  <el-upload class="avatar-uploader" :action="uploadAction" accept="image/jpg, image/jpeg, image/png, image/gif"
                    :show-file-list="false" :on-success="(res)=>uploadSuccessCoustom(res,'image')" :before-upload="beforeUpload">
                    <img v-if="formData.image" :src="formData.image" class="image" />
                    <i v-else class="el-icon-plus avatar-uploader-icon image"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">链接信息</el-divider>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="开奖规则链接">
                  <el-input placeholder="请输入开奖规则链接" v-model="formData.rewardLink" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="隐私条款链接">
                  <el-input placeholder="请输入隐私条款链接" v-model="formData.privacyLink" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="官网链接">
                  <el-input placeholder="请输入官网链接" v-model="formData.website" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="推特链接" prop="">
                  <el-input placeholder="请输入推特链接" v-model="formData.twitter" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="DC链接" prop="">
                  <el-input placeholder="请输入DC链接" v-model="formData.discord" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="TG链接" prop="">
                  <el-input placeholder="请输入TG链接" v-model="formData.telegram" />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="轮播图" name="2">
          <div class="bannerList">
            <div class="banner-item" v-for="(imgUrl,index) in bannerList" :key="imgUrl">
              <el-image :src="imgUrl" :preview-src-list="[imgUrl]" :initial-index="2000">
              </el-image>
              <div class="txt-c mt10">
                <el-button type="danger" size="mini" @click="bannerList.splice(index, 1)" plain>删除</el-button>
              </div>
            </div>
            <el-upload :action="uploadAction" accept="image/jpg, image/jpeg, image/png, image/gif" :show-file-list="false"
              :on-success="(res)=>uploadSuccessCoustom(res,'BannerList')" :before-upload="beforeUpload">
              <i class="el-icon-plus banner-upload-icon"></i>
            </el-upload>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目介绍" name="3">
          <el-tabs type="border-card" style="width:800px">
            <el-tab-pane label="项目亮点">
              <el-button type="primary" plain size="mini" @click="insertItem(introduceList,'text')" icon="el-icon-tickets">添加文本</el-button>
              <el-upload style="display:inline-block" class="ml20" :action="uploadAction"
                accept="image/jpg, image/jpeg, image/png, image/gif" :show-file-list="false"
                :on-success="(res)=>uploadSuccessCoustom(res,'introduce')" :before-upload="beforeUpload">
                <el-button type="primary" plain size="mini" icon="el-icon-picture-outline">添加图片</el-button>
              </el-upload>
              <div class="content-list mt10">
                <div class="content-item" v-for="(item,index) in introduceList" :key="index">
                  <el-input type="textarea" v-if="item.type==='text'" :autosize="{ minRows: 4, maxRows: 16 }" placeholder="请输入内容"
                    v-model="item.content">
                  </el-input>
                  <el-image :src="item.content" v-if="item.type==='image'" :preview-src-list="[item.content]" :initial-index="2000">
                  </el-image>
                  <i class="el-icon-delete ml20 mr20" @click="introduceList.splice(index, 1)"></i>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="团队">
              <el-button type="primary" plain size="mini" @click="insertItem(teamIntroList,'text')" icon="el-icon-tickets">添加文本</el-button>
              <el-upload style="display:inline-block" class="ml20" :action="uploadAction"
                accept="image/jpg, image/jpeg, image/png, image/gif" :show-file-list="false"
                :on-success="(res)=>uploadSuccessCoustom(res,'teamIntro')" :before-upload="beforeUpload">
                <el-button type="primary" plain size="mini" icon="el-icon-picture-outline">添加图片</el-button>
              </el-upload>
              <div class="content-list mt10">
                <div class="content-item" v-for="(item,index) in teamIntroList" :key="index">
                  <el-input type="textarea" v-if="item.type==='text'" :autosize="{ minRows: 4, maxRows: 16 }" placeholder="请输入内容"
                    v-model="item.content">
                  </el-input>
                  <el-image :src="item.content" v-if="item.type==='image'" :preview-src-list="[item.content]" :initial-index="2000">
                  </el-image>
                  <i class="el-icon-delete ml20 mr20" @click="teamIntroList.splice(index, 1)"></i>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="线路图">
              <el-button type="primary" plain size="mini" @click="insertItem(roadmapList,'text')" icon="el-icon-tickets">添加文本</el-button>
              <el-upload style="display:inline-block" class="ml20" :action="uploadAction"
                accept="image/jpg, image/jpeg, image/png, image/gif" :show-file-list="false"
                :on-success="(res)=>uploadSuccessCoustom(res,'roadmap')" :before-upload="beforeUpload">
                <el-button type="primary" plain size="mini" icon="el-icon-picture-outline">添加图片</el-button>
              </el-upload>
              <div class="content-list mt10">
                <div class="content-item" v-for="(item,index) in roadmapList" :key="index">
                  <el-input type="textarea" v-if="item.type==='text'" :autosize="{ minRows: 4, maxRows: 16 }" placeholder="请输入内容"
                    v-model="item.content">
                  </el-input>
                  <el-image :src="item.content" v-if="item.type==='image'" :preview-src-list="[item.content]" :initial-index="2000">
                  </el-image>
                  <i class="el-icon-delete ml20 mr20" @click="roadmapList.splice(index, 1)"></i>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Media from "@/components/Media";
import base from "@/mixins/base";
import dayjs from "dayjs";
import { launchpadCreate, launchpadUpdate, launchpadInfo } from '@/api/common'

export default {
  components: { Media },
  mixins: [base],
  data () {
    return {
      id: '',
      activeName: '1',
      formData: {

        name: '',
        total: '',
        price: '',
        startTime: '',
        endTime: '',
        rewardTime: '',
        bannerImage: '',
        image: '',

        owner: '',
        ownerName: '',
        contract: '0xeb1e502410bb45e51907b88b0ea9a08fb575d3c2',
        contractType: '',
        payment: '', // 支付币种

        isCertification: 0,

        rewardLink: '',
        privacyLink: '',
        website: '',
        twitter: '',
        discord: '',
        telegram: '',

        introduce: '',
        teamIntro: '',
        roadmap: '',
        top: false,
        isShow: false,
      },
      bannerList: [
        'http://54.169.232.16:8083/static/upload/x041yze9i38nu9fml6o3.png',
      ],
      introduceList: [],
      teamIntroList: [],
      roadmapList: [],

      rules: {
        name: [{ required: true, message: "项目名称不能为空", trigger: "blur" }],
        total: [{ required: true, message: "发行数量不能为空", trigger: "blur" }],
        price: [{ required: true, message: "发售价格不能为空", trigger: "blur" }],
        startTime: [{ required: true, message: "开始时间不能为空", trigger: "change" }],
        endTime: [{ required: true, message: "结束时间不能为空", trigger: "change" }],
        rewardTime: [{ required: true, message: "开奖时间不能为空", trigger: "change" }],
        ownerName: [{ required: true, message: "项目作者不能为空", trigger: "blur" }],
        owner: [{ required: true, message: "项目作者地址不能为空", trigger: "blur" }],
        contract: [{ required: true, message: "合约地址不能为空", trigger: "blur" }],
        contractType: [{ required: true, message: "合约类型不能为空", trigger: "change" }],
        payment: [{ required: true, message: "项目币种不能为空", trigger: "change" }],
        bannerImage: [{ required: true, message: "背景图不能为空", trigger: "change" }],
        image: [{ required: true, message: "合集头像不能为空", trigger: "change" }],

      }
    };
  },
  created () {
    this.init()
  },
  methods: {
    uploadSuccess (res) {
      this.successUploadHandle();
      if (res.errno === 0) {
        this.formData.bannerImage = this.IMG_URL + res.data.url;
        this.$modal.msgSuccess("上传成功");
      } else {
        this.$modal.msgError(res.msg || "上传失败!");
      }
    },
    uploadSuccessCoustom (res, type) {
      this.successUploadHandle();
      if (res.errno === 0) {
        switch (type) {
          case "introduce":
            this.insertItem(this.introduceList, 'image', this.IMG_URL + res.data.url)
            break;
          case "teamIntro":
            this.insertItem(this.teamIntroList, 'image', this.IMG_URL + res.data.url)
            break;
          case "roadmap":
            this.insertItem(this.roadmapList, 'image', this.IMG_URL + res.data.url)
            break;
          case "BannerList":
            this.bannerList.push(this.IMG_URL + res.data.url)
            break;
          case "image":
            this.formData.image = this.IMG_URL + res.data.url
            break;
          case "bannerImage":
            this.formData.bannerImage = this.IMG_URL + res.data.url;
            break;
        }
        this.$modal.msgSuccess("上传成功");
      } else {
        this.$modal.msgError(res.msg || "上传失败!");
      }
    },
    insertItem (list, type, content = '') {
      list.push({ type, content })
    },
    saveData () {
      this.$refs.basicInfoForm.validate().then(val => {
        if (!val) return
        let data = JSON.parse(JSON.stringify(this.formData))
        data.startTime = dayjs(data.startTime).unix()
        data.endTime = dayjs(data.endTime).unix()
        data.rewardTime = dayjs(data.rewardTime).unix()
        data.introduce = this.introduceList ? JSON.stringify(this.introduceList) : ''
        data.teamIntro = this.teamIntroList ? JSON.stringify(this.teamIntroList) : ''
        data.roadmap = this.roadmapList ? JSON.stringify(this.roadmapList) : ''
        data.imgList = this.bannerList.join(',')
        let fun = data.id ? launchpadUpdate : launchpadCreate
        fun(data).then(res => {
          if (!this.formData.id) {
            this.formData.id = res.data
            let path = this.$route.path
            this.$router.push({
              path,
              query: { ...this.$route.query, id: res.data }
            })
          }
          this.$modal.msgSuccess("操作成功");
        })
      })
    },
    getInfo () {
      this.loading = true
      launchpadInfo({ id: this.id }).then(res => {
        this.loading = false
        this.formData = res.data
        this.roadmapList = []
        this.teamIntroList = []
        this.introduceList = []
        if (this.formData.roadmap) {
          this.roadmapList = JSON.parse(this.formData.roadmap) || []
        }
        if (this.formData.teamIntro) {
          this.teamIntroList = JSON.parse(this.formData.teamIntro) || []
        }
        if (this.formData.introduce) {
          this.introduceList = JSON.parse(this.formData.introduce) || []
        }
        this.formData.rewardTime = dayjs.unix(this.formData.rewardTime).format('YYYY-MM-DD HH:mm:ss')
        this.formData.startTime = dayjs.unix(this.formData.startTime).format('YYYY-MM-DD HH:mm:ss')
        this.formData.endTime = dayjs.unix(this.formData.endTime).format('YYYY-MM-DD HH:mm:ss')
        this.bannerList = this.formData.imgList.split(',')
      })
    },
    init () {
      let id = this.$route.query.id
      this.id = id
      if (id) {
        this.getInfo()
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.page-center {
  position: relative;
  .right-wrap {
    position: absolute;
    right: 0;
    top: 0;
    height: 40px;
    display: flex;
    align-items: center;
    z-index: 9;
  }
}
::v-deep {
  .el-form-item__label {
    font-weight: 400;
  }
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
}
.bannerImage,
.avatar-uploader-icon {
  width: 200px;
  height: 120px;
  line-height: 120px;
  display: block;
}

.image,
.avatar-uploader-icon.image {
  width: 120px;
  height: 120px;
  line-height: 120px;
  display: block;
}
.bannerList {
  display: flex;
  flex-wrap: wrap;
  .banner-item {
    margin-right: 20px;
    margin-bottom: 20px;
    .el-image {
      width: 160px;
      height: 160px;
    }
  }
  .banner-upload-icon {
    width: 160px;
    height: 160px;
    line-height: 160px;
  }
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
  }
}

.content-list {
  .content-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .el-icon-delete {
      color: #f56c6c;
      cursor: pointer;
    }
    .el-image {
      border-radius: 5px;
    }
  }
}
</style>
