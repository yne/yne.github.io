/* view-accessible function*/

function rebuild_arg($val,$_tr){
	if($val.length){
		var value=$val.val();
		$val.parent().find('a').html(value);
	}
	var $tr=$_tr||$val.closest('tr');
	var args=[];
	$tr.find('.args a').each(function(a,b){
		args.push($(b).html());
	})
	var $op=$tr.find('.op');
	result=disasm.build_arg($op.val()||$op.html(),args);//TODO:find a better access
	//update <a>
	$tr.find('.instr').html(result.toString(16));
}
function generate_select($par){
	if($par.find('select,input').length) return;//already generated
	var value=/*parseInt*/($par.find('a').html());
	var html="";
	if($par.hasClass("type_reg")){
		html+='<select onchange="rebuild_arg($(this))">';
		for(var i=0;i<regName.length;i++)//TODO:print reg names
			html+='<option value="'+i+'" '+(i==value?' selected="selected"':'')+'>'+regName[i]+'</option>';
		html+="</select>";
	}else if($par.hasClass("type_int")){//integer value
		html+='<input type="text" value="'+value+'" onkeyup="rebuild_arg($(this))"/>';
	}else if($par.hasClass("type_off")){//offset absolute
		html+='<input type="text" value="'+value+'" onkeyup="rebuild_arg($(this))"/>';
	}else if($par.hasClass("type_rel")){//offset relativ
		html+='<input type="text" value="'+value+'" onkeyup="rebuild_arg($(this))"/>';
	}
	$par.append(html);
}
/* disassembler interface */
Disassembler.setPrinter('html',function(type){
	var self=this.printer;//TODO: better idea ?
	var arg=arguments;
	switch(type){
		case "disasm_start"://param
			self.html="";
			self.target=document.getElementById(arg[1].id);
		break;
		case "instr_start"://pc,instr
			self.html+='<tr>'+
				'<td class="pc">'+arg[1].toString(16)+'</td>'+
				'<td class="instr"><span><a>'+arg[2].toString(16)+'</a></span></td>';
		break;
		case "instr"://opcode,args[]
			self.html+='<td class="op">'+arg[1]+'</td>'+
				'<td class="args">';
			for(var i=0;i<arg[2].length;i++){
				var val=arg[2][i];
				self.html+='<span class="arg type_'+val[0]+'" onmouseover="generate_select($(this))"><a>';
				switch(val[0]){
					case "reg":self.html+=val[1];break;
					case "int":self.html+=  ''+val[1].toString(10);break;
					case "off":self.html+='0x'+val[1].toString(16);break;
					case "rel":self.html+='0x'+val[1].toString(16);break;
				}
				self.html+='</a></span>';
			}
			self.html+='</td>';
		break;
		case "instr_end":
			self.html+='</tr>'
		break;
		case "disasm_end":
			self.target.innerHTML=
			'<thead><tr><td>PC</td><td>instr</td><td>op</td><td>args</td></tr></thead>'+
			'<tbody>'+self.html+'</tbody>';//+
//			'<tfoot><button onclick="">rebuild</button></tfoot>';
		break;
		default:console.log.apply(this,arg);break;
	}
});