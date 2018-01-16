<template>
	<div class="form-wrap" >
		
		<div class="portlet-body">
			<div class="control-group" style='margin-top:20px;'>
				<span class='dec'>
					出单类型<span class='symbol'>*</span>
				</span>
				<RadioGroup v-model="formItem.fromType">
	                <Radio v-for="item in fromTypeList" :key='item.code' :label="item.code">{{item.value}}</Radio>
	            </RadioGroup>
			</div>
			<div class="control-group">
				<span class='dec'>
					订单编号<span class='symbol'>*</span>
				</span>
				<Input v-model="formItem.orderNumber" 
	            	placeholder="请输入订单编号"
	            	style="width: 300px">
	            </Input>
	            <span class='error_text' v-if='orderNumberError'>订单编号不能为空</span>
			</div>
			<div class="control-group">
				<span class='dec'>
					出货地址<span class='symbol'>*</span>
				</span>
				<Input v-model="formItem.shipmentAddress" 
	            	placeholder="请输入出货地址"
	            	style="width: 300px">
	            </Input>
	            <span class='error_text' v-if='shipmentAddressError'>出货地址不能为空</span>
			</div>
			<div class="control-group">
				<span class='dec'>
					出货日期
				</span>
				<Row style="width: 300px;display:inline-block;vertical-align: middle;">
					<Col span="12">
						 <DatePicker 
						 	type="date" 
						 	placeholder="请选择出货日期"  
						 	style="width: 300px" 
						 	v-model="formItem.shipmentDate">
						 </DatePicker>
					</Col>
				</Row>
				<span class='error_text' v-if='shipmentDateError'>出货日期不能为空</span>
				
			</div>
			<div class="control-group" style='margin-bottom:20px;'>
				<span class='dec'>
					备注
				</span>
				<Input 
					v-model="formItem.remarks" 
					type="textarea" 
					:maxlength= 50
					:autosize="{minRows: 2,maxRows: 3}" 
					style="width: 300px">
				</Input>
			</div>
			
	
			
		</div>
		<div class="form_operate">
			<Button type="primary" @click='save'>保存</Button>
            <Button type="primary" 
            	@click='saveAndBack'
            	>保存并返回</Button>
            <Button type="ghost" 
            	@click='back'
            	>返回</Button>
		</div>
		
		
		
		
		
	    
	    <Spin :fix='true' v-show='isLoading'>
			<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
			<div>Loading</div>
		</Spin>
	</div>
</template>
<script>
	
	import { lookUpdata, transformData } from '@/lookup';
	import { addShipments, queryShipments, updateShipments, confirmShipments, deleteShipments  } from '@/api/shipment/index';
	import util from '@/libs/util';
	
    export default {
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
        data () {
            return {
                formItem: {
                    input: '',
                    select: '',
                    fromType: 'ORDER',
                    checkbox: [],
                    switch: true,
                    shipmentDate: util.addDate(new Date(),0),
                    shipmentAddress:'',
                    orderNumber: '',//订单编号
                    remarks: '',
                    shipmentNumber: '12'
                },
                fromType: 'ORDER',//出单类型
				fromTypeList:lookUpdata.ShipmentFromTypeLookup,
				orderNumber:'',//订单编号
				shipmentState:'UNCONFIEM',//出货单状态
				shipmentStateList:lookUpdata.ShipmentStateLookup,
				shipmentAddress: '',//出货地址
				shipmentDate: util.addDate(new Date(),0),//出货日期
				shipmentAddressError: false,
				orderNumberError: false,
				shipmentDateError: false,
				confirmStatus: false,
				isLoading: false,
				isBack: false
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
					this.formItem = this.editData;
				}
				
			},
			back(){
				this.$emit('backList');
			},
			saveAndBack(){
				this.save();
				this.isBack = true;
			},
			save(){
				console.log(this.formItem);
				if(!this.formItem.shipmentAddress){
					this.shipmentAddressError = true;
				}
				if(!this.formItem.orderNumber){
					this.orderNumberError = true;
				}
				if(!this.formItem.shipmentDate){
					this.shipmentDateError = true;
				}
				
				if(this.shipmentAddressError || this.orderNumberError || this.shipmentDateError) return;
				this.isLoading = true;
				
				if(this.isEdit){
					this.formItem.id = this.editData.id;
					return new Promise((resolve, reject) => {
						
						updateShipments(this.editData.id, this.formItem).then(response => {
	
							console.log(response);
							if(response.code == 201){
								this.isLoading = false;
	                    		this.showAddOrEdit = false;
	                    		this.$Message.success('保存成功');
//	                    		this.getListData();
								if(this.isBack){
									this.$emit('savebackList');
								}else{
									this.$emit('save',response.content.id);
								}
	                    		this.isSelect = false;
							}else{
								this.$Message.error('保存失败');
							}
							
							resolve()
						}).catch(error => {
							reject(error)
						})
					})
				}else{
					return new Promise((resolve, reject) => {
						addShipments( this.formItem).then(response => {
	
							console.log(response);
							if(response.code == 201){
								this.isLoading = false;
	                    		this.showAddOrEdit = false;
	                    		this.$Message.success('保存成功');
//	                    		this.getListData();
								if(this.isBack){
									this.$emit('savebackList');
								}else{
									this.$emit('save',response.content.id);
								}
	                    		this.remarks = '';
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
		},
		watch:{
			'formItem.shipmentAddress'(val){
				if(val){
					this.shipmentAddressError = false;
				}
			},
			'formItem.orderNumber'(val){
				if(val){
					this.orderNumberError = false;
				}
			},
			'formItem.shipmentDate'(val){
				if(val){
					this.shipmentDateError = false;
				}
			}
			
		}
    }
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
	.form-wrap{
		height:500px;	
	}
</style>