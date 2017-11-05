<template>
    <!--m-content start-->
    <div class="m-content">
        <div class="play-detail">
            <!-- swiper start -->
            <div class="swiper">
                <div class="swiper-wrapper" @click="hideMusicInfo">
                    <div class="swiper-slide" v-for="item of ppts" track-by="$index">
                        <div class="avatar" :style="getBgImg(item.path)"></div>
                    </div>
                </div>
                <!-- Add Pagination -->
            </div>
            <!-- swiper end -->
            <div class="try" v-if="tryFlag && !isHideMusicInfo">您可试听{{detail.entity.min_free_duration}}</div>
            <div class="content" v-if="!isHideMusicInfo">
                <div class="time now">{{nowTimes}}</div>
                <div class="title">主讲：{{detail.entity.speakers}}</div>
                <div class="time end">{{detail.entity.min_duration}}</div>
            </div>
            <div class="mySlider" @click="changeTime">
                <!-- <div class="buffered-amount" style="width:{{bufferedWidth}}%"></div> -->
                <div class="times" style="width:{{now/duration*100>96?'96':now/duration*100}}%">
                    <span class="u-icn icn-times"></span>
                </div>
            </div>
        </div>
        <!--control start-->
        <div class="control">
            <div class="u-icn icn-store" v-if='{{false}}'></div>
            <div class="center">
                <span class="u-icn icn-left" @click="videoPrew"></span>
                <span class="u-icn icn-on" @click="fmStop" v-if="st"></span>
                <span class="u-icn icn-off" @click="fmContinue" v-else></span>
                <span class="u-icn icn-right" @click="videoNext"></span>
            </div>
            <div class="u-icn icn-list" @click="popOpen"></div>
        </div>
        <!--control end-->
        <div class="detail-title">
            <div class="title">{{detail.entity.title}}</div>
            <div class="dec">
                <span class="txt">播放：{{detail.entity.play_times}}</span>
                <span class="txt">收藏：{{detail.entity.collection}}次</span>
            </div>
        </div>
        <div class="diviler"></div>
    </div>
    <!--m-content end-->
    <!--tab-section start-->
    <div class="tab-section page-detail">
        <div class="section-intro">
            <div class="title">内容简介</div>
            <div class="dec">
                {{detail.entity.intro.trim()}}
            </div>
        </div>
        <div class="diviler" v-if="recommends.length>0"></div>
        <div class="section-commend" v-if="recommends.length>0">
            <div class="u-title">
                相关推荐
            </div>
            <ul class="list">
                <li class="item" v-for="item of recommends" track-by="$index" style="background-image:url('{{item.recommend_banner}}');" v-link="'/detail/gh/'+getLessonId(item)">
                    <div class="wrap">
                        <span class="u-icn icn-video"></span>{{item.title}}
                    </div>
                </li>
            </ul>
        </div>
        <div class="diviler"></div>
        <div class="m-judge">
            <div class="u-title">
                活动留言({{comment_list.length || 0}})
            </div>
            <ul class="judge-list">
                <comment :comment_list.sync="comment_list"></comment>
            </ul>
        </div>
        <div class="no-more" v-if="allDone">已经全部加载完成</div>
        <div class="link-more" v-if="!allDone" @click="loadMore">点击查看更多留言</div>
    </div>
    <!--tab-section end-->
    <!--pop-panel start-->
    <div class="pop-panel" v-if="popShow" class="animated" transition="fade">
        <div class="video-list">
            <div v-for="item of video_list" track-by="$index" class="item" :class="item.dried_food_video_id==id?'active':''" @click="openDetail(item.dried_food_video_id,item.dried_food_id)">{{item.title}}</div>
        </div>
        <div class="close" @click="popClose">
            关闭
        </div>
    </div>
    <!--pop-panel end-->
    <!--pop-comment start-->
    <div class="pop-comment">
        <form class="myform">
            <input type="text" placeholder="优质评论将会被优先展示" class="words" v-model="comment_form_value" />
            <span class="submit" @click="userComment">发布</span>
        </form>
    </div>
    <!--pop-comment end-->
</template>

