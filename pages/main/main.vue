<template>
    <view class="content">
		<map class="map" :latitude="mapMsg.latitude" :longitude="mapMsg.longitude" :markers="location"></map>
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
			<view id="c_right">
				
			</view>
		</view>
    </view>
</template>

<script>
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入柱状图
	require('echarts/lib/chart/bar');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
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
				location: [{
					"latitude": 39,
					"longitude": 116
				}],
				barGraph:{}
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
							
						}
					},
					fcb(res){
						console.log( "errmmm", res)
					}
				})				
			},
			initChart(obj){
				var myChart = echarts.init(document.getElementById('c_left'));
			}
		}
    }
</script>

<style>
.header{
	display: flex;
	justify-content: space-between;
	margin-top: 25upx;
	height: 88upx;
	background-color: white;
	align-items: center;
	z-index: 100;
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
}
</style>
