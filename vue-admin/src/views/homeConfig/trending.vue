<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="72px">
      <el-form-item label="">
        <el-input v-model="queryParams.areaNm" placeholder="请输入标题名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList" size="small">
      <el-table-column label="序号" align="center" type="index" width="70" fixed />
      <el-table-column label="合约名称" align="center" prop="title" />
      <el-table-column label="合约地址" align="center" prop="contract" />
      <el-table-column label="图片" align="center">
        <template #default="scope">
          <img class="miniImg" :src="scope.row.image" alt="">
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center" prop="weight" />
      <el-table-column label="启用状态" align="center" prop="enable">
        <template slot-scope="scope">
          <el-switch :active-value="1" :disabled="true" :inactive-value="0" v-model="scope.row.enable">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="时下流行区配" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" style="margin-right:45px">
        <el-form-item label="合约名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入合约名称" />
        </el-form-item>
        <el-form-item label="合约地址" prop="contract">
          <el-input v-model="form.contract" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload class="avatar-uploader" :action="OSS_URL" accept="image/jpg, image/jpeg, image/png, image/gif" :show-file-list="false"
            :data="OSS_PARAM" :on-success="uploadSuccess" :before-upload="oss_beforeUpload">
            <img v-if="form.image" :src="form.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否启用" prop="useMark">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.enable">
          </el-switch>
        </el-form-item>
        <el-form-item label="权重" prop="cOrderCd">
          <el-input-number style="width:100%" v-model="form.weight" controls-position="right" :min="0" />
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
import { advList, advCreate, advDelete, advUpdate } from "@/api/common";
import { regPrice } from "@/utils/reg";
import base from "@/mixins/base";
export default {
  name: "bannerBottom",
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
        advId: '3',
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        advId: '3',
        title: '',
        // subtitle: '',
        image: '',
        weight: '',
        // url: '',
        enable: '',

        // startTime: '',
        // endTiem: '',
        contract: '',
      },
      imageUrl: '',
      // 表单校验
      rules: {
        title: [{ required: true, message: '合约名称不能为空', trigger: "blur" }],
        contract: [{ required: true, message: '合约地址不能为空', trigger: "blur" }],
        image: [{ required: true, message: '图片不能为空', trigger: "change" }],
      },
      selectDeptType: 'search',
      dialogStatus: "",
    };
  },
  created () {
    this.getList();
  },
  methods: {
    uploadSuccess (res) {
      this.oss_uploadSuccess();
      this.form.image = this.OSS_IMAGE_URL
    },
    /** 查询岗位列表 */
    getList () {
      this.loading = true;
      advList(this.queryParams).then(response => {
        this.dataList = response.data.map(el => {
          el.url = 'https://ms.bdimg.com/pacific/0/pic/808604863_340820137.png?x=0&y=0&h=150&w=242&vh=150.00&vw=242.00&oh=150.00&ow=242.00'
          return el
        })
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: '',
        advId: '3',
        title: '',
        subtitle: '',
        image: '',
        weight: '',
        url: '',
        enable: '',
        contract: ''
      };
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.dialogStatus = "create";
      this.reset();
      this.open = true;
    },

    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (!valid) return
        if (this.form.id) {
          advUpdate(this.form).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.open = false;
            this.getList();
          });
        } else {
          advCreate(this.form).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row);
      this.dialogStatus = "update";
      this.open = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      this.$modal.confirm('是否确认删除？').then(function () {
        return advDelete({ id: row.id });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
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
.miniImg {
  width: 120px;
  height: 80px;
}
</style>
