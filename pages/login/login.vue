<template>
    <view class="content">
		<view class="logo">
			<image src=""></image>
			<image src=""></image>
			<text>泓米瑞特光伏智能清扫机器人</text>
		</view>
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <input type="text" v-model="account" placeholder="请输入账号">
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <input type="text" password="true" v-model="password" placeholder="请输入密码">
            </view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="bindLogin">登录</button>
        </view>
    </view>
</template>

<script>
    import service from '../../service.js';
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data() {
            return {
                providerList: [],
                account: '13500000000',
                password: '123456',
                positionTop: 0
            }
        },
        methods: {
            bindLogin() {
				let that = this;
                let promise = new Promise((resolve,reject)=>{
					resolve()
				})
				promise.then(()=>{
					that.httpRequest({
						url:"sys/login",
						params:{
						  "phone": this.account,
						  "password": this.password
						},
						scb(res){
							if( res.data.code == 200 ){
								that.$store.state.token = res.data.token;
								that.$store.state.userMsg = res.data;
								uni.setStorage({
									key:"token",
									data:res.data.token,
									success() {
										console.log("return back")
										uni.showToast({
												title: "return back",
												duration: 2000
										});
										uni.navigateBack();
									}
								})
								uni.setStorage({
									key:"userMsg",
									data:res.data
								})	
							}

						},
						fcb(res){
							console.log( "fcb",res)
						}
					})
				})
            }
		},
        mounted() {
            
        }
    }
</script>

<style>
	.content{
		background-color: #061939;
	}
</style>
