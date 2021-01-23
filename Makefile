ASSETS=$(shell grep -Poh '\./[\w\.]+' *.m4 *.md)

all: ${ASSETS} index.html
projects.md:
	echo "# Projects" > $@
	curl -s https://api.github.com/users/yne/repos | jq -r 'sort_by(.stargazers_count)|reverse|.[]|select(.fork==false)| "- ["+.name+"]("+.html_url+") ★"+(.stargazers_count|tostring)+" : "+.description+" ("+.language+")"' >> $@
photos.zip:
	curl -s ${PHOTOS_URL} | grep -Po 'https://video-downloads[^"]+' | xargs wget -q -O $@
photos.jpg:
	curl -s ${PHOTOS_URL} | grep -Po 'https://[a-z0-9]+\.googleusercontent\.com/[a-zA-Z0-9-_]{139}+' | sort -u | xargs wget -q -P $<.d
	montage $<.d/* -gravity center -geometry 384x216^ -crop 384x216+0+0 -geometry +0+0 -background none -quality 50 -tile 5 $@
tracks.html:
	curl -s ${TRACKS_URL} | jq .data[].tracklist | xargs -I {} -n 1 curl -H 'accept-language: en-US,en;q=0.9' -s {}?limit=2000 | jq -r '.data[] | "<li>"+.artist.name+" - "+.title+"<audio controls preload=none src="+.preview+" /></li>"' | shuf >$@
%.md.html: %.md
	curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
%.html: %.html.m4
	m4 <$^ >$@

