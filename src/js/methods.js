import { Toast } from 'mint-ui';
module.exports = {
    serialize: function(form) {
        var len = form.elements.length;
        var field = {};
        for (var i = 0; i < len; i++) {
            var obj = form.elements[i];
            if (obj.name.length) {
                field[obj.name] = (obj.value ? obj.value : "");
            }
        }
        return field;
    },
    getCookie: function(c_name) {
        if (document.cookie.length > 0) {
            var p = new RegExp(c_name + '="([^;]*)";?|' + c_name + '=([^;]+);?');
            var m = document.cookie.match(p);
            if (m) {
                if (m[1]) {
                    return m[1];
                } else if (m[2]) {
                    return m[2];
                }
            }
        }
        return ""
    },
    WXConfigInit: function(weixinObj, title, desc, imgUrl) {
        console.log(JSON.stringify(weixinObj));
        wx.config({
            debug: false, // 开启调试模式
            appId: weixinObj.appId, // 必填，公众号的唯一标识
            timestamp: weixinObj.timestamp, // 必填，生成签名的时间戳
            nonceStr: weixinObj.noncestr, // 必填，生成签名的随机串
            signature: weixinObj.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
            wx.hideMenuItems({
                menuList: [
                    "menuItem:editTag",
                    //"menuItem:copyUrl",
                    "menuItem:readMode",
                    "menuItem:openWithSafari",
                    "menuItem:share:email",
                    "menuItem:share:qq",
                    "menuItem:share:QZone"
                ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
            wx.showMenuItems({
                menuList: [
                    "menuItem:copyUrl"
                ]
            });
            console.log("微信回调成功");
            wx.onMenuShareTimeline({
                title: title || '校长得道-属于校长的音频知识社区', // 分享标题
                link: window.location.href.substring(0, window.location.href.lastIndexOf('#'))+'?jumpURL='+encodeURIComponent(window.location.href)+window.location.href.substring(window.location.href.lastIndexOf('#')), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl || 'http://file.xiaozhangbang.org/image/1.pic_hd.jpg', // 分享图标
                success: function() {
                    Toast({
                        message: "分享成功",
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-success'
                    });
                },
                cancel: function() {
                    Toast({
                        message: '分享取消',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-error'
                    });
                }
            });

            wx.onMenuShareAppMessage({
                title: title || '校长得道-属于校长的音频知识社区', // 分享标题
                desc: desc || '校长得道具有社交媒体属性的校长知识分享平台，我们汇集各路大咖为校长提供经验性解决方案。', // 分享描述
                link: window.location.href.substring(0, window.location.href.lastIndexOf('#'))+'?jumpURL='+encodeURIComponent(window.location.href)+window.location.href.substring(window.location.href.lastIndexOf('#')), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl || 'http://file.xiaozhangbang.org/image/1.pic_hd.jpg', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    Toast({
                        message: "分享成功",
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-success'
                    });
                },
                cancel: function() {
                    Toast({
                        message: '分享取消',
                        duration: 1500,
                        iconClass: 'mint-toast-icon mintui mintui-field-error'
                    });
                }
            });
        });
    },
    getToken: function() {
        // document.cookie = 'token=41254a9f55323fd751a84359678ca95b';
        // return "41254a9f55323fd751a84359678ca95b";
        var token = this.getCookie("token");
        if (token) {
            //token存在
            return token;
        } else {
            //token不存在,重定向到微信授权
            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd2c4732b5f9cd99d&redirect_uri=http%3a%2f%2fwx.xiaozhangbang.org%2fxzdd&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
    }
}