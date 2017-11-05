var Vue = require('vue');
console.log(process.env);
window.$ApiConf = require('./apiconf/apiconf'); //添加全局API配置
var VueRouter = require('vue-router');
var infiniteScroll = require('vue-infinite-scroll');
import app from './view/App';
//引入css
require('./css/style.scss');
var MyMethods = require('./js/methods.js');
var flexible = require('./js/flexible.js');
var logoImg = require('./images/logo.jpg');
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import { AlertPlugin, ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

flexible.remRest();

//vue配置
Vue.config.debug = false;
Vue.config.silent = true;
Vue.config.devtools = true;

MyMethods.install = function (Vue, options) {
    Vue.prototype.$am = MyMethods;
    Vue.prototype.token = MyMethods.getToken();
};

Vue.use(MintUI);
Vue.use(MyMethods);
Vue.use(VueRouter);
Vue.use(infiniteScroll);

// register filters 自定义过滤器  金额格式化，
var filters = require('./js/filters');
Object.keys(filters).forEach(function (k) {
    Vue.filter(k, filters[k]);
});

//微信初始化
$.ajax({
    url: $ApiConf.api_getUrlConfig,
    type: 'GET',
    dataType: 'json',
    data: {
        url: window.location.href.substring(0, window.location.href.lastIndexOf('#'))
    },
    success: function (data) {
        if (data && data.code == 0) {
            MyMethods.WXConfigInit(data.data);
        } else {
            console.log(data.msg);
        }
    }
});

var App = Vue.extend(app);
var router = new VueRouter({
    linkActiveClass: "active",
    saveScrollPosition: false
});
require('./routers')(router);

router.start(App, '#app');