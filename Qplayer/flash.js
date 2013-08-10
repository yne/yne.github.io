//flash fallback for win XP
if(navigator.oscpu=="Windows NT 5.1"){
	Player=function(){//override the nativ HTML5 handler with the flash one
		var embed=$('<embed src="player.swf" type="application/x-shockwave-flash" hidden></embed>');
		$('body').append(embed);
		this.obj=embed[0];
		this.paused=true;
		this.play = function (){
			this.obj.TCallLabel('/','play');
			this.paused=false;
		};
		this.pause = function () {
			this.obj.TCallLabel('/','pause');
			this.paused=true;
		};
		this.setAttribute = function (key,val) {
			if(key=='src'){
				this.obj.SetVariable('currentSong', val);
				this.obj.TCallLabel('/','load');
			}else if(key=='onPlaying'){
				this.obj.SetVariable('onPlay', val);
			}else if(key=='onEnded'){
				this.obj.SetVariable('onSongOver', val);
			}else{
				this.obj.SetVariable(key, val);
			}
		};
	}
}