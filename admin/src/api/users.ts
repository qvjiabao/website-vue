import request from "@/utils/request";

export const getUserInfo = (data: any) =>
  request({
    url: "/api/backstage/users/detail",
    method: "post",
    data
  });

export const login = (data: any) =>
  request({
    url: "/api/backstage/account/login",
    method: "post",
    data
  });

export const logout = () =>
  request({
    url: "/users/logout",
    method: "post"
  });
/**
 * 获取用户列表
 * @param params
 * @returns
 */
export const getUserList = (params: any) =>
  request({
    url: "/api/backstage/users/page",
    method: "get",
    params
  });
/**
 * 修改用户状态
 * @param params
 * @returns
 */
export const modifyState = (params: any) =>
  request({
    url: "/api/backstage/users/modifyState",
    method: "get",
    params
  });
/**
 * 删除用户信息
 * @param params
 * @returns
 */
export const removeUser = (params: any) =>
  request({
    url: "/api/backstage/users/deleted",
    method: "get",
    params
  });

/**
 * 重置密码
 * @param params
 * @returns
 */
export const resetPassword = (params: any) =>
  request({
    url: "/api/backstage/users/resetPassword",
    method: "get",
    params
  });
/**
 * 增加用户
 * @param params
 * @returns
 */
export const createUser = (data: any) =>
  request({
    url: "/api/backstage/users/save",
    method: "post",
    data
  });
export const updateUser = (data: any) =>
  request({
    url: "/api/backstage/users/update",
    method: "post",
    data
  });
