<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="mini" :inline="true">
      <el-form-item label="投注时间">
        <el-date-picker type="datetime" v-model="queryParams.startTime" clearable value-format="yyyy-MM-dd" style="width: 160px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至">
        <el-date-picker type="datetime" v-model="queryParams.endTime" clearable value-format="yyyy-MM-dd" style="width: 160px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="queryParams.name" clearable style="width: 160">
        </el-input>
      </el-form-item>
      <el-form-item label="合约地址">
        <el-input v-model="queryParams.contract" clearable style="width: 160">
        </el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="queryParams.owner" clearable style="width: 160px">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="$router.push('/launchpad/launchpadInfo')" plain size="mini">新增项目</el-button>
      </el-col>
    </el-row>
    <!-- 查询结果 -->
    <el-table v-loading="loading" :data="dataList" fit highlight-current-row>
      <el-table-column align="center" label="合集头像" prop="metadataContent" width="80">
        <template #default="scope">
          <img v-if="scope.row.image" :src="scope.row.image" class="image" />
          <!-- <media v-if="scope.row.image" :isPreview="true" :url="scope.row.image" type="image"></media> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称" prop="name">
      </el-table-column>
      <el-table-column align="center" label="发行数量" prop="total" width="120px" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="开始时间" prop="startTime" width="160px">
        <template #default="scope">
          {{ dateParse(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" prop="endTime" width="160px">
        <template #default="scope">
          {{ dateParse(scope.row.endTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="合约类型" prop="contract" /> -->
      <!-- <el-table-column align="center" label="拥有者地址" prop="contract" /> -->
      <el-table-column align="center" label="是否认证" width="80px">
        <template #default="scope">
          <el-switch :active-value="1" :disabled="true" :inactive-value="0" v-model="scope.row.isCertification">
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="使用币种" prop="contract" /> -->
      <el-table-column align="center" label="是否置顶" width="80px">
        <template #default="scope">
          <el-switch :active-value="true" :inactive-value="false" @change="(val)=> topChange(val,scope.$index)" v-model="scope.row.top">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否上架" width="80px">
        <template #default="scope">
          <el-switch :active-value="true" :inactive-value="false" @change="(val)=> topChange(val,scope.$index)" v-model="scope.row.isShow">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="state">
        <template #default="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.row)">修改</el-button>
          <!-- <el-button size="mini" type="text" @click="handleDetail(scope.row)">白名单</el-button> -->
          <el-button size="mini" type="text" @click="showBetListDialog(scope.row)">中奖管理</el-button>
          <el-button size="mini" type="text" @click="showBetresultDialog(scope.row)">开奖</el-button>
          <el-button size="mini" :loading="scope.row.loading" type="text" @click="contractHandle(scope.row)">合约交互</el-button>
          <el-upload class="ml5" :data="{lpId:scope.row.id}" style="display: inline-block;" :action="uploadAction" accept=".xls,.xlsx"
            :show-file-list="false" :on-success="(res)=>uploadSuccessCoustom(res,scope.row.$index)" :before-upload="beforeUpload">
            <el-button size="mini" type="text">导入Token</el-button>
          </el-upload>
          <el-button class="ml5" size="mini" type="text" @click="handleDelete(scope.row)">删除Token</el-button>
          <el-button class="ml5" size="mini" type="text" @click="handleDeleteLP(scope.row)">删除项目</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />
    <!-- 对话框 -->
    <betresultDialog ref="betresultDialogRef" />
    <betListDialog ref="betListDialogRef" />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import Media from "@/components/Media";
import launchpad from '../../utils/sdk/launchpad';
import dayjs from "dayjs";
import betresultDialog from './components/betResultDialog';
import betListDialog from './components/betListDialog';
import { launchpadList, launchpadUpdateStatus, launchpadBindToken, launchpadInfo, launchpadRemoveTokens, launchpadDel } from '@/api/common'
import util_web3 from "@/utils/web3/index.js";
import base from "@/mixins/base";

export default {
  mixins: [base],
  computed: {
    ...mapState({
      connected: (state) => state.network.connected,
      web3: (state) => state.network.web3,
    }),
    uploadAction () {
      return process.env.VUE_APP_BASE_API + `/admin/launchpad/inputTokens`;
    },
  },
  components: { Media, betresultDialog, betListDialog },
  data () {
    return {
      list: null,
      total: 0,
      dataList: [],
      loading: false,
      queryParams: {
        page: 1,
        limit: 10,
        contract: '',
        name: '',
        owner: '',
        startTime: '',
        endTime: '',
      },
    };
  },
  created () {
    this.getList();
  },
  methods: {
    handleDeleteLP (row) {
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return launchpadDel({ id: row.id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        })
        .catch(() => { });
    },
    handleDelete (row) {
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return launchpadRemoveTokens({ lpId: row.id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("操作成功");
        })
        .catch(() => { });
    },
    uploadSuccessCoustom (res, index) {
      this.successUploadHandle();
      if (res.errno === 0) {
        console.log(res, index)
        this.$modal.msgSuccess("上传成功");
      } else {
        this.$modal.msgError(res.errmsg || "上传失败!");
      }
    },
    dateParse (time) {
      return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    getList () {
      this.loading = true;
      launchpadList(this.queryParams).then(res => {
        this.dataList = res.data.list.map(el => {
          el.loading = false
          return el
        })
        this.total = res.data.total
        this.loading = false
      })
    },
    handleDetail (row) {
      this.$router.push('/launchpad/launchpadInfo?id=' + row.id)
    },
    topChange (val, index) {
      let obj = this.dataList[index]
      let data = {
        id: obj.id,
        top: obj.top,
        show: obj.isShow
      }
      launchpadUpdateStatus(data).then(res => {
        this.getList()
      })
    },
    handleQuery () {
      this.queryParams.page = 1
      this.getList()
    },
    showBetresultDialog (item) {
      this.$refs.betresultDialogRef.show(item)
    },
    showBetListDialog (item) {
      this.$refs.betListDialogRef.show(item.id)
    },
    async contractHandle (item) {
      if (!this.connected) {
        this.$store.dispatch("connect").then(() => {
          this.getLaunchpadProject(item)
        });
      }
      else {
        this.getLaunchpadProject(item)
      }
    },
    async getLaunchpadProject (item) {
      let info = await launchpad.getProject(item.id, item.treeAddress)
      if (info && info[0] != '0x0000000000000000000000000000000000000000') {
        this.$modal.msgSuccess("合约交互已经执行");
      }
      else {
        this.bindToken(item)
      }
    },
    bindToken (item) {
      item.loading = true
      launchpadBindToken({ lpId: item.id }).then(res => {
        return launchpadInfo({ id: item.id })
      }).then(res => {
        const dataInfo = res.data
        let data = {
          lp_id: dataInfo.id,
          target: dataInfo.contract,
          merkleRoot: dataInfo.txRoot,
          receipt: dataInfo.receiptAddress,
          payment: dataInfo.payment,
          price: util_web3.getWeb3().utils.toWei(dataInfo.price.toString()),
          startTime: dataInfo.startTime,
          endTime: dataInfo.endTime
        }
        return launchpad.launchpad(data, this.web3.coinbase, dataInfo.treeAddress)
      }).then(res => {
        item.loading = false
        if (res.error) {
          this.$modal.msgError(res.error);
        }
        else {
          if (res.status === true) {
            this.$modal.msgSuccess("操作成功");
          }
        }
      }).catch(error => {
        item.loading = false
        console.log(1, error)
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.mb-20 {
  margin-bottom: 20px;
}
.table-cell {
  padding: 10px;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
}
.title {
  font-style: 16px;
  font-weight: 700;
}
.width-70px {
  width: 70px;
}
.centerClass {
  display: flex;
  justify-content: center;
  align-items: center;
}
.verifyClass {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.image {
  width: 40px;
  height: 40px;
  border-radius: 2px;
  display: block;
  margin: 0 auto;
}
</style>