<script>
    import Comment from "./component/comment";
    import Swiper from "../js/swiper.min.js";
    import { Toast, MessageBox } from 'mint-ui';
    export default {
        components: {
            Comment
        },
        data() {
            return {
                id: 0,
                detail: null,
                video_list: [],
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
                st: false,
                ppts: [],
                ppt: {},
                nowTimes: "00:00",
                comment_list: [],
                ablumId: 0,
                popShow: false,
                video_list: [],
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
                mySrc: ''
                // bufferedWidth: 0,
            }
        },
        route: {
            activate: function(transition) {
                var $this = this;
                var id = $this.$route.params.id;
                var type = $this.$route.params.type;//栏目id
                window.scrollTo(0,0);
                if (id && type) {
                    $this.id = id;
                    $this.type = type;
                    // window.myAudio = document.getElementById('audioPlay');
                    // $this.mySrc = $("#audioPlay")[0].currentSrc;
                    // $this.begin_loading_time = Math.floor(new Date().getTime()/1000);
                    // $this.getDetail();
                    // $this.userHistory();
                    $this.$dispatch("userMusicHidden");
                    $this.$dispatch("getPlayInfo",id,type);
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
        ready: function() {
            var $this = this;
            var $slider = $(".mySlider"),
                $sliderHandler = $('.icn-times'),
                $sliderTimes = $('.times');
            var totalLen = $(".mySlider").width();
            var dist,
                percent,
                times;

            //音频开始播放的时候隐藏loading
            // myAudio.oncanplaythrough = function() {
            //     $this.$vux.loading.hide();
            //     $this.end_loading_time = Math.floor(new Date().getTime()/1000);
            //     $.ajax({
            //         url: $ApiConf.api_log,
            //         type: 'GET',
            //         data: {
            //             token: $this.token,
            //             dried_food_id: $this.ablumId,
            //             dried_food_audio_id: $this.id,
            //             begin_loading_time: $this.begin_loading_time,
            //             end_loading_time: $this.end_loading_time
            //         },
            //         success: function(res) {
            //             // console.log(res);
            //         }
            //     })
            // }

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

    //         myAudio.addEventListener("error", function(err) {
    //             $this.$vux.loading.show({
				// 	text: err
				// })
    //         })

    //         myAudio.addEventListener("ended", function() {
    //             $this.videoNext();
    //         })

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
            loadMore: function(event) {
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
                        "dried_food_video_id": $this.id,
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
                            //$this.userSubscribe();
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
            popClose: function(event) {
                var $this = this;
                $this.popShow = false;
                $("html").css({
                    "height": "auto",
                    "overflow": "auto"
                })
            },
            popOpen: function(event) {
                var $this = this;
                $this.popShow = true;
                $("html").css({
                    "height": "100%",
                    "overflow": "hidden"
                })
            },
            openDetail: function(id,type) {
                var $this = this;
                if (id == $this.id) {
                    return false;
                };
                $this.saveUserPlay($this.now);
                $this.id = id;
                $this.musicContinue = false;
                $this.$dispatch("getPlayInfo",id,type);
            },
            videoPrew: function() {
                this.$dispatch('playVideoPrew');
            },
            videoNext: function() {
                this.$dispatch('playVideoNext');
            },
            userComment: function(event) {
                var $this = this;
                if ($this.comment_form_value.length > 0) {
                    if ($this.commentFlag) {
                        MessageBox('提示', '请勿重复提交!');
                        return false;
                    } else {
                        setTimeout(function() {
                            $this.commentFlag = false;
                        }, 5000);
                    }
                    $this.commentFlag = true;
                    $.ajax({
                        url: $ApiConf.api_user_create_driedfood_comment,
                        data: {
                            "dried_food_video_id": $this.id,
                            "dried_food_id": $this.ablumId,
                            "token": $this.token,
                            "content": $this.comment_form_value
                        },
                        type: "POST",
                        dataType: "json",
                        success: function(res) {
                            Toast({
                                message: res.msg,
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-success'
                            });
                            $this.commentFlag = false;
                            if (!res.code) {
                                var tmpStr = [res.data];
                                $this.comment_form_value = "";
                                $this.comment_list = tmpStr.concat($this.comment_list);
                            }
                        }
                    });
                } else {
                    Toast({
                        message: '评论不能为空!',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    return false;
                }
            },
            userMusicSeek: function(times) {
                var $this = this;
                console.log('成功触发去订阅')
                $this.$dispatch('tryUserMusicSeek',times);
            },
            userSubscribe: function() {
                return;
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
                                        $this.$dispatch('setTryDig',true);
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
                                $this.$dispatch('setTryDig',true);
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
                $this.comment = data.comment_list;
                $this.comment_list = data.comment_list.data_list;
                $this.recommends = data.recommends;
                $this.bg_img = data.entity.images[0].path;
                $this.is_pay = data.entity.is_pay;
                $this.duration = data.entity.duration;
                $this.video_url = data.entity.video_url;
                $this.is_collection = data.entity.is_collection;
                $this.allPage = data.comment_list.page_num;
                $this.page = $this.page + 1;
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
                                            $this.tryDig = true;
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
            'getTryDig': function(boo){
                this.tryDig = boo;
            }
        }
    };
</script>
 