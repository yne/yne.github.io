function solve(grid){
	var minus=function(array,vals){
		return (vals.constructor==Array?vals:[vals]).forEach(function(val){
			var i=array.indexOf(val);
			if(i!=-1)array.splice(i,1);
		});
	}
	for(var prev_str;JSON.stringify(grid) != prev_str;){
		prev_str=JSON.stringify(grid);//backup
		grid=grid.map(function(possibilities,p){
			if(possibilities.length==1)return possibilities;//already solved
			var exclu=possibilities.slice();//will lose non exclusives one
			for(var grid=this,i=0;i<9;i++){
				[(p-(p%9))+i,(p%9)+(i*9),(p-p%27)+(p-p%3)%9 + (i%3)+(0|i/3)*9]
				.forEach(function(pos,b,a){//foreach rows,collumns,blocs
					if(pos==p)return;//we don't compute ourself
					//remove existing solved blocs from possibilities
					if(grid[pos].length==1)
						minus(possibilities,grid[pos]);
					//check if i'm the only one to hold a possibility
					minus(exclu,grid[pos]);
				})
			}
			return exclu.length==1?exclu:possibilities;
		},grid);
	}
	return grid;
}
