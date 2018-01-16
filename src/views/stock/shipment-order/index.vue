<template>
	<div class="couplet-card">
		<div class="list" v-show='!showAddOrEdit'>
			<div class="portlet-title">
				<Icon type="person-stalker"></Icon>
				<span class='title_text'>出货单列表信息</span>
			</div>
			<div v-show='showList' class='query-wrap'>
				<div class="operate-wrap">
					<operate class='operate' 
						:deleteStatus='isSelect' 
						:edit='isSelect' 
						:data='data'
						:confirmStatus='confirmStatus'
						@deletedata='deletedata' 
						@handleConfirmClick='handleConfirmClick'
						@addData='addData' 
						@editData='editData'>
					</operate>
	
				</div>
				<div class="search-wrap">
					<search class='search-component'
						@query='query' 
						:placeholderValue='placeholderValue' 
						:searchdata='searchdata' >
					</search>
				</div>
			</div>
			
			<!--基本信息列表-->
			<div class="list" v-show='showList'>
	
				<div class='table-wrap'>
					<i-table stripe highlight-row 
						:columns="columns1" 
						:data="listData" 
						@on-row-click='selectItem'> 
					</i-table>
	
					<Spin :fix='true' v-show='isLoading'>
						<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
						<div>Loading</div>
					</Spin>
				</div>
				<Page class='page-wrap' show-elevator show-total  
					:total="total" 
					@on-change='pageChange' >
				</Page>
	
			</div>
		
		</div>
		<!--新增编辑-->
		<div class="editOradd" v-if='showAddOrEdit'>
			<Tabs type="card">
		        <TabPane label="出货单信息">
		        	<addoredit 
						:isEdit = 'isEdit'
						@backList='backList'
						@save='saveNoBack'
						@savebackList='savebackList'
						:editData = 'data'>
					</addoredit>
		        </TabPane>
		        <TabPane label="出货单明细" :disabled = '!detailStatus'>
		        	<detail 
		        		:shipmentId='shipmentId'
		        		@back='backList'
		        		v-if='detailStatus'></detail>
		        </TabPane>
		    </Tabs>
			
		</div>
	</div>
</template>

