var Btcnf={
struct:{
	magic     :[0x01,0x30,0x80,0x0f],
	devkit    :4,
	unk8      :4,
	unk12     :4,
	modeOff  :4,
	modeLen  :4,
	mode      :{
	_off      :'$.modeOff',
	_num      :'$.modeLen',
	_entsize  :'32',
		maxsearch:2,
		searchstart:2,
		modeflag:4,
		modeflag2:4,
		reserved1:4,
		reserved2:4,
		reserved3:4,
		reserved4:4,
		reserved5:4,
	},
	unk24     :4,
	unk28     :4,
	modOff   :4,
	modLen   :4,
	mod       :{
	_off      :'$.modOff',
	_num      :'$.modLen',
	_entsize  :'32',
		pathOff 	:4,
		rsrvd   	:4,
		flags   	:2,
		mode    	:2,
		rsrvd2  	:4,
		hash1    	:4,
		hash2    	:4,
		hash3    	:4,
		hash4    	:4,
	},
	unk40     :4,
	unk44     :4,
	path_off  :4,
	path_lim  :4,
	path      :'slice($.path_off,$.path_lim-$.path_off).split(/\0/g)',
	unk56     :4,
	unk60     :4,
},

parse:function(blob){
	var factor=(blob.length>>15)+1;
	var width=blob.length/factor;
	var height=width/50;
	$('.table').empty().show();
	try{
		  var struct=blob.toStruct(Btcnf.struct)[0];
			$('#message').html(objDump(struct)/*JSON.stringify(struct,null,'\t')*/)
	}catch(err){
		alert(err);
	}
	return struct;
}
};
function objDump(obj,_ind){
	var ret="",depth=_ind||0;
	switch(typeof(obj)){
		case 'number':ret+=hex(obj)+" ("+obj+")\n";break;
		case 'string':ret+='"'+obj+'"\n';break;
		case 'object':
			ret+="\n";
			for(attr in obj){
				for(var i=0;i<depth;i++)ret+="\t";//indent
				ret+=attr+'\t: ';
				ret+=objDump(obj[attr],depth+1);
			}
			break;
		default:ret+=obj+" ("+typeof(obj)+")";
	}
//	ret+="\n";
	return ret;
}
function hex(val){
	var fill='0x00000000',val=val.toString(16);
	return fill.substr(0,10-val.length)+val;
}