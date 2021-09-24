<template>
<div class="login">
  <van-nav-bar class="login-top"
  title="登录/注册"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
  <van-cell-group class="login-info">
      <van-field
        v-model="username"
        required
        :label="labelUserName"
        :placeholder="placeUserName"
        :right-icon="usernameIcon"
        :error="usernameError"
      />
      <van-field
        v-if="ifRegister"
        v-model="name"
        required
        :label="labelName"
        :placeholder="placeName"
        :right-icon="nameIcon"
        :error="nameError"
      />
      <van-field
        v-model="password"
        type="password"
        :label="labelPassword"
        :placeholder="placePassword"
        required
        :right-icon="passwordIcon"
        :error="passwordError"
      />
       <van-field
        v-if="ifRegister"
        v-model="confirmPassword"
        type="password"
        :label="labelConfirmPassword"
        :placeholder="placeConfirmPassword"
        required
        :right-icon="confirmPasswordIcon"
        :error="confirmPasswordError"
      />
  </van-cell-group>
  <font class="login-error"> {{error}} </font>
  <div class="login-commit" @click="loginOrReg">{{buttonText}}<van-loading v-if="ifLoading" type="spinner" color="white" /></div>
  <font  class="login-register" @click="register">{{registerText}}</font>
</div>
</template>
<script>
import { login, addUser, loginInfo } from '../api/getData'
import {NumberKeyboard,Toast,Field,DatetimePicker,Popup,Button,Notify,Icon,Loading,NavBar    } from 'vant';
export default {
  components: {
    [NumberKeyboard.name]: NumberKeyboard,
    [Toast.name]: Toast,
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Notify.name]: Notify,
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [NavBar.name]: NavBar 
  },
 name: 'billRecord',
 data() {
    return {
      username: "",
      labelUserName: "用户名",
      placeUserName: "请输入用户名/邮箱",
      usernameIcon: "",
      usernameError: false,
      name: "",
      labelName: "用户名",
      placeName: "请输入用户名",  
      nameIcon: "",
      nameError: false,
      password: "",
      labelPassword: "密码",
      placePassword: "请输入密码",
      passwordIcon: "",
      passwordError: false,
      confirmPassword: "",
      labelConfirmPassword: "再次密码",
      placeConfirmPassword: "请再次输入密码",
      confirmPasswordIcon: "",
      confirmPasswordError: false,
      buttonText: "登录",
      ifLoading: false,
      ifRegister: false,
      error: "",
      registerText: "注册"
    }
},
async mounted(){
  const message = await loginInfo()
  this.username = message.username
  this.password = message.password
  if (this.username !== ""){
    this.loginOrReg()
  }
},
  watch: {
    username: function(val){
        if (val !== ""){
          if (this.ifRegister){
             //验证是否是邮箱格式
            if (val.match('^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$') !== null){
              this.usernameIcon = "success"
            }else{
              this.usernameIcon = "cross"
            }
          }else{
            this.usernameIcon = "success"
          }
          this.usernameError = false
        }else{  
          this.usernameIcon = ""
        }
    },
    name: function(val){
      if (val !== ""){
        this.nameIcon = "success"
        this.nameError = false
      }else{
        this.nameIcon = ""
      }
    },
    password: function(val){
      if (val !== ""){
        this.confirmPassword = ""
        this.confirmPasswordIcon = ""
        this.passwordIcon = "success"
        this.passwordError = false
      }else{
        this.password = ""
        this.confirmPassword = ""
        this.passwordIcon = ""
        this.confirmPasswordIcon = ""
      }
    },
    confirmPassword: function(val){
      if (val !== "")
      {
        if (val === this.password){
          this.confirmPasswordIcon = "success"
        }else{
          this.confirmPasswordIcon = "cross"
        }
        this.confirmPasswordError = false
      }else{
        this.confirmPasswordIcon = ""
      }
    }

  },
  methods: {
   loginOrReg(){
      if (this.ifRegister){
        this.reg()
      }else{
        this.login()
      }
   },
   async login(){
      if ((this.username === "")||(this.password === "")){
        if (this.username === ""){
          this.usernameError = true
        }
        if (this.password === "")
        {
          this.passwordError = true
        }
        return
      }
      /*
      Toast.loading({
        message: '加载中...'
      });
      */
      this.buttonText = ""
      this.ifLoading = true
      const message =  await login({email: this.username, password: this.password})
      this.buttonText = "登录"
      this.ifLoading = false
      //Toast.clear()
      if (message.state === "0"){ 
        Toast('登录成功');
        this.$emit("updateUser",this.username)
      }else{
        Notify(message.error);
      }

   },
   async reg(){
     if ((this.username === "")||(this.name === "")||(this.password === "")||(this.confirmPassword === "")){
       if (this.username === ""){
          this.usernameError = true
        }
        if (this.password === "")
        {
          this.passwordError = true
        }
        if (this.name === "")
        {
          this.nameError = true
        }
         if (this.confirmPassword === "")
        {
          this.confirmPasswordError = true
        }
        return
     }
     if (this.usernameIcon === "cross"){
       Notify('邮箱格式错误');
       return
     }
     if (this.confirmPasswordIcon === "cross"){
       Notify('再次密码录入错误');
       return
     }
      this.buttonText = ""
      this.ifLoading = true
      const message = await addUser({email: this.username, name: this.name, password: this.confirmPassword})
      this.buttonText = "注册"
      this.ifLoading = false
      if (message.state === "0"){
        Toast('注册成功');
        this.initLog()
      }else{
        Notify(message.error);
      }

   },
   register(){
     if (this.registerText === "注册"){
        this.initReg()
      }else{
        this.initLog()
      }
   },
   initLog(){
      this.ifRegister = false
      this.labelUserName = "用户名"
      this.placeUserName = "请输入用户名或邮箱"
      this.buttonText = "登录"
      this.registerText = "注册"
      this.clear()
   },
   initReg(){
      this.ifRegister = true
      this.labelUserName = "邮箱"
      this.placeUserName = "请输入邮箱"
      this.buttonText = "注册"
      this.registerText = "登录"
      this.clear()
   },
   clear(){
      this.username = ""
      this.usernameIcon = ""
      this.name = ""
      this.nameIcon = ""
      this.password = ""
      this.passwordIcon = ""
      this.confirmPassword = ""
      this.confirmPasswordIcon = ""
   },
   onClickLeft(){
     this.$emit("closeLogin")
   }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
html,body{
	height: 100%;
  width: 100%;
}
.login{
  display: flex;
  flex-direction: column;
  align-items: center;  
  &-top{
    width: 100%;
  }
  &-info{
    width: 100%;
    .van-cell__value {
    padding-top: 0px;
}
  }
  &-error{
    margin-top: 0px;
    height: 10px;
    color: red;
  }
  &-commit{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    font-size: 20px;
    width: 90%;
    height: 40px;
    margin: 3px 0px;
    background: #FF69B4;
  }
  &-register{
    align-self: flex-end;
    margin-right: 30px;
    margin-top: 5px;
  }
}
.login-commit:active{
      background:rgb(204, 83, 144);
    } 
.van-icon-success{  
  color: green;
}
.van-icon-cross{  
  color: red;
}
</style>
