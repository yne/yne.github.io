TitleMap=function(){
	this.titles=[/*U8Cl[1024],U8Cl[1024],...*/];
	this.map=[/*0,1,1,2...*/];
	this.size/*16*/;
	this.view=document.getElementById('view');
	this.view_ctx=this.view.getContext('2d');
	this.titles=document.getElementById('titles');
}
TitleMap.prototype.toGUI=function(){
	$('aside').hidden=true;
//	fileReader.readAsArrayBuffer(new Blob(this.titles));
};
TitleMap.prototype.view2TitlesMap=function(tmp_titles,mirror){
	function equal_base(a,b,width){
		for(var i=0;i<a.length;i++)
			if(a[i]!=b[i])return false;
		return true;
	}
	function equal_flip(a,b,width){
		for(var y=0;y<a.length;y+=width)
			for(var x=0;x<width;x+=4)
				for(var i=0;i<4;i++)
					if(a[(y+(width-1-x))*4+i]!=b[(y+x)*4+i])return false;
		return true;
	}
	function equal_mirror(a,b,width){
		if(equal_base(a,b,width))return 1;
		if(equal_flip(a,b,width))return -1;
		return 0;
	}
	var equal=mirror?equal_mirror:equal_base;
	this.titles=new Array();//uniq titles
	this.map=tmp_titles.map(function(title){
		for(var t=0,uv=0;t<this.titles.length;t++)//search for an existing title
			if(uv=equal(this.titles[t],title,this.size))//duplicate found ?
				return t;//yes : use it index
		return this.titles.push(title)-1;//none found, add to the list
	},this);
	return this;
};
TitleMap.prototype.fromImage=function(size,img_f){
	var self=this;
	var reader=new FileReader();
	reader.onload=function(){//file loaded
		var img=new Image();
		img.src=this.result;
		img.onload=function(){//image decoded
			self.size=size;
			self.view.width=this.width;
			self.view.height=this.height;
			self.view_ctx.drawImage(this,0,0);
			
			for(var y=0,tmp=[];y<self.view.width;y+=size)
				for(var x=0;x<self.view.height;x+=size)
					tmp.push(self.view_ctx.getImageData(y,x,size,size).data);
			self.view2TitlesMap(tmp,false);//remove duplicate titles
			self.toGUI();
		}
	}
	reader.readAsDataURL(img_f);
};
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