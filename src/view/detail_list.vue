<template>
    <!--m-content start-->
    <div>
        <ul v-infinite-scroll="loadMore()" infinite-scroll-disabled="allDone" infinite-scroll-distance="10" class="wz-detail-list">
            <li class="wz-dlist" v-for="item of list" track-by="$index" v-link="'/playSpecial/0/'+item.id" v-lazy:background-image="item.img">
                <div class="wz-list-text">
                    <div class="wz-list-title">{{item.title1}}</div>
                    <div class="wz-list-explain">{{item.explain}}</div>
                </div>
                <div v-if="false" class="wz-list-mask"></div>
                <div class="wz-shoucang">
                    <img v-show="item.is_collection" @click.stop="userUncollection(item.id,$index)" class="wz-shoucang-img" src="./../images/collectioned.png" alt="">
                    <img v-show="!item.is_collection" @click.stop="userCollection(item.id,$index)" class="wz-shoucang-img" src="./../images/collection.png" alt="">
                    <span class="wz-collection">{{item.zan | largeNum}}</span>
                </div>
            </li>
        </ul>
        <div class="no-more wz-list-no-more">已经全部加载完成</div>   
    </div>
    
    <!--m-content end-->
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    export default {
        data() {
            return {
                id: 0,
                type: 2,
                detail: {},
                list: [],
                page: 1,
                allPage: 1,
                allDone: false,
                is_subscribe: 0
            }
        },
        filters: {
            largeNum: function(value){
                if(parseInt(value) >= 10000){
                    var _v = value/10000;
                    return _v.toFixed(1) + '万';
                }else{
                    return value;
                }
            }
        },
        route: {
            activate: function(transition) {
                var $this = this;
                // console.log(id);
                this.$vux.loading.show({
                    text: '加载中...'
                })
                //$this.getDetail();
                //$this.userHistory();
                transition.next();
            }
        },
        methods: {
            loadMore: function(event) {
                var $this = this;
                if ($this.page > $this.allPage) {
                    $this.allDone = true;
                } else {
                    $.ajax({
                        url: $ApiConf.api_specialList,
                        data: {
                            "page": $this.page,
                            "page_num": 10,
                            "token": $this.token
                        },
                        type: "POST",
                        dataType: "json",
                        success: function(res) {
                            
                            res.data.special_list.forEach(function(arg){
                                var _value = 'detail_list' + arg.id;
                                if($this.$am.getCookie(_value) == 1){
                                    arg.is_collection = true;
                                }else{
                                    arg.is_collection = false;
                                }
                            });
                            $this.list = $this.list.concat(res.data.special_list);
                            $this.allPage = res.data.page_num;
                            $this.page = $this.page + 1;
                            if ($this.page > $this.allPage) {
                                $this.allDone = true;
                            }
                            document.title = '专题列表';
                            $this.$vux.loading.hide();
                        }
                    });
                }
            },
            userCollection: function(id,index) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_do_zan,
                    data: {
                        "id": id,
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        if (!res.code) {
                            Toast({
                                message: '收藏成功',
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-success'
                            });
                            $this.list[index].is_collection = 1;
                            document.cookie = 'detail_list'+id + '=' + 1;
                            $this.list[index].zan++;
                        } else {
                            console.log(res.msg);
                        }
                    }
                });
            },
            userUncollection: function(id,index) {
                var $this = this;
                $this.list[index].is_collection = 0;
                document.cookie = 'detail_list'+id + '=' + 0;
                $this.list[index].zan = $this.list[index].zan - 1 > 0 ? $this.list[index].zan - 1 : 0;
                Toast({
                    message: '取消收藏成功',
                    duration: 1500,
                    iconClass: 'mint-toast-icon mintui mintui-success'
                });
            },
            userHistory: function(event) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_driedfood_click,
                    data: {
                        "dried_food_id": $this.id,
                        "token": $this.token
                    },
                    type: "POST",
                    success: function(res) {
                        console.log(res.msg);
                    }
                });
            },
            getBgImg(url) {
                if (url) {
                    return "background-image:url(" + url + ")";
                } else {
                    return "";
                }
            }
        }
    };
</script>

