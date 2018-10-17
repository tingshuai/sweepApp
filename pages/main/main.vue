<template>
    <view class="content">
			<map :style="{height: mapHeight}" class="map" :controls="controls" @controltap="tapControl" :latitude="mapMsg.latitude" :longitude="mapMsg.longitude" :markers="location">
		
			</map>
			<view class="header">
				<view class="h_left">
					sdf
				</view>
				<view class="h_center">
					{{ userMsg.userName }}
				</view>
				<view class="h_right">
					<text>退出</text>
				</view>
			</view>
			<view class="charts">
				<view id="c_left">
					
				</view>
				<view id="c_right" ref="c_right">
					
				</view>
			</view>
    </view>
</template>

<script>

    import {
        mapState,
		mapMutations
    } from 'vuex'

    export default {
        data() {
            return {
                userMsg:{},
				mapMsg:{
					latitude:39.909,
					longitude:116.39742
				},
				mapHeight:"100%",
				location: [],
				barGraph:{},
				controls:[
					{
						id:"c_left",
						position:{
							top:40,
							left:20,
							width:50,
							height:88
						},
						iconPath:"../../static/img/home.png",
						clickable:true
					}
				]
            }
        },		
        computed: mapState(['userMsg','token']),
        onLoad() {
			let that = this;
			uni.getStorage({
				key: 'token',
				success: function (res) {
					that.$store.state.token	= res.data;
					that.getPosition()
					that.getChartData({type:"normal"})
				},
				fail(res) {
					uni.navigateTo({
						url: '../login/login'
					});					
				}
			});
        },
		onShow() {
			let that = this;
			uni.getStorage({
				key:'userMsg',
				success(_res){
					that.$store.state.userMsg = _res.data;
					that.userMsg = _res.data;
				}
			})			
		},
		methods:{
			...mapMutations(['login','httpRequest']),
			tapControl(e){
				console.log(e)
				this.mapHeight = "40%";
				console.log(this.mapHeight)
			},
			getPosition(){//获取清扫机位置
				let that = this;
				that.httpRequest({
					url:'cars/macPosition',
					method:"GET",
					scb(res){
						if( res.data.code == 200 ){
							let _location = [];
							res.data.data.filter((item)=>{
								_location.push({
									"latitude":item.latitude,
									"longitude":item.longitude
								})
							})
							that.mapMsg.latitude = res.data.data[0].latitude;
							that.mapMsg.longitude = res.data.data[0].longitude;
							that.location = _location;
						}
					},
					fcb(res){
						console.log( "errmmm", res)
					}
				})
			},
			getChartData(obj){
				let that = this;
				that.httpRequest({
					url:'cars/getVoltageStatic',
					method:"GET",
					params:{
						areaNo:"",
						type:obj.type
					},
					scb(res){
						console.log(res)
						if( res.data.code == 200 ){
							let _data = [{
								value:res.data.data.errors,
								name:"低电压占比",
							},{
								value:res.data.data.total - res.data.data.errors,
								name:"正常电压占比",
							}]
							that.initChart({
								series : [{
									type: 'pie',
									radius : '55%',
									center: ['50%', '60%'],
									data:_data
								}]
							})
						}
					},
					fcb(res){
						console.log( "errmmm", res)
					}
				})				
			},
			initChart(obj){
				console.log(this.$refs.c_right)
			}
		}
    }
</script>

<style lang="less">
.header{
	display: flex;
	justify-content: space-between;
	top: 25upx;
	height: 88upx;
	background-color: white;
	align-items: center;
	z-index: 1000;
	position: fixed;
	width: 100%;
}
.map{
	position: absolute;
	height: 100%;
	width: 100%;
	z-index: 0;
}
.charts{
	height: 300upx;
	background-color: white;
	width: 100%;
	position: fixed;
	bottom: 0;
	display: block;
	z-index: 1000;
	#c_left{
		width: 50%;
		background-color: white;
		height: 100%;
		display: inline-block;
	}
	#c_right{
		width: 50%;
		background-color: white;
		height: 100%;
		display: inline-block;
	}
}
</style>
