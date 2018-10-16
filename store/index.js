import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
        userName: "",
		httpUrl:"http://192.168.1.80:8004",
		token:"",
		userMsg:{}
    },
	actions:{
		http(context,obj){
			context.commit('httpRequest',obj)
		}
	},
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        },
		httpRequest(state,obj){
			let that = this;
			uni.request({
				url: `${state.httpUrl}/${obj.url}`, //仅为示例，并非真实接口地址。
				method:obj.method || "POST",
				data: obj.params,
				header: {
					"token": state.token || "",
					"content-type" : obj.contentType || "application/json"
				},
				success: (res) => {
					obj.scb(res)
				},
				fail(res){
					obj.fcb(res)
				}
			});
		}
    }
})

export default store
