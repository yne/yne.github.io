#!/usr/bin/env python

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
import re
import os

class Index(webapp.RequestHandler):
  def get(self):
    self.response.out.write('''<a href="http://appengine.google.com/dashboard?&app_id=ultimate-portal"><img src="http://www.google.com/images/logos/app_engine_logo_sm.gif"/></a><br>
<form action="http://localhost:8080/echo" method="POST">
Location:<input type="text" name="Location" value=""/><br/>
Cache-Control:<input type="text" name="Cache-Control" value="no-cache"/><br/>
Content-Type:<input type="text" name="Content-Type" value="application/x-psp-dstartup"/><br/>
Content-Disposition:<input type="text" name="Content-Disposition" value="attachment; filename=fname.ext"/><br/>
<TEXTAREA name="Content" style="width:400px;height:120px;">contenu de votre fichier</TEXTAREA><br/>
<br/>
<input type="submit" value="go!">
</form>
<hr/>XPD
<form action="/dl.xpd" method="GET">
<input type="text" value="Desc" name="Desc"/>:
<input type="text" value="Code" name="Code"/>
<input type="text" value="C" name="C"/>
<input type="submit" value="&gt"/></form>
<hr/>Chat
<form action="/chat/post" method="GET">
<input type="text" value="pseudo" name="usr"/>:
<input type="text" value="message" name="msg"/>
<input type="hidden" value="mon portail" name="por"/>
<input type="submit" value="&gt"/></form>
<iframe src="/chat/messages"></iframe>
''')
    self.response.out.write(os.getenv("REMOTE_ADDR"))
    self.request.get('remote_addr')
    
class Echo(webapp.RequestHandler):
  def post(self):
    self.response.headers['Cache-Control'] = self.request.get('Cache-Control')
    self.response.headers['Location'] = self.request.get('Location')
    self.response.headers['Content-Disposition'] = self.request.get('Content-Disposition')
    self.response.headers['Content-Type'] = self.request.get('Content-Type')
    self.response.out.write(self.request.get('Content'))
  def get(self):
    self.response.headers['Cache-Control'] = self.request.get('Cache-Control')
    self.response.headers['Location'] = self.request.get('Location')
    self.response.headers['Content-Disposition'] = self.request.get('Content-Disposition')
    self.response.headers['Content-Type'] = self.request.get('Content-Type')
    self.response.out.write(self.request.get('Content'))

class Xpd(webapp.RequestHandler):
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

class Greeting(db.Model):
  date = db.DateTimeProperty(auto_now_add=True)
  usr = db.StringProperty(multiline=False)
  msg = db.StringProperty(multiline=False)
  por = db.StringProperty(multiline=False)
  ip = db.StringProperty(multiline=False)

class ChatMessages(webapp.RequestHandler):
  def get(self):
    self.response.out.write("<script>parent.updateIP('%s');var msgs = new Array(" %os.getenv("REMOTE_ADDR"))
#    limite = 128
#    if self.request.get('l') : limite = self.request.get('l')
    for greeting in db.GqlQuery("SELECT * FROM Greeting ORDER BY date DESC LIMIT 20"):
      self.response.out.write('\n"%s","%s","%s","%s","%s",' % (greeting.date.strftime('%H:%M:%S'),greeting.usr,greeting.msg,greeting.por,greeting.ip))
    self.response.out.write("'');msgs.pop();parent.loadMsgs(msgs);</script>")
class ChatPost(webapp.RequestHandler):
  def get(self):
    greeting = Greeting()
    greeting.ip = os.getenv("REMOTE_ADDR")
    if self.request.get('por'):
      string = self.request.get('por')
      string = re.sub("'", r"&#39;", string)
      string = re.sub('"', r"&#34;", string)
      string = re.sub('<', r"&#60;", string)
      string = re.sub('>', r"&#62;", string)
      string = re.sub('\\\\', r"&#92;", string)
      greeting.por = string
    else:greeting.por = ""
    if self.request.get('usr'):
      string = self.request.get('usr')
      string = re.sub("'", r"&#39;", string)
      string = re.sub('"', r"&#34;", string)
      string = re.sub('<', r"&#60;", string)
      string = re.sub('>', r"&#62;", string)
      string = re.sub('\\\\', r"&#92;", string)
      greeting.usr = string
    else:greeting.usr = "toto"
    string = self.request.get('msg')
    string = re.sub('"', r"&#34;", string)
    string = re.sub('<', r"&#60;", string)
    string = re.sub('\\\\', r"&#92;", string)
    greeting.msg = string
    
    if greeting.msg:greeting.put()

def main():
  run_wsgi_app(webapp.WSGIApplication([('/', Index),('/echo', Echo),('/dl.xpd', Xpd),('/chat/messages', ChatMessages),('/chat/post', ChatPost)],debug=True))

if __name__ == "__main__":main()