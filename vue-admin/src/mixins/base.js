import { mapState, mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import dayjs from "dayjs";
export default {
  computed: {
    ...mapState({
      userId: (state) => state.user.userInfo.userId.toString(),
      nickName: (state) => state.user.userInfo.nickName,
    }),

    uploadAction() {
      return process.env.VUE_APP_BASE_API + `/admin/storage/create`;
    },
    uploadHeaders() {
      return {
        Authorization: "Bearer " + getToken(),
        AuthorizationTk: "Bearer " + getToken(),
      };
    },
  },
  data() {
    return {
      STATIC_URL: process.env.VUE_APP_STATIC_URL,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      fullscreenLoading: undefined,
    };
  },
  mounted() { },
  methods: {
    goBack(path) { },
    beforeUpload() {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "文件上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      return;
    },
    successUploadHandle() {
      if (this.fullscreenLoading) {
        this.fullscreenLoading.close();
      }
    },
  },
};
