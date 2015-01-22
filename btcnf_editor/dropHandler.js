function onFileChange(event){
	if (!File || !FileReader || !FileList || !Blob)
		alert('The File APIs are not fully supported in this browser.');
	var reader = new FileReader();
	var $t=$(event.currentTarget);
	reader.onloadend = function(evt){
		if(evt.target.readyState != FileReader.DONE)return;
		localStorage.file=JSON.stringify(evt.target.result);
		TEST=evt.target.result;
//		window[$t.data('name')||'result']=new window[$t.data('handler')](evt.target.result);
	};
	if(event.type=='drop')
		var f=event.originalEvent.dataTransfer.files[0];//called from a drop event
	else
		var f=event.target.files[0];
	
	if(f){
		$t.find(".filename").html(f.name);
		reader.readAsArrayBuffer(f.slice());
//		reader.readAsBinaryString(f.slice());
	}
}

$(function(){
	$('.drop').on('dragenter dragover drop',function(e){
			e.preventDefault();
			e.stopPropagation();
		}
	)
	$('.drop').on('drop',function(e){
		if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length)
			onFileChange(e);
	});
//	$('[data-handler]').on('change',onFileChange).trigger('change');
})