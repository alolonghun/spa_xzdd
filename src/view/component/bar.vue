<template>
  <ul class="bar">
<!--     <li v-link="{ path: '/', exact: true }">
      <i class="icons-bar ico-gh"></i>
      <p>干货</p>
    </li> -->
    <li v-link="{ path: '/', exact: true }">
      <i class="icons-bar ico-dd"></i>
      <p>首页</p>
    </li>
    <!-- <li v-link="{ path: '/daka', exact: true }">
      <i class="icons-bar ico-dg"></i>
      <p>大咖</p>
    </li> -->
<!--     <li v-link="{ path: '/my', exact: true }">
      <i class="icons-bar ico-my"></i>
      <p>我的</p>
    </li> -->
    <li v-link="{ path: '/my', exact: true }">
      <i class="icons-bar ico-me"></i>
      <p>我的</p>
    </li>
  </ul>
  <div class="bar-height-fix"></div>
</template>