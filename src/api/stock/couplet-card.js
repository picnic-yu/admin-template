import request from '../../libs/request';
import store from '@/store/index';

export function add(obj) {
	console.log(store);
	return request({
		url: '/management-api/iotCards/',
		method: 'post',
		data: obj
	})
}

export function update(id,obj) {
	return request({
		url: '/management-api/iotCards/' + id,
		method: 'put',
		data: obj
	})
}

export function query(obj) {
	return request({
		url: '/management-api/iotCards/pg',
		method: 'post',
		data: obj
	})
}

export function deleteSensor(id) {
	return request({
		url: '/management-api/iotCards/'+ id,
		method: 'delete'
	})
}
export function back(id,obj) {
	return request({
		url: '/management-api/iotCards/back/' + id,
		method: 'put',
		data: obj
	})
}
export function logAction(number) {
	return request({
		url: '/management-api/stock/logs/IOTCARD/' + number,
		method: 'get'
	})
}