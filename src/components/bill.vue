<template>
  <div class="billRecord">
    <div class="billRecord-icon">
         <div class="billRecord-icon-item" v-for="(imageItem,index) in imageList " :key="imageItem.id" @click="iconClick(index)">
            <img :src="imageItem.url">
            <div>{{imageItem.title}}</div>
        </div>
    </div>
    <div class="billRecord-sum">
        <div class="billRecord-sum-item" >
                <img :src="imageList[activeId].url">
            <div>
                {{imageList[activeId].title}}
            </div>
        </div>
        <div class="billRecord-sum-num">
                <font style="font-size:30px;font-weight:bold">{{sum}}</font>
                <div  style="overflow: auto;height:20px;"  ref="history">
                    <font >{{history}}</font>
                </div>
        </div>
    </div>
    <div class="billRecord-other">
            <div class="billKey billOtherMidden">
                <van-field v-model="remark" placeholder="备注" />
            </div>
            <div class="billKey billOther" @click="DateShowClick">{{BillRemark}}</div>
    </div>
    <div class="billRecord-keyboard">
        <div class="billRecord-keyboard-num">
             <div class="billKey" v-for="item in items" :key="item" @click="clickNum(item)">{{item}}</div>
           
        </div>
        <div class="billRecord-keyboard-sidebar">
            <div class="billKey billKeySidebar" @click="clickNum('+')">+</div>
            <div class="billKey billKeySidebar" @click="clickNum('-')">-</div>
            <div class="billKey billKeySidebar billKeySidebarMidden"  v-on:click="clickBtn" :class="{'BtnSure':(btnDesc==='完成'), 'BtnCancle':(btnDesc==='取消')}">{{btnDesc}}</div>
        </div>
    </div>
    <div>
        <van-popup
            v-model="DateShow"
            position="bottom"
        >
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                @confirm="selDateClick"
                @cancel="DateShow = false"
            />
        </van-popup>
    </div>

  </div>
</template>

