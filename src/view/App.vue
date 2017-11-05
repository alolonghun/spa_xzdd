<template>
  <div>
    <Player :ps.sync="ps" :playing.sync="playing" :psshow.sync="psshow"></Player>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
    import Player from './component/playerBar';
    import animate from 'animate.css';
    export default {
        data() {
            return {
                ps: {},
                playing: false,
                psshow: true,
                playID: 0,
                tryDig: true
            }
        },
        ready() {
            document.addEventListener("WeixinJSBridgeReady", function() {
                document.getElementById('audioPlay').play();
            }, false);
        },
        components: {
            Player
        },
        events: {
            'userPlayMusic': function(ps) {
                this.ps = ps;
                this.playID = ps.id;
                this.$broadcast("playMusic",ps.id);
            },
            'userPlayMusicStatus': function() {
                this.$broadcast("playMusicStatus");
                this.playing = true;
            },
            'userMusicHidden': function() {
                this.$broadcast("musicHidden");
            },
            'userMusicShow': function() {
                this.$broadcast("musicShow");
            },
            'userStopMusicStatus': function() {
                this.$broadcast("stopMusicStatus");
                this.palying = false;
            },
            'isPlaying': function(){
                var $this = this;
                $this.$broadcast('setPlayStatus',$this.playing,$this.playID);
            },
            'getPlayInfo':function(id,ablumId,playlist,specialId){
                this.$broadcast("getVideoInfo",id,ablumId,playlist,specialId);
            },
            'setTryFlagStatus': function(boo){
                this.$broadcast("tryFlagStatus",boo);
            },
            'setVideoInfo': function(data){
                this.$broadcast('videoInfo',data);
            },
            'setNowTimes': function(time,now){
                this.$broadcast('nowTime',time,now);
            },
            'tryUserMusicSeek': function(times){
                console.log('成功触发首页的订阅')
                this.$broadcast('userMusicSeeks',times);
            },
            'playVideoPrew': function(){
                this.$broadcast('videoPrew');
            },
            'playVideoNext': function(){
                this.$broadcast('videoNext');
            },
            'setTryDig': function(boo){
                this.tryDig = boo;
                this.$broadcast('getTryDig',boo);
            },
            'emitUserSubscribe': function(){
                this.$broadcast('emitSubscribe');
            },
            'userContinue': function(){
                this.$broadcast('emitContinue');
            }
        }
    }
</script>
