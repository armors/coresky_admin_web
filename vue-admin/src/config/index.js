
export default {
  tokenList () {
    let obj = require('./token.json')
    return obj['CHAINID_' + process.env.VUE_APP_CHAINID]
  },
}