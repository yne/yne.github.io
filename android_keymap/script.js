var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

function fileDrop2value(event,el){
	event.preventDefault();
	var fr=new FileReader();
	fr.onload=(function(ev){this.value=ev.target.result;}).bind(el);
	fr.readAsText(event.dataTransfer.files[0]);
}

function parseKl(kl){
	return kl.split('\n')
		.filter(function(a){return a.length&&a[0]!='#';})
		.map(function(a){return a.match(/\w+/g);});
}

function parseKcm(text){
	text=text.replace(/\r/,'').replace(/^#.*\n/g,'').replace(/\t/g,'    ');
	var type=(text.match(/type (\w+)/)||['','FULL'])[1];
	var entry_exp="key\\s+(\\w+)\\s+\\{([\\s\\S]+?)\\}";
	return (text.match(new RegExp(entry_exp,'g'))||[]).map(function(entry){
		var ret=entry.match(new RegExp(entry_exp)).slice(1);
		var line_exp="(.*?):\\s*(.*)";
		ret[1]=ret[1].match(new RegExp(line_exp,'g')).map(function(line){
			var ret2=line.match(new RegExp(line_exp)).slice(1);
			ret2[0]=ret2[0].replace(/\s/g,'').split(',');
			return ret2;
		});
		return ret;
	});
}

function drawOSK(kl,kcm){
	function val(n,modifier){
		var ret=(n[1].find(function(a){return(a[0].indexOf(modifier)>=0);})||[0,"none"])[1];
		
		if(ret.match(/fallback /))
			return '<u title="'+ret+'">&#x2197;</u>';
//		console.log(ret,modifier);
		
		if(ret=="none")return '';
		if(ret[0]=="'")ret=(ret.match(/'(.*)'/)||[null,ret])[1];
		if(ret[0]=='\\'){
			if(ret[1]=='u')ret=String.fromCharCode("0x"+ret.substr(2));
			else ret={t:'\t',r:'\r',n:'\n','\\':'\\'}[ret[1]]||ret[1];
		}
		return ret;
	}
//		console.log(kcm)
	Osk.innerHTML=Layout.map(function(l){return l.map(function(k){
		var code=kl .find(function(a){return a&&(a[1]*1==k.n);}) || ['key',0,''];
		var name=kcm.find(function(k){return k[0]==code[2];}) || ['',[]];
		//console.log(name);
		return '<div class="btn s'+(k.t||1)+'" title="'+code[2]+'"><table><tr>'+
			'<td class="t l shift" >'+val(name,'shift' )+'</td>'+
			'<td class="t c"       >'+val(name,'meta'  )+'</td>'+
			'<td class="t r number">'+val(name,'number')+'</td>'+
			'</tr><tr>'+
			'<td class="b l base"  >'+val(name,'base'  )+'</td>'+
			'<td class="b c fn"    >'+val(name,'fn'    )+'</td>'+
			'<td class="b r alt"   >'+val(name,'alt'   )+'</td>'+
			'</tr></table></div>';
	}).join('');}).join('<br/>');
}
function toTxt(){
	$$('#Osk btn');
}
onload=function(e){
	if(Kcm.value.length>300)
		drawOSK(parseKl(Kl.value),parseKcm(Kcm.value));
};