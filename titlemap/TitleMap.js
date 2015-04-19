TitleMap=function(){
	this.titles=[/*U8Cl[1024],U8Cl[1024],...*/];
	this.map=[/*0,1,1,2...*/];
	this.size/*16*/;
	this.width;/*sprite par row*/
	this.view=document.getElementById('view');
	this.view_ctx=this.view.getContext('2d');
	this.titles=document.getElementById('titles');
}
TitleMap.prototype.view2TitlesMap=function(tmp_titles,mirror){
	function equal_base(a,b,width){
		for(var i=0;i<a.data.length;i++)
			if(a.data[i]!=b.data[i])return false;
		return true;
	}
	function equal_flip(a,b,width){
		for(var y=0;y<a.data.length;y+=width)
			for(var x=0;x<width;x+=4)
				for(var i=0;i<4;i++)
					if(a.data[(y+(width-1-x))*4+i]!=b.data[(y+x)*4+i])return false;
		return true;
	}
	function equal_mirror(a,b,width){
		if(equal_base(a,b,width))return 1;
		if(equal_flip(a,b,width))return -1;
		return 0;
	}
	var equal=mirror?equal_mirror:equal_base;
	this.titles=[];//unique titles
	this.titles_occur=[];//unique titles occurrences
	this.map=tmp_titles.map(function(title){
		for(var t=0,uv=0;t<this.titles.length;t++)//search for an existing title
			if(uv=equal(this.titles[t],title,this.size)){//duplicate found ?
				this.titles_occur[t]++;
				return t;//yes : use it index
			}
		this.titles_occur.push(1);
		return this.titles.push(title)-1;//none found, add to the list
	},this);
	return this;
}
TitleMap.prototype.set=function(pos,val){
	var x=(pos*this.size)%this.view.width;
	var y=(((pos*this.size)-x)/this.view.width)*this.size
	this.view_ctx.putImageData(this.titles[val],x,y);
	this.map[pos]=val;
}
TitleMap.prototype.fromImageFile=function(size,img_f,cb){
	var self=this;
	var reader=new FileReader();
	reader.onload=function(){//file loaded
		var img=new Image();
		img.onload=function(){//image decoded
			self.fromImageData(size,this,cb)
		}
		img.src=this.result;
	}
	reader.readAsDataURL(img_f);
}
TitleMap.prototype.fromImageData=function(size,img_d,cb){
	this.size=size;
	this.width=img_d.width/size;
	this.view.width=img_d.width;
	this.view.height=img_d.height;
	this.view_ctx.drawImage(img_d,0,0);
	
	for(var y=0,tmp=[];y<this.view.height;y+=size)
		for(var x=0;x<this.view.width;x+=size)
			tmp.push(this.view_ctx.getImageData(x,y,size,size));
			
	this.view2TitlesMap(tmp,true);//remove duplicate titles
	if(cb)cb.call(this);
}
TitleMap.prototype.fromFiles=function(size,map_f,ttl_f,sub_f){
	var self=this;
	var reader=new FileReader();
	reader.onload=function(){//file loaded
		self.map=[1,2,3,4,5];
	}
	reader.readAsArrayBuffer(file);
	
	self.size=size;
	if(sub_f){
		//self.titles=TODO
	}else{
		//self.titles=
	}
}
TitleMap.prototype.mapTitles2Image=function(map,title,width,size,can_inv){//to create title from sub
	
}
TitleMap.prototype.toHref=function(do_sub,map_a,inf_a,ttl_a,sub_a){
	for(var i=0;i<arguments.length;i++)//free all .href
		if(arguments[i].constructor==HTMLAnchorElement && arguments[i].hasAttribute('href'))
			URL.revokeObjectURL(arguments[i].href),
			arguments[i].removeAttribute('href');
	
	if(do_sub){//TODO
		//ttl_a.href=
		//sub_a.href=
	}else{
		ttl_a.href=window.URL.createObjectURL(new Blob(this.titles))
		ttl_a.title='nb:'+this.titles.length;
	}
	//map
	var u=1<<Math.max(3,Math.ceil(Math.log2(Math.log2(this.titles.length))));
	map_a.href=window.URL.createObjectURL(new Blob([new window['Uint'+u+'Array'](this.map_a)]))
	map_a.title='nb:'+this.map_a.length+'(u'+u+')';
	//info
}