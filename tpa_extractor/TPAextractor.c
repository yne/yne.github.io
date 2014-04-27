#include <fcntl.h>
#include <malloc.h>

typedef struct{
	unsigned id;
	short padding;
	unsigned short len;
	unsigned unk;
}TPAheader;
typedef struct{
	unsigned id;
	unsigned size;
	unsigned offset;
	unsigned dummy;
}FileEntry;
typedef struct{
	unsigned id;//0xdec00400
	char sig;//0x0000
	char zip;//0x0000
	short len;//0xf900
	unsigned unk2;//0x60c4 3800
}PKHeader;
typedef struct{
	unsigned id;//0xa24ac3d6
	unsigned short size;//0x0001
	unsigned short size2;//0x0000
	unsigned unk;//0x00000000
	unsigned unk2;//0x00000000
}PKEntry;
char*argv_[]={"","DATA.TPA"};
int main(int argc,char** argv){
	if(argc==0)argv=argv_;
	if(argc==1)return printf("How to use : TPAextractor input.tpa [convert]");
	//if(argc==3)convert=1;
	printf("opening %s...\n",argv[1]);
	FILE*fd=fopen(argv[1],"rb");
	if(fd<=0)return printf("file %s not found",argv[1]);
	mkdir("out");
	chdir("out");
	TPAheader head;
	fread(&head,sizeof(head),1,fd);
	printf("%i files found\n",head.len);
	FileEntry ent;
	int i;
	for(i=0;i<head.len;i++){
		fread(&ent,sizeof(ent),1,fd);
		int pos=ftell(fd);
		char*p=malloc(ent.size);
		fseek(fd,ent.offset,SEEK_SET);
		fread(p,ent.size,1,fd);
		fseek(fd,pos,SEEK_SET);
		printf("%08X @%08X (%i)\n",ent.id,ent.offset,ent.size);
		char fname[256],*ext=NULL;
		switch(*((int*)p)){
			case 0x46464952:ext=".at3";break;//RIFF
			case 0x46465450:ext=".pt";break;//PTFF
			case 0x464d5350:ext=".pmf";break;//PSMF
			case 0x2e47494d:ext=".gim";break;//MIG
			case 0xe0ffd8ff:ext=".jpg";break;//JFIF
			case 0x0004c0de:{//no extention it will be a folder
				PKHeader*pk=(PKHeader*)p;
				if(pk->zip|pk->sig){
					ext=".mp";
					break;
				}
				sprintf(fname,"%08X",ent.id);
				mkdir(fname);
				chdir(fname);
				printf("  PKG <%08X> %i\n",pk->id,pk->len);
				unsigned off=0,i,prevSize=0;
				for(i=0;off+sizeof(PKHeader)<ent.size;i++){
					PKEntry*pke=(PKEntry*)(p+sizeof(PKHeader)+off);
					int size=pke->size|pke->size2<<16;
					off+=size+sizeof(PKEntry);
					printf("    <%08X> (%i)\n",pke->id,size);
					{//output the file
						if(*(pke+1)!=0x70474156)
							sprintf(fname,"%08X",pke->id);
						else
							sprintf(fname,"%.16s.%08X.vag",((char*)pke)+48,pke->id);
//						sprintf(fname,"%08X%s",pke->id,*(pke+1)==0x70474156?".vag":"");
						FILE*out=fopen(fname,"w+b");
						fwrite(pke+1,size,1,out);
						fclose(out);
						if((argc==3)&&*(pke+1)==0x70474156){//convert vag to wav 
							char cmd[256];
							sprintf(cmd,"MFAudio \"%.16s.%08X.vag\" \"%.16s%s.%08X.wav\" /OTWAVU /OC2",((char*)pke)+48,pke->id,((char*)pke)+48,prevSize==size?"[r]":"",pke->id);
							system(cmd);
							remove(fname);
						}
					}
					prevSize=size;
				}
				chdir("..");
			}break;
			default:ext="";
		}
		if(ext){
			sprintf(fname,"%08X%s",ent.id,ext);
			FILE*out=fopen(fname,"w+b");
			fwrite(p,ent.size,1,out);
			fclose(out);
			//post processing
			if((argc==3)&&*((int*)p)==0x2e47494d){//convert gim to png 
				char cmd[256];
				sprintf(cmd,"GimConv %s -o %08X.png",fname,ent.id);
				system(cmd);
				remove(fname);
			}
		}	
		free(p);
	}
	printf("%i files extracted!",i);
	fclose(fd);
}
