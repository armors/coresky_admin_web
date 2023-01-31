import utils from "./utils.js";
export default {
  async launchpad (data, from, address) {
    try {
      let lp_id = data.lp_id
      let target = data.target
      let merkleRoot = data.merkleRoot
      let receipt = data.receipt
      let payment = data.payment
      let price = data.price
      let startTime = data.startTime
      let endTime = data.startTime
      let abi = utils.contractAbi("launchpad");
      const _contract = await utils.contractAt({ abi }, address);
      const result = await _contract.launchpad(
        lp_id,
        target,
        merkleRoot,
        receipt,
        payment,
        price,
        startTime,
        endTime, { from });
      return result
    } catch (e) {
      return { error: e.message };
    }
  },
  async getProject (roundID, address) {
    try {
      let abi = utils.contractAbi("launchpad");
      const _contract = await utils.contractAt({ abi }, address);
      const result = await _contract.getProject(roundID);
      return result
    } catch (e) {
      return { error: e.message };
    }
  }
};
