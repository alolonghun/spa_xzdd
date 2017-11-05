<template>
    <!-- swiper start -->
    <div class="swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item of banner" track-by="banner_id">
                <div class="avatar" style="background-image: url('{{item.banner_url}}');"></div>
            </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
    </div>
    <!-- swiper end -->
    <div class="m-title">
        大咖精选
    </div>
    <!--m-lesson start-->
    <ul class="m-lesson dk" v-infinite-scroll="loadMore()" infinite-scroll-disabled="allDone" infinite-scroll-distance="10">
        <lesson :lesson.sync="lesson" :alldone.sync="allDone"></lesson>
    </ul>
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
                playStatus: null
            }
        },
        ready() {
            var $this = this;
            $this.getBannerList();
            $this.loadMore();
        },
        methods: {
            openDetail: function(event) {
                var $this = this;
                var index = event.currentTarget.dataset.index;
                var tmpData = util.clone($this.lesson);
                if (index >= 0 && tmpData[index].update_status) {
                    tmpData[index].update_status = 0;
                }
                $this.lesson = tmpData;
            },
            getBannerList: function() {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_banner_list,
                    data: {
                        "type": 1
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
                            url: $ApiConf.api_bigshot_list,
                            data: {
                                "page": $this.page,
                                "page_num": 10,
                                "token": $this.token
                            },
                            type: "POST",
                            dataType: "json",
                            success: function(res) {
                                $this.lesson = $this.lesson.concat(res.data.data_list);
                                $this.allPage = res.data.page_num;
                                $this.page = $this.page + 1;
                                $this.loadFlag = false;
                                if ($this.page > $this.allPage) {
                                    $this.allDone = true;
                                }
                            }
                        });
                    }
                } else {
                    setTimeout(function() {
                        $this.loadFlag = false;
                    }, 5000);
                }
            }
        }
    };
</script>

