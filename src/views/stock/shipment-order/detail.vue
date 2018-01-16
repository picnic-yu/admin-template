<template>
	<div class="detail">
		
		<!--基本信息列表-->
		<div class="list" v-show='showList'>

			<div class='table-wrap'>
				<i-table stripe border highlight-row 
					:columns="columns1" 
					:data="listData" 
					@on-row-click='selectItem'> 
				</i-table>

				<Spin :fix='true' v-show='isLoading'>
					<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
					<div>Loading</div>
				</Spin>
			</div>
			<div style='height:50px '>
				<!--<Page class='page-wrap' show-elevator show-total  
					:total="total" 
					@on-change='pageChange' >
				</Page>-->
				<Button type="primary" 
					@click='addData'
	            	style="margin: 20px 0 20px 8px">新增</Button>
	            <Button type="ghost" 
	            	@click='backList'
	            	style="margin: 20px 0 20px 8px">返回</Button>
			</div>
			

		</div>
		<Modal v-model="deletteModelStatus" width="310" :styles="{top: '250px'}">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>提示</span>
	        </p>
	        <div>
				<h3>确认删除吗?</h3>
			</div>
	        <div slot="footer">
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="cancelDel">
	            	取消
	            </Button>
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="sureDel">
	            	确定
	            </Button>
	        </div>
		</Modal>
		
		
		<Modal v-model="showAddOrEdit" width="510">
	        <p slot="header" style="color:#2db7f5;text-align:left">
	            <span>新增出货明细</span>
	        </p>
	        <div >
	        	<div class="control-group">
					<span class='dec'>
						库存类型<span class='symbol'>*</span>
					</span>
					<RadioGroup v-model="stockType">
		                <Radio v-for="item in stockTypeList" :key='item.code' :label="item.code">{{item.value}}</Radio>
		            </RadioGroup>
				</div>
				<div class="control-group">
					<span class='dec'>
						库存编号<span class='symbol'>*</span>
					</span>
					<Input v-model="stockNumber" placeholder="" style="width: 300px"></Input>
					<span class='error_text' v-if='stockNumberError'>库存编号不能为空</span>
				</div>
				
				<div class="control-group">
					<span class='dec'>
						备注
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
	            	@click="handleCancle">
	            	取消
	            </Button>
	        	<Button v-if='!isEdit'
	            	type="info"
	            	size="large" 
	            	:loading="saveandbackloading" 
	            	@click="saveAndAdd">
	            	保存并新增
	            </Button>
	            <Button 
	            	type="info"
	            	size="large" 
	            	:loading="modal_loading" 
	            	@click="handelSave">
	            	保存
	            </Button>
	        </div>
    	</Modal>
	</div>
</template>

