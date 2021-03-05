import { get, post, delone, put } from "../http/http"

export const apis = {
  /**
    机构管理接口
   */
  orgManageApi: {
    get(p) {
      return get('/api/orgpos', p)
    },
    add(p) {
      return post("/api/orgpos", p)
    },
    update(p) {
      return put("/api/orgpos", p)
    },
    delete(p) {
      return delone("/api/orgpos", p)
    }
  },
  /**
   * 用户管理接口
   */
  System: {
    getUserList(p) {
      return get("/api/users", p)
    },
    addUser(p) {
      return post("/api/users", p)
    },
    deleteUser(p) {
      return delone("/api/users", p)
    },
    getUserDetail(p) {
      return get('/api/users/detail', p)
    },
    updateUser(p) {
      return put('/api/users', p)
    },
    getRoleList(p){
      return get('/api/role',p)
    },
    getDepartmentList(p){
      return get('/api/department',p)
    },
  },
  /**
   * chat接口
   */
  Chat:{
    get(){
      return get('/api/chat')
    }
  },
  /**
   * mongodb测试接口
   */
  Site:{
    getList(p){
      return get('/api/site',p)
    }
  },
  /**应急指挥接口 */
  Alarm:{
    getList(p){
      return get('/api/alarm',p)
    }
  },
  /**文件管理 */
  File:{
    getList(p){
      return get('/api/file',p)
    },
    delete(p){
      return delone('/api/file',p)
    }
  },
  /**通知管理 */
  Notice:{
    getList(p){
      return get('/api/notice',p)
    },
    add(p){
      return post('/api/notice',p)
    }
  }
}