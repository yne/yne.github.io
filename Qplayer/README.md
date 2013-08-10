QPlayer
=======

Web Application to remotely play music stored on your QNAP from a web browser

Under the hood
--------------------
JavaScript main script is divided into 2 object :
* system : deal with the QNAP API
* gui : deal with the DOM API

Dependency
--------------------
QPlayer us the filemanager API so it will not work if you deactivated the QNAP's file manager.
QPlayer rely on the "guest" user to retrieve directories and file contents.
It mean that, by default, only public directories can be browsed and played.
You can use your own credentials by removing the commented <form> and the commented lines in the gui.login function.

Features
------------
You can change the default start folder (mine is /Multimedia/MUSIC) to "" if you want to browse from the root of the /shared/ folder
MP3 playing rely on Flash if used from XP (Firefox doesn't provide it under XP)
So XP will not be able to play ogg file (since flash don't support it)
To disable this feature, comment the <script src="flash.js"> from the .html
Responsive browsing :
* italic : loading
* bold : selected

Playback systems
--------------------------
* pure shuffle : shuffle the whole root folder
* available shuffle : shuffle from opened folder
* next : play the next file in the current folder (no subfolder !)
* none : do nothing

Hash Driven Navigation
-------------------------------
files and directories are just <a href="#path">
so you can : 
* send a link to the currently played file by copy/pasting the current URL
* changing the URL lead to a view change (to match the URL's path)
It mean :
* It's possible to bookmark send throught mail/IM the currently played file/folder
* play the previous/next file by using the browser buttons

TODO
-------
* store the mode into localstorage
* if expired token : re-log automatically
* Use the filename extension to switch between flash and html5
* User a JS decoder (MadJS) or a Flash/HTML5 glue lib
* display warnings in a popup (and not in the console)
