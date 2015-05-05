


page={
	menu:{
		input  :function(v,n,e){this.value=v;},
		value:"",
		_value :function(v,n,e){n.innerHTML=v;},//called when .value change
	},

	article:{
		text   :'',
		txtarea:function(v,n,e){this.text=v;},
		submit :function(v,n,e){document.querySelector('p').innerHTML=this.text;},
		isub   :function(v,n,e){page.menu.value=v;},
		ibtn   :function(v,n,e){alert(this.text)},
	}
};
