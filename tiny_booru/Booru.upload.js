Booru.upload_queue=[];
Booru.upload=function(files,event){
	Booru.upload_input=event.target
	Booru.upload_input.form.hidden=true;
	$('#uploaded').empty();
	Array.prototype.forEach.call(files,function(file,i,files){
		var reader = new FileReader();
		reader.onload = function(e){
			var spark = new SparkMD5.ArrayBuffer();
			spark.append(e.target.result);
			var md5=spark.end();
			$('#uploaded').append('<li id="ul_'+i+'" data-hash="'+md5+'"><i class="icon-picture"></i><code>'+md5+'</code>('+file.name+')</li>');
			Booru.upload_queue.push({id:i,file:file,hash:md5});
			if(i+1==files.length)
				Booru.searchExisting();
		};
		reader.readAsArrayBuffer(file);
	});
}
Booru.searchExisting=function(){
	$.post('json.php?cmd=exist',{q:JSON.stringify(Booru.upload_queue.map(function(a){return a.hash;}))},function(ajax){
		for(img in ajax.results){
			if(!ajax.results[img])continue;
			$elem=$('[data-hash="'+img+'"]');
			Booru.uploadSucceed($elem,img);
		}
		Booru.uploadNext();
	},'json');
}
Booru.uploadSucceed=function($elem,id){
	$elem.find('code').html('<a target="_blank" href="post.php?h='+id+'">'+id+'</a>');
	$elem.find('i').removeClass().addClass('icon-ok');
	$('#addtag').val().split(/\s/g).forEach(function(tag){if(!tag)return;
			$.get('json.php',{cmd:'addtag',h:id,q:tag});
	})
}
Booru.uploadNext=function(){
	var f=Booru.upload_queue.pop();
	if(f===undefined){//no more elements
		Booru.upload_input.form.reset();
		Booru.upload_input.form.hidden=false;
		return;
	}
	var elem=document.getElementById('ul_'+f.id);
	console.log('uploading:'+f.id)
	if($(elem).find('i').hasClass('icon-ok'))
		return Booru.uploadNext();
	$(elem).find('i').removeClass().addClass('icon-upload');
	var formdata=new FormData();
	formdata.append("file", f.file);
	$.ajax({
		url: "json.php?cmd=upload",
		type: "POST",
		data: formdata,
		processData:false,
		contentType:false,
		dataType   :'json',
		success: function(res){
			Booru.uploadSucceed($(elem),res.results);
			Booru.uploadNext();
		},
		error: function(res){
			$(elem).find('code').html('error');
			$(elem).find('i').removeClass().addClass('icon-warning-sign');
			Booru.uploadNext();
		}
	});
}
