<template>
	<div >
		<basic></basic>
		
	</div>
</template>

<script>
	import { add, update, query } from '@/api/stock/couplet-card';
	import { lookUpdata } from '@/lookup';
	import util from '@/libs/util';
	import basic from './basic.vue'
	
	export default {
		name: 'add-edit',
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
				
			}
		},
		mounted() {
			this.init();
		},
		watch: {

//			iccid(val){
//				if(val){
//					this.iccidError = false;
//				}
//			},
			
		},
		components: {
			basic
		},
		methods: {
			init() {
				if(this.isEdit) {
					console.log(this.editData);
					this.numberOfCard = this.editData.numberOfCard;
					this.cardCost = this.editData.cardCost;
					this.cardType = this.editData.cardType;
					this.carrierOperator = this.editData.carrierOperator;
					this.iccid = this.editData.iccid;
				}
			}
		}
	}
</script>

<style scoped lang='less'>

	
</style>