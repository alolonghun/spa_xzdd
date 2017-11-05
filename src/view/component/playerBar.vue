<template>
  <audio id="audioPlay" :src="ps.url" autoplay></audio>
  <div class="soundbar" v-show='ps && ps.url && psshow'>
    <div class="bg" style="background-image:url({{ps.bg}})"></div>
    <div class="txt" @click="openPlay">{{ps.title}}</div>
    <div class="act" @click="toggleStatus">
      <span class="u-icn icn-radio" v-if='!playing'></span>
      <span class="u-icn icn-radio-stop" v-else></span>
    </div>
  </div>
  <div class="fixHeight" v-show='ps && ps.url && psshow'></div>
</template>

<script>
    import { Toast, MessageBox } from 'mint-ui';
    export default {
        data(){
            return{
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
                mySrc: '',
                isCanSendLog: true,
                playlist:[],
                isSpecial:false,
                linkName:'',
                specialId:0
            }
        },
        props: {
            ps: {
                type: Object,
                twoWay: true
            },
            playing: {
                type: Boolean,
                twoWay: true
            },
            psshow: {
                type: Boolean,
                twoWay: true
            }
        },
        ready: function(){
            var $this = this;
            window.myAudio = document.getElementById('audioPlay');
            myAudio.oncanplaythrough = function() {
                if(!$this.isCanSendLog){
                    //oncanplaythrough会触发2-3次，多余
                    return;
                }
                $this.isCanSendLog = false;
                $this.$vux.loading.hide();
                $this.end_loading_time = Math.floor(new Date().getTime()/1000);
                $.ajax({
                    url: $ApiConf.api_log,
                    type: 'GET',
                    data: {
                        token: $this.token,
                        dried_food_id: $this.ablumId,
                        dried_food_audio_id: $this.id,
                        begin_loading_time: $this.begin_loading_time,
                        end_loading_time: $this.end_loading_time
                    },
                    success: function(res) {
                        // console.log(res);
                    }
                })
                setTimeout(function(){
                    $this.isCanSendLog = true;
                },500)
            }
            myAudio.onerror = function(err) {
                $this.$vux.loading.show({
                    text: err
                })
            }

            myAudio.onended = function() {
                $this.videoNextBar();
            }
        },
        methods: {
            openPlay: function(){
                this.$router.go(this.linkName);
            },
            toggleStatus() {
                var $this = this;
                if ($this.playing) {
                    document.getElementById('audioPlay').pause();
                    $this.playing = false;
                    $this.$dispatch('userStopMusicStatus');
                } else {
                    document.getElementById('audioPlay').play();
                    $this.playing = true;
                    $this.$dispatch('userPlayMusicStatus');
                }
            },
            videoPrewBar: function() {
                var $this = this;
                if ($this.video_index === 0) {
                    $this.id = $this.video_list[$this.video_list.length - 1].dried_food_video_id;
                    $this.video_index = $this.video_list.length - 1;
                } else {
                    $this.id = $this.video_list[$this.video_index - 1].dried_food_video_id;
                    $this.video_index = $this.video_index - 1;
                }
                myAudio.pause();
                $this.saveUserPlay($this.now);
                $this.musicContinue = false;
                $this.is_record = false;
                $this.getDetail();
                $this.userHistory();
            },
            videoNextBar: function() {
                var $this = this;
                if ($this.video_index === $this.video_list.length - 1) {
                    $this.id = $this.video_list[0].dried_food_video_id;
                    $this.video_index = 0;
                } else {
                    var n = parseInt($this.video_index);
                    $this.video_index = n + 1;
                    $this.id = $this.video_list[$this.video_index].dried_food_video_id;
                }               
                myAudio.pause();
                $this.saveUserPlay($this.now);
                $this.musicContinue = false;
                $this.is_record = false;
                
                $this.getDetail();
                $this.userHistory();
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
            getTimeStr: function(nowTime) {
                var $this = this;
                var times = "",
                    now = Math.round(nowTime || 0);
                var min = Math.floor(now / 60);
                var second = now % 60;
                times = (min > 9 ? min : '0' + min) + ":" + (second > 9 ? second : '0' + second);
                $this.nowTimes = times;
            },
            getDetail: function() {
                var $this = this;
                $this.$vux.loading.show({
                    text: '加载中...'
                })
                if($this.isSpecial){
                    var url = $ApiConf.api_dev_music;
                    var data = {
                        "token": $this.token,
                        "id": $this.id,
                    };
                }else{
                    var url = $ApiConf.api_driedfood_video_detail;
                    var data = {
                        "token": $this.token,
                        "dried_food_video_id": $this.id,
                        "app_type": "h5"
                    };
                }
                $.ajax({
                    url: url,
                    data: data,
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        console.log(res)
                        if (!res.code) {
                            $this.detail = res.data;
                            $this.$dispatch('setVideoInfo',res.data);
                            $this.bg_img = res.data.entity.images[0].path;
                            $this.is_pay = res.data.entity.is_pay;
                            $this.duration = res.data.entity.duration;
                            $this.video_url = res.data.entity.video_url;
                            if($this.isSpecial){
                                $this.detail.video_list = $this.playlist;
                                $this.video_list = $this.playlist;
                                $this.linkName = '/playSpecial/'+$this.id+'/'+$this.specialId;
                            }else{
                                $this.video_list = res.data.video_list;
                                $this.linkName = '/play/'+$this.detail.entity.dried_food_id+'/'+$this.id;
                            }
                            
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
                            //是否可以试听
                            $this.canUserTry();
                            //判断是否显示试听
                            if ($this.is_pay || parseInt($this.detail.entity.price) == 0) {
                                $this.tryFlag = false;
                                $this.$dispatch('setTryFlagStatus',false);
                            } else {
                                $this.tryFlag = true;
                                $this.$dispatch('setTryFlagStatus',true);
                            }
                            // 音频播放
                            $this.musicContinue = false;
                            if (!$this.musicContinue) {
                                if (res.data.entity.previous_record > 0 && res.data.entity.previous_record <= parseInt($this.duration) && !$this.tryFlag && $this.is_record) {
                                    $this.now = res.data.entity.previous_record;
                                    $this.fmPlay(res.data.entity.previous_record);
                                    $this.is_record = false;
                                } else {
                                    $this.getTimeStr(0);
                                    $this.now = 0;
                                    $this.fmPlay(0);
                                }
                            }
                            //若音频的url一致，则隐藏loading
                            // if ($this.video_url == $this.mySrc) {
                            //     $this.$vux.loading.hide();
                            // }
                            for (var j = 0; j < res.data.video_list.length; j++) {
                                if (res.data.video_list[j].dried_food_video_id == $this.id) {
                                    $this.video_index = j;
                                    return false;
                                }
                            }

                        } else {
                            Toast({
                                message: res.msg,
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-field-warning'
                            });
                        }
                    }
                })
            },
            fmPlay: function(times) {
                var $this = this;
                var playStatus = {
                    id: $this.id,
                    title: $this.detail.entity.title,
                    bg: $this.detail.entity.img,
                    url: $this.detail.entity.video_url,
                    notPlay: true
                };

                //document.getElementById('audioPlay').setAttribute('data-id',$this.id);
                $this.$dispatch("userPlayMusic", playStatus);
                $this.st = true;
                if ($this.video_url == $this.mySrc) {
                    $this.now = myAudio.currentTime;
                    myAudio.play();
                    $this.$dispatch("userPlayMusicStatus"); 
                    $this.$vux.loading.hide();                   
                } else {
                    $this.mySrc = $this.video_url;

                    if (!myAudio) {
                        window.myAudio = document.getElementById('audioPlay');
                    }
                    if (!$this.tryDig) {
                        return false;
                    }

                    myAudio.onloadstart = function(){
                        $this.begin_loading_time = Math.floor(new Date().getTime()/1000);
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
                    $this.$dispatch('setNowTimes',$this.nowTimes,$this.now);

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
                    // try {
                    //     if (!$this.isTouchMoving) {
                    //         var ppts = $this.ppts;
                    //         for (var i = 0; i < ppts.length; i++) {
                    //             if ($this.now > ppts[ppts.length - 1].time) {
                    //                 swiper.slideTo(ppts.length - 1);
                    //                 $this.now_ppt = ppts.length - 1;
                    //                 return false;
                    //             }
                    //             if ($this.now < ppts[0].time) {
                    //                 swiper.slideTo(0);
                    //                 $this.now_ppt = 0;
                    //                 return false;
                    //             }
                    //             if (ppts[i].time <= $this.now && $this.now < ppts[i + 1].time) {
                    //                 swiper.slideTo(i);
                    //                 $this.now_ppt = i;
                    //                 return false;
                    //             }
                    //         }
                    //     }
                    // } catch (error) {}
                };
            },
            fmStop: function(event) {
                var $this = this;
                myAudio.pause();
                $this.$dispatch("userStopMusicStatus");
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
            canUserTry: function(times) {
                var $this = this;
                times = times || 0;
                //没有支付 && 超过免费试听时间
                if (!$this.is_pay && times >= $this.detail.entity.free_duration && $this.detail.entity.price > 0) {
                    if (!myAudio) {
                        window.myAudio = document.getElementById('audioPlay');
                    }
                    $this.now = $this.detail.entity.free_duration;
                    $this.userMusicSeek($this.detail.entity.free_duration);
                    $this.$dispatch("userStopMusicStatus");
                    $this.musicContinue = true;
                    myAudio.pause();

                    if ($this.tryDig) {
                        $this.tryDig = false;
                    }
                    if (!$this.alertFlag) {
                        $this.alertFlag = true;
                        MessageBox.confirm('免费试听结束，支付' + $this.detail.entity.price + '邦币可畅听整个课程!')
                            .then(function() {
                                console.log('点击了确定按钮');
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
            userSubscribe: function() {
                var $this = this;
                console.log('触发了subscribe');
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
                                console.log('获取了接口返回');
                                wx.chooseWXPay({
                                    timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                    nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                    signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: payData.paySign, // 支付签名
                                    success: function(res) {
                                        console.log('成功直接订阅');
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
                                        console.log('充值取消');
                                        Toast({
                                            message: '充值取消',
                                            duration: 1500,
                                            iconClass: 'mint-toast-icon mintui mintui-field-error'
                                        });
                                        return false;
                                    }
                                });
                            } else {
                                console.log('邦币订阅成功');
                                Toast({
                                    message: '订阅成功',
                                    duration: 1500,
                                    iconClass: 'mint-toast-icon mintui mintui-success'
                                });
                                $this.tryDig = true;
                                $this.getDetail();
                                $this.userHistory();
                                console.log('成功后');
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
            userMusicSeek: function(times) {
                var $this = this;
                if (!myAudio) {
                    window.myAudio = document.getElementById('audioPlay');
                }
                if (!$this.tryDig) {
                    
                    myAudio.pause();
                    $this.$dispatch("userStopMusicStatus");
                    return;
                }else{
                    try {
                        myAudio.currentTime = times;
                    } catch (err) {
                        console.warn(err);
                    }

                    myAudio.play();
                    $this.$dispatch("userPlayMusicStatus");
                    $this.saveUserPlay(times);
                }
                    
            },
            fmContinue: function(event) {
                var $this = this;
                if ($this.tryDig) {
                    $this.$dispatch("userPlayMusicStatus");
                } else {
                    MessageBox.confirm('免费试听结束，支付' + $this.detail.entity.price + '邦币可畅听整个课程!')
                        .then(function() {
                            $this.userSubscribe();
                        }).catch(err => {
                            $this.tryDig = true;;
                        });
                }
            }
        },
        events: {
            'playMusic': function() {
                var $this = this;
                $this.firstPlay = false;
            },
            'stopMusicStatus': function() {
                var $this = this;
                $this.playing = false;
                myAudio.pause();
            },
            'playMusicStatus': function() {
                var $this = this;
                $this.playing = true;
                myAudio.play();
            },
            'musicHidden': function() {
                var $this = this;
                $this.psshow = false;
                console.log($this.psshow);
            },
            'musicShow': function() {
                var $this = this;
                $this.psshow = true;
                console.log($this.psshow);
            },
            'getVideoInfo':function(id,ablumId,playlist,specialId){
                var $this = this;
                $this.ablumId = ablumId;
                $this.id = id;
                if(playlist){
                    $this.playlist = playlist;
                    $this.isSpecial = true;
                    $this.specialId = specialId;
                }else{
                    $this.isSpecial = false;
                }
                $this.getDetail();
            },
            'userMusicSeeks': function(times){
                this.userMusicSeek(times);
            },
            'emitSubscribe': function(){
                $this.playing = false;
                this.userSubscribe();
            },
            'videoPrew': function(){
                this.videoPrewBar();
            },
            'videoNext': function(){
                this.videoNextBar();
            },
            'emitContinue': function(){
                this.fmContinue();
            }
        }
    }
</script>
