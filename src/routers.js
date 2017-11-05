module.exports = function(router) {
    router.map({
        '/': {
            name: "ganhuo",
            component: require('./view/ganhuo.vue')
        },
        '/daka': {
            name: "daka",
            component: require('./view/daka.vue')
        },
        '/detail_list/': {
            name: "detail_list",
            component: require('./view/detail_list.vue')
        },
        '/detail/:type/:id': {
            name: "detail",
            component: require('./view/detail.vue')
        },
        '/play/:type/:id': {
            name: "play",
            component: require('./view/play.vue')
        },
        '/playSpecial/:type/:id': {
            name: "/playSpecial",
            component: require('./view/playSpecial.vue')
        },
        '/my': {
            name: "my",
            component: require('./view/my.vue')
        },
        '/vip': {
            name: "vip",
            component: require('./view/vip.vue')
        },
        '/my/money': {
            name: "my_money",
            component: require('./view/my_money.vue')
        },
        '/my/collect': {
            name: "my_collect",
            component: require('./view/my_collect.vue')
        },
        '/my/subscribe': {
            name: "my_subscribe",
            component: require('./view/my_subscribe.vue')
        },
        '/my/pay': {
            name: "my_pay",
            component: require('./view/pay.vue')
        },
        '/agreement': {
            name: "my_agreement",
            component: require('./view/agreement.vue')
        },
        '/404': {
            name: "404",
            component: require('./view/404.vue')
        },
        '*': {
            component: require('./view/ganhuo.vue')
        }
    });

    router.beforeEach(function(transition) {
        transition.next();
    });

    router.afterEach(function(transition) {
        console.log('成功浏览到: ' + transition.to.path);
    });
}