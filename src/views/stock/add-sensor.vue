<template>
	<div>
		<div class="portlet-body">
			<div class="control-group" style='margin-top:20px;'>
				<span class='dec'>
					序列号<span class='symbol'>*</span>
				</span>
				<Input v-model="serialNumber" placeholder="" style="width: 300px"></Input>
				<span class='error_text' v-if='serialNumberError'>{{serialNumberText}}</span>
			</div>
			<div class="control-group">
				<span class='dec'>
					传感器类型<span class='symbol'>*</span>
				</span>
				<Select v-model="defaultType"  style="width:300px">
					<Option v-for="item in sensorType" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					传感器型号<span class='symbol'>*</span>
				</span>
				<Select v-model="defaultModel"  style="width:300px">
					<Option v-for="item in sensorModel" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					所属仓库<span class='symbol'>*</span>
				</span>
				<Select v-model="storeHouse"  style="width:300px">
					<Option v-for="item in storeHouseLookUp" :value="item.code" :key="item.value">{{ item.value }}</Option>
				</Select>
			</div>
			<div class="control-group">
				<span class='dec'>
					MAC地址<span class='symbol'>*</span>
				</span>
				<Input v-model="macVal" placeholder="" style="width: 300px"></Input>
				<span class='error_text' v-if='macError'>{{macText}}</span>
			</div>
			<div class="control-group">
				<span class='dec'>
					IMEI<span class='symbol'>*</span>
				</span>
				<Input v-model="imeiVale" placeholder="" style="width: 300px"></Input>
				<span class='error_text' v-if='imeiError'>{{imeiText}}</span>
			</div>
			<div class="control-group">
				<span class='dec'>
					成本<span class='symbol'>*</span>
				</span>
				<Input v-model="price" placeholder="" style="width: 300px"></Input>
				<span class='error_text' v-if='priceError'>{{priceText}}</span>
			</div>
			<div class="control-group">
				<span class='dec'>
					生产时间<span class='symbol'>*</span>
				</span>
				<Row style="width: 300px;display:inline-block;vertical-align: middle;">
					<Col span="12">
						<DatePicker 
							type="date" 
							:value='productionDate' 
							:editable='false' 
							placeholder="请选择生产时间" 
							@on-change='changeProductDate' 
							style="width: 300px" 
							:clearable='false'>
						</DatePicker>
					</Col>
				</Row>
			</div>
			<div class="control-group">
				<span class='dec'>
					购入时间<span class='symbol'>*</span>
				</span>
				<Row style="width: 300px;display:inline-block;vertical-align: middle;">
					<Col span="12">
						<DatePicker 
							type="date" 
							placeholder="请选择购入时间" 
							:editable='false' 
							:value='shippingDate' 
							style="width: 300px" 
							@on-change='changeShippingDate' 
							:clearable='false'>
						</DatePicker>
					</Col>
				</Row>
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
	import { add, update, query } from '@/api/stock/index';
	import util from '@/libs/util';
	import { lookUpdata, transformData } from '@/lookup';
	
	
	export default {
		name: 'add-sensor',
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
				serialNumberError: false,
				serialNumberText: '请输入序列号',
				macError: false,
				macText: '请输入MAC地址',
				priceError: false,
				priceText: '请输入正确的金额',
				imeiError: false,
				imeiText: '请输入IMEI',
				serialNumber: '',
				macVal: '',
				productionDate: util.addDate(new Date(),0),
				shippingDate: util.addDate(new Date(),0),
				imeiVale: '',
				price: '',
				sensorType: lookUpdata.SensorSeriesLookup,
				sensorModel: lookUpdata.SensorModelLookup,
				storeHouseLookUp: lookUpdata.StoreHouseLookup,
				storeHouse: 'SUZHOU',
				defaultType: 'DS',
				defaultModel: 'MB130'

			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				console.log(this.isEdit)
				if(this.isEdit) {
					console.log(this.editData)
					this.serialNumber = this.editData.serialNumber;
					this.macVal = this.editData.mac;
					this.defaultType = this.editData.sensorSeries;
					this.defaultModel = this.editData.sensorModel;
					this.imeiVale = this.editData.imei;
					this.price = this.editData.sensorCost;
					this.shippingDate = this.editData.shippingDate;
					this.storeHouse = this.editData.storeHouse;
					this.productionDate = this.editData.productionDate;
				}
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
			handleClickSure() {
				if(!this.serialNumber) {
					this.serialNumberError = true;
				}
				if(!this.macVal) {
					this.macError = true;
				}
				if(!this.price) {
					this.priceError = true;
				}
				if(!this.imeiVale) {
					this.imeiError = true;
				}
				var addObj = {

					"imei": this.imeiVale,
					"mac": this.macVal,
					"numberOfCard": "",
					"productionDate": this.productionDate,
					"sensorCost": this.price,
					"sensorModel": this.defaultModel,
					"sensorSeries": this.defaultType,
					"sensorType": "",
					"serialNumber": this.serialNumber,
					"shippingDate": this.shippingDate,
					"storeHouse": this.storeHouse,
					"stockState": ""
				};
				if(!this.imeiError && !this.priceError && !this.macError && !this.serialNumberError) {
					if(this.isEdit) {
						addObj.id = this.editData.id;
						return new Promise((resolve, reject) => {
							update(this.editData.id, addObj).then(response => {

								console.log(response);
								if(response.code == 201){
									this.$Message.success('保存成功');
									this.$emit('save');
								}else{
									this.$Message.error('保存失败');
								}
								
								resolve()
							}).catch(error => {
								reject(error)
							})
						})
					} else {
						return new Promise((resolve, reject) => {
							add(addObj).then(response => {
								
								console.log(response);
								if(response.code == 201){
									this.$Message.success('保存成功');
									this.$emit('save');
								}else{
									this.$Message.error('保存失败');
								}
								resolve()
							}).catch(error => {
								reject(error)
							})
						})
					}
				}

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