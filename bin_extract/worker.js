var magic=[
	[[ 73, 68, 51        ],"mp3"],
	[[ 71, 73, 70, 56, 57],"gif"],
	[[137, 80, 78, 71    ],"png"],
	[[ 79,103,103, 83    ],"ogg"],
	[[255,216,255,224    ],"jpg"],
	[[ 66, 77, 54,120    ],"bmp"],
	[[ 68, 68, 83, 32    ],"dds"],
	[[ 60, 63,120,109    ],"xml"],
	//sony related
	[[126 ,  80,  83,  80],'prx'],
	[[0x00,0x50,0x52,0x46],'rco'],
	[[  83,  67,  69,   0],'self'],
	//Sony game ressources
	[[0x52,0x49,0x46,0x46],"at3"],
	[[0x50,0x54,0x46,0x46],"pt" ],
	[[0x50,0x53,0x4d,0x46],"pmf"],
	[[0x4d,0x49,0x47,0x2e],"gim"],
];

function memcmp(buffer,pos,token){
	for(var i=0;i<token[0].length;i++)
		if(token[0][i]!=buffer[pos+i])return;
	return token[1];
}
onmessage=function(e){
	var type,u8=new Uint8Array(e.data),prev={pos:0,type:'head'};
	for(var i=0;i<u8.length;i++){
		if((i&0xFFFF)==0)postMessage(['progress',i/u8.length])
		
		magic.forEach(function(m){
			if(!(type=memcmp(u8,i,m)))return;
			postMessage(['result',{
				href:URL.createObjectURL(new Blob([u8.subarray(prev.pos,i-1)])),
				name:i.toString(16),
				type:prev.type,
			}]);
			prev.pos=i;
			prev.type=type;
		})
	}
	postMessage(['result',{
		href:URL.createObjectURL(new Blob([u8.subarray(prev.pos,i-1)])),
		name:i.toString(16),
		type:prev.type,
	}]);
	postMessage(['progress',1])
}
