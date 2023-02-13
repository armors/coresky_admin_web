import { mapState, mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import dayjs from "dayjs";
import { uploadConfig } from "@/api/common";

export default {
  computed: {
    ...mapState({
      userId: (state) => state.user.userInfo.userId.toString(),
      nickName: (state) => state.user.userInfo.nickName,
      connected: (state) => state.network.connected
    }),

    uploadAction () {
      return process.env.VUE_APP_BASE_API + `/admin/storage/create`;
    },
    uploadHeaders () {
      return {
        // Authorization: "Bearer " + getToken(),
        // AuthorizationTk: "Bearer " + getToken(),
      };
    },
  },
  data () {
    return {
      STATIC_URL: process.env.VUE_APP_STATIC_URL,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      fullscreenLoading: undefined,
      OSS_URL: '',
      OSS_DIR: '',
      OSS_IMAGE_URL: '',
      OSS_PARAM: {
        OSSAccessKeyId: '',
        key: '',
        policy: '',
        success_action_status: '200',
        signature: ''
      },
    };
  },
  mounted () { },
  methods: {
    oss_beforeUpload (file) {
      this.OSS_IMAGE_URL = ''
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      return new Promise((resolve, reject) => {
        uploadConfig().then(res => {
          this.OSS_PARAM.OSSAccessKeyId = res.accessid
          this.OSS_PARAM.signature = res.signature
          this.OSS_PARAM.policy = res.policy
          this.OSS_PARAM.key = ''
          this.OSS_DIR = res.dir
          this.OSS_URL = res.host
          this.oss_setKey(file.name)
          resolve()
        }).catch(err => {
          reject()
        })
      })
    },
    oss_uploadSuccess () {
      if (this.fullscreenLoading) {
        this.fullscreenLoading.close();
      }
      this.OSS_IMAGE_URL = this.OSS_URL + '/' + this.OSS_PARAM.key;
    },
    oss_setKey (filename) {
      let suffix = this.oss_fileSuffix(filename)
      this.OSS_PARAM.key = this.OSS_DIR + this.oss_random_string(10) + suffix
    },
    oss_fileSuffix (filename) {
      let pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos != -1) {
        suffix = filename.substring(pos)
      }
      return suffix;
    },
    oss_random_string (length) {
      let len = length || 10;
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    cancel (path) {
      const obj = { path };
      if (this.$route.query.isclose === "1") {
        this.$tab.closePage();
      } else {
        if (path) {
          this.$tab.closeOpenPage(obj);
        } else {
          this.$tab.closePage();
        }
      }
    },
    beforeUpload () {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "文件上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      return;
    },
    successUploadHandle () {
      if (this.fullscreenLoading) {
        this.fullscreenLoading.close();
      }
    },
  },
};
