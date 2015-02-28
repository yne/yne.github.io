function MP4AtomReader(){
	this.setBuffer=function(buffer){
		this.buffer=buffer;
		return this;
	}
	//atom handlers
	this.ftyp=function(o){
		return MP4File.tag2str(MP4File.read32be(this.buffer,o.pos+8));
	}
}