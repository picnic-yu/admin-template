<template>
	<div class='log_wrap'>
		<div class="portlet-title">
			<Icon type="person-stalker"></Icon>
			<span class='title_text'>物联卡基本信息</span>
		</div>
		<div class="portlet-body">
			<div class='form-wrap'>
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>运营商</div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.carrierOperatorText" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>物联卡号</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.numberOfCard" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>物联卡类型</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.cardTypeText" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>iccid</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.iccid" 
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
							<Input v-model="basicdata.cardCost" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>库存状态</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.stockStateText" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				
				<Row :gutter="16" class='row-wrap'>
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
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>操作人</span></div>
					</Col>
					<Col span="9" class='col-wrap'>
						<div>
							<Input v-model="basicdata.operator" 
								readonly
								style="width: 80%">
							</Input>
							
						</div>
					</Col>
	
				</Row>
				
				<Row :gutter="16" class='row-wrap'>
					<Col span="3" class='col-wrap'>
						<div class='dec-text'>创建时间</span></div>
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
			</div>
		</div>
		
			
		<div class="portlet-title">
			<Icon type="person-stalker"></Icon>
			<span class='title_text'>物联卡日志列表</span>
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
	import { logAction } from '@/api/stock/couplet-card';
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
				console.warn(this.basicdata);
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
									lookUpdata.CardTypeLookup,
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