var Postit={
	dragStart:function(e){
		Postit.target={};
		e.dataTransfer.effectAllowed = 'copy';
		e.dataTransfer.setData('id', this.id);
	},
	dragOver :function(e){
		if (e.preventDefault) e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
		Postit.target={
			id:this.parentNode.parentNode.parentNode.id,
			before:$(this).hasClass('left')
		};
	},
	drop:function(e){
		e.preventDefault();//prevent redirect
		var $source=$('#'+e.dataTransfer.getData('id'));
		var $target=$('#'+Postit.target.id);
		if(Postit.target.before)
			$target.before($source);
		else
			$target.after($source);
		//TODO:ajax move record
			//on succed :
				//for each collumn
					//update postit id/class
	},
}
["TODO","pending","done","tested"].forEach(function(title){//create postits
	var formated = title.toLowerCase().replace(/\s/g,'');
	$('#planning>thead>tr').append('<th>'+title+'</th>');
	$('#planning>tbody>tr').append('<td id="'+formated+'"></td>');
	for(var i=0;i<10;i++){
		var rot=Math.round(25*(Math.random()-0.5));
		$('#'+formated).append(
			'<table id="postit_'+title+'_'+i+'" class="container" draggable="true">'+
			'<td class="spacer left"></td>'+
			'<td style="transform: rotate('+rot+'deg)" class="postit">'+
				'<a onclick="alert(\'TODO:\npopup : '+title+'_'+i+'\')">'+i+'</a>'+
			'</td>'+
			'<td class="spacer right"></td>'+
			'</table>'
		);
	}
})
//add drag handler on spaces
$('.spacer').each(function(e){
	this.addEventListener('dragover' , Postit.dragOver , false);
	this.addEventListener('drop'     , Postit.drop     , false);
})
$('.container').each(function(e){
	this.addEventListener('dragstart', Postit.dragStart, false);
})