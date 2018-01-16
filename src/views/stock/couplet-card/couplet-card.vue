<template>
	<div class="couplet-card">
		<div class="portlet-title" v-show='!showLog'>
			<Icon type="person-stalker"></Icon>
			<span class='title_text'>{{titleText}}</span>
		</div>
		<!--操作和查询框-->
		<div v-show='showList' class='query-wrap'>
			<div class="operate-wrap">
				<operate class='operate' 
					:moreOperateData='moreOperateData' 
					:deleteStatus='isSelect' 
					:edit='isSelect' 
					:data='data' 
					@handleBackLibrary = 'handleBackLibrary'
					:backLibraryStatus='backLibraryStatus'
					@deletedata='deletedata' 
					@handmoreclick='handmoreclick' 
					@addData='addData' 
					@editData='editData'></operate>

			</div>
			<div class="search-wrap">
				<search class='search-component'
					@query='query' 
					:placeholderValue='placeholderValue' 
					:searchdata='searchdata' ></search>
			</div>
		</div>
		
		<!--物联卡列表-->
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
			@on-change="change" 
			:actionUrl = 'url'
			@importSuccess='importSuccess'
			:modeltitle='importtitle'>
		</importdata>
		<Modal v-model="showBackLibraryForm" width="510">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>设备回库</span>
	        </p>
	        <div >
	        	<div class="control-group" style='height:40px;'>
					<span class='dec'>
						物联卡号
					</span>
					{{data.numberOfCard}}
				</div>
	            <div class="control-group">
					<span class='dec'>
						物联卡类型
					</span>
					<Select v-model="cardType" :disabled = 'isEdit' style="width:300px" >
						<Option v-for="item in cardTypes" :value="item.code" :key="item.value">{{ item.value }}</Option>
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
	import operate from '../../main-components/operate/operate.vue';
	import search from '../../main-components/search/search.vue';
	import importdata from '../../main-components/import-data/index.vue';
	import addsensor from './addAndEdit.vue';
	import log from './log.vue';
	import { add, update, query, deleteSensor, back } from '@/api/stock/couplet-card';
	import { lookUpdata, transformData } from '@/lookup';

	export default {
		name: 'sensor-manage',
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
						title: '运营商',
						key: 'carrierOperatorText'

					},
					{
						title: '物联卡号',
						key: 'numberOfCard',
						render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    
                                    on: {
                                        click: () => {
                                            this.show(params.index);
                                        }
                                    }
                                }, params.row.numberOfCard )
                            ]);
                       	},
                       
					},
					{
						title: 'ICCID',
						key: 'iccid'

					},
					{
						title: '所属仓库',
						key: 'storeHouseText'
					},
					{
						title: '物联卡类型',
						key: 'cardTypeText'
					},
					{
						title: '库存状态',
						key: 'stockStateText'
					},
					{
						title: '入库时间',
						key: 'displayCT'

					}
					
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
				titleText: '物联卡列表',
				iconType: 'person',
				isLoading: false,
				importstatus: false,
				importtitle: '导入数据',
				showLog: false,
				url: '/management-api/iotCards/import',
				queryParam: {
					"cardType": '',
					"stockState": '',
					"pageSize": 10,
					"keyWords": '',
					"pageNumber": 0
				},
				
				selectIndex: '',
				moreOperateData: [
					{
						name: '模板下载',
						icon: 'edit'
					},
					{
						name: '物联卡导入',
						icon: 'edit'
					}
				],
				searchdata: [{
						title: "库存状态",
						model: '全部',
						//code: 'STOCK',
						code: '',
						data: lookUpdata.StockStateLookup
					},
					{
						title: "物联卡类型",
						model: '全部',
						//code: 'NORMAL',
						code: '',
						data: lookUpdata.CardTypeLookup
					}
				],
				backLibraryStatus: false,
				showBackLibraryForm: false,
				cardTypes: lookUpdata.CardTypeLookup,
				cardType: 'NORMAL',
				remarks: '',
				modal_loading:false,
				numberOfCard: '',
				log_loading:false,//进入log页面加载
				numberParam: ''
			}
		},
		methods: {
			init() {

			},
			backLibrarySave () {
                this.modal_loading = true;
                let param = {
					"id": this.data.id,
					"cardType": this.cardType,
					"remarks": this.remarks
				};
				return new Promise((resolve, reject) => {
					back(this.data.numberOfCard, param).then(response => {

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
			backCoupletCard() {
				this.showLog = false;
				this.add = false;
				this.showList = true;
				this.isEdit = false;
			},
			handleBackLibrary(){
				this.showBackLibraryForm = true;
				this.cardType = this.data.cardType;
			},
			show (index) {
				console.log(index);
				this.data = this.listData[index];
				console.log(this.data)
				this.numberParam = this.listData[index].numberOfCard;
				this.showLog = true;
				this.add = false;
				this.showList = false;
				this.isEdit = false;
				
				
            },
//			导入成功刷新页面
            importSuccess(){
            	this.getListData();
            },
//			获取列表页面
			getListData() {
				
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					query(this.queryParam).then(response => {

						if(response.code == 200 ){
							this.isLoading = false;
							this.listData = response.content.data;
							this.total = response.content.rowCount;

							this.listData.forEach( (item ) => {
								
								//运营商转码
								transformData(
									item,
									lookUpdata.CarrierOperatorLookup,
									'carrierOperator', 
									'carrierOperatorText'
								);
								//CardTypeLookup 物联卡类型
								transformData(
									item,
									lookUpdata.CardTypeLookup,
									'cardType', 
									'cardTypeText'
								);
								//库存状态
								transformData(
									item,
									lookUpdata.StockStateLookup,
									'stockState', 
									'stockStateText'
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
						resolve()
					}).catch(error => {
						reject(error)
					})
				})
			},
			query(data) {
				console.log(data);
				this.queryParam.keyWords = data.keyWords;
				this.queryParam.stockState = data.selectData[0].code;
				this.queryParam.cardType = data.selectData[1].code;
				this.getListData();
			},
			addData() {
				this.add = true;
				this.showList = false;
				this.isEdit = false;
				this.titleText = '新增物联卡';
			},
			editData(){
				this.add = true;
				this.isEdit = true;
				this.showList = false;
				this.titleText = '编辑物联卡'
			},
			change(val) {
				this.importstatus = val;
			},
			deletedata(data) {
				
				let index = this.selectIndex;
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					deleteSensor(data.id).then(response => {

						console.log(response);
						if(response.code == 204 ){
							this.isLoading = false;
//							删除成功,页面删除点击的那行，此时要取消选中行，隐藏修改喝删除按钮
							this.listData.splice(index,1);
							this.isSelect = false;
							this.total = this.total - 1;
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
				this.titleText = '物联卡列表';
				
			},
			save() {
				this.back();
				this.getListData();
				this.isSelect = false;
			},
			selectItem(data, index) {

				this.data = data;
				this.selectIndex = index;
				
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
				
				console.log(name)
				if(name == '物联卡导入'){
					this.importstatus = true;
				}
				if(name == '模板下载'){
					window.open("/management-api/upload/template/iotCard.xlsx");
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
			this.init();
			this.getListData();
			
		}

	};
</script>

<style lang='less'>
	@import "../../../styles/searchAndOperate.less";
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