<template>
    <div class="my-page">
        <div class="record-detail">
            <div class="dec">当前余额</div>
            <div class="money">{{money}}</div>
        </div>
        <div class="record-list">
            <div class="title">
                交易明细
            </div>
            <div v-infinite-scroll="loadMore()" infinite-scroll-disabled="allDone" infinite-scroll-distance="10">
                <div class="item" v-for="item of record" track-by="$index">
                    <div class="name">
                        {{item.week_day}}
                    </div>
                    <div class="date">
                        {{item.create_time}}
                    </div>
                    <div class="price">
                        {{item.consumption_type ==1?'+':'-'}}{{item.price}}
                    </div>
                    <div class="info">
                        {{item.remark}}
                    </div>
                </div>
            </div>
            <div class="no-more" v-if="allDone">已经全部加载完成</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                money: "",
                page: 1,
                allPage: 1,
                allDone: false,
                record: [],
                playStatus: null
            }
        },
        ready() {
            this.getMoney();
            this.loadMore();
        },
        methods: {
            getMoney() {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_account_info,
                    data: {
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(res) {
                        if (!res.code) {
                            $this.money = res.data.balance;
                        } else {
                            console.log(res.msg);
                        }
                    }
                })
            },
            loadMore: function(event) {
                var $this = this;
                if ($this.page > $this.allPage) {
                    $this.allDone = true;
                } else {
                    $.ajax({
                        url: $ApiConf.api_user_bangbi_recode,
                        data: {
                            "page": $this.page,
                            "page_num": 10,
                            "token": $this.token
                        },
                        type: "POST",
                        dataType: "json",
                        success: function(res) {
                            setTimeout(function() {
                                $this.record = $this.record.concat(res.data.data_list);
                                $this.allPage = res.data.page_num;
                                $this.page += 1;   
                                if ($this.page > $this.allPage) {
                                    $this.allDone = true;
                                }
                            }, 100)
                            
                        }
                    });
                }
            }
        }
    }
</script>

