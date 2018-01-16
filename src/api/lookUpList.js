import request from '../libs/request';

export function getLookUpList(name) {
	
	return request({
		url: '/management-api/lookupLists/lookupName/' + name + '/lookupValues/',
		method: 'get'
	})
};