import fetch from '../config/fetch'

/**
 * 查询
 */

//export const selectByMonth = data => fetch('/getdata/login', data, 'POST')

export const selectByMonth = data => fetch('/getdata',data,"GET")

/****
 * 插入数据
 */
export const insertData = data => fetch('/insert', data, "POST")


/****
 * 删除数据
 */
export const deleteData = data => fetch('/delete', data, "POST")

/****
 * 用户登录
 */
export const login = data => fetch('/login', data, "POST")

/****
 * 用户注册
 */
export const addUser = data => fetch('/reg', data, "POST")

/****
 * session
 */
export const loginInfo = data => fetch('/loginInfo', data, "GET")
