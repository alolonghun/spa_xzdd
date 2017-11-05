<template>
    <!--m-content start-->
    <div class="m-content">
        <div class="lesson-detail" :style="getBgImg(detail.entity.bg_img)" v-if="type==2 || type=='gh'">
            <div class="avatar" :style="getBgImg(detail.entity.img)">
            </div>
            <div class="title">{{detail.entity.title}}</div>
            <div class="action">
                <div class="em">
                    <span class="u-icn icn-play"></span>{{detail.entity.play_times}}</div>
                <div class="em">
                    <span class="u-icn icn-star"></span>{{detail.entity.collection}}次</div>
            </div>
            <div class="price">
                <span>专题：{{detail.entity.price}}邦币</span>
                <span>邦友：{{detail.entity.vip_price}}邦币</span>
            </div>
        </div>
        <div class="lesson-detail" :style="getBgImg(detail.entity.bg_img)" v-if="type==1 || type=='dk'">
            <div class="content">
                <div class="em"><span class="u-icn icn-collect-white"></span>{{detail.entity.subscribe}}</div>
                <div class="em"><span class="u-icn icn-star-white"></span>{{detail.entity.collection}}</div>
                <div class="play">已播放{{detail.entity.play_times}}次</div>
            </div>
        </div>
        <div class="detail-title" v-if="type==1 || type=='dk'">
            <div class="title">{{detail.entity.title}}</div>
            <div class="dec"><span class="txt">专题: {{detail.entity.price}}邦币/年</span><span class="txt">邦友: {{detail.entity.vip_price}}邦币/年</span></div>
        </div>
        <!--btns-group start-->
        <div class="btns-group">
            <div class="u-btn success" v-if='is_subscribe'>
                <span class="u-icn icn-collect-white"></span>
                <span>订阅成功</span>
            </div>
            <div class="u-btn" v-else @click="userSubscribe">
                <span class="u-icn icn-collect-white"></span>
                <span>点击订阅</span>
            </div>
            <div class="u-btn success" v-if='is_collection' @click="userUncollection">
                <span class="u-icn icn-star-white"></span>
                <span>收藏成功</span>
            </div>
            <div class="u-btn" v-else @click="userCollection">
                <span class="u-icn icn-star-white"></span>
                <span>点击收藏</span>
            </div>
        </div>
        <!--btns-group end-->
        <!--u-tabs start-->
        <div class="detail-tabs">
            <span class="tab {{showInfo?'active':''}}" @click="showInfoTab">详情</span>
            <span class="tab {{showList?'active':''}}" @click="showListTab">干货List </span>
            <span class="tab {{showJudge?'active':''}}" @click="showJudgeTab">评论({{detail.comment_list.count_num}})</span>
        </div>
        <!--u-tabs end-->
        <!--tab-section start-->
        <div class="tab-section" v-if="showInfo">
            <div class="section-intro">
                <div class="title">内容简介</div>
                <div class="dec">
                    {{detail.entity.intro}}
                </div>
            </div>
            <div class="diviler"></div>
            <div class="section-author">
                <div class="info">
                    <div class="title">主讲嘉宾介绍</div>
                    <div class="author">
                        <div class="avatar" :style="getBgImg(detail.entity.speaker_img)">
                        </div>
                        <span class="name">{{detail.entity.speaker_name}}</span>
                    </div>
                </div>
                <div class="dec">
                    {{detail.entity.speaker_intro}}
                </div>
            </div>
        </div>
        <!--tab-section end-->
        <!--tab-section start-->
        <div class="tab-section" v-if="showList">
            <!--m-lesson start-->
            <ul class="lesson-detail-list">
                <li @click="LinkTo(item.dried_food_video_id)" class="item" v-for="item of video_list" track-by="$index">
                    <div class="avatar" :style="getBgImg(item.img)">
                        <i class="u-icn icn-radio"></i>
                    </div>
                    <div class="info">
                        <div class="title">{{item.title}}</div>
                        <div class="dec">{{item.explain}}</div>
                    </div>
                    <div class="action">
                        <div class="em">
                            <span class="u-icn icn-view"></span>{{item.play_times}}</div>
                        <div class="em">
                            <span class="u-icn icn-time"></span>{{item.duration}}</div>
                    </div>
                    <span class="badge" v-if="{{item.update_status}}">更新</span>
                </li>
                <div class="no-more">已经全部加载完成</div>
            </ul>
        </div>
        <!--tab-section end-->
        <!--tab-section start-->
        <div class="tab-section" v-if="showJudge">
            <div class="m-judge">
                <div class="u-title" v-if="!allDone">
                    热门评论
                </div>
                <ul class="judge-list">
                    <comment :comment_list.sync="comment"></comment>
                </ul>
            </div>
            <div class="link-more" v-if="!allDone" @click="loadMore">点击查看更多留言</div>
            <div class="no-more" v-if="allDone">已经全部加载完成</div>
        </div>
        <!--tab-section end-->
    </div>
    <!--m-content end-->
</template>

