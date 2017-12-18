$.alert=function(text){
  if($('.h-alert')[0]){return;}
  var html='<div class="h-alert">'+text+'</div>';
  $('body').append(html);
  $('.h-alert').fadeIn(function(){
    var the=this;
    setTimeout(function(){
      $(the).fadeOut(function(){$(the).remove();});
    },1000);
  });
}
var hhl=false;
$.com={
  http:'http://139.199.166.107',  //    登录超时  code==403    suc==false
  //prevUrl:'',    // 登录超时后再登录返回时记录的路由
  ajax:function(url,data,type,callback){
    $.ajax({
      url:this.http+url,
      data:data,
      type:type,
      success:function(res){
        var res=JSON.parse(res);
        if(!res.suc && res.code==403){
          //alert('登录超时');
          localStorage.prevUrl=window.location.href;
          window.location.href='login.html';
        }else if(res.suc){
          callback(res);
        }else{
          $.alert(res.msg);
        }
      },
      error:function(){
        console.log('error');
      }
    });
  },
	token:function(){
		var TOKEN;
		$.ajax({
			type:'POST',
			data:{},
			async:false,
			url:this.http+'/core/getToken.shtml',
			success:function(e){	
				var e=JSON.parse(e);
				TOKEN=e.rs;
				document.cookie="arftkn="+TOKEN; 
			},
			error:function(){
				console.log('error');
			}
		});
		return TOKEN;
	},
	getShapeCode:function(el){
	  hhl=true;
    var token=this.token(); 
    el.attr('src','http://139.199.166.107/code/captcha-image.shtml?id='+Math.random()+'&arftkn='+token);
    hhl=false;
	},
	getRSA:function(){
	  var rsa;
	  if(localStorage.rsa){
	    rsa=JSON.parse(localStorage.rsa);
	  }else{
	    $.ajax({
        type:'GET',
        data:{},
        async:false,
        url:this.http+'/core/getRSA.shtml',
        success:function(res){  
          var e=JSON.parse(res);
          rsa=e.rs;
          localStorage.rsa=JSON.stringify(rsa);
        },
        error:function(){
          console.log('error');
        }
      });
	  }
    return rsa;
	},
	getCode:function(type,mobile,captha){ // type: SMS_TYPE_REG(或者SMS_CHANGE_PWD和SMS_DYNAMIC_LOGIN)//动态登录，接口暂无
	  if($('.h-alert')[0]){return;}
	  var suc=false;
	  $.ajax({
      type:'post',
      data:{
        type:type,mobile:mobile,captha:captha
      },
      async:false,
      url:this.http+'/sms/send.shtml',
      success:function(res){  
        var e=JSON.parse(res);
        if(e.suc){
          suc=true;
          $.alert('短信验证码发送成功!');
        }else{
          $.alert(e.msg);
        }
      },
      error:function(){
        console.log('error');
      }
    });
    return suc;
	},
	rsaEncrypt:function(exponent,modulus,psd){
//  var rsa = new RSAKey();
//  rsa.setPublic(modulus, exponent);
//  return rsa.encrypt(psd);
    var key = RSAUtils.getKeyPair(exponent, '', modulus);
    return RSAUtils.encryptedString(key, psd);
	}

}

$.check={
  mobile:function(el){
    this.phone=el.val();
    if(!this.phone){
      $.alert('请输入手机号!');
      el.focus();
      return false;
    }else if(!/^1(3|4|5|7|8)\d{9}$/.test(this.phone)){
      $.alert('请输入有效手机号!');
      el.val('');
      el.focus();
      return false;
    }else{
      return true;
    }
  },
  password:function(el,text1,text2){  // 改方法写成psd第二次进来就会报错,与下面的this.psd冲突
    this.psd=el.val();
    if(!this.psd){
      $.alert(text1);
      el.focus();
      return false;
    }else if(!/[a-zA-Z0-9]{6,20}/.test(this.psd) || !/[A-Za-z]+[0-9]|[0-9]+[A-Za-z]/.test(this.psd) ){
      $.alert(text2);
      el.val('');
      el.focus();
      return false;
    }else{
      return true;
    }
  },
  shapeCode:function(el){
    var shapeCode=el.val();
    if(!shapeCode){
      $.alert('请输入图形码!');
      el.focus();
      return false;
    }else{
      return true;
    }
  },
  code:function(el){
    var code=el.val();
    if(!code){
      $.alert('请输入验证码!');
      el.focus();
      return false;
    }else{
      return true;
    }
  }
}
