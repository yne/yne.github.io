var	Player=Audio;//native HTML5 audio player
var sys={
	cgi_url:'/cgi-bin/filemanager/utilRequest.cgi',
	session:{},
	login:function(credential,cb){
		$.post('/cgi-bin/filemanager/wfm2Login.cgi',{
			user:credential.user,
			pwd:ezEncode(credential.pwd),
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
}
var gui={
	warning:function(msg){
		console.log(msg);
	},
	login:function(form){
		$(form).find('[type=submit]').attr('disabled',true);
		sys.login({
			user:$(form).find('[name=user]').val(),
			pwd :$(form).find('[name=pwd]').val(),
		},function(obj){
			$(form).find('[type=submit]')
				.attr('disabled',false);
			if(!obj.sid)gui.warning('no SID returned ! (bad user/pwd?)')
			else $(form).hide();
		});
		return false;
	},
	ls:function(a,cb){
		var $ul=$(a).parent().find('ul');
		if($ul.find('li').length){//already opened
			if(cb)return cb($ul);//internal browse : keep
			return $ul.empty();//human clic : clear content
		}
		$(a).addClass('loading');
		sys.ls(a.title,function(list,json){
			$(a).removeClass('loading');
			if(json.status!=undefined)return gui.warning('bad server response');
			gui.entry($ul,list,a.title);
			if(cb)cb($ul);
		});
	},
	entry:function($ul,list,dir){
		(list||[]).forEach(function(entry){
			var isfile=(entry.isfolder!=undefined&&entry.isfolder==0);
			var title=entry.id!=undefined?entry.id:entry.filename;
			var name=entry.text!=undefined?entry.text:entry.filename;
			$ul.append('<li class="type_'+(isfile?'file':'dir')+'"><a onclick="gui.'+(isfile?'play':'ls')+
				'(this)" title="'+dir+title+(isfile?'':'/')+'">'+name+'</a><ul></ul></li>');
		});
	},
	play:function(a){
		gui.$target=$(a).addClass('playing');
		var url=a.title.replace(/&/g,'%26');
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
		gui['playnext_'+$('#player select').val()]();
	},
	playnext_folder:function(){
		gui.$target.parent().next().find('a').click();
	},
	playnext_shuffle:function(){
		function digg($ul){
			$dirs=$ul.children('li.type_dir');
			if($dirs.length)
				gui.ls($dirs.eq((Math.random()*$dirs.length)|0).find('a')[0],digg);
			else if($ul.find('li').length){
				var $files=$ul.find('li.type_file>a');
				$files.eq((Math.random()*$files.length)|0).click();
			}else playnext_shuffle();//the final directory was empty
		}
		digg($('#root'))
	},
	playnext_available:function(){
		var $files=$('li.type_file>a');
		$files.eq((Math.random()*$files.length)|0).click();
	}
}