<script>
	import operate from '../../main-components/operate/operate.vue';
	import search from '../../main-components/search/search.vue';
	import { addDetail, queryDetails, updateDetails, updateShipments, confirmShipments, deleteDetails  } from '@/api/shipment/index';
	import { lookUpdata, transformData } from '@/lookup';
	import util from '@/libs/util';

	export default {
		name: 'detail',
		props: {
			shipmentId: {
				type: String,
				default: ''
			}
		},
		data() {
			let self  = this;
			return {
				columns1: [
					{
						title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
					{
						title: '库存类型',
						key: 'stockTypeText',
						align: 'center',

					},
					{
						title: '库存编号',
						key: 'stockNumber',
						align: 'center',
					},
					{
						title: '备注',
						key: 'remarks',
						align: 'center',
					},
					{
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editDetail(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
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
				showAddOrEdit: false,
				modal_loading:false,
				numberOfCard: '',
				numberParam: '',
				
				remarks: '',
				stockType: 'IOTCARD',
				stockTypeList:lookUpdata.StockCategoryLookup,
				stockNumber:'',//订单编号
				shipmentState:'UNCONFIEM',//出货单状态
				shipmentStateList:lookUpdata.ShipmentStateLookup,
				shipmentAddress: '',//出货地址
				shipmentDate: util.addDate(new Date(),0),//出货日期
				shipmentAddressError: false,
				stockNumberError: false,
				confirmStatus: false,
				isCloseModel:false,
				saveandbackloading: false,
				deletteModelStatus: false,//删除弹出框控制
				delIndex: '',//删除选项的index
				editId: ''//编辑某一项的时候存的id
			}
		},
		methods: {
			init() {
				console.log(this.shipmentId);
			},
			backList(){
				this.$emit('back')
			},
			remove(index){
				this.delIndex = index;
				this.deletteModelStatus = true;
			},
			//编辑
			editDetail(index){
				this.isEdit = true;
				this.showAddOrEdit = true;
					
				this.remarks = this.listData[index].remarks;
				this.stockType= this.listData[index].stockType;
				this.stockNumber=this.listData[index].stockNumber;//订单编号
				this.editId=this.listData[index].id;//出货单状态
			},
			//取消删除
			cancelDel(){
				this.deletteModelStatus = false;
			},
			//确认删除
			sureDel(){
				this.isLoading = true;
				let index = this.delIndex;
				return new Promise((resolve, reject) => {
					deleteDetails(this.listData[index].id).then(response => {

						if(response.code == 204 ){
							this.isLoading = false;
							this.deletteModelStatus = false;
							this.$Message.success('删除成功');
							//删除成功,页面删除点击的那行，此时要取消选中行，隐藏修改喝删除按钮
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
			changeShipmentDate(data) {
				this.shipmentDate = data;
				console.log(data)
			},
//			保存并新增
			saveAndAdd(){
				this.isCloseModel = false;
				this.saveDataByShipmentId();
			},
//			保存
			handelSave () {
                this.isCloseModel = true;
                this.saveDataByShipmentId();
            },
//			取消
            handleCancle(){
				this.showAddOrEdit = false;
			},
            saveDataByShipmentId(){
            	let param = {
					stockType: this.stockType,//出单类型
					stockNumber:this.stockNumber,//订单编号
					
					remarks: this.remarks,
					shipmentId:this.shipmentId
					
					
				};
				if(!this.shipmentAddress){
					this.shipmentAddressError = true;
				}
				if(!this.stockNumber){
					this.stockNumberError = true;
				}
				
				if( this.stockNumberError) return;
				
				if(this.isCloseModel){
					this.modal_loading = true;
					
				}else{
					this.saveandbackloading = true;
				}
				if(this.isEdit){
					param.id = this.editId;
					return new Promise((resolve, reject) => {
						
						updateDetails(this.editId, param).then(response => {
							
							console.log(response);
							if(response.code == 201){
								
								if(this.isCloseModel){
									this.showAddOrEdit = false;
								}else{
									this.stockType = 'IOTCARD';
									this.remarks = '';
									this.stockNumber = '';
								}
								this.modal_loading = false;
	                    		this.saveandbackloading = false;
	                    		this.$Message.success('保存成功');
	                    		this.getListData();
	                    		this.isSelect = false;
							}else{
								this.$Message.error('保存失败');
								this.modal_loading = false;
	                    		this.saveandbackloading = false;
							}
							
							resolve()
						}).catch(error => {
							reject(error)
						})
					})
				}else{
					return new Promise((resolve, reject) => {
						addDetail(param).then(response => {
	
							console.log(response);
							if(response.code == 201){
								if(this.isCloseModel){
									this.showAddOrEdit = false;
								}else{
									this.stockType = 'IOTCARD';
									this.remarks = '';
									this.stockNumber = '';
								}
								this.modal_loading = false;
	                    		this.saveandbackloading = false;
	                    		this.$Message.success('保存成功');
	                    		this.getListData();
	                    		this.remarks = '';
							}else{
								this.$Message.error('保存失败');
								this.modal_loading = false;
	                    		this.saveandbackloading = false;
							}
							
							resolve()
						}).catch(error => {
							reject(error)
						})
					})
				}
           },
			show (index) {
				console.log(index);
				this.numberParam = this.listData[index].numberOfCard;
				this.showLog = true;
				this.add = false;
				this.showList = false;
				this.isEdit = false;
				
				
            },
			getListData() {
				
				this.isLoading = true;
				return new Promise((resolve, reject) => {
					queryDetails(this.shipmentId).then(response => {

						if(response.code == 200 ){
							this.isLoading = false;
							this.isSelect = false;
							this.confirmStatus = false;
							this.listData = response.content;
							this.total = response.content.rowCount;

							this.listData.forEach( (item ) => {
								
								//出货单状态
								transformData(
									item,
									lookUpdata.ShipmentStateLookup,
									'shipmentState', 
									'shipmentStateText'
								);
								
								transformData(
									item,
									lookUpdata.StockCategoryLookup,
									'stockType', 
									'stockTypeText'
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
				this.shipmentAddressError = false;
				this.stockNumberError = false;
				this.showAddOrEdit = true;
				this.isEdit = false;
				this.remarks = '';
				this.stockType= 'IOTCARD';//
				this.stockNumber='';//订单编号
				this.shipmentState='UNCONFIEM';//出货单状态
				this.shipmentAddress= '';//出货地址
				this.shipmentDate= util.addDate(new Date(),0);//出货日期
			},
			change(val) {
				this.importstatus = val;
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
			search
		},
		mounted() {
			this.init();
			this.getListData();
			
		},
		watch:{
			shipmentAddress(val){
				if(val){
					this.shipmentAddressError = false;
				}
			},
			stockNumber(val){
				if(val){
					this.stockNumberError = false;
				}
			}
		}

	};
</script>

<style lang='less' scoped>
	/*@import "../../../styles/searchAndOperate.less";*/
		.control-group {
		height: 55px;
		.error_text {
			color: red;
			padding-left: 110px;
		}
	}
	.detail{
		border-bottom:1px solid #ccc;
		border-left:1px solid #ccc;
		border-right:1px solid #ccc;
	}
	.list{
		width: 98%;
		margin: 0px auto;
		padding: 20px 0;
		position: relative;
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
</style>