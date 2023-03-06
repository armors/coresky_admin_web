<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb15">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate">{{
          $t("sortManagement.create") }}</el-button>
      </el-col>
    </el-row>
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" size="small" :data="list" :element-loading-text="$t('sortManagement.loadingText')"
      border fit highlight-current-row>
      <el-table-column label="序号" align="center" type="index" width="70" />
      <el-table-column align="center" label="规则名称" prop="name" />
      <el-table-column align="center" label="状态" prop="listReward" />
      <el-table-column align="center" label="矿池总量" prop="buyReward" />
      <el-table-column align="center" label="剩余矿池量" prop="sellReward" />
      <el-table-column align="center" label="有效期开始时间" prop="listReward" />
      <el-table-column align="center" label="有效期结束时间" prop="buyReward" />
      <el-table-column align="center" label="挂单奖励" prop="listReward" />
      <el-table-column align="center" label="购买奖励" prop="buyReward" />
      <el-table-column align="center" label="出售奖励" prop="sellReward">
      </el-table-column>
      <el-table-column align="center" :label="$t('sortManagement.operation')" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑</el-button>
          <!-- <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit"
      @pagination="getList" />
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" size="small" :visible.sync="dialogFormVisible" width="600px" append-to-body>
      <el-form ref="dataFormRef" :rules="rules" :model="dataForm" label-width="100px" style="margin-right:30px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="是否启用" prop="useMark">
          <el-switch :active-value="1" :inactive-value="0" v-model="dataForm.enable">
          </el-switch>
        </el-form-item>
        <el-form-item label="矿池总量" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker style="width: 100%;" @change="dateChange()" value-format="yyyy-MM-dd HH:mm:ss"
            v-model="myDatetime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="挂单奖励" prop="list_reward">
          <el-input-number size="medium" v-model="dataForm.list_reward" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="购买奖励" prop="buy_reward">
          <el-input-number size="medium" v-model="dataForm.buy_reward" :controls="false"></el-input-number>

        </el-form-item>
        <el-form-item label="出售奖励" prop="sell_reward">
          <el-input-number size="medium" v-model="dataForm.sell_reward" :controls="false"></el-input-number>

        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <div class="dialog-footer" v-if="dialogStatus != 'detail'">
          <el-button size="small" @click="dialogFormVisible = false">{{
            $t("sortManagement.cancel")
          }}</el-button>
          <el-button size="small" v-if="dialogStatus == 'create'" type="primary" @click="createData">
            {{ $t("sortManagement.confirm") }}</el-button>
          <el-button size="small" v-else type="primary" @click="updateData">{{
            $t("sortManagement.confirm")
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { rewardList, rewardCreate, rewardUpdate } from '@/api/common'
export default {
  name: 'miningPoolList',
  components: {},
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 10,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      dataForm: {
        id: '',
        name: '',
        list_reward: '',
        buy_reward: '',
        sell_reward: ''
      },
      rules: {
        name: [{ required: true, message: '规则名称不能为空', trigger: "blur", },],
        list_reward: [{ required: true, message: '挂单奖励积分不能为空', trigger: "blur", },],
        buy_reward: [{ required: true, message: '购买奖励积分不能为空', trigger: "blur", },],
        sell_reward: [{ required: true, message: '出售奖励积分不能为空', trigger: "blur", },],
      },
      textMap: {
        update: this.$t("sortManagement.edit"),
        detail: this.$t("sortManagement.detail"),
        create: this.$t("sortManagement.create"),
      },
      dataFormRef: null,
      myDatetime: null,

    };
  },
  created () {
    this.handleQuery();
  },
  methods: {
    dateChange () {
      if (this.myDatetime != null) {
        this.dataForm.startTime = dayjs(this.myDatetime[0]).unix()
        this.dataForm.endTime = dayjs(this.myDatetime[1]).unix()
      }
      else {
        this.dataForm.startTime = ''
        this.dataForm.endTime = ''
      }
    },
    handleQuery () {
      this.queryParams.page = 1
      this.getList()
    },
    getList () {
      this.listLoading = true;
      rewardList(this.queryParams)
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter () {
      this.queryParams.page = 1;
      this.getList();
    },
    resetForm () {
      this.dataForm = {
        id: '',
        name: '',
        list_reward: '',
        buy_reward: '',
        sell_reward: ''
      };
    },
    handleCreate () {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].clearValidate();
      });
    },
    createData () {
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          rewardCreate(this.dataForm)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify.success({
                title: this.$t("sortManagement.success"),
                message: this.$t("sortManagement.createSuccess"),
              });
              this.handleQuery();
            })
            .catch((response) => {
              this.$notify.error({
                title: this.$t("sortManagement.fail"),
                message: this.$t("response." + response.data.errno),
              });
            });
        }
      });
    },
    handleUpdate (row) {
      this.dataForm = Object.assign({}, row);
      this.dataForm.id = row.id
      this.dataForm.name = row.name
      this.dataForm.list_reward = row.listReward
      this.dataForm.sell_reward = row.sellReward
      this.dataForm.buy_reward = row.buyReward
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].clearValidate();
      });
    },
    updateData () {
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          rewardUpdate(this.dataForm)
            .then(() => {
              this.dialogFormVisible = false;
              this.$notify.success({
                title: this.$t("sortManagement.success"),
                message: this.$t("sortManagement.editSuccess"),
              });
              this.handleQuery();
            })
            .catch((response) => {
              this.$notify.error({
                title: this.$t("sortManagement.fail"),
                message: this.$t("response." + response.data.errno),
              });
            });
        }
      });
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
  },
};
</script>
<style lang="scss" scoped>
.dataFormClass {
  width: 400px;
  margin-left: 50px;
}
</style>
