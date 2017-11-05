<template>
    <!--m-content start-->
    <div class="m-content">
        <div v-show="!isShowPPT" class="wz-bofang-title-box" style="border-bottom: none">
            <div class="wz-bf-title">{{detail.entity.explain}}</div><span v-show="ablumId != 29" class="wz-state" @click="togglePPT"><span v-show="isShowPPT" class="wz-btn">关闭</span><span v-show="!isShowPPT" class="wz-btn wz-kaiqi">开启</span>PPT</span>
        </div>
        <div class="play-detail">
            <!-- swiper start -->
            <div v-show="isShowPPT" class="swiper">
                <div class="swiper-wrapper" @click="hideMusicInfo">
                    <div class="swiper-slide" v-for="item of ppts" track-by="$index">
                        <div class="avatar" :style="getBgImg(item.path)"></div>
                    </div>
                </div>
                <!-- Add Pagination -->
            </div>
            <!-- swiper end -->
            <div v-show="!isShowPPT" class="singleIMG">
                
                <div class="singleBox" :class="{'singleEight':ablumId == 29}">
                    <img v-if="ablumId == 29" :src="img" class="eight">
                    <img v-else :src="img">
                </div>                
            </div>
            <div class="try" v-if="tryFlag && !isHideMusicInfo">您可试听{{detail.entity.min_free_duration}}</div>
            <div class="content " :class="{'no-PPT-content':!isShowPPT}" v-show="!isHideMusicInfo">
                <div class="time now">{{nowTimes}}</div>
                <div v-show="isShowPPT" class="title">主讲：{{detail.entity.speakers}}</div>
                <div class="time end">{{detail.entity.min_duration}}</div>
            </div>
            <div :class="{'mySlider':true,'wz':!isShowPPT}" @click="changeTime">
                <!-- <div class="buffered-amount" style="width:{{bufferedWidth}}%"></div> -->
                <div class="times" style="width:{{now/duration*100>96?'96':now/duration*100}}%">
                    <span class="u-icn icn-times"></span>
                </div>
            </div>
        </div>
        <div v-show="isShowPPT" class="wz-bofang-title-box">
            <div class="wz-bf-title">{{detail.entity.explain}}</div><span class="wz-state" @click="togglePPT"><span v-show="isShowPPT" class="wz-btn">关闭</span><span v-show="!isShowPPT" class="wz-btn wz-kaiqi">开启</span>PPT</span>
        </div>

        <!--control start-->
        <div class="control-white"></div>
        <div class="control wz-control">
            <div class="u-icn icn-store" v-if='{{false}}'></div>
            <div class="center">
                <span class="u-icn icn-left" @click="videoPrew"></span>
                <span class="u-icn icn-on" @click="fmStop" v-if="st"></span>
                <span class="u-icn icn-off" @click="fmContinue" v-else></span>
                <span class="u-icn icn-right" @click="videoNext"></span>
            </div>
            <div v-if="false" class="u-icn icn-list" @click="popOpen"></div>
        </div>
        <!--control end-->        
    </div>
    <div v-for="item in list">
        <div class="diviler my-diviler"></div>
        <dl class="wz-audio-component">
            <dt>{{item.title}} <span class="shuxian">|</span> <span>{{item.tinyTitle}}</span></dt>
            <dd @click="play(ite.dried_food_video_id,ite.dried_food_id)" v-for="ite in item.list">
                <div :class="{'active':ite.dried_food_video_id == playId}" class="wz-title">{{ite.explain || ite.title}}</div>
                <div class="flex-wrap">
                    <div v-if="ite.tag | hasTag || ite.dried_food_id == 29" class="flex-con">{{ite.update_time | Timer}}</div>
                    <div v-else class="flex-con"><span class="tag1">{{ite.tag[0].tagname}}</span></div>
                    <div class="flex-con"><i class="u-icn icn-view"></i>{{ite.play_times}}人</div>
                    <div class="flex-con"><i class="u-icn icn-time"></i>{{ite.min_duration}}</div>
                </div>
            </dd>
        </dl>
    </div>
    <!--m-content end-->
    <div class="wz-tohome">
        <img src="./../images/home.png" alt=""><br>首页{{plll}}
    </div>
    <div v-if="false" class="wz-col-box">
        <div @click="collection" class="wz-col"><img v-show="is_collection" src="./../images/collectioned.png"><img v-show="!is_collection" src="./../images/collection.png"><span>{{detail.entity.collection}}</span></div>
        <div @click="subscribe" class="wz-col"><img v-show="is_subscribe" src="./../images/subscribed.png"><img v-show="!is_subscribe" src="./../images/subscribe.png"><span><span v-show="is_subscribe">已</span>订阅</span></div>
    </div>

    <div class="wz-bottom-50"></div>
