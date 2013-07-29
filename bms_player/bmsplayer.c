#include <malloc.h>
#include <string.h>
#include <fcntl.h>

char*chan2names[]={
		"??","BGS","?!","BPM","BGA","??","POR","LAY","!?","STP",
		"10?","S","D","F","-","J","SCR","08","K","L",
		"20?","s","d","f","_","j","scr","??","k","l"
};
char col2lane[]={ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 1, 2, 3, 4, 5, 8, 0, 6, 7,
                  0, 9,10,11,12,13,16, 0,14,15};

typedef struct{
	int player;
	int level;
	int rank;
	int bpm;
	char genre[64];
	char title[64];
	char artist[64];
	char splash[64];
	char*keys[1300];
	float*lanes[17];	//TODO get the file.bms size/2
	int lanesLen[17];
//postprocess
	int fd;
	char tmp[512];
	float barlen;
}BMS;

int die(char*err){
	puts(err);
	exit(1);
}
int getkey(char*in){
	int out=0;
	if(in[0]>='0'&&in[0]<='9')out =(in[0]-'0')*36;
	if(in[0]>='A'&&in[0]<='Z')out =(in[0]-'A'+10)*36;
	if(in[1]>='0'&&in[1]<='9')out+=(in[1]-'0');
	if(in[1]>='A'&&in[1]<='Z')out+=(in[1]-'A'+10);
	return out;
}
int getLine(BMS*bms){
	int i;
	char*line=bms->tmp;
	for(i=0;i<sizeof(bms->tmp);i++){
		if(read(bms->fd,bms->tmp+i,1)<1){return -1;}
		if(bms->tmp[i]=='\n'||bms->tmp[i]=='\r'){
			bms->tmp[i]=0;
			return i;
		}
	}
}
void parseLine(BMS*bms){
	char*line=bms->tmp;
	char*id=line+1;
	switch(line[0]){
		case 0:return 0;
		case '*':return 0;
		case ';':return 0;
		case '#':
			if(!strncmp("WAV"      ,id,3))return bms->keys[getkey(id+3)]=(char*)strcpy(malloc(strlen(id+6)+1),id+6);
			if(!strncmp("PLAYER"   ,id,6))return bms->player=atoi(line+ 8);
			if(!strncmp("PLAYLEVEL",id,9))return bms->level =atoi(line+11);
			if(!strncmp("RANK"     ,id,4))return bms->level =atoi(line+ 6);
			if(!strncmp("BPM"      ,id,3))return bms->barlen=240/(float)(bms->bpm=atoi(line+ 5));
			if(!strncmp("TITLE"    ,id,5))return strncpy(bms->title ,line+ 7,sizeof(bms->title ));
			if(!strncmp("GENRE"    ,id,5))return strncpy(bms->genre ,line+ 7,sizeof(bms->genre ));
			if(!strncmp("ARTIST"   ,id,6))return strncpy(bms->artist,line+ 8,sizeof(bms->artist));
			if(!strncmp("STAGEFILE",id,9))return strncpy(bms->splash,line+11,sizeof(bms->splash));
			if(!strncmp("TOTAL"    ,id,4))return 0;//TODO:implement
			if(!strncmp("STOP"     ,id,4))return 0;//TODO:implement
			if(!strncmp("BMP"      ,id,3))return 0;//TODO:implement
			if(!strncmp("VOLWAV"   ,id,6))return 0;//TODO:implement
			if(line[1]>='0'&&line[1]<='9'){
				int i,len=strlen(id+6);
				char tmp[4]={0,0,0,0};
				int bar=atoi(strncpy(tmp,id,3));
				memset(tmp,0,4);
				int col=atoi(strncpy(tmp,id+3,2))%30;
				//printf("\ntab:%i key:%i (%s)",bar,col,chan2names[col<30?col:0]);
				int lane=col2lane[col];
				for(i=0;i<len;i+=2){
					int ok=getkey(id+6+i);
					if(!ok||!lane)continue;
					int llen=++bms->lanesLen[lane];
					bms->lanes[lane]=realloc(bms->lanes[lane],llen*sizeof(float));
					float timestamp=((float)i/len)*bms->barlen+bar*bms->barlen;
					bms->lanes[lane][llen-1]=timestamp;
//				if(ok)printf("<%f>%i\n",timestamp,ok);
				}
			}
			return;
		default:printf("unk char:%c line:%i (%s)\n",line[0],0,line);die("unknow line type");
	}
}
BMS*newBMS(char*path){
	BMS*bms=(BMS*)malloc(sizeof(BMS));
	memset(bms,0,sizeof(BMS));
	bms->fd=open(path,O_RDONLY,0777);
	while(getLine(bms)>=0)
		parseLine(bms);
	close(bms->fd);
	return bms;
}

#include <SDL/SDL.h>
SDL_Surface *image,*screen;
void draw(int i,BMS*bms){
	SDL_Rect src={0,0,image->w,image->h},dest={0,0,screen->w,screen->h};
//	if(i<screen->w)src.w=i;
	SDL_BlitSurface(image, &src, screen, &dest);
	int j,i,off=SDL_GetTicks()/10;
	
	int coef=2;
	off=off*coef;
	int lane2color[]={0,
		0x00FF0000,0x00FFFFFF,0x0000FF00,0x00FFFFFF,0x000000FF,0x00FFFFFF,0x0000FF00,0x00FFFFFF,
		0x00FF0000,0x00FFFFFF,0x0000FF00,0x00FFFFFF,0x000000FF,0x00FFFFFF,0x0000FF00,0x00FFFFFF};
	for(j=16;j>0;j--){
		for(i=0;i<bms->lanesLen[j];i++){
			SDL_Rect rect = {10*j+100,bms->lanes[j][i]*coef*-100+off,10,2};
			SDL_FillRect(screen, &rect, lane2color[j]);
		}
	}	
}
void graphinit(BMS*bms){
	if(SDL_Init(SDL_INIT_VIDEO)<0)return 1;
	screen = SDL_SetVideoMode(480, 272, 32, /*SDL_FULLSCREEN|*/SDL_HWSURFACE);
  SDL_ShowCursor(SDL_DISABLE);
	SDL_Surface *temp = SDL_LoadBMP("bg.bmp");
	image = SDL_DisplayFormat(temp);
	SDL_FreeSurface(temp);
	SDL_GL_SetAttribute(SDL_GL_SWAP_CONTROL, 0);
	int i;
	for(i=0;;i++){
		SDL_Event event;
		if(SDL_PollEvent(&event)&&((event.type==SDL_QUIT)||(event.type==SDL_KEYDOWN)))break;
		draw(i,bms);
		SDL_Flip(screen);
	}
	SDL_FreeSurface(image);
	SDL_Quit();
}
int main(int argc,char**argv){
	BMS*bms=newBMS("test.bms");
	graphinit(bms);
}