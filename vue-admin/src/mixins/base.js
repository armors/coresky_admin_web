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
      return process.env.VUE_APP_BASE_API + `/api/upload/uploadFile`;
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
    };
  },
  mounted() {},
  methods: {
    goBack(path) {},
  },
};
