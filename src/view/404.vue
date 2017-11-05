<template>
    <div class="u-title">
        功能暂未开放,敬请期待</div>
    <div class="submit-btn" @click="backPage">返回上一页</div>
</template>


<script>
    export default {
        methods: {
            backPage() {
                history.go(-1);
            }
        }
    };
</script>

