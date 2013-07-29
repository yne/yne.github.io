#!/usr/bin/env python

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
import re, os

class index(webapp.RequestHandler):
  def get(self):
    self.response.out.write('''
		<html>
		<style>
		body{background:#888;}
		a:link,a:visited,a:hover,a:active{color:#FFF;text-decoration:none;}
		a:hover{text-decoration:underline;}
		</style>
		<img src="http://code.google.com/p/gotube/logo?logo_id=1263156890" style="position:absolute;right:0;bottom:0;opacity:0.1;" width="612" height="220"/>
		<b><a href="http://code.google.com/p/gotube/downloads/list">Download here</a></b>
		</html>
		''')
#biscottealacrevette@gmail.com
class update(webapp.RequestHandler):
	def get(self):
		if os.getenv("HTTP_X_PSP_APPLICATION")=="psp-radio" :
			self.response.out.write('''<head>
<object type="application/x-psp-extplugin"></object>
<style>
*{margin:0px;padding:0px;border-collapse:collapse;font-size:40px;}
th{border-top:1px solid #888;border-bottom:1px dotted #AAA;}
td{text-align:center;}
table{background:#FFF;}
iframe{display:none;}
</style>
<title>Go!Tube</title>
<script>/* why not ? */
google_ad_client = "pub-1581526491464753";
google_ad_slot = "2846514540";
google_ad_width = 200;
google_ad_height = 90;
displayMode=1;//0=system;1=sites;
/*--__--*/
var repo="http://gotube.googlecode.com/svn/trunk/GoTube/"
function xpd(i){
	switch(i){
		case 0 :
			if(HighMemory){
				document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=GoTube%20[1/2]%20High%20Memory%20Mod&FName=EBOOT.PBP&C="+escape(repo+"HMM.PBP")+"&A="+escape(repo+"GT")+"&NPage=javascript:xpd(5);";
			}else{
				document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=GoTube&C="+escape(repo+"EBOOT.PBP");
			}break;
		case 2 : document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=cfg.js&C="+escape("http://go-tube.appspot.com/cfg.js?favorites="+escape(favorites)+"&VideoOutMode="+VideoOutMode+"&ScreenZoom="+ScreenZoom+"&MultiView="+MultiView+"&rev="+rev);break;
  	case 4 : document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=Updateur&C="+escape(repo+"update.js")+"&NPage="+escape(repo+"GoTube.prs");break;
		case 5 : document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=GoTube%20[2/2]%20High%20Memory%20Mod&C="+escape(repo+"rdriver.prx");break;
	}
}
var favorites="/VIDEO/",VideoOutMode=1,ScreenZoom=1,MultiView=1,HighMemory=0;rev=1.2;
/*--__--*/
var mycookie=Math.floor(Math.random()*1000000+1000000);
var myrandom=Math.floor(Math.random()*1147483647+1000000000);
var mytoday=new Date().getTime();
document.write('<img style="position:absolute;top:32px;" src="http://www.google-analytics.com/__utm.gif?utmwv=4.6.5&utmn='+Math.floor(Math.random()*1000000000+1000000000)+'&utmsr=480x272&utmsc=32-bit&utmul=en-us&utmje=1&utmfl=6.0%20r72&utmdt=GoTube%20Updater&utmhn=code.google.com&utmcs=UTF-8&utmr=-&utmac=UA-1786689-9&utmp=%2Fp%2Fgotube%2F&utmcc=__utma%3D'+mycookie+'.'+myrandom+'.'+mytoday+'.'+mytoday+'.'+mytoday+'.19%3B%2B__utmz%3D'+mycookie+'.'+mytoday+'.5.9.utmccn%3D(direct)%7Cutmcsr%3D(direct)%7Cutmcmd%3D(none)%3B&gaq=1"></img>');
</script>
<script src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
<b style="position:absolute"><iframe id="Cframe" name="maFrame" src="" style="display:block;border:0;width:0px;height:0px;"></iframe></b>
<script src="http://gotube.googlecode.com/svn/trunk/GoTube/update.js"></script>
<script>function getAd(){if(Math.random()*100<15)AJAX(maFrame.document.getElementById('aw'+Math.floor(Math.random()*9)),'','');myAlert();}</script>
<script src="file:/PSP/GAME/GoTube/cfg.js"></script>
</head>
<body onload="init()">
<table id="sites" style="width:480px;height:250px;position:absolute;left:-0px;">
<tr>
<td width="50%"><iframe id="online" style="position:absolute;left:0px;top:0px;display:block;width:240;height:272;border:0;"></iframe></td>
<td><iframe id="local" style="position:absolute;left:240px;top:0px;display:block;width:240;height:272;border:0;"></iframe></td>
</tr>
</table>
<table id="system" style="width:480px;height:250px;position:absolute;left:-480px;">
<tr height="27"><td colspan="2"></td></tr>
<tr height="1%"><th colspan="2"><b>cfg.js</b></td></tr>
<tr height="1%"><td style="text-align:right;">favorites : </td><td style="text-align:left;"><input type="text" onchange="favorites=this.value" value="/VIDEO/" style="width:194px;"/></td></tr>
<tr height="1%"><td style="text-align:right;">VideoOutMode : </td><td style="text-align:left;"><input type="checkbox" onclick="if(this.checked){VideoOutMode=0;document.getElementById('VideoOutMode').innerHTML='i';}else{VideoOutMode=1;document.getElementById('VideoOutMode').innerHTML='p';};" checked>480<b id="VideoOutMode">i</b></td></tr>
<tr height="1%"><td style="text-align:right;">ScreenZoom : </td><td style="text-align:left;"><select onchange="ScreenZoom=this.selectedIndex"><option>0<option selected>1<option>2<option>3<option>4<option>5<option>6<option>7<option>8<option>9<option>10<option>11<option>12<option>13<option>14</select></td></tr>
<tr height="1%"><td style="text-align:right;">MultiView : </td><td style="text-align:left;"><input type="checkbox" onclick="if(this.checked){MultiView=1;document.getElementById('MultiView').innerHTML='on';}else{MultiView=0;document.getElementById('MultiView').innerHTML='off';};" checked><b id="MultiView">on</b></td></tr>
<tr height="1%"><td colspan="2"><input type="button" value="Save" onclick="xpd(2)"/></td></tr>
<tr height="1%"><th colspan="2"><b>Go!Tube EBOOT</b></td></tr>
<tr height="1%">
	<td width="50%"><input type="button" onclick="HighMemory=0;xpd(0)" value="GoTube"/></td>
	<td width="50%"><input type="button" onclick="HighMemory=1;xpd(0)" value="GoTube HMM"/></td></tr>
</table>
<input type="button" style="position:absolute;left:220px;font-size:50px;" value="[+]" onclick="if(displayMode){displayMode=0;document.getElementById('sites').style.left='-480px';document.getElementById('system').style.left='0px';}else{displayMode=1;document.getElementById('sites').style.left='0px';document.getElementById('system').style.left='-480px';}"/>
</body>''')
			return
		if os.getenv("HTTP_X_PSP_PRODUCTCODE") :
			self.response.out.write('''<script>
var repo="http://gotube.googlecode.com/svn/trunk/GoTube/"
function xpd(i){
	switch(i){
		case 0 :document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=Modules&C="+escape(repo+"dvemgr.prx")+"&A="+escape(repo+"mediaengine.prx")+"&NPage=javascript:xpd(1);";break;
		case 1 :
			if(HighMemory){
				document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=GoTube%20[1/2]%20High%20Memory%20Mod&FName=EBOOT.PBP&C="+escape(repo+"HMM.PBP")+"&A="+escape(repo+"GT")+"&NPage=javascript:xpd(4);";
			}else{
				document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=GoTube&C="+escape(repo+"EBOOT.PBP");break;
			}break;
		case 2 : document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=cfg.js&C="+escape("http://go-tube.appspot.com/cfg.js?favorites="+escape(favorites)+"&VideoOutMode="+VideoOutMode+"&ScreenZoom="+ScreenZoom+"&MultiView="+MultiView+"&rev="+rev)+"&A="+escape("http://gotube.googlecode.com/svn/trunk/GoTube/site.js");break;
		case 3 : document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=Updateur&C="+escape(repo+"update.js")+"&NPage="+escape(repo+"GoTube.prs");break;
		case 4 : document.location.href="http://go-tube.appspot.com/dl.xpd?Code=GoTube&Desc=GoTube%20[2/2]%20High%20Memory%20Mode&C="+escape(repo+"rdriver.prx");
	}
}
var favorites="/VIDEO/",VideoOutMode=1,ScreenZoom=1,MultiView=1,HighMemory=0;rev=1.2;
</script>
<style>
*{font-size:50px;color:#FFF;}
body{margin:0;background:#000;}
td{vertical-align:top;border-top:solid 1px #4F666A;border-bottom:solid 1px #4F666A;padding:0;padding-left:3px;}
table{border-collapse:collapse;}
.tra{background:#8F0604;text-align:right;}
.trb{background:#CD1009;}
</style>
<br/>
<table style="width:480px;">
<tr style="background:#B06666"><td colspan="2" align="center"><b>GoTube Instaler</b></td></tr>
<tr>
	<td class="tra"><input type="button" onclick="xpd(0)" value="GoTube"/></td>
	<td class="trb"><input type="checkbox" onclick="if(this.checked){HighMemory=1;}else{HighMemory=0;}"/>HighMemory</td>
</tr>
<tr>
	<td class="tra"><input type="button" value="Preference" onclick="xpd(2)"/></td>
	<td class="trb">
		<table width="100%">
		<tr><td>favorites</td><td><input type="text" onchange="favorites=this.value" value="/VIDEO/" style="width:194px;"/></td></tr>
		<tr><td>VideoOutMode</td><td><input type="checkbox" onclick="if(this.checked){VideoOutMode=0;document.getElementById('VideoOutMode').innerHTML='i';}else{VideoOutMode=1;document.getElementById('VideoOutMode').innerHTML='p';};" checked>480<b id="VideoOutMode">i</b></td></tr>
		<tr><td>ScreenZoom</td><td><select onchange="ScreenZoom=this.selectedIndex"><option>0<option selected>1<option>2<option>3<option>4<option>5<option>6<option>7<option>8<option>9<option>10<option>11<option>12<option>13<option>14</select><br/></td></tr>
		<tr><td>MultiView</td><td><input type="checkbox" onclick="if(this.checked){MultiView=1;document.getElementById('MultiView').innerHTML='on';}else{MultiView=0;document.getElementById('MultiView').innerHTML='off';};" checked><b id="MultiView">on</b></td></tr>
		</table>
	</td>
</tr>
<tr>
	<td class="tra"><input type="button" value="Updater" onclick="xpd(3)"/></td>
	<td class="trb"><i>no option</i></td>
</tr>
<tr style="background:#B06666">
	<td colspan="2"><i id="final" style="font-size:5px">Now, go to the "Internet Radio" menu , start "GoTube Update" and download at least 1 site</i></td>
</tr>
</table>
<script>if(navigator.language=="fr")document.getElementById('final').innerHTML='Allez dans "radio par internet" , lancez "GoTube Update" et telechargez au moins 1 site';</script>''')
		else :	self.response.out.write('''<script>google_ad_client = "pub-1581526491464753";google_ad_slot = "2846514540";google_ad_width = 200;google_ad_height = 90;</script>Use the actual URL to instal GoTube <u>from</u> your PSP<script src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>''')

