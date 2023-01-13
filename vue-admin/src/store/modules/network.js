import util_web3 from "@/utils/web3/index.js";
import { Notification } from "element-ui";

const network = {
  state: {
    web3: {
      coinbase: null,
      networkId: null,
    },
    connected: false,
  },
  mutations: {
    CONNECT (state, payload) {
      state.web3 = Object.assign({}, state.web3, {
        networkId: payload.networkId,
        coinbase: payload.coinbase,
      });
      state.connected = true;
    },
    DISCONNECT (state) {
      state.connected = false;
      state.web3 = {
        coinbase: null,
        networkId: "",
      };
    },
  },
  actions: {
    connect ({ commit }) {
      return new Promise(async function (resolve, reject) {
        util_web3
          .connectWeb3()
          .then((result) => {
            if (result.error) {
              Notification.error(result.error.message || result.error,);
              return;
            }
            commit("CONNECT", result);
            resolve(result)
          })
          .catch((error) => {
            reject(error.message || error)
            Notification.error(error.message || error);
          });
      })
    },
    disconnect ({ state, commit }) {
      if (!state.connected) return;
      return new Promise(() => {
        commit("DISCONNECT");
      });
    },
  },
};

export default network;
