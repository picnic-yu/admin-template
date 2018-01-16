import axios from 'axios';
import store from '../store';
import { Message } from 'iview';
import { getToken } from './auth';

// 创建axios实例
const service = axios.create({
	baseURL: process.env.BASE_API, // api的base_url
	timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {

	if(store.state.user.token) {
		config.headers['authorization'] = store.state.user.token; // 让每个请求携带自定义token 请根据实际情况自行修改
	}
	return config
}, error => {
	// Do something with request error
	console.log(error) // for debug
	Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
	response => {
		/**
		 * code为非20000是抛错 可结合自己业务进行修改
		 */
		const res = response.data
		if(res.code == 200) {

//			Message.success(res.message);
			return response.data
		} else if(res.code == 201){
//			Message.success(res.message);
			return response.data
		}else if(res.code == 504) {
			return response.data
		}else{
//			Message.error('服务器异常');
			return response.data
		}
	},
	error => {
		console.log('err' + error) // for debug

		return Promise.reject(error)
	}
)

export default service