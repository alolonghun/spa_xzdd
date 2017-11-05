<template>
    <div class="u-tabs">
        <span class="tab {{showGH?'active':''}}" @click="showGHTab">干货</span>
        <span class="tab {{showDK?'active':''}}" @click="showDKTab">大咖</span>
    </div>
    <div class="diviler"></div>
    <ul class="m-lesson link dk" v-show="showDK" v-infinite-scroll="dkloadMore()" infinite-scroll-disabled="dkallDone" infinite-scroll-distance="10">
        <lesson :lesson.sync="dklesson" :alldone.sync="dkallDone"></lesson>
    </ul>
    <ul class="m-lesson link" v-show="showGH" v-infinite-scroll="ghloadMore()" infinite-scroll-disabled="ghallDone" infinite-scroll-distance="10">
        <lesson :lesson.sync="ghlesson" :alldone.sync="ghallDone"></lesson>
    </ul>
</template>

<script>
    import Lesson from "./component/lesson";
    export default {
      components: {
        Lesson
      },
      data() {
        return {
          showGH: true,
          showDK: false,
          dklesson: [],
          dkpage: 1,
          dkallPage: 1,
          dkallDone: false,
          dkloadFlag: false,
          ghlesson: [],
          ghpage: 1,
          ghallPage: 1,
          ghallDone: false,
          ghloadFlag: false,
        }
      },
      ready() {
        this.ghloadMore();
      },
      methods: {
        showGHTab: function(e) {
          this.showGH = true;
          this.showDK = false;
          this.ghloadMore();
        },
        showDKTab: function(e) {
          this.showGH = false;
          this.showDK = true;
          this.dkloadMore();
        },
        ghloadMore: function(event) {
          var $this = this;
          if (!$this.ghloadFlag) {
            $this.ghloadFlag = true;
            if ($this.ghpage > $this.ghallPage) {
              $this.ghallDone = true;
            } else {
              $.ajax({
                url: $ApiConf.api_user_collection_list,
                data: {
                  "page": $this.ghpage,
                  "page_num": 10,
                  "type": 2,
                  "token": $this.token
                },
                type: "POST",
                dataType: "json",
                success: function(res) {
                  $this.ghlesson = $this.ghlesson.concat(res.data.data_list);
                  $this.ghallPage = res.data.page_num;
                  $this.ghpage = $this.ghpage + 1;
                  $this.ghloadFlag = false;
                  if ($this.ghpage > $this.ghallPage) {
                    $this.ghallDone = true;
                  }
                }
              });
            }
          } else {
            setTimeout(function() {
              $this.ghloadFlag = false;
            }, 5000);
          }
        },
        dkloadMore: function(event) {
          var $this = this;
          if (!$this.dkloadFlag) {
            $this.dkloadFlag = true;
            if ($this.dkpage > $this.dkallPage) {
              $this.dkallDone = true;
            } else {
              $.ajax({
                url: $ApiConf.api_user_collection_list,
                data: {
                  "page": $this.dkpage,
                  "page_num": 10,
                  "type": 1,
                  "token": $this.token
                },
                type: "POST",
                dataType: "json",
                success: function(res) {
                  $this.dklesson = $this.dklesson.concat(res.data.data_list);
                  $this.dkallPage = res.data.page_num;
                  $this.dkpage = $this.dkpage + 1;
                  $this.dkloadFlag = false;
                  if ($this.dkpage > $this.dkallPage) {
                    $this.dkallDone = true;
                  }
                }
              });
            }
          } else {
            setTimeout(function() {
              $this.dkloadFlag = false;
            }, 5000);
          }
        }
      }
    };

</script>

