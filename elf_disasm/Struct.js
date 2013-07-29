function Struct(struct){
	var type2class={
		'1':Uint8Array,'2':Uint16Array,'4':Uint32Array,
		'-1':Int8Array,'-2':Int16Array,'-4':Int32Array
	}
	this.struct=struct;
	this.size=function(){
		var size=0;
		for(var attr in this.struct){
			var self=this.struct[attr];
			if(self.constructor==Number)size+=self;
			if(self.constructor==Object)size+=self.size()||0;
			if(self.constructor==Array )size+=self.length;
		}
		return size;
	}
	this.toObject=function(blob,off){
		var out={},offset=0;
		for(var attr in this.struct){
			var self=this.struct[attr];
			if(self.constructor==Object){
				//TODO:sub struct
			}
			if(self.constructor==Number){
				var type=type2class[self];
				//TODO:pre-subset in case of bad offset%n
				try{
				var value=new type(blob,offset,1);
				}catch(e){console.log('bad offset')}
				out[attr]=value;
				offset+=self;
			}
		}
		return out;
	}
	this.toBlob=function(){
		return Struct.toBlob(this.struct);
	}
}
Struct.toBlob=function(obj){
	var array=[];
	for(var attr in obj){
		if(attr[0]=='_')continue;
		array.push(obj[attr]);//TODO:sub array
	}
	return new Blob(array);
}
//utility
Struct.insert=function(input,offset,blob){//insert a struct in a blob according to it offset
	if(input.constructor==Array )input=new Blob(input);
	else if(input.constructor==Object)input=Struct.toBlob(input);
	else if(input.constructor==ArrayBuffer)input=Blob([input]);
	else console.warn(input.constructor);
	if(blob.size<offset){
		console.log(offset-blob.size)
		blob=new Blob([blob,new Uint8Array(offset-blob.size)]);
	}
	return new Blob([
		blob.slice(0,offset),
		input,
		blob.slice(offset+input.size)
	]);
}