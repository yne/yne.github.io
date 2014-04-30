#include <stdio.h>
#include <string.h>

char* headers[]={
	"ID3",
	"GIF89",
	"‰PNG",
	"OggS",
	"ÿØÿà",
	"BM6x",
	"DDS ",
	"<?xm",
};
char* ext[]={
	"mp3",
	"gif",
	"png",
	"ogg",
	"jpg",
	"bmp",
	"dds",
	"xml"
};
int dump(char* from,char*to,size_t start,size_t end){
	printf("dump %08x ~ %08x to %s\n",start,end,to);
	FILE*src=fopen(from,"rb");
	FILE*dst=fopen(to,"wb+");
	char buf[4];
	size_t pos;
	fseek(src,start,SEEK_SET);
	for(pos=0;pos<end-start;pos+=4){
		fread (buf,4,1,src);
		fwrite(buf,4,1,dst);
	}
	fclose(src);
	fclose(dst);
}
int main(int argc,char**argv){
	FILE*last=NULL,*f=fopen(argv[1],"rb");
	char data[4],fname[8+4+1]="00000000.bin";
	unsigned j,i,lastpos=0;
	for(j=0;fread(&data,4,1,f)>0;j+=4){
		for(i=0;i<sizeof(headers)/4;i++){
			if(memcmp(headers[i],data,4))continue;
			dump(argv[1],fname,lastpos,j);
			sprintf(fname,"%08X.%s",j,ext[i]);
			lastpos=j;
		}
	}
	fclose(f);
	return 0;
}