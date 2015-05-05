(function buildTree(elem,obj/*=window*/,parent/*=null*/,child/*=""*/){
	if(obj==undefined)obj=window;
	if(parent==undefined)parent=null;
	if(child==undefined)child="";
//add handler
	var n=elem.tagName.toLowerCase();
	if(n=="button" || (n=="input" && ['submit','button'].indexOf(elem.getAttribute("type"))>=0)){
		elem.onclick=function(ev){obj.call(parent,elem.value,elem,ev)};
	}else if(n=="input" || n=="textarea"){
		elem.onkeyup=function(ev){obj.call(parent,elem.value,elem,ev)};
	}else if(parent&&parent['_'+child]){//div,span,p ...
		parent.__defineSetter__(child,function(val){parent['_'+child](val,elem)});
	}else{
		//console.log(elem,parent,child);
	}
//recursivly
	for(var i=0,childs=elem.children;i<childs.length;i++){
		var attr=childs[i].getAttribute('a');
		if(attr==undefined){
			buildTree(childs[i],obj,parent,child);
		}else{
			if(obj[attr]==undefined)obj[attr]={};
			buildTree(childs[i],obj[attr],obj,attr);
		}
	}
})(document.childNodes[0]);

/*
le fou se reve intelligent
a moins que ce ne soit son
inteligence qui l'est rendu fou
*/