</template>

<script>
    // import Comment from "./component/comment";
    import Swiper from "../js/swiper.min.js";
    import { Toast, MessageBox } from 'mint-ui';
    export default {
        data() {
            return {
                id: 0,
                playId:0,
                detail: null,
                video_list: [],
                list:[],
                page: 1,
                allPage: 1,
                allDone: false,
                comment: [],
                is_collection: 0,
                is_subscribe: 0,
                video_url: "",
                recommends: [],
                now: 0,
                duration: 1,
                bg_img: "",
                st: true,
                ppts: [],
                ppt: {},
                nowTimes: "00:00",
                comment_list: [],
                ablumId: 0,
                popShow: false,
                video_index: 0,
                commentFlag: false,
                comment_form_value: "",
                is_pay: false,
                tryFlag: true,
                musicContinue: false,
                now_ppt: 0,
                isHideMusicInfo: false,
                tryDig: true,
                isTouchMoving: false,
                alertFlag: false,
                is_record: true,
                begin_loading_time: 0,
                end_loading_time: 0,
                img:'',
                isShowPPT: true,
                play_video_id:0,
                new_video_list:[],
                specialId:'',
                mySrc: ''
                // bufferedWidth: 0,
            }
        },
        route: {
            activate: function(transition) {
                var $this = this;
                var id = $this.$route.params.id;
                var play_video_id = $this.$route.params.type;
                window.scrollTo(0,0);
                if(id == 0){
                    $this.isShowPPT = false;
                }
                if ((id == 0) || id) {
                    $this.id = id;//专栏id，当是0时是早八点
                    $this.specialId = id;
                    $this.play_video_id = play_video_id;

                    $this.getSpecial();
                    //$this.userHistory();记录新专栏点击应该要新街口
                    $this.$dispatch("userMusicHidden");
                    transition.next();
                } else {
                    Toast({
                        message: '无法获取到ID',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    history.go(-1);
                }
            },
            deactivate: function(transition) {
                var $this = this;
                $this.$dispatch("userMusicShow");
                $this.saveUserPlay($this.now);
                transition.next();
            }
        },
        filters:{
            hasTag:function(value){
                return !Boolean(value.length);
            },
            Timer:function(date){
                        //获取js 时间戳
                var time=new Date().getTime();
                //去掉 js 时间戳后三位，与php 时间戳保持一致
                time=parseInt((time-date*1000)/1000);
                //存储转换值
                var s;
                if(time<60*10){//十分钟内
                    return '刚刚';
                }else if((time<60*60)&&(time>=60*1)){
                    //超过十分钟少于1小时
                    s = Math.floor(time/60);
                    return  s+"分钟前";
                }else if((time<60*60*24)&&(time>=60*60)){
                    //超过1小时少于24小时
                    s = Math.floor(time/60/60);
                    return  s+"小时前";
                }else if((time<60*60*24*3)&&(time>=60*60*24)){
                    //超过1天少于3天内
                    s = Math.floor(time/60/60/24);
                    return s+"天前";
                }else{
                    //超过3天
                    var date= new Date(parseInt(date) * 1000);
                    //return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
                    return (date.getMonth()+1)+"-"+date.getDate();
                }
            }
        },
        ready: function() {
            var $this = this;
            var $slider = $(".mySlider"),
                $sliderHandler = $('.icn-times'),
                $sliderTimes = $('.times');
            var totalLen = $(".mySlider").width();
            var dist,
                percent,
                times;
            document.querySelector('.wz-tohome').addEventListener('touchstart',function(e){
                e.stopPropagation();
                $this.$router.go('/');
            })

            
            if(document.querySelector('.wz-control')){
                var dom = document.querySelector('.wz-control');
                var _scroll = dom.offsetTop;
                window.onscroll = function(){
                    if(this.scrollY > _scroll){
                        // dom.style.position = 'fixed';
                        // dom.style.width = '100%';
                        // dom.style.left = 0;
                        // dom.style.top = 0;
                        dom.style = 'position:fixed;width:100%;left:0;top:0;background-color:#fff;z-index:100;box-shadow:5px 5px;box-shadow: 0 0 10px 0px rgba(155,143,143,0.6);-webkit-box-shadow: 0 0 10px 0px rgba(155,143,143,0.6);-moz-box-shadow: 0 0 10px 0px rgba(155,143,143,0.6);'
                    }else{
                        dom.style = '';
                    }
                }
            }


            //评论输入框定位
            // $('.words').bind('focus', function() {
            //     $('.pop-comment').addClass('pop-comment-fix');
            // });
            // $('.words').bind('blur', function() {
            //     $('.pop-comment').removeClass('pop-comment-fix');
            // });

            // myAudio.addEventListener('progress', function() {
            //     var duration =  myAudio.duration;
            //     if (duration > 0) {
            //         for (var i = 0; i < myAudio.buffered.length; i++) {
            //             if (myAudio.buffered.start(myAudio.buffered.length - 1 - i) < myAudio.currentTime) {
            //                 $this.bufferedWidth = (myAudio.buffered.end(myAudio.buffered.length - 1 - i) / duration) * 100;
            //                 break;
            //             }
            //         }
            //     }
            // })

            $slider.on('touchstart', function(e) {
            }).on('touchmove', function(e) {
                //禁止默认事件
                e.preventDefault();

                dist = e.changedTouches[0].clientX;
                dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
                percent = parseInt(dist / totalLen * 100);
                times = Math.floor($this.duration * percent / 100);

                if ($sliderHandler[0] == e.target) {
                    $sliderTimes.css('width', percent + '%');
                    $this.now = times;
                }
            }).on('touchend', function(e) {
                if ($sliderHandler[0] == e.target) {
                    $this.$vux.loading.show({
						text: '加载中..'
					})

					dist = e.changedTouches[0].clientX;
					dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
					percent = parseInt(dist / totalLen * 100);
					times = Math.floor($this.duration * percent / 100);

                    if (times >= 0) {
	                	if (!$this.is_pay && times >= $this.detail.entity.free_duration && $this.detail.entity.price > 0) {
	                		$this.now = $this.detail.entity.free_duration;
	                		$this.userMusicSeek($this.detail.entity.free_duration);
	                	} else {
	                		$sliderTimes.css('width', percent + '%');
							$this.now = times;
	                    	$this.userMusicSeek(times);
	                	}
	                }

                    setTimeout(function() {
                        $this.$vux.loading.hide();
                    }, 500)
                }
            });
        },
        methods: {
            getLessonId: function(item) {
                return item.mid || item.dried_food_id
            },
            togglePPT: function(){
                this.isShowPPT = !this.isShowPPT;
                this.isHideMusicInfo = false;
            },
            play: function(id,ablumId,playlist){
                var $this = this;
                
                if(id == $this.playId){
                    return;
                }
                $this.$vux.loading.show({
                    text: '加载中..'
                })
                $this.saveUserPlay($this.now);
                $this.$dispatch('getPlayInfo',id,ablumId,$this.new_video_list,$this.specialId);
            },
            getSpecial: function(){
                var $this = this;
                if($this.id == 0){
                    var data = {
                        "token": $this.token
                    }
                }else{
                    var data = {
                        "token": $this.token,
                        "tid": $this.id
                    }
                }
                if($this.id == 0){
                    var url = $ApiConf.api_special_eight;
                }else{
                    var url = $ApiConf.api_special
                }
                $.ajax({
                    url: url,
                    data: data,
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        $this.list = res.data;
                        $this.$dispatch("userMusicHidden");
                        $this.list.forEach(function(arg,index){
                            if(!arg.title){
                                $this.list.splice(index,1);
                            }                          
                        })
                        $this.list.forEach(function(arg){
                            $this.new_video_list = $this.new_video_list.concat(arg.list);
                        })
                        //构造新的播放列表,因为数据绑定，造成循环的时候数据乱掉，删除元素后list立即变少，造成后续的元素就不执行了
                        if($this.id == 0){
                            var _abl = 29;
                        }else{
                            var _abl = $this.list[0].list[0].dried_food_id;
                        }

                        if($this.play_video_id == 0){
                           $this.$dispatch("getPlayInfo",$this.list[0].list[0].dried_food_video_id,_abl,$this.new_video_list,$this.specialId); 
                        }else{
                            $this.$dispatch("getPlayInfo",$this.play_video_id,_abl,$this.new_video_list,$this.specialId); 
                        }
                        
                    }
                })
            },
            loadMore: function(event) {
                return;
                var $this = this;
                if ($this.page > $this.allPage) {
                    $this.allDone = true;
                } else {
                    $.ajax({
                        url: $ApiConf.api_driedfood_video_detail,
                        data: {
                            "page": $this.page,
                            "page_num": 10,
                            "dried_food_video_id": $this.id,
                            "token": $this.token
                        },
                        type: "POST",
                        dataType: "json",
                        success: function(res) {
                            $this.comment_list = $this.comment_list.concat(res.data.comment_list.data_list);
                            $this.allPage = res.data.comment_list.page_num;
                            $this.page = $this.page + 1;
                            if ($this.page > $this.allPage) {
                                $this.allDone = true;
                            }
                        }
                    });
                }
            },
            userHistory: function(event) {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_driedfood_play,
                    data: {
                        "dried_food_video_id": $this.play_video_id,
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        console.log("点击记录成功!");
                    }
                });
            },
            saveUserPlay: function(time) {
                var $this = this;
                if(time < 60) {
                    time = 0;
                }
                $.ajax({
                    url: $ApiConf.api_driedfood_video_play,
                    data: {
                        "dried_food_video_id": $this.id,
                        "token": $this.token,
                        "dried_food_id": $this.ablumId,
                        "time": time
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        console.log("记录时间点成功!");
                    }
                });
            },
            fmPlay: function(times) {
                return;
                var $this = this;
                var playStatus = {
                    id: $this.id,
                    title: $this.detail.entity.title,
                    bg: $this.detail.entity.img,
                    url: $this.detail.entity.video_url,
                    notPlay: true
                };
                document.getElementById('audioPlay').setAttribute('data-id',$this.id);
                $this.$dispatch("userPlayMusic", playStatus);

				if ($this.video_url == $this.mySrc) {
                    $this.now = myAudio.currentTime;
                    myAudio.play();
                    $this.$dispatch("userPlayMusicStatus");                    
				} else {
					if (!myAudio) {
						window.myAudio = document.getElementById('audioPlay');
					}
					if (!$this.tryDig) {
						return false;
					}

					myAudio.onloadeddata = function() {
						try {
							myAudio.currentTime = times;
						} catch (err) {
							console.warn(err);
						}
						myAudio.play();
						$this.$dispatch("userPlayMusicStatus");
						$this.saveUserPlay(times);
					}
				}
                myAudio.ontimeupdate = function() {                    
                    var time = myAudio.currentTime;
                    if(($this.now == Math.floor(time)) && ($this.now != 0)){
                        return;
                    }
                    $this.now = Math.floor(time);
                    $this.getTimeStr(time);
                    myAudio.onplaying = function() {
                        $this.st = true;
                        $this.$dispatch("userPlayMusicStatus");
                    };
                    myAudio.onpause = function() {
                        $this.st = false;
                        $this.$dispatch("userStopMusicStatus");
                        $this.saveUserPlay($this.now);
                    };
                    $this.canUserTry($this.now);
                    try {
                        if (!$this.isTouchMoving) {
                            var ppts = $this.ppts;
                            for (var i = 0; i < ppts.length; i++) {
                                if ($this.now > ppts[ppts.length - 1].time) {
                                    swiper.slideTo(ppts.length - 1);
                                    $this.now_ppt = ppts.length - 1;
                                    return false;
                                }
                                if ($this.now < ppts[0].time) {
                                    swiper.slideTo(0);
                                    $this.now_ppt = 0;
                                    return false;
                                }
                                if (ppts[i].time <= $this.now && $this.now < ppts[i + 1].time) {
									swiper.slideTo(i);
									$this.now_ppt = i;
									return false;
                                }
                            }
                        }
                    } catch (error) {}
                };
            },
            fmStop: function(event) {
                var $this = this;
                $this.$dispatch("userStopMusicStatus");
            },
            getTimeStr: function(nowTime) {
                var $this = this;
                var times = "",
                    now = Math.round(nowTime || 0);
                var min = Math.floor(now / 60);
                var second = now % 60;
                times = (min > 9 ? min : '0' + min) + ":" + (second > 9 ? second : '0' + second);
                $this.nowTimes = times;
            },
            fmContinue: function(event) {
                var $this = this;
                $this.$dispatch("userContinue");
                return;
                if ($this.tryDig) {
                    $this.$dispatch("userPlayMusicStatus");
                } else {
                    MessageBox.confirm('免费试听结束，支付' + $this.detail.entity.price + '邦币可畅听整个课程!')
                        .then(function() {
                            $this.userSubscribe();
                            $this.$dispatch('emitUserSubscribe');
                        }).catch(err => {
                            $this.tryDig = true;
                            $this.$dispatch('setTryDig',true);
                        });
                }
            },
            changeTime: function(e) {
                var $this = this;
                var $sliderTimes = $('.times');
                var totalLen = $(".mySlider").width();
                var dist = e.clientX,
                    percent,
                    times;

                $this.$vux.loading.show({
					text: '加载中...'
				})
                dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
                percent = parseInt(dist / totalLen * 100);
                if(!$this.isShowPPT){
                    percent-=5;
                }
                times = Math.floor($this.duration * percent / 100);

                if (times >= 0) {
                	if (!$this.is_pay && times >= $this.detail.entity.free_duration && $this.detail.entity.price > 0) {
                		$this.now = $this.detail.entity.free_duration;
                		$this.userMusicSeek($this.detail.entity.free_duration);
                	} else {
                		$sliderTimes.css('width', percent + '%');
						$this.now = times;
                    	$this.userMusicSeek(times);
                	}
                }
                setTimeout(function() {
                    $this.$vux.loading.hide();
                }, 500)
            },
            videoPrew: function() {
                this.$dispatch('playVideoPrew');
            },
            videoNext: function() {
                this.$dispatch('playVideoNext');
            },
            userMusicSeek: function(times) {
                var $this = this;
                $this.$dispatch('tryUserMusicSeek',times);
            },
            userSubscribe: function() {
                return
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_buyDriedFood,
                    data: {
                        "token": $this.token,
                        "dried_food_id": $this.ablumId
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
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
                                        $this.tryDig = true;
                                        $this.getDetail();
                                        $this.userHistory();
                                        myAudio.play();
                                    },
                                    fail: function() {
                                        Toast({
                                            message: '充值取消',
                                            duration: 1500,
                                            iconClass: 'mint-toast-icon mintui mintui-field-error'
                                        });
                                        return false;
                                    }
                                });
                            } else {
                                Toast({
                                    message: '订阅成功',
                                    duration: 1500,
                                    iconClass: 'mint-toast-icon mintui mintui-success'
                                });
                                $this.tryDig = true;
                                $this.getDetail();
                                $this.userHistory();
                                myAudio.play();
                            }
                        } else {
                            Toast({
                                message: res.msg,
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-field-warning'
                            });
                        }
                    }
                });
            },
            subscribe:function(){
                return;
                var $this = this;

                if(!$this.is_subscribe){
                    $this.userSubscribe();
                }
            },
            canUserTry: function(times) {
                return
                var $this = this;
                times = times || 0;
                //没有支付 && 超过免费试听时间
                if (!$this.is_pay && times >= $this.detail.entity.free_duration && $this.detail.entity.price > 0) {
                    if (!myAudio) {
                        window.myAudio = document.getElementById('audioPlay');
                    }
                    myAudio.pause();
                    $this.now = $this.detail.entity.free_duration;
                    $this.userMusicSeek($this.detail.entity.free_duration);
                    $this.$dispatch("userStopMusicStatus");

                    if ($this.tryDig) {
                        $this.tryDig = false;
                    }
                    if (!$this.alertFlag) {
                        $this.alertFlag = true;
                        MessageBox.confirm('免费试听结束，支付' + $this.detail.entity.price + '邦币可畅听整个课程!')
                            .then(function() {
                                $this.userSubscribe();
                            }).catch(err => {
                                $this.tryDig = true;
                            });
                    } else {
                        setTimeout(function() {
                            $this.alertFlag = false;
                        }, 2000);
                    }
                }
            },
            hideMusicInfo: function(event) {
                var $this = this;
                if ($this.isHideMusicInfo) {
                    $this.isHideMusicInfo = false;
                } else {
                    $this.isHideMusicInfo = true;
                }
            },
            getBgImg: function(url) {
                if (url) {
                    return "background-image:url(" + url + ")";
                } else {
                    return "";
                }
            }
        },
        events: {
            'tryFlagStatus': function(boo){
                this.tryFlag = boo;
            },
            'videoInfo': function(data){
                console.log(data);
                var $this = this;
                $this.detail = data;
                $this.id = data.entity.dried_food_video_id;
                $this.ablumId = data.entity.dried_food_id;
                $this.img = data.entity.img
                // $this.comment = data.comment_list;
                // $this.comment_list = data.comment_list.data_list;
                // $this.recommends = data.recommends;
                $this.bg_img = data.entity.images[0].path;
                $this.is_pay = data.entity.is_pay;
                $this.duration = data.entity.duration;
                $this.video_url = data.entity.video_url;
                $this.is_collection = data.entity.is_collection;
                // $this.allPage = data.comment_list.page_num;
                // $this.page = $this.page + 1;
                $this.video_list = data.video_list;
                document.title = data.entity.title;
                //ppts
                var ppts = data.entity.images,
                    ppt = {};
                for (var i = 0; i < ppts.length; i++) {
                    var item = ppts[i];
                    ppt[item.time] = item.path;
                }
                $this.ppt = ppt;
                $this.ppts = ppts;
                setTimeout(function() {
                    window.swiper = new Swiper('.swiper', {
                        autoplayDisableOnInteraction: false,
                        lazyLoading: true,
                        onSlideNextEnd: function(obj) {
                            if ($this.now_ppt < ppts.length - 1 && $this.isTouchMoving) {
                                if (ppts[$this.now_ppt + 1].time > $this.detail.entity.free_duration && $this.tryFlag) {
                                    MessageBox.confirm('免费试听结束，支付' + $this.detail.entity.price + '邦币可畅听整个课程!')
                                        .then(function() {
                                            //$this.userSubscribe();
                                            $this.$dispatch('emitUserSubscribe');
                                        }).catch(err => {
                                            // $this.tryDig = true;
                                            $this.$dispatch('setTryDig',true);
                                        });
                                } else {
                                    $this.userMusicSeek(ppts[$this.now_ppt + 1].time + 1);
                                    if($this.now_ppt>=ppts.length-1){
                                        $this.now_ppt = ppts.length-1
                                    }else{
                                       $this.now_ppt++; 
                                    }
                                    $this.isTouchMoving = false;
                                }
                            }
                        },
                        onSlidePrevEnd: function(obj) {
                            if ($this.now_ppt > 0 && $this.isTouchMoving) {
                                $this.userMusicSeek(ppts[$this.now_ppt - 1].time+1);
                                if($this.now_ppt >0){
                                    $this.now_ppt--;
                                }else{
                                    $this.now_ppt = 0;
                                }
                                    $this.isTouchMoving = false;      
                            }
                        },
                        onTouchStart: function() {
                                $this.isTouchMoving = true;                            
                        }
                    });
                }, 500);
            },
            'nowTime': function(time,now){
                var $this = this;
                $this.nowTimes = time;
                $this.now = now
                try {
                    if (!$this.isTouchMoving) {
                        var ppts = $this.ppts;
                        for (var i = 0; i < ppts.length; i++) {
                            if ($this.now > ppts[ppts.length - 1].time) {
                                swiper.slideTo(ppts.length - 1);
                                $this.now_ppt = ppts.length - 1;
                                return false;
                            }
                            if ($this.now < ppts[0].time) {
                                swiper.slideTo(0);
                                $this.now_ppt = 0;
                                return false;
                            }
                            if (ppts[i].time <= $this.now && $this.now < ppts[i + 1].time) {
                                swiper.slideTo(i);
                                $this.now_ppt = i;
                                return false;
                            }
                        }
                    }
                } catch (error) {}
            },
            'playMusicStatus':function(){
                this.st = true;
            },
            'stopMusicStatus':function(){
                this.st = false;
            },
            'playMusic': function(id){
                this.playId = id;
            }
        }
    };
</script>
