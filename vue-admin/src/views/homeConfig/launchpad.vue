<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="72px">
      <el-form-item label="">
        <el-input v-model="queryParams.areaNm" placeholder="请输入项目名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList" size="small">
      <!-- <el-table-column label="序号" align="center" type="index" width="70" /> -->
      <el-table-column label="项目名称" align="center" prop="deptNm" />
      <el-table-column label="项目封面" align="center" prop="byRatio">
        <template slot-scope="scope">
          <img src="" alt="">
        </template>
      </el-table-column>
      <el-table-column label="发射时间" align="center" prop="deptNm" />
      <el-table-column label="铸造链接" align="center" prop="deptNm" />
      <el-table-column label="权重" align="center" prop="cOrderCd" />
      <el-table-column label="启用状态" align="center" prop="useMark">
        <template slot-scope="scope">
          <el-switch active-value="1" :disabled="true" inactive-value="0" v-model="scope.row.useMark">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog title="发射日历区配置" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" style="margin-right:45px">
        <el-form-item label="项目名称" prop="areaNm">
          <el-input v-model="form.areaNm" placeholder="请输入合约名称" />
        </el-form-item>
        <el-form-item label="项目封面" prop="areaNm">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="发射时间" prop="areaNm">
          <el-input v-model="form.areaNm" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item label="铸造链接" prop="areaNm">
          <el-input v-model="form.areaNm" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item :label="$t('contract.website')" prop="website">
          <el-input v-model="form.website" />
        </el-form-item>
        <el-form-item :label="$t('contract.discord')" prop="discord">
          <el-input v-model="form.discord" />
        </el-form-item>
        <el-form-item :label="$t('contract.twitter')" prop="twitter">
          <el-input v-model="form.twitter" />
        </el-form-item>
        <el-form-item :label="$t('contract.telegram')" prop="telegram">
          <el-input v-model="form.telegram" />
        </el-form-item>
        <el-form-item label="是否启用" prop="useMark">
          <el-switch active-value="1" inactive-value="0" v-model="form.useMark">
          </el-switch>
        </el-form-item>
        <el-form-item label="权重" prop="cOrderCd">
          <el-input-number style="width:100%" v-model="form.cOrderCd" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regPrice } from "@/utils/reg";
import base from "@/mixins/base";
export default {
  name: "launchpad",
  mixins: [base],
  data () {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {

      },
      // 表单校验
      rules: {

      },
      selectDeptType: 'search',
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询岗位列表 */
    getList () {
      // this.loading = true;
      // getAreaSetList(this.queryParams).then(response => {
      //   this.postList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {

      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加区域";
    },

    /** 提交按钮 */
    submitForm () {

    }
  }
};
</script>
<style lang="scss" scoped>
.w200 {
  width: 200px;
}
::v-deep .el-input-group__append .el-button--small {
  border-color: transparent;
  color: #1890ff;
  background: transparent;
  padding: 9px 15px;
}
</style>
