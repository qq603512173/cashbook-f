<template>
  <div class="bill" ref="bills">
      <div class="bill-top">
          <div class="bill-top-logo">
             <van-notice-bar
                text="热烈庆祝！热烈庆祝！热烈庆祝！爱琦记账本:于(2021年01月31日)发布正式版V1.0.当前版本为正式版v1.1。后续持续更新，敬请期待！"
                left-icon="volume-o"
                />
          </div>
          <div class="bill-top-details">
            <div class="bill-top-details-date" @click="show = true">
                {{selectYear}} <br><font>{{selectMonth}}</font><label class="fontSmallSize">月</label>
            </div>
            <div class="bill-top-details-split">
            </div>
            <div class="bill-top-details-export">
                收入<br><font>{{BillSumImport}}</font><label class="fontSmallSize">{{BillSumImportSub}}</label>
            </div>
            <div class="bill-top-details-import">
                支出<br><font>{{BillSumExport}}</font><label class="fontSmallSize">{{BillSumExportSub}}</label>
            </div>
          </div>    
      </div>
      <div class="bill-detail">
          <div class="bill-detail-top specialalign">
              <div class="bill-detail-top-left ">
              </div>
          </div>
          <div class="bill-detail-body"  ref="vanlists">
              <div class="bill-detail-body-title"></div>
            <demo-section name="pull-refresh" id="bill-detail-bodyA">
                <van-pull-refresh
                v-model="list.refreshing"
                @refresh="onRefresh"
                >
                <van-list
                        v-model="list.loading"
                        :finished="list.finished"
                        :finished-text="finishedText"
                        @load="init"
                        :class="{'animanSpecial': ifAnimal}"
                    >
                    <van-cell
                        v-for="item in list.items"
                        :key="item">
                        <div class="list-Padding">
                            <div class="list-Date">
                                <div class="list-Date-Detail">{{item.BillDate}}&nbsp&nbsp&nbsp&nbsp{{item.BillDay}}</div>
                                <div>收入:{{item.BillImport}}&nbsp&nbsp&nbsp&nbsp支出:{{item.BillExport}}</div>
                            </div>      
                            <div class="list-Detail"  v-for="detailItem in item.Detail" :key="detailItem"  >
                                <van-swipe-cell :right-width="65" >
                                    <img :src="iconList[detailItem.BillIcon]">
                                    <div class="list-Detail-Title">
                                        <font v-if="detailItem.BillRemark===''">{{detailItem.BillTitle}}</font>
                                        <font v-else>{{detailItem.BillRemark}}</font>
                                    </div>
                                    <div class="list-Detail-Money">{{detailItem.BillMoney}} &nbsp&nbsp</div>
                                    <span slot="right" @click="delete_Click(detailItem.BillId)">删除</span>
                                </van-swipe-cell>   
                            </div>
                        </div>
                        <div class = "list-bottom">
                            <div class = "list-bottom-left"></div>   
                            <div class = "list-bottom-center"></div>   
                            <div class = "list-bottom-right"></div>
                        </div>
                    </van-cell>
                    </van-list>
                </van-pull-refresh>
            </demo-section>
          </div>
           <div class="bill-detail-top">
                <div class="bill-detail-top-right">
              </div>
          </div>
      </div>
      <div class="bill-Record" >
          <div class="bill-Record-top">
              <div class="bill-Record-top-center"></div>
          </div>
           <div class="bill-Record-bottom">
               <div class="bill-Record-bottom-left"></div>
               <div class="bill-Record-bottom-center" @click="showBill = true">
                   <img src="../assets/add.png">
               </div>
               <div class="bill-Record-bottom-right" @click="showLogin = true" >
                   {{user}}
               </div>
           </div>
          <!--<img src="../assets/add.png">-->
      </div >
      <div>
        <van-popup
            v-model="show"
            position="bottom"
            >
            <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                @confirm="selYearMonth"
                @cancel="show = false"
            />
        </van-popup>
         <van-popup
            v-model="showBill"
            position="bottom"
            >
            <div class="selbill">
                <bill @closeBill="toCloseBill" @openDateTime="OverLayClick" ref="bill" ></bill>
            </div>
        </van-popup>
        <van-popup
          v-model="showLogin"
          position="right"
        >
            <login @closeLogin="showLogin=false" @updateUser="updateUser" ></login>
        </van-popup>
        <div  v-if="OverLay" class="van-overlay" style="z-index: 2000;"></div>
    </div>
  </div>
