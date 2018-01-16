<template>
	<div>
		<div class="portlet-body">
			<div class="control-group">
				<span class='dec'>
					物联卡号
				</span>
				<Input v-model="numberOfCard" placeholder="" style="width: 300px"></Input>
			</div>
			<div class="control-group">
				<span class='dec'>
					运营商
				</span>
				<Select v-model="carrierOperator" @on-change = 'carrierChange' style="width:300px">
					<Option v-for="item in sensorType" 
						:value="item.code"
						
						:key="item.value">
						{{ item.value }}
					</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					ICCID<span class='symbol'>*</span>
				</span>
				<Input v-model="iccid" placeholder="" style="width: 300px"></Input>
				
			</div>
			<div class="control-group">
				<span class='dec'>
					物联卡类型
				</span>
				<Select v-model="cardType" disabled  style="width:300px" @on-change = 'cardTypeChange'>
					<Option v-for="item in cardTypes" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					库存状态
				</span>
				<Select v-model="defaultStockState"  style="width:300px" @on-change = 'stockStateChange'>
					<Option v-for="item in stockStates" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					制卡成本<span class='symbol'>*</span>
				</span>
				<Input v-model="cardCost" placeholder="" style="width: 300px"></Input>
				<span class='error_text' v-if='cardCostError'>{{cardCostText}}</span>
			</div>
	
			
		</div>
		<div class="form_operate">
				<ButtonGroup>
					<Button type="primary" @click='handleClickSure'>保存</Button>
				</ButtonGroup>
				<ButtonGroup>
					<Button @click='handleClickback'>返回</Button>
				</ButtonGroup>
			</div>
	</div>
</template>

<script>
	import { add, update, query } from '@/api/stock/couplet-card';
	import { lookUpdata } from '@/lookup';
	import util from '@/libs/util'
	export default {
		name: 'sensor-backlibrary',
		props: {
			isEdit: {
				type: Boolean,
				default: false

			},
			editData: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		data() {
			return {
				numberOfCardError: false,
				numberOfCardText: '请输入物联卡号',
				iccidError: false,
				iccidText: '请输入iccid',
				cardCostError: false,
				cardCostText: '请输入IMEI',
				numberOfCard: '',
				iccid: '',
				cardCost: '',
				sensorType: lookUpdata.CarrierOperatorLookup,
				cardTypes: lookUpdata.CardTypeLookup,
				stockStates: lookUpdata.StockStateLookup,
				carrierOperator: 'DX',
				defaultStockState: 'STOCK',
				cardType: 'NORMAL'

			}
		},
		mounted() {
			this.init();
		},
		watch: {
//			监听物联卡号变化
			numberOfCard(val) {
				if(val){
					this.numberOfCardError = false;
				}
			},
			iccid(val){
				if(val){
					this.iccidError = false;
				}
			},
			cardCost(val){
				if(val){
					this.cardCostError = false;
				}
			}
		},
		methods: {
			init() {
				
				console.log(this.editData);
				this.numberOfCard = this.editData.numberOfCard;
				this.cardCost = this.editData.cardCost;
				this.cardType = this.editData.cardType;
				this.carrierOperator = this.editData.carrierOperator;
				this.iccid = this.editData.iccid;
				
			},
			changeShippingDate(data) {
				this.shippingDate = data;
				console.log(data)
			},
			changeProductDate(data) {
				this.productionDate = data;
				console.log(data)
			},
			handleClickback() {
				this.$emit('back');
			},
			carrierChange(value){
				this.carrierOperator = value;
			},
			cardTypeChange(value){
				this.cardType = value;
			},
			stockStateChange(value){
				this.cardType = value;
			},
			handleClickSure() {
				if(!this.numberOfCard) {
					this.numberOfCardError = true;
				}
				if(!this.iccid) {
					this.iccidError = true;
				}

				if(!this.cardCost) {
					this.cardCostError = true;
				}
				var addObj = {
					"carrierOperator": this.carrierOperator,//运营商
					"iccid": this.iccid,
					"numberOfCard": this.numberOfCard,
					"cardType": this.cardType,
					"stockState": this.defaultStockState,
					"cardCost": this.cardCost
				}
				if(!this.cardCostError && !this.iccidError && !this.numberOfCardError) {
					
					addObj.id = this.editData.id;
					return new Promise((resolve, reject) => {
						update(this.editData.id, addObj).then(response => {

							console.log(response);
							if(response.code == 201) {
								this.$emit('save');
							}

							resolve()
						}).catch(error => {
							reject(error)
						})
					})
					
				}

			}
		}

	};
</script>

<style scoped lang='less'>
	.portlet-body {
		background-color: #fff;
		padding: 10px;
		height: 352px;
	}
	
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
		width: 160px;
		text-align: right;
		height: 25px;
		line-height: 25px;
		font-size: 14px;
		margin-right: 10px;
	}
	
	.symbol {
		display: inline-block;
		vertical-align: middle;
		width: 7px;
		text-align: right;
		height: 25px;
		color: red;
		line-height: 25px;
		font-size: 14px;
	}
	
	.form_operate {
		padding-left: 180px;
		margin:20px 0;
		
	}
</style>