class env(webapp.RequestHandler):
  def get(self):
    self.response.out.write('''update''')
    self.response.out.write(os.getenv("SERVER_PORT"))
    self.response.out.write(os.getenv("HTTP_ACCEPT_LANGUAGE"))
    self.response.out.write(os.getenv("HTTP_X_PSP_BROWSER"))
    self.response.out.write(os.getenv("HTTP_X_PSP_PRODUCTCODE"))

class dummy(webapp.RequestHandler):
  def get(self):
    self.response.out.write('''//this script was deleted''')

class cfg(webapp.RequestHandler):
  def get(self):
	self.response.out.write('PSPTube.favorites = "'+self.request.get('favorites')+'";\n');
	self.response.out.write('PSPTube.VideoOutMode = '+self.request.get('VideoOutMode')+';\n');
	self.response.out.write('PSPTube.ScreenZoom = '+self.request.get('ScreenZoom')+';\n');
	self.response.out.write('PSPTube.MultiView = '+self.request.get('MultiView')+';\n');
	self.response.out.write('PSPTube.rev = '+self.request.get('rev')+';\n');
	self.response.out.write('SiteList = new Array();\nModList = new Array();');

class xpd(webapp.RequestHandler):
  def get(self):
    EID = self.request.get('EID')
    Desc = self.request.get('Desc')
    Code = self.request.get('Code')
    Size = self.request.get('Size')
    NPage = self.request.get('NPage')
    RPage = self.request.get('RPage')
    DName = self.request.get('DName')
    AName = self.request.get('AName')
    FName = self.request.get('FName')
    Duration = self.request.get('Duration')
    DrmMGN = self.request.get('DrmMGN')
    ddpc = self.request.get('ddpc')
    ddpg = self.request.get('ddpg')
    C = self.request.get('C')
    A = self.request.get('A')
    
    self.response.headers['Content-Type'] = "application/x-psp-dstartup"
    self.response.out.write('[Info]\n')
    if EID : self.response.out.write('EID='+EID+'\n')
    else : self.response.out.write('EID=gdp#\n')
    if Desc : self.response.out.write('Desc='+Desc+'\n')
    else  : self.response.out.write('Desc= \n')
    if Code : self.response.out.write('Code='+Code+'\n')
    else : self.response.out.write('Code=XPD-instal\n')
    if Size : self.response.out.write('Size='+Size+'\n')
    if NPage : self.response.out.write('NPage='+NPage+'\n')
    if RPage : self.response.out.write('RPage='+RPage+'\n')
    if DName : self.response.out.write('DName='+DName+'\n')
    if AName : self.response.out.write('AName='+AName+'\n')
    if FName : self.response.out.write('FName='+FName+'\n')
    if Duration : self.response.out.write('Duration='+Duration+'\n')

    if DrmMGN : self.response.out.write('[DrmMGN]\n')
    if ddpc : self.response.out.write('ddpc='+ddpc+'\n')
    if ddpg : self.response.out.write('ddpg='+ddpg+'\n')

    self.response.out.write('[File]\n')
    if C : self.response.out.write('C='+C+'\n')
    if A : self.response.out.write('A='+A+'\n')

def main():
  run_wsgi_app(webapp.WSGIApplication([('/', index),('/dl.xpd', xpd),('/cfg.js', cfg),('/config.js', cfg),('/dummy.js', dummy),('/update', update),('/env', env)],debug=True))

if __name__ == "__main__":main()