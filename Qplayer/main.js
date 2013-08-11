var	Player=Audio;//native HTML5 audio player
var sys={
	cgi_url:'/cgi-bin/filemanager/utilRequest.cgi',
	session:{},
	login:function(credential,cb){
		$.post('/cgi-bin/filemanager/wfm2Login.cgi',{
			user:credential.user,
			pwd:ezEncode(credential.pwd)
		},function(obj){
			sys.session=obj;
			if(cb)cb(obj);
		},'JSON');
	},
	ls:function(path,cb){
		var isroot=(path=='/');
		var raw=[];
		var params={
			list_mode:'all',
			func:'get_'+(isroot?'tree':'list'),
			sort:'filename',dir:'ASC',
			start:0,limit:9999,
			sid:sys.session.sid,
			node:"share_root"
		};
		if(!isroot)
			raw.push('path='+path);
		$.get(sys.cgi_url+'?'+raw.join('&'),params,function(a){
			if(!isroot)
				return cb(a.datas,a);
			a.map(function(dir){dir.id=dir.id.substr(1);return dir;});//remove the pre-slash of every dir
			return cb(a,a);
		},'JSON');
	},
	play:function(url,start_cb,next_cb,end_cb){
		var file=url.substr(  url.lastIndexOf('/')+1);
		var path=url.substr(0,url.lastIndexOf('/')+1);
		var src=sys.cgi_url+'?func=get_viewer&sid='+sys.session.sid+
			'&source_path='+path+'&source_file='+file;
		audio.setAttribute('src',src);
		audio.setAttribute('onPlaying',start_cb);
		audio.setAttribute('onError',next_cb);
		audio.setAttribute('onEnded',next_cb);
		audio.setAttribute('onAbort',end_cb);
		audio.play();
	}
};
var gui={
	init:function(msg){
		window.onhashchange=function(){
			var hash=document.location.hash.substr(2);
			if(hash)
				gui.dig(hash.split('/'),$('#root'));
		};
		$('#player [name=mode]').val(localStorage.mode);
		window.audio=new Player();
		//for(var i in audio)if(i.substr(0,2)=='on')audio[i]=console.log;
		sys.login({user:'guest',pwd:''},function(){window.onhashchange();});
		gui.entry($('ul#root'),[{text:'MUSIC',id:'MUSIC'}],'/Multimedia/');
	},
	warning:function(msg){
		$('<div class="warning">'+msg+'</div>').appendTo('body').fadeOut(0).fadeIn(1000).fadeOut(5000,function(){$(this).remove()});
	},
	login:function(form,cb){
		//$(form).find('[type=submit]').attr('disabled',true);
		sys.login({
			user:'guest',//$(form).find('[name=user]').val(),
			pwd :''//$(form).find('[name=pwd]').val(),
		},function(obj){
			//$(form).find('[type=submit]').attr('disabled',false);
			if(!obj.sid)
				return gui.warning('no SID returned ! (bad user/pwd?)');
			//else $(form).hide();
			if(cb)cb(obj);
		});
		return false;
	},
	ls:function(a,cb){
		var $ul=$(a).parent().find('ul');
		if(cb &&$ul.find('li').length)return cb($ul);//already opened
		$(a).addClass('loading');
		var path=$(a).attr('href').substr(1);
		sys.ls(path,function(list,json){
			$(a).removeClass('loading');
			if(json.status!==undefined){
				if(json.status==3)
					return gui.login(null,gui.ls.bind(this,a,cb));
				else
					return gui.warning('bad server response');
			}
			gui.entry($ul,list,path);
			if(cb)cb($ul);
		});
	},
	entry:function($ul,list,dir){
		(list||[]).forEach(function(entry){
			var isfile=(entry.isfolder!==undefined&&entry.isfolder===0);
			var title=entry.id!==undefined?entry.id:entry.filename;
			var name=entry.text!==undefined?entry.text:entry.filename;
			$ul.append('<li class="type_'+(isfile?'file':'dir')+'"><a '+
				(!isfile?'onclick="gui.entry_toggle(event,this)"':'')+
				' href="#'+dir+title+(isfile?'':'/')+'">'+name+'</a><ul></ul></li>');
		});
	},
	entry_toggle:function(event,a){
		if($('>ul>li',$(a).parent()).length){
			$('>ul',$(a).parent()).empty();
			event.preventDefault();//avoid hash change
		}
	},
	play:function(a){
		gui.$target=$(a).addClass('playing');
		var url=$(a).attr('href').substr(1).replace(/&/g,'%26');
		document.title=url.substring(url.lastIndexOf('/')+1,url.lastIndexOf('.'));
		sys.play(url,'gui.onplay_start()','gui.onplay_next()','gui.onplay_end()');
	},
	onplay_start:function(){
		gui.$target.removeClass('playing').addClass('play');
	},
	onplay_end:function(){
		$('.play').removeClass('play');
	},
	onplay_next:function(){
		gui.onplay_end();
		gui.playnext();
	},
	playnext:function(){
		//audio.stop();
		gui['playnext_'+$('#player select').val()]();
	},
	playnext_folder:function(){
		var a=gui.$target.parent().next().find('a')[0];
		if(a)a.click();
	},
	playnext_shuffle:function(){
		function dig($ul){
			$dirs=$('>li.type_dir',$ul);
			if($dirs.length){
				gui.ls($dirs.eq((Math.random()*$dirs.length)|0).find('a')[0],dig);
			}else if($ul.find('li').length){
				var $files=$('>li.type_file>a',$ul);
				var a=$files.eq((Math.random()*$files.length)|0)[0];
				if(a)a.click();
			}else playnext_shuffle();//the final directory was empty
		}
		dig($('#root'));
	},
	playnext_available:function(){
		var $files=$('li.type_file>a');
		var a=$files.eq((Math.random()*$files.length)|0)[0];
		if(a)a.click();
	},
	playnext_none:function(){},
	dig:function(dir_list,$ul){
		var file=dir_list.shift();
		var $a=$('>li>a:contains("'+file+'")',$ul);
		if(file==="")//directory reached
			return;
		if(!$a.length)//dir not found : may be a hidden directory (ex. "/Multimedia" when tree start at /Multimedia/)
			return gui.dig(dir_list,$ul);
		if($a.parent().hasClass('type_dir'))
			return gui.ls($a[0],function(){gui.dig(dir_list,$('>ul',$a.parent()));});
		if($a.parent().hasClass('type_file'))
			return gui.play($a[0]);
	}
};