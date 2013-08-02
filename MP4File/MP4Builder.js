function MP4Builder(output){
	var p=output,_p=[];
	this.reader=undefined;
	this.setAtomReader=function(reader){
		this.reader=reader;
		return this;
	}
	this.group=function(name){
		_p.push(p);
		if(!p[name])return p=p[name]=[];
		if(!p[name].length)p[name]=[p[name]];
		p=p[name][p[name].length]=[];
	}
	this.log=function(name,val){
		var res=(this.reader&&this.reader[name])?this.reader[name](val):val;
		if(!p[name])p[name]=[res];
		else p[name].push(res)
	}
	this.groupEnd=function(){
		p=_p.pop();
	}
}