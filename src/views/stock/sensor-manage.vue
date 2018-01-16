<template>
	<div class="sensor-manage">
		<div class="portlet-title" v-if='!showLog'>
			<Icon type="person-stalker"></Icon>
			<span class='title_text'>{{titleText}}</span>
		</div>
		<div v-show='showList' class='query-wrap'>
			<div class="operate-wrap">
				<operate class='operate' 
					:moreOperateData='moreOperateData' 
					:deleteStatus='isSelect' 
					:edit='isSelect' 
					:data='data' 
					@handleBackLibrary = 'handleBackLibrary'
					@deletedata='deletedata' 
					@handmoreclick='handmoreclick' 
					@addData='addData'
					:backLibraryStatus='backLibraryStatus'
					@editData='editData'>
				</operate>

			</div>
			<div class="search-wrap">
				<search class='search-component'
					@query='query' 
					:showDate = 'true' 
					:dateTime = 'dateTime'
					:placeholderValue='placeholderValue' 
					:searchdata='searchdata' >
				</search>
			</div>
		</div>
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
		<!--日志-->
		<div class="log-list" v-if='showLog'>
			<log 
				@backCoupletCard = 'backCoupletCard' 
				:basicdata='data'
				:numberParam='numberParam'></log>
			
		</div>
		
		<addsensor v-if='add'
			:isEdit='isEdit' 
			:editData='data'  
			@back='back' 
			@save='save'>
		</addsensor>
		<importdata 
			:importstatus='importstatus' 
			:actionUrl = 'url'
			@importSuccess='importSuccess'
			@on-change="change" 
			:modeltitle='importtitle'>
		</importdata>
		<Modal v-model="showBackLibraryForm" width="510">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>设备回库</span>
	        </p>
	        <div >
	        	<div class="control-group" style='height:40px;'>
					<span class='dec'>
						传感器序列号
					</span>
					{{data.serialNumber}}
				</div>
	            <div class="control-group">
					<span class='dec'>
						传感器状态
					</span>
					<Select v-model="sensorType"   style="width:300px">
						<Option v-for="item in sensorTypeLookup" :value="item.code" :key="item.value">{{ item.value }}</Option>
					</Select>
				</div>
				<div class="control-group">
					<span class='dec'>
						说明
					</span>
					<Input 
						v-model="remarks" 
						type="textarea" 
						:maxlength= 50
						:autosize="{minRows: 2,maxRows: 3}" 
						style="width: 300px">
					</Input>
				</div>
	        </div>
	        <div slot="footer">
	            <Button 
	            	type="info"
	            	size="large" 
	            	:loading="modal_loading" 
	            	@click="backLibrarySave">
	            	保存
	            </Button>
	        </div>
    	</Modal>
	</div>
</template>

<script>
	import operate from '../main-components/operate/operate.vue';
	import search from '../main-components/search/search.vue';
	import importdata from '../main-components/import-data/index.vue';
	import addsensor from './add-sensor.vue';
	import log from './log.vue';
	import { add, update, query, deleteSensor, back } from '@/api/stock/index';
	import { lookUpdata, transformData } from '@/lookup';

	export default {
		name: 'sensor-manage',
		data() {
			return {
				columns1: [
					{
						title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
					{
						title: '传感器序列号',
						key: 'serialNumber',
						render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    
                                    on: {
                                        click: () => {
                                            this.show(params.index);
                                        }
                                    }
                                }, params.row.serialNumber )
                            ]);
                       	},

					},
					{
						title: '型号',
						key: 'SensorModelText'

					},
					{
						title: 'MAC地址',
						key: 'mac'
					},
					
					{
						title: 'IMEI',
						key: 'imei'

					},
					{
						title: '传感器状态',
						key: 'sensorTypeText'

					},
					{
						title: '所属仓库',
						key: 'storeHouseText'
					},
					{
						title: '库存状态',
						key: 'stockStateText'

					},
					{
						title: '入库时间',
						key: 'displayCT'

					},
					{
						title: '购入日期',
						key: 'shippingDate',
						sortable: true

					}
					
				],
				listData: [],
				data: {},
				isSelect: false,
				value: '',
				total: 0,
				backLibraryStatus: false,
				url: '/management-api/sensors/import',
				showBackLibraryForm:false,
				pageNumber: 1,
				placeholderValue: '请输入序列号或MAC地址或IMEI',
				add: false, // 点击添加切换
				isEdit: false, // 点击编辑切换
				showList: true, //显示列表
				titleText: '传感器列表',//页面头部文字
				iconType: 'person',//页面头部icon
				isLoading: false,//加载表格状态
				selectIndex: null,//选中表格的行数
				importstatus: false,
				importtitle: '导入数据',
				modal_loading:false,
				queryParam: {
					"pageSize" : 10,
					"keyWords" : '',
					"pageNumber": 0,
					"productionDate": '',
					"stockState": '',
					"sensorType": '',
					"sensorSeries": '',
					"sensorModel": ''
				},
				moreOperateData: [
					{
						name: '模板下载',
						icon: 'edit'
					},
					{
						name: '传感器导入',
						icon: 'edit'
					}
				],
				dateTime: {
					title: '生产日期',
						type: 'date',
						value: ''
				},
				searchdata: [{
						title: "库存状态",
						model: '全部',
						code: '',
						data: lookUpdata.StockStateLookup
					},
					{
						title: "库存类别",
						model: '全部',
						code: '',
						data: lookUpdata.SensorTypeLookup
					},
					{
						title: "传感器类型",
						model: '全部',
						code: '',
						data: lookUpdata.SensorSeriesLookup
					},
					{
						title: "传感器型号",
						model: '全部',
						code: '',
						data: lookUpdata.SensorModelLookup
					}
				],
				remarks: '',
				sensorTypeLookup: lookUpdata.SensorTypeLookup,
				sensorType: 'NORMAL',
				showLog: false
			}
		},
		methods: {
//			获取列表数据
			getListData() {
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					query(this.queryParam).then(response => {

						if(response.code == 200 ){
							this.isLoading = false;
							this.listData = response.content.data;
							this.total = response.content.rowCount;
							this.listData.forEach( (item) => {
								//库存状态
								transformData(
									item,
									lookUpdata.StockStateLookup,
									'stockState', 
									'stockStateText'
								);
								//类型
								transformData(
									item,
									lookUpdata.SensorSeriesLookup,
									'sensorSeries', 
									'sensorSeriesText'
								);
								//型号
								transformData(
									item,
									lookUpdata.SensorModelLookup,
									'sensorModel', 
									'SensorModelText'
								);
								//库存类型
								transformData(
									item,
									lookUpdata.SensorTypeLookup,
									'sensorType', 
									'sensorTypeText'
								);
								//所属仓库
								transformData(
									item,
									lookUpdata.StoreHouseLookup,
									'storeHouse', 
									'storeHouseText'
								);
								
							});
						}
						resolve();
					}).catch(error => {
						reject(error);
					})
				})
			},
