<template>
  <aside class="right">
    <ul v-if="userinfo.id" class="icon-group">
      <li>
        <i class="iconfont icon-mail"></i>
      </li>
      <li @click="$router.push('/index/options')">
        <i class="iconfont icon-shezhi"></i>
      </li>
      <li>
        <i class="iconfont icon-changyonggongneng"></i>
      </li>
    </ul>
    <p v-else>
      访客你好 去<RouterLink to="/login" style="color: rgb(124, 12, 226)">登录</RouterLink>
    </p>
    <div class="container" @mouseenter="infoShow = true" @mouseleave="infoShow = false">
      <div class="avatar">
        <MyElimage v-if="userinfo.id" :img="userinfo.avatar" :zip="2" />
        <MyElimage v-else :img="Logo" alt="占位图片" :zip="2" />
      </div>
      <transition name="toptodown" mode="out-in">
        <div v-show="infoShow" class="info-box">
          <!-- 显示个人用户设置的背景图 -->
          <div class="imgmask" v-if="userinfo.banner"></div>
          <div class="imgcontainer" v-if="userinfo.banner">
            <MyElimage :img="userinfo.banner" :zip="3" v-if="userinfo.banner" />
          </div>
          <div class="loginbox" v-if="userinfo.id">
            <div class="up">
              <div class="info">
                <h2>{{ userinfo.nickname }}</h2>
                <div>{{ userinfo.introduce }}</div>
              </div>
            </div>
            <div class="button">
              <ul>
                <li @click="$router.push('/index/home')">
                  <i class="iconfont icon-geren"></i>
                  <span>个人中心</span>
                </li>
                <li @click="$router.push('/index/create')">
                  <i class="iconfont icon-edit"></i>
                  <span>我的发布</span>
                </li>
                <li @click="$router.push('/index/options')">
                  <i class="iconfont icon-shezhi"></i>
                  <span>设置</span>
                </li>
                <li @click="logout">
                  <i class="iconfont icon-close_circle"></i>
                  退出登录
                </li>
              </ul>
            </div>
          </div>
          <div class="nologin" v-else>
            喵~ 点击这里跳转
            <RouterLink to="/login" style="color: rgb(124, 12, 226)">登录 </RouterLink>
          </div>
        </div>
      </transition>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import Logo from '@/assets/img/logo.png';
defineProps({
  userinfo: {
    type: Object as PropType<UserEasy>,
    default: () => {
      return {};
    }
  }
});
const emit = defineEmits(['logout']);
const logout = () => {
  emit('logout');
};
let infoShow = ref(false);
</script>

<style lang="less" scoped>
@import url(../styles/RightInfoBox.less);
</style>
