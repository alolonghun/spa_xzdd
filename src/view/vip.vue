<template>
    <form name="myform" id="myform">
        <div class="vip-intro">
            <div class="title">邦友介绍</div>
            <div class="dec">邦友是校长得道线上会员名称，我们拥有很多东邦友是校长得道线上会员名称，我们拥有很多东西邦友是校长得道线上会员名称，我们拥有很多东西邦友是校长得道线上会员名称。</div>
            <div class="price">加入邦友：99邦币</div>
        </div>
        <div class="diviler"></div>
        <div class="vip-info">
            <div class="title">个人信息</div>
            <div class="ele">
                <div class="txt">
                    <span class="require">*</span>姓 名：</div>
                <input type="text" class="input" name="real_name" placeholder="请输入您的姓名（必填）" />
            </div>
            <div class="ele">
                <div class="txt">
                    <span class="require">*</span>手 机：</div>
                <input type="text" class="input" name="mobile" placeholder="请输入您的手机号码（必填）" />
            </div>
            <div class="ele">
                <div class="txt">微 信：</div>
                <input type="text" class="input" name="channel_id" placeholder="请填写您的微信号（选填）" />
            </div>
        </div>
        <div class="diviler"></div>
        <div class="vip-like">
            <div class="title">我关心</div>
            <ul class="choose-list">
                <li class="item" v-for="item of choose" @click="chooseFav">{{item}}</li>
            </ul>
        </div>
        <div class="diviler"></div>
        <div class="vip-info">
            <div class="title">机构信息</div>
            <div class="ele">
                <div class="txt">机构名称：</div>
                <input type="text" class="input" name="company" placeholder="请输入您的机构名称" />
            </div>
            <div class="ele">
                <div class="txt">职位：</div>
                <input type="text" class="input" name="profession" placeholder="请输入您的职位" />
            </div>
            <div class="ele">
                <div class="txt">您的需求：</div>
                <input type="text" class="input" name="demand" placeholder="请输入您的需求" />
            </div>
            <div class="ele">
                <div class="txt">您的供应：</div>
                <input type="text" class="input" name="autograph" placeholder="请输入您的供应" />
            </div>
            <div class="ele select-wrap">
                <div class="txt">公司规模：</div>
                <select class="picker" name="scale">
                    <option class="item" v-for="item of scale">{{item}}</option>
                </select>
            </div>
            <div class="ele select-wrap">
                <div class="txt">公司类别：</div>
                <select class="picker" name="company_type">
                    <option class="item" v-for="item of company">{{item}}</option>
                </select>
            </div>
        </div>
        <div class="submit-wrap">
            <div class="submit-btn" @click="formSubmit">立即提交</div>
        </div>
    </form>
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
                cindex: 0,
                interest: [],
                scale: ['请选择', '1家校区', '2-5家校区', '6家及以上校区'],
                sindex: 0,
                choose: ['招生营销', '招生力', '教学调研', '薪酬绩效', '家庭教育', '招聘面试', '股权激励', '行业动态', '其他'],
                company: ['请选择', '在线教育', '体制内', '职业教育', '国际教育', '艺术教育', '幼儿教育', 'K12教育', '语言教育'],
                cindex: 0,
                chooseItem: [],
                submitFlag: false,
                playStatus: null
            }
        },
        methods: {
            payForVip: function() {
                var $this = this;
                $.ajax({
                    url: $ApiConf.api_user_join_vip,
                    data: {
                        "token": $this.token
                    },
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                        if (!data.code) {
                            if (data.data !== true) {
                                //微信支付
                                var payData = data.data;
                                wx.chooseWXPay({
                                    timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                    nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                    signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: payData.paySign, // 支付签名
                                    success: function(res) {
                                        Toast({
                                            message: '成功加入',
                                            duration: 1500,
                                            iconClass: 'mint-toast-icon mintui mintui-success'
                                        });
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
                                //余额支付成功
                                Toast({
                                    message: '支付成功',
                                    duration: 1500,
                                    iconClass: 'mint-toast-icon mintui mintui-success'
                                });
                            }
                        } else {
                            Toast({
                                message: data.msg,
                                duration: 1500,
                                iconClass: 'mint-toast-icon mintui mintui-field-warning'
                            });
                        }
                    }
                });
            },
            chooseFav: function(event) {
                var $this = this;
                var $obj = $(event.target);
                if ($obj.hasClass("active")) {
                    $obj.removeClass("active");
                    $this.chooseItem.$remove($obj.text());
                } else {
                    $obj.addClass("active");
                    $this.chooseItem.push($obj.text());
                }
            },
            formSubmit: function(event) {
                var $this = this;
                var data = $this.$am.serialize(document.getElementById("myform"));
                console.log(data);
                if (data.real_name.length < 2) {
                    Toast({
                        message: '姓名不合法',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    return false;
                };
                if (data.mobile.length < 11) {
                    Toast({
                        message: '手机不合法',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    return false;
                };
                data.interest = $this.chooseItem.join(",");
                data.token = $this.token;
                if (!$this.submitFlag) {
                    $this.submitFlag = true;
                    $.ajax({
                        url: $ApiConf.api_user_info_update,
                        data: data,
                        type: "POST",
                        dataType: "json",
                        success: function(data) {
                            if (!data.code) {
                                Toast({
                                    message: data.msg,
                                    duration: 1500,
                                    iconClass: 'mint-toast-icon mintui mintui-success'
                                });
                                setTimeout(function() {
                                    $this.payForVip();
                                }, 1000);
                            } else {
                                Toast({
                                    message: data.msg,
                                    duration: 1500,
                                    iconClass: 'mint-toast-icon mintui mintui-success'
                                });
                            }
                            $this.submitFlag = false;
                        }
                    });
                } else {
                    Toast({
                        message: '提交太频繁',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-warning'
                    });
                    setTimeout(function() {
                        $this.submitFlag = false;
                    }, 5000);
                }
            }
        }
    };
</script>
