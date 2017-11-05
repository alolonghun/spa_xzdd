<template>
  <li class="item" v-for="item of lesson" track-by="$index" v-link="'/detail/gh/'+getLessonId(item)">
    <div class="avatar" :style="getBgImg(item.img)">
      <i class="tag tag-free" v-if="item.is_special && item.is_free==1">邦友免费</i>
      <i class="tag tag-sale" v-if="item.is_special && item.is_special==1">邦友特价</i>
      <i class="tag tag-not" v-if="item.is_pay==0">未购买</i>
    </div>
    <div class="info">
      <div class="title">{{item.title}}</div>
      <div class="dec">{{item.explain}}</div>
    </div>
    <div class="action">
      <div class="lesson-tag" style="display:none;">招生</div>
      <div class="em" v-if="item.subscribe">
        <i class="u-icn icn-view"></i>{{item.subscribe}}</div>
      <div class="em" v-if="item.count">
        <i class="u-icn icn-album"></i>{{item.count}}集</div>
    </div>
    <div class="price" v-if="item.price > 0">
      <i>{{item.price}}</i>邦币</div>
    <div class="price" v-if="item.price == 0">
      <i class="free">免费</i></div>
    <i class="badge" v-if="item.update_status">更新</i>
  </li>
  <li class="no-more" v-if="alldone">已经全部加载完成</li>
</template>

<script>
  export default {
    props: {
      lesson: {
        type: Array,
        twoWay: true
      },
      alldone: {
        type: Boolean,
        twoWay: true
      }
    },
    methods: {
      getLessonId: function(item) {
        return item.mid || item.dried_food_id
      },
      getBgImg: function(url) {
        if (url) {
          return "background-image:url(" + url + ")";
        } else {
          return "";
        }
      }
    }
  }
</script>