</template>
<script>
import { selectByMonth,insertData,deleteData,loginInfo } from '../api/getData'
import {List,Toast ,Tab, Tabs, PullRefresh,Cell,NoticeBar,Popup,DatetimePicker, SwipeCell, Dialog,Field } from 'vant';
import bill from './bill.vue';
import login from './login.vue';
export default {
  name: 'alibabaPay',
  components: {
      [Dialog.name]:Dialog,
      [SwipeCell.name]:SwipeCell,
      [List.name]: List,
      [Toast.name]: Toast,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [PullRefresh.name]: PullRefresh,
      [Cell.name]: Cell,
      [NoticeBar.name]: NoticeBar,
      [Popup.name]: Popup,
      [DatetimePicker.name]: DatetimePicker ,
      [Field.name]: Field ,
      bill,
      login
  },
  data() {
    return {
      list: {
        items: [],
        refreshing: false,
        loading: false,
        error: false,
        finished: false
      },
      allItems: [],
      selectYear: "",
      selectMonth: "",
      count: 0,
      isLoading: false,
      basicUsage:"123",
      text: "刷新次数",
      success: "刷新成功",
      finishedText: "没有更多了",
      show: false,
      showBill: false,
      currentDate: new Date(),
      OverLay: false,
      iconList:{
          1: require("../assets/food-active.png"),
          2: require('../assets/clothes-active.png'),
          3: require('../assets/shopping-active.png'),
          4: require('../assets/recreation-active.png'),
          5: require('../assets/heart-active.png')
      },
      BillSumImport: "",
      BillSumExport:"",
      BillSumImportSub: "",
      BillSumExportSub: "",
      ifAnimal:  false,
      user: "登录",
      showLogin : false
    };
  },
  watch: {
      showBill: function (val){
          if(!val){
              this.$refs.bill.clean()
          }
      }
  },
    created(){ 
      this.selectYear = new Date().getFullYear()+"年"
      let mSelectMonth = (new Date().getMonth()+1)
      mSelectMonth = mSelectMonth<10 ? "0"+mSelectMonth : mSelectMonth.toString()
      this.selectMonth = mSelectMonth 
      //this.init();
  },
  async mounted(){
       const loginInfos = await loginInfo()
      this.user = loginInfos.username  
  },
  methods: {
    async init() {
        let lastDate = new Date()
        let year = this.selectYear.substring(0,4)
        let month = this.selectMonth.substring(0,2)
        let lastDay = new Date(year,month,0).getDate()
        let ret = await selectByMonth({ fromDate: `${year}-${month}-01`, toDate: `${year}-${month}-${lastDay}`})
        this.allItems = ret.data
        this.list.items = []
        this.BillSumImport = ret.BillSumImport.split(".")[0]
        this.BillSumImportSub = "." + ret.BillSumImport.split(".")[1]
        this.BillSumExport = ret.BillSumExport.split(".")[0]
        this.BillSumExportSub = "." + ret.BillSumExport.split(".")[1]
        this.onLoad()
        Toast.clear()
        this.exeAnimation()
    },
    exeAnimation(){
        const AllItem = this.list.items
        let itemsLength = AllItem.length
        for (let AllItemItem in AllItem){
            itemsLength += AllItem[AllItemItem].Detail.length
        }
        this.$refs.bills.style.setProperty('--Aheight',`-${itemsLength*50+100}px`);
        this.ifAnimal = true;
    },
    getDta(){
        let lastDate = new Date()
        let year = this.selectYear.substring(0,4),month = this.selectMonth.substring(0,2)
        let lastDay = new Date(year,month,0).getDate()
        let ret =  selectByMonth({ fromDate: `${year}-${month}-01`, toDate: `${year}-${month}-${lastDay}`}).then(()=>{
             this.allItems = ret.data
            this.BillSumImport = ret.BillSumImport.split(".")[0]
            this.BillSumImportSub = "." + ret.BillSumImport.split(".")[1]
            this.BillSumExport = ret.BillSumExport.split(".")[0]
            this.BillSumExportSub = "." + ret.BillSumExport.split(".")[1]
        })
    },
    inserToData( mBillDate, mBillType, mBillMoney, mBillRemark){
        return new Promise((callback) => {
            let ret =  insertData({BillDate:mBillDate, BillType:mBillType , BillMoney:mBillMoney , BillRemark:mBillRemark }).then(()=>{
                 callback()
            })
       });
    },
    selYearMonth(){ 
        debugger
        this.selectYear = this.currentDate.getFullYear() + "年"
        let selectMonth = parseInt(this.currentDate.getMonth())  + 1
        selectMonth = selectMonth<10 ? "0"+selectMonth : selectMonth.toString() 
        this.selectMonth =  selectMonth
        this.show = false;
        this.ifAnimal  = false
        this.init()
    },
     onLoad() {
      const list = this.list;
      const showLength = list.items.length
      for (let i = showLength; i < this.allItems.length; i++) {
      if (list.items.length >= this.allItems.length)
      {
            list.loading = false;
            list.finished = true;
            return
      }
            list.items.push(this.allItems[i]);
      }
            list.loading = false;
      if (list.items.length >= this.allItems.length)
        {
            list.finished = true;
        }
    },
    async onRefresh() {
        const list = this.list;
        await this.getDta()
        setTimeout(() => {
        list.items = [];
        list.error = false;
        list.finished = false;
        list.refreshing = false;
        window.scrollTo(0, 10);
      }, 300);
    },
    async toCloseBill( mBillDate, mBillType, mBillMoney, mBillRemark){
        this.showBill = false
        if (arguments.length === 4){
             Toast.loading({
             });
            let that = this
            await this.inserToData( mBillDate, mBillType, mBillMoney, mBillRemark).then(()=>{
                 that.init();
            })
        }
    },
    OverLayClick(value){
        this.OverLay = value
    },
    onClose(clickPosition, instance, id) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
         Dialog.confirm({
            message: '确定删除吗？'
          }).then(async() => {
               
                instance.close();
          });
            break;
        case 'outside':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(async() => {
              //  await deleteData({id: })
                instance.close();
          });
          break;
      }
    },
    delete_Click(mId){
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(async() => {
            Toast.loading({
             });
             await deleteData({id:mId })
            this.init();
        });
    },
    updateUser(username){
        this.user = username;
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
.bill{
     --Aheight: -400px;
    display: flex;
    flex-direction: column; 
    height: 100%;
    &-top{
        z-index: 1;
        height: 95px;
        background: #FF69B4;
        &-details{
            //background: black;
            display: flex;
            flex-direction: row;
            align-items: center;
            font{
                font-weight: bold;
                font-size: 23px;
            }
            &-date{    
                padding-left: 5%;
                padding-top: 2px;
                padding-bottom: 2px;
                width: 20%;
                //background: brown;
            }
            &-split{
                 margin-top: 20px;
                 height: 20px;
                 border-right: solid 1px rgb(36, 32, 32);
            }
            &-import{
                padding-left: 5%;
                padding-top: 2px;
                padding-bottom: 2px;
                width: 40%;
                //background:cadetblue;
            }
            &-export{
                padding-left: 5%;
                padding-top: 2px;
                padding-bottom: 2px;
                width: 40%;
                //background:cornflowerblue;
            }
        }
    }
    &-detail{
    display: flex;
    flex-direction: row;
    flex-grow:1;
    margin-bottom: -11px;
        &-top{
            display: flex;
            flex-direction: row;
            height: 20px;
            width: 10px;
            background: #FF69B4;
            &-left{
                height: 8px;
                width: 5px;
                background: rgb(97, 17, 70);
                float: right;
                 border-radius: 20px 0px 0px 20px;
            }
             &-right{
                height: 8px;
                width: 5px;
                background: rgb(97, 17, 70);
                border-radius: 0px 20px 20px 00px;
            }
        }
        &-body{
            flex-grow:18;
            background: #BEBECA;    
            //border-top: rgb(97, 17, 70) 4px solid;
           // position:relative;
            //animation:mymove 5s infinite;
            //-webkit-animation:mymove 5s infinite; /*Safari and Chrome*/
            &-title{
                height: 4px;
                background: rgb(97, 17, 70);
            }
        }
    }
    &-Record{
         height:45px;
         background:white;
         &-top{
            height:15px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            background: #BEBECA;
            &-center{
                 width: 30px;
                 z-index: 2;
                 background: white;
                  border-radius: 20px 20px 0px 0px;
                  border-top: 1px solid #BEBECA;
                  border-left: 1px solid #BEBECA;
                  border-right: 1px solid #BEBECA;
                 
            }
         }
         &-bottom{
            height:30px;
            background:white;
             display: flex;
            flex-direction: row;
            justify-content: space-between;
             &-center{    
                 width: 30px;
                 height: 15px;
                 z-index: 20;
                 text-align: center;
                 padding-right: 2px;
                 img{
                   margin-top:-17px;
                 }
            }
            &-left{
                width: 80px;
                border-top: 1px solid #BEBECA;
            }
            &-right{
                 width: 80px;
                line-height: 30px;
                border-top: 1px solid #BEBECA;
            }
         }
    }
    &-DateSelect{
        height:60px;
        background: 100px;
    }
}
  .van-pull-refresh {
      overflow:scroll;
      height: 100%;
  }
  .selbill{
      height: 442px;
      background: white;
  }
.list-Date{
    font-size: 13px;
    color: #BEBECA;
    display: flex;
    flex-direction: row;
    &-Detail{
        flex-grow: 1;
    }
}
.list-Detail{
  
    &-Title{
        flex-grow: 1;
        padding-left: 10px;
    }
    &-Money{
       

    }
}
.list-bottom{
    display: flex;
    &-center{
        height: 5px;
        flex-grow: 1;
        border-top: 5px dotted #BEBECA;
        margin-top: 5px;
    }
    &-left{
         width: 5px;
         height: 10px;
         border-radius: 0px 20px 20px 0px;
         background: #BEBECA;
         border: 2px solid #BEBECA;
    }
    &-right{
         width: 5px;
         height: 10px;
         border-radius: 20px 0px 0px 20px;
         background: #BEBECA;
         border: 2px solid #BEBECA;
    }
}
#bill-detail-bodyA {
  .van-pull-refresh {
      overflow:scroll;
      height: 100%;
  }
.van-swipe-cell__wrapper{
    margin-top: 15px;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
}
.van-swipe-cell{
    width: 100%;
     &__right {
      color: white;
      margin-left: 2px;
      font-size: 16px;
      width: 65px;
      height: 44px;
      display: inline-block;
      text-align: center;
      line-height: 35px;
      background-color: red;
    }
}

.van-cell{
    padding: 0px 0px;
}

.list-Padding{
    padding: 0px 15px 10px 15px;
}

.van-cell:not(:last-child)::after {
    border-bottom: 0px;
}

.van-list__finished-text{
    background: white;
    height: 30px;
    line-height: 25px;
    border-bottom: 8px dashed  #BEBECA;
}
.van-list__loading{
    background: white;
    height: 40px;
    line-height: 0px;
    border-bottom: 8px dashed  #BEBECA;
}
.van-list{
    background: white;
}
}
.animanSpecial{
     position:relative;
     animation:mymove 3s linear;
     -webkit-animation:mymove 3s linear; /*Safari and Chrome*/
}
.fontSmallSize{
    font-weight: bold;
}

.specialalign {
    justify-content: flex-end;
}
@keyframes mymove
{
    from {top:var(--Aheight);}
    to {top:0px;}
}

@-webkit-keyframes mymove /*Safari and Chrome*/
{
    from {top:var(--Aheight);}
    to {top:-0px;}
}
.van-popup {
    &--right {
        background: #BEBECA;
      width: 100%;
      height: 100%;
    }
}
</style>
