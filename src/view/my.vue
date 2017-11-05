<template>
    <div class="my-page">
        <div class="user">
            <div class="avater" :style="getBgImg(userInfo.head_img)"></div>
            <div class="name">{{userInfo.nick_name}}<span class="u-icn icn-vip" v-if='vip'></span></div>
            <div class="dec">我们欢迎热爱教育事业的有识之士</div>
            <div class="vip" v-if='!vip' v-link="'/vip'">+加入邦友</div>
        </div>
        <div class="menu">
            <div class="item" v-link="'/my/subscribe'">
                <span class="icn-menu icn-dy"></span>
                <span class="name">我的订阅</span>
            </div>
            <div class="item" v-link="'/my/collect'">
                <span class="icn-menu icn-sc"></span>
                <span class="name">我的收藏</span>
            </div>
            <div class="item" v-link="'/404'">
                <span class="icn-menu icn-hd"></span>
                <span class="name">我的活动</span>
            </div>
        </div>
        <div class="menu">
            <div class="item" v-link="'/my/money'">
                <span class="icn-menu icn-bb"></span>
                <span class="name">我的邦币</span>
            </div>
            <div class="item" v-link="'/my/pay'">
                <span class="icn-menu icn-cz"></span>
                <span class="name">邦币充值</span>
            </div>
        </div>
        <bar></bar>
    </div>
</template>

<script>
    import Bar from "./component/bar";
    export default {
        components: {
            Bar
        },
        data() {
            return {
                userInfo: {},
                vip: false
            }
        },
        ready() {
            const that = this;
            that.getUserInfo();
        },
        methods: {
            getUserInfo() {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_info,
                    data: {
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        if (!res.code) {
                            $this.userInfo = res.data;
                            if (res.data.user_type) {
                                $this.vip = true;
                            } else {
                                $this.vip = false;
                            }
                        } else {
                            console.log(res.msg);
                        }
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

