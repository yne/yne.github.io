function createCanvas(width,height){
	var cnv = document.createElement('canvas');
	cnv.width = width;
	cnv.height = height;
	return cnv.getContext("2d");
}
function Title(map,x,y,size){
	this.img = map.ctx.getImageData(x*size,y*size,size, size);

	this.eq=function(to){
		if(this.img.data.length!=to.img.data.length)return false;
		for(var i=0;i<this.img.data.length;i++)
			if(this.img.data[i]!=to.img.data[i])return false;
		return true;
	}
}
function Map(img){
	this.ctx = createCanvas(img.width,img.height);
	this.ctx.drawImage(img, 0, 0);
	this.img = this.ctx.getImageData(0,0,img.width, img.height);
	
	this.titlify=function(size){
		if(this.ctx.canvas.height%size || this.ctx.canvas.width%size)
			console.warn("unexact titling");
		var progress=document.getElementById('progress');
		var titles=[];//filled during the map browsing
		var map=[];//2d array of title indexes
		for(var y=0;y<this.ctx.canvas.height/size;y++){
			map[y]=[];
			for(var x=0;x<this.ctx.canvas.width/size;x++){
				var title = new Title(this,x,y,size);
				var clone=false;
				for(var i=0;i<titles.length;i++){//search for existing sprite
					if(title.eq(titles[i])){
						clone=i;
						break;
					}
				}
				map[y][x] = (clone===false)?titles.push(title)-1:clone;
			}
			var percent=Math.floor(((y+1)/(this.ctx.canvas.height/size))*100);
			console.log(percent);
			progress.innerHTML=percent;
		}
		return new TitleMap(titles,map);
	}
}
function TitleMap(titles,map){
	this.titles=titles;
	this.map=map;
	
	var size=this.titles.length?this.titles[0].img.width:0;
	
	this.drawTitles=function(id,linewidth){
		var titles=document.getElementById(id);
		titles.width = size*linewidth;
		titles.height = size*Math.ceil(this.titles.length/linewidth);
		var ctx=titles.getContext("2d");
		for(var y=0,n=0;y<this.titles.length/linewidth;y++){
			for(var x=0;x<linewidth && n<this.titles.length ;x++,n++){
				ctx.putImageData(this.titles[n].img, x*size, y*size);
			}
		}
	}
	this.drawMapTable=function(id){
		var table="";
		for(var y=0;y<this.map.length;y++){
			table+="<tr>";
			for(var x=0;x<this.map[y].length;x++){
				table+='<td title="[ '+x+' | '+y+' ] ( '+(x*size)+'px | '+(y*size)+' px )">' + this.map[y][x] + '</td>';
			}
			table+="</tr>";
		}
		document.getElementById(id).innerHTML=table;
	}
}
function init(img,size){
	var map = new Map(img);
	var start = Date.now();
	r = map.titlify(size);
//	var r={titles:[],map:[]};
	var opt=Math.round(r.titles.length/((map.ctx.canvas.width*map.ctx.canvas.height)/(size*size))*100)
	console.log(r.titles.length+" ("+opt+"% total) titles found in "+(Date.now()-start)+"ms");

	r.drawTitles('titles',16);
	r.drawMapTable('map');
}
