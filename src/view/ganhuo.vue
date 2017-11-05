<template>
    <!-- swiper start -->
    <div class="swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item of banner" track-by="banner_id" v-link="'/detail/gh/'+item.relation_id">
                <div class="avatar" :style="getBgImg(item.banner_url)"></div>
            </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
    </div>
    <!-- swiper end -->
<!--     <div class="m-title">
        干货精选
    </div> -->
    <!-- early-8 start -->
    <div class="ganhuo-title">
        <img class="ganhuo-title-icon" src="./../images/paper.png" alt="">
        <span class="ganhuo-title-text">教育早8点+</span>
        <span v-link="'/playSpecial/0/0'" class="ganhuo-title-fr">查看更多</span><!--点击之前确定播放哪一条-->
    </div>
    <div class="ganhuo-early-con">
        <ul>
            <li playid="{{item.dried_food_video_id}}" :class="{'active':item.dried_food_video_id==playId}" v-link="'/playSpecial/'+item.dried_food_video_id+'/0'" v-for="item in early"><span>[{{item.time}}]</span>{{item.explain}}</li>
        </ul>
        <img @click="playAudio" v-show="!playing" src="./../images/play_btn.png" class="ganhuo-btn">
        <img @click="stopPlayAudio" v-show="playing"  src="./../images/pause_btn.png" class="ganhuo-btn">
    </div>
    <div class="ganhuo-partiton"></div>
    <!-- carefully chosen start -->
    <div class="ganhuo-title">
        <img class="ganhuo-title-icon" src="./../images/cho.png" alt="">
        <span class="ganhuo-title-text">精选专题</span>
        <span v-link="'/detail_list'" class="ganhuo-title-fr">查看更多</span>
    </div>
    <ul class="cho-box">
        <li v-link="'/playSpecial/0/'+item.id" v-for="item in choosy" style="background-image:url({{item.img}})"></li>
    </ul>
    <div class="ganhuo-partiton"></div>
    <!--m-lesson start-->
    <div class="ganhuo-title">
        <img class="ganhuo-title-icon" src="./../images/hot.png" alt="">
        <span class="ganhuo-title-text">热门推荐</span>
        <span v-if="false" class="ganhuo-title-fr">查看更多</span>
    </div>
    <ul class="m-lesson ganhuo-revision" v-infinite-scroll="loadMore()" infinite-scroll-disabled="allDone" infinite-scroll-distance="10">
        <lesson :lesson.sync="lesson" :alldone.sync="allDone"></lesson>
    </ul>
    <div class="ganhuo-partiton"></div>
    
    
    <bar></bar>
</template>

<script>
    import Swiper from "../js/swiper.min.js";
    import Bar from "./component/bar";
    import Lesson from "./component/lesson";
    export default {
        components: {
            Bar,
            Lesson
        },
        data() {
            return {
                banner: [],
                lesson: [],
                page: 1,
                allPage: 1,
                allDone: false,
                loadFlag: false,
                playStatus: null,
                early:[],
                playData: null,
                playing: false,
                choosy:[],
                playId: 0,
                new_video_list:[]
            }
        },
        ready() {
            var $this = this;
            document.title = '校长得道';
            this.$vux.loading.show({
                text: '加载中...'
            })
            $this.getBannerList();
            $this.loadMore();

            $this.getEarly();
            $this.getChoosy();
            $this.$dispatch('isPlaying');
        },
        methods: {
            getBgImg: function(url) {
                if (url) {
                    return "background-image:url(" + url + ")";
                } else {
                    return "";
                }
            },
            getBannerList: function() {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_banner_list,
                    data: {
                        "type": 2
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        $this.banner = res.data;
                        setTimeout(function() {
                            var swiper = new Swiper('.swiper', {
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: false,
                                lazyLoading: true
                            });
                        }, 500);
                        $this.$nextTick(() => {
                            window.scrollTo(0, 1)
                            window.scrollTo(0, 0)
                        })
                    }
                })
            },
            loadMore: function(event) {
                var $this = this;
                if (!$this.loadFlag) {
                    $this.loadFlag = true;
                    if ($this.page > $this.allPage) {
                        $this.allDone = true;
                    } else {
                        $.ajax({
                            url: $ApiConf.api_driedfood_list,
                            data: {
                                "page": $this.page,
                                "page_num": 10,
                                "token": $this.token
                            },
                            type: "POST",
                            dataType: "json",
                            success: function(res) {
                                if(res.code) {
                                    $this.$vux.loading.hide();  
                                    $this.allDone = true;
                                    return false;
                                } else {
                                    $this.lesson = $this.lesson.concat(res.data.data_list);
                                }
                                $this.allPage = res.data.page_num;
                                $this.page = $this.page + 1;
                                $this.loadFlag = false;                             
                                if ($this.page > $this.allPage) {
                                    $this.allDone = true;
                                }
                                $this.$vux.loading.hide();
                            }
                        });
                    }
                } else {
                    setTimeout(function() {
                        $this.loadFlag = false;
                    }, 5000);
                }
            },
            getEarly: function(){
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_special_eight,
                    data: {
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res){
                        if(!res.code){
                            var _data = res.data[0].list;
                            $this.new_video_list = _data;
                            $this.early = _data.slice(0,3);
                            _data.forEach(function(arg,index){
                                var _date = arg.update_time;
                                _date = new Date(_date * 1000);
                                var _month = _date.getMonth() + 1;
                                var _day = _date.getDate();
                                arg.time = _month + '月' + _day + '日';
                            });
                        }
                    }
                })
            },
            getChoosy: function(){
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_choosy,
                    data: {
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        if(!res.code){
                            var _data = res.data;
                            if(_data.length >= 4){
                                _data = _data.slice(0,4);
                            }else{
                                _data = _data.slice(0,2);
                            }
                        }
                        $this.choosy = _data;
                    }
                })
            },
            playAudio: function(){
                var $this = this;
                if($this.playId == 0){
                    $this.$dispatch('getPlayInfo',$this.early[0].dried_food_video_id,$this.early[0].dried_food_id,$this.new_video_list,0)
                }else{
                    $this.$dispatch('userPlayMusicStatus');
                }
            },
            stopPlayAudio: function(){
                var $this = this;
                this.$dispatch("userStopMusicStatus");
            }
        },
        events: {
            'stopMusicStatus': function() {
                var $this = this;
                setTimeout(function() {
                    $this.playing = false;
                }, 100);
            },
            'playMusicStatus': function() {
                var $this = this;
                setTimeout(function() {
                    $this.playing = true;
                }, 100);
            },
            'setPlayStatus': function(status,id){
                this.playing = status;
                this.playId = id;  
                setTimeout(function(){
                    if(document.querySelector('[playid="'+id+'"]')){
                        document.querySelector('[playid="'+id+'"]').className = 'active' 
                    }                   
                },1000)
            },
            'playMusic': function(id){
                this.playId = id;
                                
            }
        }
    };
</script>