<script>
import {NumberKeyboard,Toast,Field,DatetimePicker,Popup} from 'vant';
export default {
  components: {
    [NumberKeyboard.name]: NumberKeyboard,
    [Toast.name]: Toast,
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
  },
 name: 'billRecord',
 data() {
    return {
        show:true,
        items: [1,2,3,4,5,6,7,8,9,0,".","删除"],
        sum: "0.00",
        history:" ",
        btnDesc: "取消",
        isSure: true,
        DateShow: false,
        activeId: 0,
        currentDate: new Date(),
        BillRemark: "今天",
        remark: "",
        imageList:[
        {
            url: require(`../assets/food-active.png`),
            activeUrl: require('../assets/food.png'),
            title: "餐饮",
            id: 1   
        },{
            url: require(`../assets/clothes.png`),
            activeUrl: require('../assets/clothes-active.png'),
            title: "服饰",
            id: 2   
        },{
            url: require(`../assets/shopping.png`),
            activeUrl: require('../assets/shopping-active.png'),
            title: "购物",
            id: 3   
        },{
            url: require(`../assets/recreation.png`),
            activeUrl: require('../assets/recreation-active.png'),
            title: "娱乐",
            id: 4   
        },{
            url: require(`../assets/heart.png`),
            activeUrl: require('../assets/heart-active.png'),
            title: "人情",
            id: 5
        }],
    }
},
  props: {
    msg: String
  },
  watch: {
      sum : function(val){
          if (parseFloat(val) != 0)
          {
              this.isSure = true
              this.btnDesc = "完成"
          }else{
              this.isSure = false
              this.btnDesc = "取消"
          }
      },
      DateShow: function(val){
              this.$emit("openDateTime",val)
      }

  },
  methods: {
    clean(){
        this.changeIcon(this.activeId)
        this.activeId = 0
        this.changeIcon(this.activeId)
        this.sum =0.00
        this.history = ""
        this.remark = ""
      },
    clickNum(selNum){
        if (selNum === "删除")
        {
            this.history =  (this.history.length===1) ? "" : this.history.substring(0, this.history.length-1)
        }else{
            this.history +=selNum
        }
        this.$refs.history.scrollLeft =this.$refs.history.scrollWidth
        this.compute(this.history)
    },
    compute(str){
        let oldSum = 0.00
        let NewNum = ""
        let lastChar = ""
       for (let i=0;i<str.length;i++)
       {   
           if ((str[i]==="+")&&(NewNum != ""))
           {
               NewNum = ""
               lastChar = "+"
           }else if((str[i] === "-")&&(NewNum != ""))
           {
               NewNum = ""
               lastChar = "-"
           }else{
               let lastNum = ""
               if ( NewNum.length > 0)
               {
                   lastNum = NewNum
               }
               NewNum += str[i]
              if (lastChar === "+"){
                   if (lastNum != "") oldSum -= parseFloat(lastNum)
                   oldSum += parseFloat(NewNum)
              }else if(lastChar==="-")
              {
                   if (lastNum != "") oldSum += parseFloat(lastNum)
                  oldSum -= parseFloat(NewNum)
              }else{
                  oldSum = parseFloat(NewNum)
              }
               
           }
       }
       this.sum = oldSum
    },
    iconClick(index){
        if (index != this.activeId)
        {
           this.changeIcon(index)
           this.changeIcon(this.activeId)
           this.activeId = index
           this.history = ""
           this.sum = "0.00"
        }
    },
    changeIcon(index){
        let temp = this.imageList[index].url
        this.imageList[index].url = this.imageList[index].activeUrl
        this.imageList[index].activeUrl = temp
    },
    clickBtn(){
        if (this.btnDesc === "取消"){
            this.clean()
            this.$emit("closeBill")
        }else{
            let selectYear = this.currentDate.getFullYear()
            let selectMonth = parseInt(this.currentDate.getMonth())  + 1
            selectMonth = selectMonth<10 ? "0"+selectMonth : selectMonth 
            let selDate =  this.currentDate.getDate()
            this.$emit("closeBill",`${selectYear}-${selectMonth}-${selDate}`, this.activeId+1,  parseFloat("-"+this.sum), this.remark)
            this.clean()
        }
    },
    selDateClick(){
        let selectYear = this.currentDate.getFullYear()
        let selectMonth = parseInt(this.currentDate.getMonth())  + 1
        selectMonth = selectMonth<10 ? "0"+selectMonth : selectMonth 
        let selectDay = this.currentDate.getDate()
        selectDay = selectDay<10 ? "0"+selectDay : selectDay 
        this.BillRemark = `${selectMonth}-${selectDay}`
        this.DateShow = false
    },
    DateShowClick(){
        this.DateShow = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.billRecord{
    height: 300px;
    &-icon{
        display: flex;
        flex-direction: row;
        text-align: center;
        padding-top: 20px;
        margin-bottom: 20px;
        &-item{
            flex-grow: 1;
        }
    }
    &-sum{
        background: white;
        display: flex;
        flex-direction: row;
        padding-top: 5px;
        padding-bottom: 7px;
        &-item{
            text-align: center;
            width: 33.333333%;
            padding-left: 20px;
        }
        &-num{
            width: 66.666666%;
            display: flex;
            flex-direction: column;
            text-align: right;
            padding-right: 20px;
        }
    }
     &-other{
        display: flex;
        flex-direction: row;
        .van-cell{
            height: 100%;
            font-size: 20px;
        }
    }
    &-keyboard{
        display: flex;
        flex-direction: row;
        &-sidebar{
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        &-num{
            flex-grow: 3;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    }
}
.billKey{
    width: 33.33333333%;
    font-size: 24px;
    font-style: normal;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    height: 54px;
    line-height: 54px;
    border: 0px solid #ebedf0;
    border-width: 1px 1px 0 0;
    background-color:#fff;
    box-sizing: border-box;

}
.billKeyMidden{
    width: 66.66666%;
}
.billKeySidebar{
    width: 100%;
}
.billKeySidebarMidden
{
    height: 108px;
     line-height: 108px;
}
.billKey:active{
    background: #BEBECA;
}
.billOtherMidden{
    width: 75%
}
.billOther{
    width: 25%;
}
.BtnCancle{
    background: #BEBECA;
}
.BtnSure{
    background: #FF69B4;
}
.van-cell__value {
    padding-top: 15px;
}
</style>
