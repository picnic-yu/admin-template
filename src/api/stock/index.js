import request from '../../libs/request';
import store from '@/store/index';

export function add(obj) {
	console.log(store);
	return request({
		url: '/management-api/sensors/',
		method: 'post',
		data: obj
	})
}

export function update(id,obj) {
	return request({
		url: '/management-api/sensors/' + id,
		method: 'put',
		data: obj
	})
}

export function query(obj) {
	return request({
		url: '/management-api/sensors/pg',
		method: 'post',
		data: obj
	})
}

export function deleteSensor(id) {
	return request({
		url: '/management-api/sensors/'+ id,
		method: 'delete'
	})
}
export function back(id,obj) {
	return request({
		url: '/management-api/sensors/back/' + id,
		method: 'put',
		data: obj
	})
}
export function logAction(number) {
	return request({
		url: '/management-api/stock/logs/SENSOR/' + number,
		method: 'get'
	})
}