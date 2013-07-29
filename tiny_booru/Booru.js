var Booru={
	searchinter:null,
	searchtimeout:0,
	searchValue:function(value){
		$('#tagSearch').val(value);
		if(value.length<=2)return;
		clearTimeout(Booru.searchtimeout);
		Booru.searchtimeout=setTimeout(function(){
			document.location.hash='tag/'+value;
		},1000);
	},
	searchImage:function(){
		console.log(this,arguments)
	},
	slideshow_delImg:function(img){
		$.getJSON('json.php',{cmd:'delimg',q:$('#slideshow').data('img')},function(json){
			Booru.slideshow_at($("#slideshow").data("pos")+1);
		})
	},
	slideshow_addTag:function(input){
		input.disabled=true;
		$.getJSON('json.php',{cmd:'addtag',q:input.value,h:$('#slideshow').data('img')},function(json){
			Booru.slideshow_at($("#slideshow").data("pos"))
			input.disabled=false;
			input.value="";
		});
	},
	slideshow_at:function(i){
		var list=Booru.printResults_args[0].results
		var img=list[(i+list.length)%list.length];
		$('#slideshow').data('img',img.id);
		$('#slideshow').css({'background-image':'url(img/'+img.id+'/content),url(img/'+img.id+'/thumb)'}).data('pos',i);
		$('#slideshow .next').attr('onclick','Booru.slideshow_at($("#slideshow").data("pos")+1)');
		$('#slideshow .prev').attr('onclick','Booru.slideshow_at($("#slideshow").data("pos")-1)');
		$('#slideshow #gis' ).attr('href','https://www.google.com/searchbyimage?image_url='+ escape(document.location.href+img.id+'/content'));
		$('#slideshow #down').attr('href','img/'+img.id+'/content');
		$.getJSON('json.php',{cmd:'info',q:img.id},function(json){
			$elem=$('#slideshow .tags ul').empty();
			json.results.forEach(function(tag){
				$elem.append('<li><a href="#tag/'+tag+'">'+tag+'</a></li>');
			});
		});
	},
	slideshow:function(id){
		var pos=-1;
		Booru.printResults_args[0].results.forEach(function(a,b){if(a.id==id)pos=b;});//todo use 'every'
		if(pos<0)return alert(id+' not found !');
		$('#slideshow').show();
		Booru.slideshow_at(pos);
	},
	printResults_args:[],
	printResults:function(json,groupFunc,offset){
		if(json.results.length && json.results[0].constructor==String)// in case of array : convert to map
			json.results=json.results.map(function(img){return{id:img,val:img}});
		if(!offset)
			Booru.printResults_args=arguments;
		if(json.results.length==0)return $('#page').html('<h3 class="muted">nothing here ...</h3>');
		var i=0;
		Booru.searchinter=setInterval(function(){
			var grp,img=json.results[offset+i];
			if(img===undefined)
				return clearInterval(Booru.searchinter);
			if(groupFunc && (grp=groupFunc(img)) && !$('.grp'+grp.id).length)
				$('#page').append('<div clear="both" class="grp'+grp.id+'"><h3 class="text-center muted"> '+grp.name+'</h3></div>');
			var $img=$('<a onclick="Booru.slideshow(\''+img.id+'\')"><img src="img/'+img.id+'/thumb" title="'+img.val+'"></img></a>');
			$(groupFunc?('.grp'+grp.id):'#page').append($img.fadeOut(0).fadeIn(1000));
			if(++i>50){
				$('#page').append('<button class="btn btn-large btn-block" id="loadNext" type="button" onclick="$(this).remove();Booru.printResults(Booru.printResults_args[0],Booru.printResults_args[1],'+(offset+i)+')">Moar !</button>');
				return clearInterval(Booru.searchinter);
			}
		},100);
	},
	pageHandler:function(name){
		clearInterval(Booru.searchinter);
		$('#page').empty();
		switch(name){
			case "":
			case "home":
			case "help":
			case "upload":{
				$('#page').load('page/'+name+'.html');
			}break;
			case "recent":{
				$.getJSON('json.php?cmd=recent',function(json){
					var list=[];
					for(var id in json.results)
						list.push({id:id,val:new Date(json.results[id]*1000)});
					list.sort(function(a,b){return b.val-a.val});
					Booru.printResults({results:list},function(img){return {id:img.val.getFullYear()+'_'+img.val.getMonth()+'_'+img.val.getDate(),name:img.val.toLocaleDateString()}},0);
				});
			}break;
			case "tag":{
				var query=document.location.hash.match(/\/(.*)$/)[1];
				$.getJSON('json.php',{cmd:'tag',q:query},function(json){Booru.printResults(json,null,0);});
			}break;
			case "flagged":{
				$.getJSON('json.php',{cmd:'flagged'},function(json){Booru.printResults(json,null,0);});
			}break;
			case "random":{
				$.getJSON('json.php',{cmd:'all'},
					function(json){Booru.printResults({results:json.results.sort(function(a){return Math.random()-0.5;})},null,0);});
			}break;
			default:$('#page').html('<h1>404 : this page is missing</h1>');
		}
	},
	hashHandler:function(){
		var h=document.location.hash;
		if(h.length<=1)h="#home";
		Booru.pageHandler(h.substr(1).match(/^(\w+)\/?/)[1]);
	},
	getTags:function(forced){
		function appendTags(){
			$('[data-provide="typeahead"]').typeahead({source: JSON.parse(localStorage.tags)})
		}
		if(forced===true || (localStorage.tags_date && (new Date()-new Date(1*localStorage.tags_date))>24*60*60*1000))
			delete localStorage.tags;
		if(localStorage.tags)return appendTags();
		$.getJSON('json.php?cmd=tagall',function(json){
			localStorage.tags_date=1*(new Date());
			localStorage.tags=JSON.stringify(json.results);
			appendTags();
		});
	}
};
$(Booru.getTags);
$(document).keyup(function(e){
	if(e.keyCode==27)$('#slideshow').hide();
	if(e.keyCode==39)$('#slideshow .next').click();
	if(e.keyCode==37)$('#slideshow .prev').click();
});
$(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() < $(document).height() - 100)return;
	$('#loadNext').click()
});
(window.onhashchange=Booru.hashHandler)();