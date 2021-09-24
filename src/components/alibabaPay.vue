<template>
  <div class="alibabaPay">
    <div data-v-2f3fc3bc="" class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
        <div class="van-nav-bar__left">
            <i class="van-icon van-icon-arrow-left van-nav-bar__arrow">
                <!---->
            </i>
        </div>
        <div class="van-nav-bar__title van-ellipsis">登录支付宝账号</div>
        <div class="van-nav-bar__right" ></div>
    </div>
    <div class="alibabaPay__Body">
        <div class="alibabaPay__Body__Logo">
            <img src="../assets/aliPay.png" />
        </div>
        <div class="alibabaPay__Body__Login">
            <van-cell-group>
                <van-field
                    v-model="username"
                    label="账号"
                    right-icon="cross"
                    placeholder="请输入手机号"
                    @click-right-icon="$toast('question')"
                />

                <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                />
            </van-cell-group>
        </div>
         <div class="alibabaPay__Body__ButtonNew">
            <van-button class="alibabaPay__Body__Button" type="primary" @click="next">下一步</van-button>
         </div>
          <div class="alibabaPay__Body__mima"><font>忘记密码</font></div>
        </div>
  </div>
</template>
<script>
import { NavBar,Field,Button,Toast} from 'vant';
export default {
  name: 'alibabaPay',
  components: {
      [NavBar.name]: NavBar,
      [Field.name]: Field,
      [Button.name]: Button,
      [Toast.name]: Toast 
  },
  methods: {
    onClickLeft() {
      Toast('返回');
    },
    onClickRight() {
      Toast('按钮');
    },
  next(){
      Toast.loading({
        mask: true,
        message: '傻琦你密码我知道了..哈哈哈...'
    });
  }
 
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.alibabaPay{
    margin: 0 auto;
    height: 100%;
    width: 100%;
    position: absolute;
    background: #F6F4F9;
}
.van-nav-bar{
    background:  #232637;
}
.van-nav-bar .van-nav-bar__title {
    color: #BEBECA ;
    font-weight: bold;
}
.van-nav-bar .van-icon {
    color: white;
    vertical-align: middle; 
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.alibabaPay__Body{
    display: flex;
    flex-direction: column;
    height: 170px;
}
.alibabaPay__Body__Logo{
    align-self: center;
    margin: 20px 0 20px 0;
}
img{
    width: 150px;
}
.alibabaPay__Body__Button{
    background:#00AAEF; 
    height: 50px;
   font-size: 20px;
    text-align: center;
    line-height: 40px;
    border-radius: 3%;
    color: white;
    border: #00AAEF 1px solid;
    width: 90%;
}
.alibabaPay__Body__ButtonNew{
    width: 100%;
    padding: 20px 20px 10px 20px;
}
.alibabaPay__Body__mima{
    height: 50px;
   text-align: right;
   padding: 0 20px 0 0;
   color: #4AA7C9;
}


</style>
