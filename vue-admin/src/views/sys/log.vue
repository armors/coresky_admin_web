<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <el-form ref="queryForm" label-width="100px" size="small" :inline="true">
      <el-form-item label="" class="wItem">
        <el-input v-model="listQuery.name" clearable :placeholder="$t('systemManagement.placeholder2')" style="width:200px">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="['GET /admin/log/list']" icon="el-icon-search" size="mini" @click="handleFilter">
          {{ $t("nftManagement.select") }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" size="small" :data="list" :element-loading-text="$t('util.loadingText')" border fit
      highlight-current-row>
      <el-table-column align="center" :label="$t('systemManagement.operationsAdministrator')" prop="admin" />
      <el-table-column align="center" :label="$t('systemManagement.ipAddress')" prop="ip" />
      <el-table-column align="center" :label="$t('systemManagement.operatingTime')" prop="createTime">
        <template #default="scope">
          {{ timeFilter(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('systemManagement.operatingClass')" prop="type">
        <template #default="scope">
          <el-tag>{{ typeFilter(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('systemManagement.operationAction')" prop="action">
        <template #default="scope">
          {{ $t("systemManagement." + scope.row.action) }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('systemManagement.operatingState')" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'">
            {{
              scope.row.status ? $t("util.success") : $t("util.fail")
            }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('systemManagement.operationResult')" prop="result" />
      <el-table-column align="center" :label="$t('systemManagement.noteInformation')" prop="comment" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { logList } from '@/api/common'
import i18n from "@/i18n/index";
import dayjs from 'dayjs';
const typeMap = {
  0: "systemManagement.generalOperation",
  1: "systemManagement.safeOperation",
  2: "systemManagement.orderOperation",
  3: "systemManagement.otherOperations",
};
export default {
  name: "Log",
  components: {},
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: "create_time",
        order: "desc",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("systemManagement.rule3"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  created () {
    this.getList();
  },
  methods: {
    typeFilter (type) {
      return i18n.t(typeMap[type]);
    },
    timeFilter (time) {
      console.log(time)
      return dayjs(time * 1000).format('YYYY-MM-DD hh:mm')
    },
    getList () {
      this.listLoading = true;
      // listLog(this.listQuery)
      //   .then(response => {
      //     this.list = response.data.list
      //     this.total = response.data.total
      //     this.listLoading = false
      //   })
      //   .catch(() => {
      //     this.list = []
      //     this.total = 0
      //     this.listLoading = false
      //   })
      logList(this.listQuery)
        .then((response) => {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter () {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>
<style scoped>
.width-200px {
  width: 200px;
}
</style>
