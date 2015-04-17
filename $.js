$$=function(sel,node){return [].slice.call((document||node).querySelectorAll(sel));}
$=function(sel,node){return (document||node).querySelector(sel);}
$.empty=function(node){[].slice.call(node.childNodes).forEach(function(child){node.removeChild(child)});return node;}
$.get=function(url,cb){
	var xhr = new XMLHttpRequest();
	xhr.onload=cb;
	xhr.open('GET',url);
	xhr.send();
}
$.toNode=function(jsonML){
	var node=document.createElement(jsonML.shift());
	jsonML.forEach(function(j){
		if(j)switch(j.constructor){
			case Array :node.appendChild($.toNode(j));break;
			case Object:for(attr in j){
				if(attr.match(/^on/))node[attr]=j[attr];//event attribut
				else node.setAttribute(attr,j[attr])//other attribut
			};break;
			case String:node.appendChild(document.createTextNode(j));break;
		}
	});
	return node;
}
