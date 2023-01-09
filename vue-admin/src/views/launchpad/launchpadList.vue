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
import Media from "@/components/Media";
import dayjs from "dayjs";
import betresultDialog from './components/betResultDialog';
import betListDialog from './components/betListDialog';
import { launchpadList, launchpadUpdateStatus } from '@/api/common'

export default {
  components: { Media, betresultDialog, betListDialog },
  data () {
    return {
      list: null,
      total: 0,
      dataList: [],
      loading: false,
      queryParams: {
        page: 1,
        limit: 3,
        contract: '',
        name: '',
        owner: '',
        startTime: '',
        endTime: '',
      },
    };
  },
  computed: {

  },
  created () {
    this.getList();
  },
  methods: {
    dateParse (time) {
      return dayjs.unix(time).format('YYYY-MM-DD HH:mm:ss')
    },
    getList () {
      this.loading = true;
      launchpadList(this.queryParams).then(res => {
        this.dataList = res.data.list
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
