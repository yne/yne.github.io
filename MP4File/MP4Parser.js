function MP4Parser(){
	this.setBuilder=function(builder){
		this.builder=builder;
		return this;
	}
	this.setBuffer=function(buffer){
		this.buffer=buffer;
		return this;
	}
	var parent_tags=['moov','trak','mdia','minf','stbl','edts','dinf'/*,'stsd'*/,'mp4a','mp4v','esds'];
	this.parse=function(pos,end){
		if(!arguments.length){pos=0;end=this.buffer.length};
		while(pos<end){
			var size=MP4File.read32be(this.buffer,pos);
			var type=MP4File.tag2str(MP4File.read32be(this.buffer,pos+4));
			if(parent_tags.indexOf(type)<0){
				this.builder.log(type,{pos:pos,size:size});
			}else{
				this.builder.group(type);
				this.parse(pos+8,pos+size);
				this.builder.groupEnd();
			}
			pos+=size;
		}
	}
}
