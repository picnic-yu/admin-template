<template>
	<div>
		<div class="portlet-body">
			<div class="control-group">
				<span class='dec'>
					序列号
				</span>
				<Input v-model="serialNumber" disabled style="width: 300px"></Input>
			</div>
			<div class="control-group">
				<span class='dec'>
					传感器类型
				</span>
				<Select v-model="defaultType" disabled  style="width:300px">
					<Option v-for="item in sensorSeries" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					传感器型号
				</span>
				<Select v-model="defaultModel" disabled style="width:300px">
					<Option v-for="item in sensorModel" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					MAC地址
				</span>
				<Input v-model="macVal" disabled style="width: 300px"></Input>
				
			</div>
			<div class="control-group">
				<span class='dec'>
					IMEI
				</span>
				<Input v-model="imeiVale" disabled style="width: 300px"></Input>
				
			</div>
			<div class="control-group">
				<span class='dec'>
					成本
				</span>
				<Input v-model="price" disabled style="width: 300px"></Input>
				
			</div>
			<div class="control-group">
				<span class='dec'>
					生产时间
				</span>
				<Row style="width: 300px;display:inline-block;vertical-align: middle;">
					<Col span="12">
						<DatePicker type="date" disabled 
							:value='productionDate' 
							:editable='false'  
							style="width: 300px" 
							:clearable='false'>
						</DatePicker>
					</Col>
				</Row>
			</div>
			<div class="control-group">
				<span class='dec'>
					购入时间
				</span>
				<Row style="width: 300px;display:inline-block;vertical-align: middle;">
					<Col span="12">
						<DatePicker type="date" disabled 
							:editable='false' 
							:value='shippingDate' 
							style="width: 300px"  
							:clearable='false'>
						</DatePicker>
					</Col>
				</Row>
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
	import { add, update, query, back } from '@/api/stock/index';
	import util from '@/libs/util';
	import { lookUpdata, transformData } from '@/lookup';
	
	
	export default {
		name: 'add-sensor',
		props: {
			isEdit: {
				type: Boolean,
				default: false

			},
			basicData: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		data() {
			return {
				serialNumber: '',
				macVal: '',
				productionDate: util.addDate(new Date(),0),
				shippingDate: util.addDate(new Date(),0),
				imeiVale: '',
				price: '',
				sensorSeries: lookUpdata.SensorSeriesLookup,
				sensorModel: lookUpdata.SensorModelLookup,
				sensorTypeLookup: lookUpdata.SensorTypeLookup,
				defaultType: 'DS',
				defaultModel: 'MB130',
				sensorType: 'NORMAL',
				remarks: ''
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				
				console.log(this.basicData)
				this.serialNumber = this.basicData.serialNumber;
				this.macVal = this.basicData.mac;
				this.defaultType = this.basicData.sensorSeries;
				this.defaultModel = this.basicData.sensorModel;
				this.imeiVale = this.basicData.imei;
				this.price = this.basicData.sensorCost;
				this.shippingDate = this.basicData.shippingDate;
				this.productionDate = this.basicData.productionDate;
				this.sensorType = this.basicData.sensorType;
				
			},
			
			handleClickback() {
				this.$emit('back');
			},
			handleClickSure() {
				
				var addObj = {

					"imei": this.imeiVale,
					"mac": this.macVal,
					"numberOfCard": "",
					"productionDate": this.productionDate,
					"sensorCost": this.price,
					"sensorModel": this.defaultModel,
					"sensorSeries": this.defaultType,
					"sensorType": this.sensorType,
					"serialNumber": this.serialNumber,
					"shippingDate": this.shippingDate,
					"stockState": this.stockState,
					"remarks": this.remarks
				};
				addObj.id = this.basicData.id;
				return new Promise((resolve, reject) => {
					back(this.basicData.id, addObj).then(response => {

						console.log(response);
						if(response.code == 201){
							this.$emit('save');
						}
						
						resolve()
					}).catch(error => {
						reject(error)
					})
				})

			}
		}

	};
</script>

<style scoped lang='less'>
	.portlet-body {
		background-color: #fff;
		padding: 10px;
		height: auto;
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