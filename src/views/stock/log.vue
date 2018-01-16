<template>
	
	<div class='log_wrap'>
		<div class="portlet-title">
			<Icon type="person-stalker"></Icon>
			<span class='title_text'>传感器基本信息</span>
		</div>
		<div class="portlet-body">
			<div class='form-wrap'>
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>序列号</div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.serialNumber" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>传感器系列</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.sensorSeriesText" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>传感器型号</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.sensorModel" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>所属仓库</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.storeHouseText" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>MAC地址</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.mac" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>IMEI</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.imei" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>成本</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.sensorCost" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>入库时间</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.displayCT" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>生产时间</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.productionDate" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>购入时间</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.shippingDate" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
			</div>
		</div>
		
			
		<div class="portlet-title">
			<Icon type="card"/>
			<span class='title_text'>传感器日志列表</span>
		</div>
		<div style='width:85%;margin:20px auto 50px;'> 
			<Table :columns="columns1" :data="logList"></Table>
			<Spin :fix='true' v-show='log_loading'>
					<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
					<div>Loading</div>
				</Spin>
			<div class="back-wrap">
				<Button type="primary" class='back' @click='back'>返回</Button>
			</div>
		</div>
	</div>
	
	
	

</template>
<script>
	import { lookUpdata, transformData } from '@/lookup';
	import { logAction } from '@/api/stock/index';
	export default {
		props: {
			
			numberParam: {
				type: String,
				default: ''
			},
			basicdata:{
				type: Object,
				default: function(){
					return {};
				}
			}
		},
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
						title: '库存类型',
						key: 'stockCategoryText'
					},
					{
						title: '库存编号',
						key: 'stockNumber'
					},
					{
						title: '库存状态',
						key: 'stockStateText'
					},
					{
						title: '操作类型',
						key: 'operateTypeText'
					},
//					{
//						title: '操作编号',
//						key: 'operateNumber'
//					},
					{
						title: '描述',
						key: 'description'
					},
					{
						title: '操作时间',
						key: 'displayCT'
					}
				],
				logList: [],
				log_loading:false
			}
		},
		mounted(){
			this.init();
		},
		methods: {
			back() {
				this.$emit('backCoupletCard')
			},
			init(){
				console.log(this.basicdata);
				this.log_loading = true;
				return new Promise((resolve, reject) => {
					logAction(this.numberParam).then(response => {

						console.log(response);
						if(response.code == 200){
							this.log_loading = false;
							this.logList = response.content;
							this.logList.forEach( (item ) => {
								
								//库存类型
								transformData(
									item,
									lookUpdata.StockCategoryLookup,
									'stockCategory', 
									'stockCategoryText'
								);
								
								//库存状态
								transformData(
									item,
									lookUpdata.SensorTypeLookup,
									'stockState', 
									'stockStateText'
								);
								// 操作类型
								transformData(
									item,
									lookUpdata.OperateTypeLookup,
									'operateType', 
									'operateTypeText'
								);
							});
						}
						
						resolve()
					}).catch(error => {
						reject(error)
					})
				})
			}
		}
	}
</script>
<style  scoped lang='less'>
	.back{
		float:left;
		margin: 10px 20px 0 0;
	}
	
	@h: 32px;
	.portlet-body{
		
	}
	.row-wrap{
		/*margin: 5px 0;*/
	}
	.col-wrap {
		min-height: 50px;
		height: auto;
	}
	
	.dec-text {
		height: @h;
		line-height: @h;
		text-align: right;
		padding-right: 10px;
	}
	
	.error {
		display: inline-block;
		width: 100%;
		padding: 3px 5px;
		color: red;
	}
	
	.sybol {
		color: red;
	}
	
	.form-wrap {
		width: 100%;
		height: auto;
		background-color: #fff;
		padding: 20px 0;
	}
	.btn-wrap{
		margin: 20px 0;
	}
	.log_wrap{
		background: #FFF;
	}
	
</style>