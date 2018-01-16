import request from '../../libs/request';
import store from '@/store/index';

export function upload(url,obj) {
	
	return request({
		url: url,
		method: 'post',
		data: obj
	})
};