String.prototype.toStruct = function(struct,cb,off){
	var out={},pos=off||0,str=this;
	function parseAttr(attr){
		if(typeof(attr)=='string')
			return eval(attr.replace(/\$/g,'out'));
		return attr;
	}
	function getVal(len){
		arguments=[pos,arguments[len]];
		console.assert(pos+len<=str.length,"out of bound");
		if(cb&&cb.read)cb.read.apply(this,arguments);
		var val=0;
		for(var i=len;i>0;i--)
			val=val*256+str.charCodeAt(pos+i-1);
		pos+=len;
		return val;
	}
	function slice(from,len){
		console.assert(from+len<=str.length,"out of bound");
		if(cb&&cb.read)cb.read.apply(this,arguments);
		return str.slice(from,from+len);
	}
	function getAttr(attr,struct,a){
		if(attr instanceof Array){//assert
			for(var i=attr.length-1;i>=0;i--){
				if(((attr[i].constructor==Number)?attr[i]:attr[i].charCodeAt(0))!=str.charCodeAt(pos+i))
					throw 'assert fail @ '+a+'['+i+']';
			}
			return getVal(attr.length,struct._style);
		}
		if(attr.constructor==String)//dynamic primitive
			return parseAttr(attr);
		if(attr.constructor==Number)//primitive
			return getVal(attr,struct._style);
		if(attr instanceof Object){//substruct
			if(attr._num){//sub struct array
				var ret=[];
				var _pos=pos;//backup pos
				pos=parseAttr(attr._off);
				var es=parseAttr(attr._entsize);
				var num=parseAttr(attr._num);
				for(var j=0;j<num;j++){
					if(attr._val)
						ret[j]=getVal(parseAttr(attr._val),attr._style);
					else
						ret[j]=str.toStruct(attr,cb,pos+j*es)[0];
				}
				pos=_pos;
				return ret;
			}else{//simple sub struct
				var t=str.toStruct(attr,cb,pos);
				pos=t[1];
				return t[0];
			}
		}	
	}
	return [(function(){
		for(var a in struct){
			if(a[0]=='_')continue;//internal attribut
			out[a]=getAttr(struct[a],struct,a);
		}
		return out;
	})(struct),pos];
};