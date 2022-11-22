import request from "@/utils/request";

export const userList = (data) => request.post("/admin/user/list", data);
export const userVerify = (data) => request.post("/admin/user/verify", data);

export const categoryList = (data) => request.post("/admin/category/list", data);
export const categoryCreate = (data) => request.post("/admin/category/create", data);
export const categoryUpdate = (data) => request.post("/admin/category/update", data);
export const disableCategory = (data) => request.post("/admin/category/disable", data);
export const enableCategory = (data) => request.post("/admin/category/enable", data);


export const contractList = (data) => request.post("/admin/contract/list", data);
export const contractCreate = (data) => request.post("/admin/contract/create", data);
export const contractUpdate = (data) => request.post("/admin/contract/update", data);
export const contractDelete = (data) => request.post("/admin/contract/delete", data);

export const storageCreate = (data) => request.post("/admin/storage/create", data);

export const nftList = (data) => request.post("/admin/nft/list", data);
export const nftDetail = (data) => request.post("/admin/nft/detail", data);
export const nftOnsale = (data) => request.post("/admin/nft/onsale", data);
export const nftVerify = (data) => request.post("/admin/nft/verify", data);
export const nftDisable = (data) => request.post("/admin/nft/disable", data);


export const configFetch = (data) => request.post("/admin/config/fetch", data);
export const configUpdate = (data) => request.post("/admin/config/update", data);
export const configUnauthFetch = (data) => request.post("/admin/config/unauthFetch", data);


export const txorderInfo = (data) => request.post("/admin/txorder/info", data);

export const adminList = (data) => request.post("/admin/adminuser/list", data);
export const adminCreate = (data) => request.post("/admin/adminuser/create", data);
export const adminUpdate = (data) => request.post("/admin/adminuser/update", data);
export const adminDelete = (data) => request.post("/admin/adminuser/delete", data);
export const adminSetpwd = (data) => request.post("/admin/adminuser/setpwd", data);

export const roleList = (data) => request.post("/admin/role/list", data);
export const roleCreate = (data) => request.post("/admin/role/create", data);
export const roleUpdate = (data) => request.post("/admin/role/update", data);
export const roleDelete = (data) => request.post("/admin/role/delete", data);
export const roleOptions = (data) => request.post("/admin/role/options", data);
export const roleUpdatepermissions = (data) => request.post("/admin/role/updatepermissions", data);
export const roleGetpermissions = (data) => request.post("/admin/role/getpermissions", data);


export const logList = (data) => request.post("/admin/log/list", data);


export const advList = (data) => request.post("/admin/adv/list", data);
export const advCreate = (data) => request.post("/admin/adv/create", data);
export const advDelete = (data) => request.post("/admin/adv/delete", data);
export const advUpdate = (data) => request.post("/admin/adv/update", data);