var Grid=function(array){
	this.cells=array;//the grid
	this.getCell=function(x,y){return this.cells[9*y+x]};
	this.setCell=function(x,y,val){return this.cells[9*y+x]=val};
	
	this.solve=function(){
		while(this.solveStep());
		return this;
	}
	this.solveStep=function(){
		for(var i=0,col=0,row=0,found=0;i<9*9;i++,col=i%9,row=(i/9)|0){
			if(this.getCell(col,row))continue;//already resolved cell
			var probs=this.getPossibilities(col,row).filter(function(e){return(e!=undefined)});
			if(probs.length!=1)continue;//multiple possibilities
			this.setCell(col,row,probs[0]);
			found++;
		}//TODO inner bloc col/row to full col/row filtering
		return found;
	}
	this.getPossibilities=function(x,y){
		var ret=[0,1,2,3,4,5,6,7,8,9];//start with all the possibilities
		var blocx=((y/3)|0)*3;//upper left cell of my bloc
		var blocy=((x/3)|0)*3;
		for(var row=blocy;row<blocy+3;row++)//remove number present in my bloc
			for(var col=blocx;col<blocx+3;col++)
				delete ret[this.getCell(row,col)||0];
		for(var col=0;col<9;col++)//remove number present in my row
			delete ret[this.getCell(x,col)||0];
		for(var row=0;row<9;row++)//remove number present in my collumn
			delete ret[this.getCell(row,y)||0];
		return ret;
	}
}