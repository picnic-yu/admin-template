<template>
	<div class="operate">
		<span class='operate-btn'>
			<Button type="primary" icon="plus-round" shape="circle" class='add' @click='handleAddClick'>新增</Button>
		</span>
		<span class='operate-btn' v-show='edit'>
			<Button type="warning" icon="edit" shape="circle" @click='handleEditClick'>编辑</Button>
		</span>
		<span class='operate-btn' v-show='backLibraryStatus'>
			<Button type="warning" icon="edit" shape="circle" @click='handleBackLibrary'>回库</Button>
		</span>
		<span class='operate-btn' v-show='deleteStatus'>
			<Button type="error" icon="trash-a" shape="circle"  @click='handleDeleteClick(data)'>删除</Button>
		</span>
		<span class='operate-btn' v-show='confirmStatus'>
			<Button type="primary" 
				icon="plus-round" 
				shape="circle" 
				class='confirm' 
				@click='handleConfirmClick'>
				确认
			</Button>
		</span>
		<Dropdown trigger="click" @on-click='handmoreclick' v-show='moreOperateData.length'>
			<Button type="primary" shape="circle">
            	更多操作
            	<Icon type="arrow-down-b"></Icon>
        	</Button>
			<DropdownMenu slot="list">
				<DropdownItem 
					:name='item.name' 
					v-for='(item, index) in moreOperateData' 
					:key="index">
					{{item.name}}
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
		
		<!--弹出层确认删除等等-->
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
	            	@click="handleCancel">
	            	取消
	            </Button>
	            <Button 
	            	type="info"
	            	size="large" 
	            	@click="sureDelete">
	            	确定
	            </Button>
	        </div>
		</Modal>
		
	</div>

</template>

<script>
	export default {
		props: {
			deleteStatus: {
				type: Boolean,
				default: false

			},
			deleteTitle: {
				type: String,
				default: ''
			},
			confirmStatus: {
				type: Boolean,
				default: false
			},
			edit: {
				type: Boolean,
				default: false
			},
			data: {
				type: Object,
				required: true
			},
			moreOperateData: {
				type: Array,
				default: function() {
					return [];
				}
			},
			backLibraryStatus: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				showDown: false,
				deletteModelStatus: false,
				deleteData:{}
			}
		},
		methods: {
			clickMore() {
				this.showDown = !this.showDown;
			},
//			取消确然删除,确认弹出层
			handleCancel(){
				this.deletteModelStatus = false;
			},
//			确认删除
			sureDelete(){
				this.deletteModelStatus = false;
				this.$emit('deletedata', this.deleteData);
			},
			handleDeleteClick(data) {
				this.deletteModelStatus = true;
				this.deleteData = data;
			},
			handleAddClick() {
				this.$emit('addData');
			},
			handleEditClick() {
				this.$emit('editData');
			},
			handleBodyClick() {
				this.showDown = false;
			},
			handmoreclick(name) {
				this.$emit('handmoreclick', name);
			},
			handleBackLibrary(){
				this.$emit('handleBackLibrary');
			},
			handleConfirmClick(){
				this.$emit('handleConfirmClick');
			}
		},
		mounted() {
			this.$nextTick(() => {
				document.querySelector('body').addEventListener('click', (event) => {
					if(
						event.target.className.indexOf('hide_wrap') < 0 &&
						event.target.parentElement.className.indexOf('hide_wrap') < 0 &&
						event.target.parentElement.parentElement.className.indexOf('hide_wrap') < 0
					) {
						this.handleBodyClick();
					}
				});
			})
		},
		beforeDestroy() {
			document.querySelector('body').removeEventListener('click', this.handleBodyClick);
		}
	}
</script>

<style scoped>
	.add {
		margin-left: 10px;
	}
	
	.operate-btn {
		display: inline-block;
		vertical-align: middle;
		height: 32px;
		min-width: 75px;
		position: relative;
	}
	
	.more {
		position: absolute;
		top: 37px;
		left: 0;
		z-index: 888;
	}
	
	.more li {
		margin: 5px 0;
		padding-left: 0;
		margin-left: -10px;
	}
</style>