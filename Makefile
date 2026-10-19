ASSETS=$(shell grep -Poh '\./[\w\.]+' *.m4 *.md)

all: ${ASSETS} index.html
projects.md:
	echo "# Projects" > $@
	curl -s https://api.github.com/users/yne/repos?per_page=100 | jq -r 'sort_by(.stargazers_count)|reverse|.[]|select(.fork==false and .archived==false)| "- ["+.name+"]("+.html_url+") ★"+(.stargazers_count|tostring)+" : "+.description+" ("+.language+")"' >> $@
	echo "# Gists" >> $@
	curl -s https://api.github.com/users/yne/gists?per_page=100 | jq -r 'sort_by(.created_at)|reverse|.[]|"- ["+.created_at[:10]+"]("+.html_url+") "+.description' >> $@
%.md.html: %.md
	curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
%.html: %.html.m4
	m4 <$^ >$@

