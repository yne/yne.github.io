var XMLparser=function(xml){
	//parsing part
	this.stack=[];
	this.obj={childNode:[]};
	this.getLastChild=function(i){
		var pos=this.obj;
		for(;i<this.stack.length;i++)
			pos=pos.childNode[pos.childNode.length-1];
		return pos
	};
	this.append=function(name,attr){
		this.stack.push(name);
		this.getLastChild(1).childNode.push({attr:attr,name:name,childNode:[]})
	};
	this.setText=function(text){//TODO:parse text
		if(text)this.getLastChild(0).text=text;
		return this.stack.pop();
	};
	this.parseAttr=function(str){
		var attr={};
		for(var reg;(reg=str.match(/^ (\w+)="(.*?[^\\])"(.*)/));str=reg[3])
			attr[reg[1]]=reg[2];
		var t=str.match(/^\s*(\/)?>(.*)/);
		return {attr:attr,rest:t[2],short:t[1]!=undefined};
	};
	this.parse=function(str){
		var tmp=str.match(/^\s*<([\w:]+)(.*)/);
		if(tmp){
			var a=this.parseAttr(tmp[2]);
			this.append(tmp[1],a.attr);
			if(a.short)this.setText();
			this.parse(a.rest);
		}else{
			var c,end=str.match(/(.*?)<\/([\w:]+)>(.*)/);
			if((c=this.setText(end[1]))!=end[2])
				return console.error('missmatching closing tag('+c+' vs '+end[2]+')');
			if(end[3])this.parse(end[3]);
		}
	};
	this.valueOf=function(){
		return this.obj.childNode;
	};
	//selector part
	this.tagMatch=function(tag,cmd){
		var tags=[],c=tag.childNode,attr=cmd.attr.match(/([\w:]+)(=(\w+))?/);
		for(var t in c){//pour chaque fils
			if((cmd.name=='*'||c[t].name==cmd.name)){//le nom match
				if((!attr)//pas de spec sur les attr = ok
					||(((attr[3]==undefined)&&(c[t].attr[attr[1]]!=undefined))//pas de spec de val + presence de l'attr = ok
					||(((attr[3]!=undefined)&&(c[t].attr[attr[1]]!=undefined)&&(c[t].attr[attr[1]]==attr[3])))))//spec de val + presence de l'attr + bonne val = ok
					tags.push(c[t]);
			}
			if((!cmd.direct)&&c[t].childNode.length)//si on est indirect on descend
				tags=tags.concat(this.tagMatch(c[t],cmd));
		}
		return tags;
	};
	this.find=function(str){
		var sel,cmds=[],tags=[this.obj];
		if(!str.match(/^[ >]/))str=' '+str;
		while(str){
			if(!(sel=str.match(/([ >])([\w:\*]+)(\[.*?\])?(.*)/)))break;
			cmds.push({direct:sel[1]=='>',name:sel[2],attr:sel[3]?(sel[3].substr(1,sel[3].length-2)):''});
			str=sel[4];
		}
		for(var cmd in cmds){
			var tmp=[];
			for(var tag in tags)
				tmp=tmp.concat(this.tagMatch(tags[tag],cmds[cmd]));
			tags=tmp;
		}
		return tags;
	}
	this.parse(xml);
}
