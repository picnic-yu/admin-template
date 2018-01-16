<template>
	<div class="portlet-body">
		<div class='form-wrap'>
			<Row :gutter="16" class='row-wrap'>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>唯一社会信用代码 <span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input v-model="saveParam.socialUnityCd" 
							placeholder="请输入唯一社会信用代码 " 
							:maxlength = 18
							style="width: 80%">
						</Input>
						<span class="error" v-if='socialUnityCdError'>
							{{socialUnityCdText}}
						</span>
					</div>
				</Col>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>客户公司名称 <span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input 
							v-model="saveParam.companyName" 
							placeholder="请输入客户公司名称" 
							:maxlength = 20
							style="width: 80%"></Input>
						<span class="error" v-if='companyNameError'>
							请输入客户公司名称
						</span>
					</div>
				</Col>

			</Row>

			<Row :gutter="16" class='row-wrap'>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>客户简称</div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input 
							v-model="saveParam.companySimpleName" 
							placeholder="请输入客户简称" 
							style="width: 80%"></Input>
						
					</div>
				</Col>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>所属经销商<span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Select v-model="saveParam.agencyCode" style="width:80%">
							<Option v-for="item in agencyList" :value="item.code" :key="item.value">{{ item.value }}</Option>
						</Select>
						<span class="error" v-show='agencyCodeError'>
							请选择所属经销商
						</span>
					</div>
				</Col>
			</Row>

			<Row :gutter="16" class='row-wrap'>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>企业行业 <span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Select v-model="saveParam.companyIndustry" style="width:80%">
							<Option v-for="item in companyIndustryList" :value="item.code" :key="item.value">{{ item.value }}</Option>
						</Select>
						<span class="error" v-if='companyIndustryError'>
							请选择企业行业
						</span>
					</div>
				</Col>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>企业属性<span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Select v-model="saveParam.enterpriseProperty" style="width:80%">
							<Option v-for="item in enterprisePropertyList" :value="item.code" :key="item.value">{{ item.value }}</Option>
						</Select>
						<span class="error">
							请选择企业属性
						</span>
					</div>
				</Col>
			</Row>

			<Row :gutter="16" class='row-wrap'>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>公司邮箱 <span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input type='email' v-model="saveParam.companyEmail" placeholder="Enter something..." style="width: 80%"></Input>
						<span class="error">
							3333333333333333333333
						</span>
					</div>
				</Col>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>公司传真<span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input v-model="saveParam.companyFax" placeholder="Enter something..." style="width: 80%"></Input>
						<span class="error">
							3333333333333333333333
						</span>
					</div>
				</Col>
			</Row>

			<Row :gutter="16" class='row-wrap'>
				<Col span="3">
					<div class='dec-text'>所在区域<span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Cascader :data="area" @on-change='selectArea' change-on-select style="width: 80%"></Cascader>
						<span class="error">
							所在区域省、市不能为空
						</span>
					</div>
				</Col>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>通讯地址 <span class='sybol'>*</span></div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input v-model="saveParam.postalAddress" placeholder="Enter something..." style="width: 80%"></Input>
						<span class="error">
							通讯地址不能为空
						</span>
					</div>
				</Col>
				
			</Row>

			<Row :gutter="16" class='row-wrap'>
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>邮编 </div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input type='email' v-model="saveParam.zipCode" placeholder="Enter something..." style="width: 80%"></Input>
						
					</div>
				</Col>
				
				<Col span="3" class='col-wrap'>
					<div class='dec-text'>公司简介</div>
				</Col>
				<Col span="9" class='col-wrap'>
					<div>
						<Input v-model="saveParam.companyDescription" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." style="width: 80%"></Input>
						
					</div>
				</Col>
			</Row>
		</div>

		<div class="btn-wrap">
			<Row :gutter="16">
				<Col span="3" class='col-wrap'>
					<div class='dec-text'> </div>
				</Col>
				<Col span="9">
					<div>
						
					    <Button type="primary">保存并返回</Button>
					    <Button type="ghost" @click='save'>保存</Button>
					    <Button>返回</Button>
					</div>
				</Col>
				
			</Row>
		</div>
		
	</div>
</template>

<script>
	import areaList from '@/libs/city'; 
	import { lookUpdata } from '@/lookup';
	export default {
		name: 'basic-information',
		data() {
			return {

				agencyList: [{
					"code": "EM",
					"value": "设备制造商"
				}, {
					"code": "LC",
					"value": "租赁公司"
				}, {
					"code": "PC",
					"value": "生产厂商"
				}],

				companyIndustryList: lookUpdata.CompanyIndustryLookup,
				enterprisePropertyList: lookUpdata.EnterprisePropertyLookup,
				saveParam: {
					companyName: '',
					companySimpleName: '',
					agencyCode: '',
					socialUnityCd: '',//社会信用代码
					companyIndustry: '', //企业行业后台code
					enterpriseProperty: '', //企业属性后台code
					companyEmail: '', //公司邮件
					companyFax: '', //传真
					zipCode: '', //邮编
					postalAddress: '', //通讯地址
					companyDescription: '' //公司简介
				},
				area: areaList,
				socialUnityCdError:false,
				socialUnityCdText: '请输入唯一社会信用代码',
				companyNameError: false,
				agencyCodeError:false,
				companyIndustryError:false,
			}

		},
		mounted() {
			this.init();
		},
		watch: {

			'saveParam.companyName'(val){
				if(!val){
					console.log(val)
					this.companyNameError = true;
					
				}
				if(val){
					this.companyNameError = false;
				}
			},
			'saveParam.socialUnityCd'(val){
				if(!val){
					console.log(val)
					this.socialUnityCdError = true;
					this.socialUnityCdText =  '请输入唯一社会信用代码';
				}
				if(val){
					this.socialUnityCdError = false;
					if(/\W/.test(val)){
						this.socialUnityCdError = true;
						this.socialUnityCdText =  '唯一社会信用代码只能为数字或者字母';
					}
					
				}
			},
			'saveParam.agencyCode'(val){
				console.log(val)
				if(!val){
					this.agencyCodeError = true;
				}else{
					this.agencyCodeError = false;
				}
			},
			'saveParam.companyIndustry'(val){
				if(!val){
					this.companyIndustryError = true;
				}else{
					this.companyIndustryError = false;
				}
			}
			
		},
		methods: {
			init() {

			},
			selectArea(value, selectedData) {
				console.log(value, selectedData)
			},
			save() {
				if(!this.saveParam.socialUnityCd){
					this.socialUnityCdError = true;
					this.socialUnityCdText =  '请输入唯一社会信用代码';
				}
				if(!this.saveParam.companyName){
					this.companyNameError = true;
				}
				if(!this.saveParam.agencyCode){
					this.agencyCodeError = true;
				}
				if(!this.saveParam.companyIndustry){
					this.companyIndustryError = true;
				}
				
			}
		}
	}
</script>

<style scoped lang='less'>
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
</style>