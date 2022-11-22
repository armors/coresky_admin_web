<template>
  <div class="app-container">
    <el-form ref="queryForm" label-width="100px" size="small" :inline="true">
      <el-form-item label="" class="wItem">
        <el-input clearable v-model="listQuery.name" :placeholder="$t('userData.placeholder1')" style="width:200px">
        </el-input>
      </el-form-item>
      <el-form-item label="" class="wItem">
        <el-input clearable v-model="listQuery.address" :placeholder="$t('userData.placeholder2')" style="width:200px">
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select clearable v-model="listQuery.verify" style="width:200px" :placeholder="$t('userData.placeholder3')">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleFilter">{{ $t("userData.select") }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" :element-loading-text="$t('global.loadingText')" border
      highlight-current-row>
      <el-table-column align="center" :label="$t('userData.address')" prop="address" width="340" />
      <el-table-column align="center" :label="$t('userData.nickname')" prop="nickname" />
      <el-table-column align="center" :label="$t('userData.photo')" prop="photo">
        <template #default="scope">
          <media v-if="scope.row.photo" :isPreview="true" :url="scope.row.photo" type="image"></media>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userData.certificationStatus')" prop="userVerify">
        <template #default="scope">
          <el-tag v-if="scope.row.userVerify == 0 || !scope.row.userVerify" type="info">
            {{ $t("userData.unauthenticated") }}</el-tag>
          <el-tag v-if="scope.row.userVerify == 1" type="success">{{
            $t("userData.certificationPassed")
          }}</el-tag>
          <el-tag v-if="scope.row.userVerify == 2" type="danger">{{
            $t("userData.authenticationFailed")
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('userData.operation')" width="160"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- <el-button type="primary" size="small" @click="handleDetail(scope.row)">{{ $t("userData.details") }}
          </el-button> -->
          <el-button type="primary" size="mini" class="widthFit" v-permission="['POST /admin/user/verify']"
            @click="(verifyForm = true), (activeId = scope.row.id)" v-if="scope.row.userVerify != 1">
            {{ $t("userData.immediateCertification") }}</el-button>
          <el-button type="primary" size="mini" class="widthFit" v-permission="['POST /admin/user/verify']"
            @click="handleCertification(scope.row)" v-else>{{ $t("userData.cancelCertification") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <!-- 对话框 -->
    <el-dialog :title="$t('userData.details')" :visible.sync="dialogFormVisible">
      <el-descriptions class="margin-top" direction="vertical" :column="3" border>
        <el-descriptions-item>
          <template v-slot:label>
            <div class="centerClass">{{ $t("userData.address") }}</div>
          </template>
          <div class="centerClass">
            {{ details.address }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <div class="centerClass">{{ $t("userData.nickname") }}</div>
          </template>
          <div class="centerClass">
            {{ details.nickname }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <div class="centerClass">{{ $t("userData.avatar") }}</div>
          </template>
          <div class="centerClass">
            {{ details.avatar }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template v-slot:label>
            <div class="centerClass">
              <div class="centerClass">
                {{ $t("userData.certificationStatus") }}
              </div>
            </div>
          </template>
          <div class="centerClass">
            <el-tag v-if="details.userVerify == 0" type="info">{{
              $t("userData.unauthenticated")
            }}</el-tag>
            <el-tag v-if="details.userVerify == 1" type="success">{{
              $t("userData.certificationPassed")
            }}</el-tag>
            <el-tag v-if="details.userVerify == 2" type="danger">{{
              $t("userData.authenticationFailed")
            }}</el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog :title="$t('userData.authentication')" :visible.sync="verifyForm" width="400px" append-to-body>
      <el-radio v-model="verifyStatus" :label="1">
        {{$t("userData.certificationPassed")}}</el-radio>
      <el-radio v-model="verifyStatus" :label="2">
        {{$t("userData.authenticationFailed")}}</el-radio>
      <br />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="verifyForm = false">
          {{$t("userData.cancel")}}</el-button>
        <el-button type="primary" size="small" @click="verifyFunction">
          {{$t("userData.confirm")}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Media from "@/components/Media";
import { userList, userVerify } from '@/api/common'
export default {
  components: { Media },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: this.$store.state.app.setting.limit,
        name: undefined,
        address: undefined,
        verify: undefined,
        start: undefined,
        end: undefined,
        sort: "create_time",
        order: "desc",
      },
      downloadLoading: false,
      dialogFormVisible: false,
      details: {},
      value1: "",
      options: [
        {
          value: 0,
          label: this.$t("userData.unauthenticated"),
        },
        {
          value: 1,
          label: this.$t("userData.authenticated"),
        },
        {
          value: 2,
          label: this.$t("userData.authenticationFailed"),
        },
      ],
      verifyForm: false,
      verifyStatus: 1,
      activeId: "",
    };
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      this.listLoading = true;
      userList(this.listQuery)
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
      if (this.value1) {
        this.listQuery.start = this.GMTToStr(this.value1[0]);
        this.listQuery.end = this.GMTToStr(this.value1[1]);
      }
      this.listQuery.page = 1;
      this.getList();
    },
    handleCertification (row) {
      this.$confirm(this.$t("userData.tipContent"), this.$t("userData.tip"), {
        confirmButtonText: this.$t("userData.confirm"),
        cancelButtonText: this.$t("userData.cancel"),
        type: "warning",
      })
        .then(() => {
          userVerify({ id: row.id, userVerify: 0 })
            .then(() => {
              this.$notify.success({
                title: this.$t("authentication.success"),
                message: this.$t("authentication.completed"),
              });
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: this.$t("authentication.fail"),
                message: this.$t("response." + response.data.errno),
              });
            });
        })
        .catch(() => { });
    },
    verifyFunction () {
      this.listLoading = true;
      userVerify({
        id: this.activeId,
        userVerify: this.verifyStatus,
      }).then(() => {
        this.getList();
        this.verifyForm = false;
        this.$notify.success({
          title: this.$t("authentication.success"),
          message: this.$t("authentication.completed"),
        });
      })
        .catch((response) => {
          this.listLoading = false;
          this.$notify.error({
            title: this.$t("authentication.fail"),
            message: this.$t("response." + response.data.errno),
          });
        });
    },
    handleDetail (row) {
      // window.open('http://testnet.yuumi.io/account/0x80dd336deb7eea1923780a7383c806870c9ce27d');

      this.details = row;

      this.dialogFormVisible = true;

      // this.$api('user.userDetail',{ id: row.address })
      //   .then((response) => {
      //     this.details = response.data;
      //     this.dialogFormVisible = true;
      //   })
      //   .catch((response) => {
      //     this.$notify.error({
      //       title: "存在错误",
      //       message: response.data.errmsg,
      //     });
      //   });
    },
    // 时间转化
    GMTToStr (time) {
      let date = new Date(time);
      let month = date.getMonth() + 1;
      let datas = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (datas < 10) {
        datas = "0" + datas;
      }
      let Str = date.getFullYear() + "-" + month + "-" + datas;
      return Str;
    },
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
.picker {
  margin: 0px 10px;
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
</style>
