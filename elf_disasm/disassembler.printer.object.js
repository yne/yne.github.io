/* disassembler interface */
Disassembler.setPrinter('object',function(type){
	var self = this.printer.target;
	var arg=arguments;
	switch(type){
		case "disasm_start"://param
			this.printer.target=arg[1];//object to output to
			this.printer.target.instr=[];
			console.log('start');
		break;
		case "instr_start"://pc,instr
			self.instr.push([arg[1],arg[2]]);
		break;
		case "instr"://opcode,args[]
			self.instr[self.instr.length-1].push(arg[1],arg[2]);
		break;
		case "instr_end":break;
		case "disasm_end":console.log('done');break;
		default:break;
	}
});