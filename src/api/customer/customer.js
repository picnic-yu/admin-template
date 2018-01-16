import request from '../../libs/request';
import store from '@/store/index';

export function add(obj) {
	console.log(store);
	return request({
		url: '/management-api/customers/',
		method: 'post',
		data: obj
	})
}

export function update(id,obj) {
	return request({
		url: '/management-api/customers/' + id,
		method: 'put',
		data: obj
	})
}

export function query(obj) {
	return request({
		url: '/management-api/customers/pg',
		method: 'post',
		data: obj
	})
}

export function deleteSensor(id) {
	return request({
		url: '/management-api/customers/'+ id,
		method: 'delete'
	})
}