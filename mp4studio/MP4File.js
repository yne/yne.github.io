function MP4File(buf){
	this.result=[];
	(new MP4Parser())
		.setBuffer(buf)
		.setBuilder(
		(new MP4Builder(this.result))
			.setAtomReader(
			(new MP4AtomReader())
				.setBuffer(buf)
		)
	).parse();
}
MP4File.read32be=function(b,o){
	return (b[o]<<24)|(b[o+1]<<16)|(b[o+2]<<8)|(b[o+3]);
},
MP4File.tag2str=function(n){
	var s=String.fromCharCode;
	return [s((n>>24)&0xff),s((n>>16)&0xff),s((n>>8)&0xff),s(n&0xff)].join('');
}
