<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        @click="handleCreate"
        v-permission="['POST /admin/contract/create']"
        ><el-icon><Plus /></el-icon>{{ $t("global.create") }}</el-button
      >
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('global.loadingText')"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" prop="id" width="70" sortable />
      <el-table-column
        align="center"
        :label="$t('contract.name')"
        prop="name"
        width="120"
      />
      <el-table-column
        align="center"
        :label="$t('contract.symbol')"
        prop="symbol"
        width="70"
      />
      <el-table-column
        align="center"
        :label="$t('contract.image')"
        prop="image"
        width="120"
      >
        <template #default="scope">
          <media
            v-if="scope.row.image"
            :url="scope.row.image"
            type="image"
            :isPreview="true"
          ></media>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('contract.address')"
        prop="contract"
      />
      <el-table-column
        align="center"
        :label="$t('contract.owner')"
        prop="owner"
      />
      <!-- <el-table-column
        align="center"
        :label="$t('contract.isSystem')"
        prop="isAdmin"
      >
        <template #default="scope">
          <el-tag type="info" v-if="!scope.row.isAdmin">{{
            $t("global.no")
          }}</el-tag>
          <el-tag type="success" v-else>{{ $t("global.yes") }}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        :label="$t('global.operation')"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(scope.row)"
            v-permission="['POST /admin/contract/update']"
            >{{ $t("global.edit") }}</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            v-if="!scope.row.deleted"
            v-permission="['POST /admin/contract/delete']"
            >{{ $t("global.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="120px"
      >
        <el-form-item :label="$t('contract.name')" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>

        <el-form-item :label="$t('contract.symbol')" prop="symbol">
          <el-input v-model="dataForm.symbol" />
        </el-form-item>

        <el-form-item :label="$t('contract.image')" prop="image">
          <el-input v-model="dataForm.image" />
        </el-form-item>

        <el-form-item :label="$t('contract.info')" prop="info">
          <el-input type="textarea" v-model="dataForm.info" />
        </el-form-item>

        <el-form-item :label="$t('contract.category')">
          <el-select
          v-model="dataForm.cid"
          class="filter-item w-200 mr-10"
          :placeholder="$t('contract.category')"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('contract.contractType')">
          <el-select
          v-model="dataForm.contractType"
          class="filter-item w-200 mr-10"
          :placeholder="$t('contract.contractType')"
          >
            <el-option
              v-for="item in contractType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('contract.address')" prop="contract">
          <el-input v-model="dataForm.contract" />
        </el-form-item>

        <el-form-item :label="$t('contract.startHeight')" prop="startHeight">
          <el-input v-model="dataForm.startHeight" />
        </el-form-item>

        <el-form-item :label="$t('contract.owner')" prop="owner">
          <el-input v-model="dataForm.owner" />
        </el-form-item>

        <el-form-item :label="$t('contract.bannerImage')" prop="bannerImage">
          <upload-unit
            v-if="dialogFormVisible"
            :refName="'contractRef'"
            :limitNum="1"
            :imageData="dataForm.bannerImage"
            :uploadStatus="dialogStatus == 'create' || dialogStatus == 'update'"
            @updateData="updateCover"
          ></upload-unit>
        </el-form-item>

        <el-form-item :label="$t('contract.feeContract')" prop="feeContract">
          <el-input v-model="dataForm.feeContract" />
        </el-form-item>

        <el-form-item :label="$t('contract.royalty')" prop="royalty">
          <el-input v-model="dataForm.royalty" />
        </el-form-item>

        <el-form-item :label="$t('contract.website')" prop="website">
          <el-input v-model="dataForm.website" />
        </el-form-item>

        <el-form-item :label="$t('contract.discord')" prop="discord">
          <el-input v-model="dataForm.discord" />
        </el-form-item>

        <el-form-item :label="$t('contract.twitter')" prop="twitter">
          <el-input v-model="dataForm.twitter" />
        </el-form-item>

        <el-form-item :label="$t('contract.telegram')" prop="telegram">
          <el-input v-model="dataForm.telegram" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer" v-if="dialogStatus != 'detail'">
          <el-button @click="dialogCancel">{{ $t("global.cancel") }}</el-button>
          <el-button
            v-if="dialogStatus == 'create'"
            type="primary"
            @click="onCreate"
            >{{ $t("global.confirm") }}</el-button
          >
          <el-button v-else type="primary" @click="onUpdate">{{
            $t("global.confirm")
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
  import Media from "@/components/Media";
  import UploadUnit from "@/components/Upload.vue";
  export default {
    components: { Pagination, Media, UploadUnit },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          username: undefined,
          mobile: undefined,
          sort: "create_time",
          order: "desc",
        },
        options: null,
        contractType: [
          {
            value: 0,
            label: "ERC721",
          },
          {
            value: 1,
            label: "ERC1155",
          },
        ],
        dialogFormVisible: false,
        dialogStatus: "",
        dataForm: {},
        rules: {
          name: [
            {
              required: true,
              message: this.$t("contract.emptyName"),
              trigger: "blur",
            },
          ],
          symbol: [
            {
              required: true,
              message: this.$t("contract.emptySymbol"),
              trigger: "blur",
            },
          ],
          contract: [
            {
              required: true,
              message: this.$t("contract.emptyAddress"),
              trigger: "blur",
            },
          ],
          owner: [
            {
              required: true,
              message: this.$t("contract.owner"),
              trigger: "blur",
            },
          ],
        },
        textMap: {
          update: this.$t("global.edit"),
          detail: this.$t("global.detail"),
          create: this.$t("global.create"),
        },
        fileImage: "",
        filelist: [],
      };
    },
    created() {
      this.getList();
      this.getCateList();
    },
    methods: {
      getCateList() {
        this.$api("category.list", this.listQuery)
          .then((res) => {
            this.options = res.data.list;
          })
          .catch(() => {
            this.list = [];
          });
      },
      updateCover(file) {
        this.fileImage = file;
        this.dataForm.cover = file;
      },
      dialogCancel() {
        this.dialogFormVisible = false;
      },
      uploadChange(file) {
        var event = event || window.event;
        var files = event.target.files[0];
        var reader = new FileReader();
        var _this = this;
        this.filelist = [];
        this.fileImage = file.raw;
        reader.onload = function (e) {
          _this.dataForm = Object.assign({}, _this.dataForm, {
            cover: e.target.result,
          });
        };
        reader.readAsDataURL(files);
      },
      getList() {
        this.listLoading = true;
        this.$api("contract.list", this.listQuery)
          .then((res) => {
            this.list = res.data.list;
            this.total = res.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.listLoading = false;
          });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      resetForm() {
        this.dataForm = {};
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      onCreate() {
        var _this = this;
        this.$refs["dataForm"].validate(async function (valid) {
          if (valid) {
            var response;
            if (_this.fileImage) {
              response = await _this.uploadFile();
              if (!_this.$tool.checkResponse(response)) {
                _this.$notify.error({
                  title: _this.$t("global.fail"),
                  message: response.errmsg,
                });
                return;
              }
            }

            _this.createData(response);
          }
        });
      },
      createData(response) {
        var data = Object.assign({}, this.dataForm);
        data.isAdmin = !data.isAdmin ? 0 : 1;
        if (response) {
          data.bannerImage = response.data.url;
        }

        this.$api("contract.create", data)
          .then((res) => {
            if (this.$tool.checkResponse(res)) {
              this.dialogFormVisible = false;
              this.$notify.success({
                title: this.$t("global.success"),
                message: this.$t("global.createSuccess"),
              });
              this.getList();
            } else {
              this.$notify.error({
                title: this.$t("global.createFail"),
                message: res.errmsg,
              });
            }
          })
          .catch((res) => {
            this.$notify.error({
              title: this.$t("global.createFail"),
              message: this.$t("response." + res.data.errno),
            });
          });
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row);
        this.dataForm.isDefault = this.dataForm.isDefault == 1 ? true : false;
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      onUpdate() {
        var _this = this;
        this.$refs["dataForm"].validate(async function (valid) {
          if (valid) {
            var response;
            if (_this.fileImage) {
              response = await _this.uploadFile();
              if (!_this.$tool.checkResponse(response)) {
                _this.$notify.error({
                  title: _this.$t("global.fail"),
                  message: response.errmsg,
                });
                return;
              }
            }
            _this.updateData(response);
          }
        });
      },
      async uploadFile() {
        return new Promise((resolve) => {
          let formData = new FormData();
          formData.append("file", this.fileImage);

          this.$api("storage.create", formData).then((response) => {
            resolve(response);
          });
        });
      },
      async updateData(response) {
        var data = Object.assign({}, this.dataForm, {
          id: this.dataForm.id,
          bannerImage: response ? response.data.url : this.dataForm.cover,
          isAdmin: !this.dataForm.isAdmin ? 0 : 1,
        });
        this.$api("contract.update", data)
          .then((res) => {
            if (this.$tool.checkResponse(res)) {
              this.dialogFormVisible = false;
              this.$notify.success({
                title: this.$t("global.success"),
                message: this.$t("global.editSuccess"),
              });
              this.getList();
            } else {
              this.$notify.error({
                title: this.$t("global.fail"),
                message: res.errmsg,
              });
            }
          })
          .catch((res) => {
            this.$notify.error({
              title: this.$t("global.fail"),
              message: this.$t("response." + res.data.errno),
            });
          });
      },
      handleDelete(row) {
        this.$confirm(this.$t("global.deleteTip"), this.$t("global.tip"), {
          confirmButtonText: this.$t("global.confirm"),
          cancelButtonText: this.$t("global.cancel"),
          type: "warning",
        })
          .then(() => {
            this.$api("contract.delete", { address: row.address })
              .then((res) => {
                if (this.$tool.checkResponse(res)) {
                  this.$notify.success({
                    title: this.$t("global.success"),
                    message: this.$t("global.deleteSuccess"),
                  });
                  this.getList();
                } else {
                  this.$notify.error({
                    message: this.$t("global.deleteFail"),
                  });
                }
              })
              .catch((res) => {
                this.$notify.error({
                  title: this.$t("global.deleteFail"),
                  message: this.$t("response." + res.data.errno),
                });
              });
          })
          .catch(() => {});
      },
    },
  };
</script>
<style lang="scss" scoped>
  .dataFormClass {
    width: 400px;
    margin-left: 50px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
</style>
