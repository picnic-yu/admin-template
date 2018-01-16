import request from '../../libs/request';
import store from '@/store/index';

export function addShipments(obj) {
	console.log(store);
	return request({
		url: '/management-api/shipments/',
		method: 'post',
		data: obj
	})
}
export function addDetail(obj) {
	console.log(store);
	return request({
		url: '/management-api/shipments/details/',
		method: 'post',
		data: obj
	})
}

export function updateShipments(id,obj) {
	return request({
		url: '/management-api/shipments/' + id,
		method: 'put',
		data: obj
	})
}
export function updateDetails(id,obj) {
	return request({
		url: '/management-api/shipments/details/' + id,
		method: 'put',
		data: obj
	})
}

export function queryShipments(obj) {
	return request({
		url: '/management-api/shipments/pg',
		method: 'post',
		data: obj
	})
}
export function queryDetails(id) {
	return request({
		url: '/management-api/shipments/'+id+'/details',
		method: 'get'
	})
}

export function confirmShipments(id) {
	return request({
		url: '/management-api/shipments/confirm/' + id,
		method: 'put'
	})
}



export function deleteShipments(id) {
	return request({
		url: '/management-api/shipments/' + id,
		method: 'delete'
	})
}
export function deleteDetails(id) {
	return request({
		url: '/management-api/shipments/details/' + id,
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