<template>
	<div class="couplet-card">
		<div v-show='showList' class='query-wrap'>
			<div class="operate-wrap">
				<operate class='operate' 
					:moreOperateData='moreOperateData' 
					:edit='isSelect' 
					:data='data' 
					@handmoreclick='handmoreclick' 
					@addData='addData' 
					@editData='editData'>
				</operate>

			</div>
			<div class="search-wrap">
				<search class='search-component'
					@query='query' 
					:showDate = 'true' 
					:dateTime = 'dateTime'
					:placeholderValue='placeholderValue'  >
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
			:modeltitle='importtitle'>
		</importdata>
	</div>
</template>

<script>
	import operate from '@/views/main-components/operate/operate.vue';
	import search from '@/views/main-components/search/search.vue';
	import importdata from '@/views/main-components/import-data/index.vue';
	import addsensor from './addAndEdit.vue';
	import { add, update, query, deleteSensor } from '@/api/stock/couplet-card';
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
						key: 'numberOfCard'
					},
					{
						title: 'ICCID',
						key: 'iccid'

					},
					{
						title: '物联卡类型',
						key: 'cardTypeText'
					},
					{
						title: '库存状态',
						key: 'stockStateText'
					}
				],
				listData: [],
				data: {},
				isSelect: false,
				value: '',
				total: 0,
				placeholderValue: '请输入公司名称或信用代码',
				add: false, // 点击添加切换
				isEdit: false, // 点击编辑切换
				showList: true, //显示列表
				titleText: '库存物联卡列表',
				iconType: 'person',
				isLoading: false,
				importstatus: false,
				importtitle: '导入数据',
				url: '/management-api/iotCards/import',
				queryParam: {
					"cardType": '',
					"stockState": '',
					"pageSize": 10,
					"keyWords": '',
					"pageNumber": 0
				},
				dateTime: {
					title: '生产日期',
						type: 'date',
						value: ''
				},
				selectIndex: '',
				moreOperateData: [
					{
						name: '下载模块',
						icon: 'edit'
					},
					{
						name: '导入',
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
				]
			}
		},
		methods: {
			init() {

			},
			getListData() {
				
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					query(this.queryParam).then(response => {

						if(response.code == 200 ){
							this.isLoading = false;
							this.listData = response.content.data;
							this.total = response.content.rowCount;
 
							this.listData.forEach( (item) => {
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
				this.titleText = '新增库存传感器';
			},
			editData(){
				this.add = true;
				this.isEdit = true;
				this.showList = false;
				this.titleText = '编辑库存传感器'
			},
			change(val) {
				this.importstatus = val;
			},
			
			back() {
				this.add = false;
				this.showList = true;
				this.titleText = '库存传感器列表';
				this.isSelect = false;
				
			},
			save() {
				this.back();
				this.getListData();
				this.isSelect = false;
			},
			selectItem(data, index) {

				this.data = data;
				this.selectIndex = index;
				console.log(data)
				console.log(index)
				
				this.isSelect = true;
			},
			pageChange(data) {
				this.queryParam.pageNumber = data -1;
				this.getListData();
			},
			handmoreclick(name){
				
				console.log(name)
				if(name == '导入'){
					this.importstatus = true;
				}
			}
		},
		components: {
			operate,
			search,
			importdata,
			addsensor
		},
		mounted() {
			this.init();
			this.getListData();
			
		}

	};
</script>

<style lang='less'>
	@import "../../../styles/searchAndOperate.less";
</style>