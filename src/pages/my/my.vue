<script setup lang="ts">
import { useMemberStore } from '@/stores'
import type { BannerItem } from '@/types/home'
import { http } from '@/utils/http'
const memberStore = useMemberStore()

// 测试请求
const getData = async () => {
  const res = await http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
  })
  console.log('请求成功', res.result) // result 是 BannerItem[](可以根据实际情况修改) 类型数组
}
</script>

<template>
  <view class="my">
    <view>会员信息：{{ memberStore.profile }}</view>
    <button
      @tap="
        memberStore.setProfile({
          nickname: '黑马先锋',
          token: '123',
        })
      "
      size="mini"
      plain
      type="primary"
    >
      保存用户信息
    </button>
    <button @tap="memberStore.clearProfile()" size="mini" plain type="warn">清理用户信息</button>
    <button @tap="getData" size="mini" plain type="warn">测试请求</button>
  </view>
</template>

<style lang="scss">
//
</style>
