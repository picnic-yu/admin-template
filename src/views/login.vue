<style lang="less">
	@import './login.less';
</style>

<template>
	<div class="login" @keydown.enter="handleSubmit">
		<div class="login-con">
			<Card :bordered="false">
				<p slot="title">
					<Icon type="log-in"></Icon>
					欢迎登录
				</p>
				<div class="form-con">
					<Form ref="loginForm" :model="form" :rules="rules">
						<FormItem prop="userName">
							<Input v-model="form.userName" placeholder="请输入用户名">
							<span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input type="password" v-model="form.password" placeholder="请输入密码">
							<span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
							</Input>
						</FormItem>
						<FormItem>
							<Button @click="handleSubmit" type="primary" long>登录</Button>
							
							<Spin :fix='true' v-show='loadingStatus'>
								<Icon type="load-c" size=10 class="demo-spin-icon-load"></Icon>
								<!--<div>Loading</div>-->
							</Spin>
						</FormItem>
					</Form>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie';
	export default {
		data() {
			return {
				form: {
					userName: 'SuperAdmin',
					password: 'admin'
				},
				rules: {
					userName: [{
						required: true,
						message: '账号不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}]
				},
				loadingStatus:  false
			};
		},
		watch: {
			'$store.state.user.loadStatus'(curVal,oldVal){
				if( curVal == 200 ){
					this.loadingStatus = true;
				}else{
					this.loadingStatus = false;
					this.$store.commit('UPDATE_LOADSTATUS','10');
				}
				if(curVal == oldVal){
					this.loadingStatus = false;
				}
			}
		},
		methods: {
			handleSubmit() {
//				this.loadingStatus = true; 接口注释
				
				this.$refs.loginForm.validate((valid) => {
					if(valid) {
						Cookies.set('user', this.form.userName);
						Cookies.set('password', this.form.password);
						this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
						this.$router.push({
							name: 'home_index'
						});
//						接口注释
//						this.$store.dispatch('Login', this.form).then(() => {
//							Cookies.set('user', this.form.userName);
//							Cookies.set('password', this.form.password);
//							this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
//							this.$router.push({
//								name: 'home_index'
//							});
//						}).catch((error) => {
//							throw error;
//						});
					}
				});
			}
		}
	};
</script>

<style>

</style>