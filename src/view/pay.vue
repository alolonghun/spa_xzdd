<template>
    <div class="my-page">
        <div class="pay-title">
            邦币余额充值</div>
        <div class="pay-list">
            <div class="item {{cindex == 10?'active':''}}" @click="choose(10)">
                <div class="title">10元邦币</div>
                <div class="dec">售价: 10.00元</div>
            </div>
            <div class="item {{cindex == 68?'active':''}}" @click="choose(68)">
                <div class="title">68元邦币</div>
                <div class="dec">售价: 68.00元</div>
            </div>
            <div class="item {{cindex == 128?'active':''}}" @click="choose(128)">
                <div class="title">128元邦币</div>
                <div class="dec">售价: 128.00元</div>
            </div>
            <div class="item {{cindex == 228?'active':''}}" @click="choose(228)">
                <div class="title">228元邦币</div>
                <div class="dec">售价: 228.00元</div>
            </div>
            <div class="item {{cindex == 368?'active':''}}" @click="choose(368)">
                <div class="title">368元邦币</div>
                <div class="dec">售价: 368.00元</div>
            </div>
            <div class="item {{cindex == 888?'active':''}}" @click="choose(888)">
                <div class="title">888元邦币</div>
                <div class="dec">售价: 888.00元</div>
            </div>
        </div>
        <div class="agreement">
            <div>点击去充值，即表示已阅读并同意<span class="link" v-link="'/agreement'">《充值免责协议》</span>；校长邦不会以任何形式要求您输入银行卡账号和密码。</div>
        </div>
        <div class="other" v-if="false">
            <span class="title">其他金额</span>
            <input type="number" class="money" placeholder="您想充值的金额" placeholder-style="color:#a8a8a8" bindinput="bindKeyInput" />
        </div>
        <div class="submit-btn" @click="getMoney">立即充值</div>
    </div>
</template>

<script>
    import Bar from "./component/bar";
    import { Toast } from 'mint-ui';
    export default {
        components: {
            Bar
        },
        data() {
            return {
                money: 0,
                cindex: 0
            }
        },
        methods: {
            getMoney() {
                var $this = this;
                var money = Number($this.money);
                if (money > 0 && typeof(money) === "number") {
                    $.ajax({
                        url: $ApiConf.api_user_recharge,
                        data: {
                            "token": $this.token,
                            "money": money
                        },
                        type: "POST",
                        dataType: "json",
                        success: function(res) {
                            if (!res.code) {
                                var payData = res.data;
                                wx.chooseWXPay({
                                    timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                    nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                    signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: payData.paySign, // 支付签名
                                    success: function(res) {
                                        Toast({
                                            message: '支付成功',
                                            duration: 1500,
                                            iconClass: 'mint-toast-icon mintui mintui-success'
                                        });
                                    }
                                });
                            } else {
                                console.log(res.msg);
                            }
                        }
                    });
                } else {
                    Toast({
                        message: '金额不合法',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                }
            },
            choose: function(num) {
                var $this = this;
                var money = num;
                if ($this.cindex == money) {
                    $this.cindex = 0;
                    $this.money = 0;
                } else {
                    $this.cindex = money;
                    $this.money = money;
                }
            }
        }
    };
</script>