<script>
	import operate from '../../main-components/operate/operate.vue';
	import search from '../../main-components/search/search.vue';
	import addoredit from './addOrEdit.vue';
	import detail from './detail.vue';
	import { addShipments, queryShipments, updateShipments, confirmShipments, deleteShipments  } from '@/api/shipment/index';
	import { lookUpdata, transformData } from '@/lookup';
	import util from '@/libs/util';

	export default {
		name: 'basic',
		data() {
			let self  = this;
			return {
				columns1: [
					{
						title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
					{
						title: '出货单编号',
						key: 'shipmentNumber'

					},
					{
						title: '出单类型',
						key: 'fromTypeText'
					},
					{
						title: '订单/领料单编号',
						key: 'orderNumber'

					},
					{
						title: '出货地址',
						key: 'shipmentAddress'
					},
					{
						title: '出货日期',
						key: 'shipmentDate'
					},
					{
						title: '出货单状态',
						key: 'shipmentStateText'
					},
					{
						title: '操作人',
						key: 'operator'
					},
					{
						title: '备注',
						key: 'remarks'
					},
				],
				listData: [],
				data: {},
				isSelect: false,
				value: '',
				total: 0,
				placeholderValue: '输入ICCID号或者物联卡号',
				add: false, // 点击添加切换
				isEdit: false, // 点击编辑切换
				showList: true, //显示列表
				isLoading: false,
				url: '/management-api/iotCards/import',
				queryParam: {
					
					"pageSize": 10,
					"keyWords": '',
					"pageNumber": 0
				},
				
				selectIndex: '',
				searchdata: [{
						title: "出货单状态",
						model: '全部',
						//code: 'STOCK',
						code: '',
						data: lookUpdata.ShipmentStateLookup
					}
				],
				showAddOrEdit: false,//是否显示编辑或者修改组件
				modal_loading:false,
				numberOfCard: '',
				numberParam: '',
				
				remarks: '',
				fromType: 'ORDER',//出单类型
				fromTypeList:lookUpdata.ShipmentFromTypeLookup,
				orderNumber:'',//订单编号
				shipmentState:'UNCONFIEM',//出货单状态
				shipmentStateList:lookUpdata.ShipmentStateLookup,
				shipmentAddress: '',//出货地址
				shipmentDate: util.addDate(new Date(),0),//出货日期
				shipmentAddressError: false,
				orderNumberError: false,
				confirmStatus: false,
				detailStatus: false,
				shipmentId: '',//显示明细查询时候的id
			}
		},
		methods: {
			init() {

			},
			saveNoBack(id){
				this.detailStatus = true;
				this.shipmentId = id;
				this.getListData();
				console.log(id);
				
			},
			savebackList(){
				this.getListData();
				this.backList();
			},
			backList(){
				this.showAddOrEdit = false;
			},
			handleConfirmClick(){
				this.isLoading = false;
				return new Promise((resolve, reject) => {
						
					confirmShipments(this.data.id).then(response => {

						console.log(response);
						if(response.code == 204){
							this.isLoading = false;
                    		this.showAddOrEdit = false;
                    		this.$Message.success('确认成功');
                    		this.getListData();
                    		this.isSelect = false;
						}else{
							this.$Message.error('确认失败');
						}
						
						resolve()
					}).catch(error => {
						reject(error)
					})
				})
				
			},
			getListData() {
				
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					queryShipments(this.queryParam).then(response => {

						if(response.code == 200 ){
							this.isLoading = false;
							this.isSelect = false;
							this.confirmStatus = false;
							this.listData = response.content.data;
							this.total = response.content.rowCount;

							this.listData.forEach( (item ) => {
								
								//出货单状态
								transformData(
									item,
									lookUpdata.ShipmentStateLookup,
									'shipmentState', 
									'shipmentStateText'
								);
								//CardTypeLookup 物联卡类型
								transformData(
									item,
									lookUpdata.ShipmentFromTypeLookup,
									'fromType', 
									'fromTypeText'
								);
								
							});
							
						}
						resolve()
					}).catch(error => {
						reject(error)
					})
				})
			},
			query(data) {
				console.log(data);
				this.queryParam.keyWords = data.keyWords;
				this.queryParam.shipmentState = data.selectData[0].code;
				this.getListData();
			},
			addData() {
				this.add = true;
				this.detailStatus = false;
				console.log(this.detailStatus)
				this.shipmentAddressError = false;
				this.orderNumberError = false;
				this.showAddOrEdit = true;
				this.isEdit = false;
				
			},
			editData(){
				this.detailStatus = true;
				this.add = true;
				this.isEdit = true;
				this.shipmentId = this.data.id;
				this.showAddOrEdit = true;
				
			},
			deletedata(data) {
				
				let index = this.selectIndex;
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					deleteShipments(data.id).then(response => {

						console.log(response);
						if(response.code == 204 ){
							this.isLoading = false;
							this.$Message.success('删除成功');
//							删除成功,页面删除点击的那行，此时要取消选中行，隐藏修改喝删除按钮
							this.listData.splice(index,1);
							this.isSelect = false;
							this.total = this.total - 1;
						}else{
							this.$Message.error('删除失败');
						}
						resolve()
					}).catch(error => {
						reject(error)
					})
				})
			},
			back() {
				this.add = false;
				this.showList = true;
				this.titleText = '库存传感器列表';
				this.isSelect = true;
				
			},
			save() {
				this.back();
				this.getListData();
				this.isSelect = false;
			},
			selectItem(data, index) {

				this.data = data;
				this.selectIndex = index;
				this.isSelect = true;
//				待确认
				if( data.shipmentState == 'UNCONFIEM'){
					this.isSelect = true;
					this.confirmStatus = true;
				}else{
					this.isSelect = false;
					this.confirmStatus = false;
				}
//				
				
				
			},
			pageChange(data) {
				this.queryParam.pageNumber = data -1;
				this.getListData();
			}
		},
		components: {
			operate,
			search,
			addoredit,
			detail
		},
		mounted() {
			this.init();
			this.getListData();
			
		},
		watch:{
			
		}

	};
</script>

<style lang='less'>
	@import "../../../styles/searchAndOperate.less";
		.control-group {
		height: 55px;
		.error_text {
			color: red;
			padding-left: 110px;
		}
	}
	
	.dec {
		display: inline-block;
		vertical-align: middle;
		width: 90px;
		text-align: right;
		height: 25px;
		line-height: 25px;
		font-size: 14px;
		margin-right: 10px;
		.symbol{
			color:red;
		}
	}
	.ivu-tabs-bar{
		margin-bottom: 0;
	}
	
</style>