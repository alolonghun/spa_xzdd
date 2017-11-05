<template>
    <div class="item" v-for="item of comment_list" track-by="$index">
        <div class="avatar" :style="getBgImg(item.head_img)"></div>
        <div class="name">{{item.nick_name}}</div>
        <div class="time">{{item.create_time}}</div>
        <div class="content">
            {{item.content}}
        </div>
        <div class="action" @click="userVote(item)"><span class="txt">{{item.point_number}}</span><span class="u-icn icn-vote {{item.is_point?'active':''}}"></span></div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    export default {
        props: {
            comment_list: {
                type: Array,
                twoWay: true
            },
            alldone: {
                type: Boolean,
                twoWay: true
            }
        },
        methods: {
            getBgImg(url) {
                if (url) {
                    return "background-image:url(" + url + ")";
                } else {
                    return "";
                }
            },
            userVote: function(item) {
                var $this = this;
                console.log(item);
                if (item.is_point) {
                    Toast({
                        message: '你已经点过赞了',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    return false;
                }
                $.ajax({
                    url: $ApiConf.api_driedfood_comment_point,
                    data: {
                        "dried_food_comment_id": item.dried_food_comment_id,
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        if (!res.code) {
                            item.point_number = item.point_number + 1;
                            item.is_point = 1;
                        } else {
                            Toast(res.msg);
                        }
                    }
                });
            }
        }
    }
</script>