<script>
    import Comment from "./component/comment";
    import { Toast, Indicator } from 'mint-ui';
    export default {
        components: {
            Comment
        },
        data() {
            return {
                showInfo: false,
                showList: true,
                showJudge: false,
                id: 0,
                type: 2,
                detail: {},
                video_list: [],
                page: 1,
                allPage: 1,
                allDone: false,
                comment: [],
                is_collection: 0,
                is_subscribe: 0
            }
        },
        route: {
            activate: function(transition) {
                var $this = this;
                var id = $this.$route.params.id;
                var type = $this.$route.params.type;
                // console.log(id);
                this.$vux.loading.show({
                    text: '加载中...'
                })
                if (id && type) {
                    $this.id = id;
                    $this.type = type;
                    $this.getDetail();
                    $this.userHistory();
                    transition.next();
                } else {
                    Toast({
                        message: '无法获取到ID',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    history.go(-1);
                }
            }
        },
        methods: {
            LinkTo: function(id){
                this.$router.go('/play/'+this.id+'/'+id);
            },
            showInfoTab: function(e) {
                this.showInfo = true;
                this.showList = false;
                this.showJudge = false;
            },
            showListTab: function(e) {
                this.showInfo = false;
                this.showList = true;
                this.showJudge = false;
            },
            showJudgeTab: function(e) {
                this.showInfo = false;
                this.showList = false;
                this.showJudge = true;
                this.loadMore();
            },
            getDetail: function() {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_driedfood_detail,
                    data: {
                        "token": $this.token,
                        "dried_food_id": $this.id
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                        if (!res.code) {
                            $this.detail = res.data;
                            $this.video_list = res.data.video_list;
                            $this.is_subscribe = res.data.entity.is_subscribe;
                            $this.is_collection = res.data.entity.is_collection;
                            document.title = res.data.entity.title;
                            $this.$nextTick(() => {
                                window.scrollTo(0, 1)
                                window.scrollTo(0, 0)
                            })
                            //微信初始化
                            $.ajax({
                                url: $ApiConf.api_getUrlConfig,
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    url: window.location.href.substring(0, window.location.href.lastIndexOf('#'))
                                },
                                success: function(data) {
                                    if (data && data.code == 0) {
                                        $this.$am.WXConfigInit(data.data, $this.detail.entity.title, $this.detail.entity.explain, $this.detail.entity.img);
                                    } else {
                                        console.log(data.msg);
                                    }
                                }
                            });
                        } else {
                            Toast({
                                message: res.msg,
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-field-warning'
                            });
                        }
                        $this.$vux.loading.hide();
                    }
                })
            },
            getLessonId: function(item) {
                return item.dried_food_video_id
            },
            loadMore: function(event) {
                var $this = this;
                if ($this.page > $this.allPage) {
                    $this.allDone = true;
                } else {
                    $.ajax({
                        url: $ApiConf.api_driedfood_comment_list,
                        data: {
                            "page": $this.page,
                            "page_num": 10,
                            "dried_food_id": $this.id,
                            "token": $this.token
                        },
                        type: "POST",
                        dataType: "json",
                        success: function(res) {
                            $this.comment = $this.comment.concat(res.data.data_list);
                            $this.allPage = res.data.page_num;
                            $this.page = $this.page + 1;
                            if ($this.page > $this.allPage) {
                                $this.allDone = true;
                            }
                        }
                    });
                }
            },
            userCollection: function(event) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_collection,
                    data: {
                        "mid": $this.id,
                        "type": 2,
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
                            $this.is_collection = 1;
                        } else {
                            console.log(res.msg);
                        }
                    }
                });
            },
            userSubscribe: function(event) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_buyDriedFood,
                    data: {
                        "token": $this.token,
                        "dried_food_id": $this.detail.entity.dried_food_id
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                        if (!res.code) {
                            if (res.data !== true) {
                                var payData = res.data;
                                wx.chooseWXPay({
                                    timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                    nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                    signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: payData.paySign, // 支付签名
                                    success: function(res) {
                                        Toast({
                                            message: '订阅成功',
                                            duration: 1500,
                                            iconClass: 'mint-toast-icon mintui mintui-success'
                                        });
                                        $this.is_subscribe = 1;
                                    },
                                    fail: function() {
                                        Toast({
                                            message: '充值取消',
                                            duration: 1500,
                                            iconClass: 'mint-toast-icon mintui mintui-field-error'
                                        });
                                    }
                                });
                            } else {
                                Toast({
                                    message: '订阅成功',
                                    duration: 1500,
                                    iconClass: 'mint-toast-icon mintui mintui-success'
                                });
                                $this.is_subscribe = 1;
                            }
                        } else {
                            Toast({
                                message: '订阅成功',
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-success'
                            });
                        }
                    }
                });
            },
            userUncollection: function(event) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_uncollection,
                    data: {
                        "mid": $this.id,
                        "type": 2,
                        "token": $this.token
                    },
                    type: "POST",
                    success: function(res) {
                        if (!res.code) {
                            Toast({
                                message: '取消收藏成功',
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-success'
                            });
                            $this.is_collection = 0;
                        } else {
                            console.log(res.msg);
                        }
                    }
                });
            },
            userUnsubscribe: function(event) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_unsubscribe,
                    data: {
                        "mid": $this.id,
                        "type": 2,
                        "token": $this.token
                    },
                    type: "POST",
                    success: function(res) {
                        if (!res.code) {
                            Toast({
                                message: '取消订阅成功',
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-success'
                            });
                            $this.is_subscribe = 0;
                        } else {
                            console.log(res.msg);
                        }
                    }
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

