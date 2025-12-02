<script setup lang="ts">
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'
import type XtxGuess from '@/components/XtxGuess.vue'

const bannerList = ref<BannerItem[]>([])
const getBanner = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const categoryList = ref<CategoryItem[]>([])
const getHomeCategory = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

const hotList = ref<HotItem[]>([])
const getHomeHot = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

const guessRef = ref<InstanceType<typeof XtxGuess>>()
const onScrolltolower = () => {
  guessRef.value?.getMore()
}

const isLoading = ref(true)
const isTriggered = ref(false)
const onRefresherrefresh = async () => {
  isTriggered.value = true
  guessRef.value?.resetData()
  await Promise.all([getBanner(), getHomeCategory(), getHomeHot(), guessRef.value?.getMore()])
  isTriggered.value = false
}

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getBanner(), getHomeCategory(), getHomeHot()])
  isLoading.value = false
})
</script>

<template>
  <CustomNavbar></CustomNavbar>
  <scroll-view
    class="scroll-view"
    scroll-y
    @scrolltolower="onScrolltolower"
    :refresher-enabled="true"
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
  >
    <PageSkeleton v-if="isLoading"></PageSkeleton>
    <template v-else>
      <XtxSwiper :list="bannerList"></XtxSwiper>
      <CategoryPanel :list="categoryList"></CategoryPanel>
      <HotPanel :list="hotList"></HotPanel>
      <XtxGuess ref="guessRef"></XtxGuess>
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
