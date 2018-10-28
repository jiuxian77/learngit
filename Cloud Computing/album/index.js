axios.defaults.baseURL = 'http://ec2-34-216-21-83.us-west-2.compute.amazonaws.com/api/';
let tmp_file_name_static = 'tmp_image_file'

/*
上传图片到服务器后 再上传到s3
最后成功后会调用 父组件的NewS3ImageUrl(s3_image_url)，把url传递出去
*/
Vue.component('image-uploader', {
 	props: ['start_savetos3',"mainkey"],
	data: function () {
		return {
			//static:
			warning_div_id:'warning_div',
			uploadedimg_div_id:"uploaded_img",
			//var:
			img_upload_status:"", // 显示图片上传时候的状态
			tmp_image_url:null,	// 我的服务器上缓存图片的路径
			s3img_url:"",		// 文件确认保存后 aws s3上的路径
			image_key:"",

			savetos3_complete:false,	// 本组件中的图片是否都已经传到s3上了
			savetos3ing:false,			// 正在等待node帮我传文件
		}
	},
	watch:{
		start_savetos3:function(newone,oldone){
			if( newone ){
				this.SaveToS3();
			}
		},
		savetos3_complete:function(newone,oldone){
			this.$emit('news3imageurl', {"image_url":this.s3img_url,"image_key":this.image_key}); // 告诉父组件 s3 上面的地址
			// TODO 自杀掉
		}
	},
	methods:{
		ImageAdd: function(event){
			let that = this;
			// 获取要上传的图片：
			let image_file = event.currentTarget.files[0];
			console.log("上传的图片:",image_file);
			that.image_key = image_file.name;

			// 通过formdata上传 
			let formData=new FormData();
			// 设置文件名
			formData.append(tmp_file_name_static,image_file);
			that.img_upload_status = "正在上传"
			axios.post("/util/tmp_image_upload",
				formData,
				{
					method: 'post',
					headers: {'Content-Type': 'multipart/form-data'}
				})
				.then(function(response){
					console.log(response);
					if( response.data.ok ){
						that.img_upload_status = "上传成功，显示："
						that.tmp_image_url =response.data.result.image_url;
						
					}else{
						return Promise.reject(response.data.err);
					}
				})
				.catch(function(err){
					that.img_upload_status = "上传失败，请重试。err："+err;
					console.log(err);
				})
		},
		SaveToS3: function(){
			let that = this;
			that.img_upload_status = "正在保存到s3";
			// http start..
			that.savetos3ing = true;
			axios.get('/util/save_tmp_image_to_bucket',
				{
					params:{
						file_name: _.split(that.tmp_image_url,'/').pop() ,
						origin_name_key: that.image_key 
					}
				})
			.then(function(response){
				console.log(response);
				if( response.data.ok ){
					that.img_upload_status = "保存到S3成功";
					that.s3img_url = response.data.result.image_url;
					that.savetos3_complete = true;

				}else{
					return Promise.reject(response.data.err);
				}
			})
			.catch(function(err){
				that.img_upload_status = "保存到S3失败，请重试："+err;
				console.log(err);
			})
			.then(function(){
			// http terminal
				that.savetos3ing = false;
			})
		},
		Restart:function(){
			this.savetos3_complete = false;
			this.savetos3ing = false;
			this.img_upload_status="";
			this.tmp_image_url=null;
			this.s3img_url="";
			this.image_key="";

		}
	},
	template: `
		<div class="image-uploader">
		 	<div>
				<label v-bind:for="mainkey+'imageuploaderfileinput'" class="button button-royal button-box button-gian" v-if="!tmp_image_url">
					ADD
					<i class="fa fa-picture-o" aria-hidden="true"></i>
				</label>
	  			<input type="file" v-on:change="ImageAdd($event)" v-bind:id="mainkey+'imageuploaderfileinput'">
			</div>
			 
 			<div class="warning_div_class"><p>{{img_upload_status}}</p></div>
			<div class="uploadedimg_div_class" ><img v-bind:src="tmp_image_url"></div>
			<div>
				<span v-if="tmp_image_url">编辑名字:</span><input v-model="image_key" type="name" v-if="tmp_image_url"/>
			</div>
			<div>
				<label v-on:click="SaveToS3()" v-if="(!savetos3_complete) && (!savetos3ing) " class="button button-action button-box button-gian">Save To S3</label>
				<label class="button button-caution button-box" v-if="tmp_image_url!=null && (!savetos3ing) " v-on:click="Restart()">Restart&nbsp;<i class="fa fa-trash-o"></i></label>
			</div>
		</div>
	`
})