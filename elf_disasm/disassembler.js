//constructor
function Disassembler(){
	this.printer=console.log;//function(type,str){};
	this.printer.param={};
	this.program=new Uint32Array(0);
	this.instructions=[];
}

//static methodes
Disassembler.macro={};
Disassembler.instructions={};//registred instruction list
Disassembler.printer={};//registred printer
Disassembler.setInstructions=function(name,instructions){
	Disassembler.instructions[name]=instructions;
};
Disassembler.setPrinter=function(name,printer){
	Disassembler.printer[name]=printer;
};

//instances methodes
Disassembler.prototype.setProgram=function(array){
	if(array.constructor!=Uint32Array)return this;//TODO:convert from other type (String,Array)
	this.program=array;
	return this;
};
Disassembler.prototype.setInstructions=function(instr_type){
	this.instructions=Disassembler.instructions[instr_type];
	return this;
};
Disassembler.prototype.setPrinter=function(printer,param){
	if(printer.constructor==Function)//use an anonymous printer
		this.printer=printer;
	if(printer.constructor==String){//select from registered printers
		if(Disassembler.printer[printer]!==undefined)
			this.printer=Disassembler.printer[printer];
		else
			console.warn("undefined printer '"+printer+"'");
	}
	this.printer.param=param;
	return this;
};
Disassembler.prototype.build_arg=function(op,args){
	var code=this.instructions[op];
	if(code===undefined)return;
	function build(val,fmt){return val<<fmt;}
	var instr=code[0];
	for(var i=0,_args=code[2].split(/,/);i<_args.length;i++){
		instr+=build(args[i],arg_list[_args[i]][1]);//|=may prpduce negativ instruction
	}
	return instr;
};
Disassembler.prototype.parse_arg=function(op,instr,pc){
	function parse(op,pos,len){return (op>>pos)&((1<<len)-1);}
	var results=[];
	for(var i=0,args=instr[2].split(/,/);i<args.length;i++){
		var arg = arg_list[args[i]]||[];
		results.push([arg[0],parse(op,arg[1],arg[2])]);
	}
	return results;
};
Disassembler.prototype.disassemble=function(){
	this.printer("disasm_start",this.printer.param);
	for(var p in this.program){
		var pc=p<<2;
		var op=this.program[p];
		this.printer("instr_start",pc,op);
		for(var i in this.instructions){
			var instr=this.instructions[i];
			var m=(op&instr[1]);// boolean operator 'and' can produce negativ number
			if(m<0)m=(-(-m-0x100000000));//re-positiv them
			if(m!=instr[0])continue;
			this.printer("instr",i,this.parse_arg(op,instr,pc));
			break;
		}
		this.printer("instr_end");
	}
	this.printer("disasm_end");
	return this;
};