//			导入成功
			importSuccess(){
				this.getListData();
			},
//			查询数据
			query(data) {
				console.log(data);

				this.queryParam.keyWords = data.keyWords;
				this.queryParam.productionDate = data.time;
				this.queryParam.stockState = data.selectData[0].code;
				this.queryParam.sensorType = data.selectData[1].code;
				this.queryParam.sensorSeries = data.selectData[2].code;
				this.queryParam.sensorModel = data.selectData[3].code;

				this.getListData();
			},
//			显示log页面
			show (index) {
				console.log(index);
				this.data = this.listData[index];
				this.numberParam = this.listData[index].serialNumber;
				this.showLog = true;
				this.add = false;
				this.showList = false;
				this.isEdit = false;
				
				
            },
//			返回到列表页面
			backCoupletCard() {
				this.showLog = false;
				this.add = false;
				this.showList = true;
				this.isEdit = false;
			},
			backLibrarySave () {
                this.modal_loading = true;
                let param = {
					"id": this.data.id,
					"sensorType": this.sensorType,
					"remarks": this.remarks
				};
				return new Promise((resolve, reject) => {
					back(this.data.id, param).then(response => {

						console.log(response);
						if(response.code == 201){
							this.modal_loading = false;
                    		this.showBackLibraryForm = false;
                    		this.$Message.success('保存成功');
                    		this.getListData();
                    		this.remarks = '';
						}else{
							this.$Message.error('保存失败');
						}
						
						resolve()
					}).catch(error => {
						reject(error)
					})
				})
            },
//         	添加数据
			addData() {
				this.add = true;
				this.showList = false;
				this.isEdit = false;
				this.titleText = '新增传感器';
			},
//			编辑数据
			editData(){
				this.add = true;
				this.isEdit = true;
				this.showList = false;
				console.log(this.data);
				console.log(this.isEdit)
				this.titleText = '编辑传感器'
			},
			handleBackLibrary(){
				this.showBackLibraryForm = true;
				this.sensorType = this.data.sensorType;
			},
			backSensorList(){
				this.showBackLibraryForm = false;
				this.showList = true;
			},
			change(val) {
				this.importstatus = val;
			},
//			删除数据
			deletedata(data) {
				let index = this.selectIndex;
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					deleteSensor(data.id).then(response => {

						console.log(response);
						if(response.code == 204 ){
							this.isLoading = false;
							//删除成功,页面删除点击的那行，此时要取消选中行，隐藏修改和删除按钮
							this.listData.splice(index,1);
							this.isSelect = false;
							this.total = this.total - 1;
						}
						resolve();
					}).catch(error => {
						reject(error);
					})
				})
			},
			back() {
				this.add = false;
				this.showList = true;
				this.titleText = '传感器列表';
				
			},
			save() {
				this.back();
				this.getListData();
				this.isSelect = false;
			},
			selectItem(data, index) {
				console.log(data);
				this.data = data;
				this.selectIndex = index;
				console.log(this.data);
				if( data.stockStateText == '出库'){
					this.backLibraryStatus = true;
					this.isSelect = false;
				}
				if( data.stockStateText == '在库' ){
					this.isSelect = true;
					this.backLibraryStatus = false;
				}
				
			},
			pageChange(data) {
				this.queryParam.pageNumber = data -1;
				this.getListData();
			},
			handmoreclick(name){
				
				if(name == '传感器导入'){
					this.importstatus = true;
				}
				if(name == '模板下载'){
					window.open("/management-api/upload/template/sensor.xlsx");
				}
			}
		},
		components: {
			operate,
			search,
			importdata,
			addsensor,
			log
		},
		mounted() {
			this.getListData();
		}

	};
</script>

<style lang='less'>
	
	@import "../../styles/searchAndOperate.less";
	.control-group {
		height: 55px;
		.error_text {
			color: red;
			padding-left: 10px;
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
	}
</style>