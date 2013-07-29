var Elf_header=new Struct({
	magic     :4,
	class     :1,
	data      :1,
	ver       :1,
	pad       :1,
	unk1      :4,
	unk2      :4,
	type      :2,
	machine   :2,
	version   :4,
	entry     :4,
	phoff     :4,
	shoff     :4,
	flags     :4,
	ehsize    :2,
	phentsize :2,
	phnum     :2,
	shentsize :2,
	shnum     :2,
	shstrndx  :2,
});
var Elf_section=new Struct({
	name      :4,//offset in the string table
	type      :4,
	flags     :4,
	addr      :4,
	offset    :4,
	size      :4,
	link      :4,
	info      :4,
	align     :4,
	entsize   :4,
});
var Elf_program=new Struct({
	type      :4,
	offset    :4,
	vaddr     :4,
	paddr     :4,
	filesz    :4,
	memsz     :4,
	flags     :4,
	align     :4,
});
function extract(array){
	//extract elf header
	var sh=[],ph=[],eh=Elf_header.toObject(array);
	//extract each sections headers (content loaded on demand only)
	for(var i=0;i<eh.shnum[0];i++){
		var start=eh.shoff[0]+i*eh.shentsize[0];
		var end=start+eh.shentsize[0];
		var obj=Elf_section.toObject(array.slice(start,end));
		if(obj.type[0]==8/*NOBITS*/){
			obj._content=array.slice(0,0);//overide section's specs
		}else{
			obj._content=array.slice(obj.offset[0],obj.offset[0]+obj.size[0]);
		}
		sh.push(obj);
	}
	//extract each programs headers (content loaded on demand only)
	for(var i=0;i<eh.phnum[0];i++){
		var start=eh.phoff[0]+i*eh.phentsize[0];
		var end=start+eh.phentsize[0];
		var obj=Elf_program.toObject(array.slice(start,end));
		obj._content=array.slice(obj.offset[0],obj.offset[0]+obj.filesz[0]);
		ph.push(obj);
	}
	return {header:eh,sections:sh,programs:ph,_array:array};
}
function build(elf){
	var blob=new Blob(),head=[],sections=[],programs=[];
	blob=Struct.insert(elf.header,0,blob);
	elf.programs.forEach(function(prog){
		programs.push(Struct.toBlob(prog));//add each program header
		blob=Struct.insert(prog._content,prog.offset[0],blob);//add each program content
	});
	blob=Struct.insert(programs,elf.header.phoff[0],blob);
	elf.sections.forEach(function(sect){
		sections.push(Struct.toBlob(sect));//add each section header
		blob=Struct.insert(sect._content,sect.offset[0],blob);//add each section content
	});
	blob=Struct.insert(sections,elf.header.shoff[0],blob);
	return blob;
}