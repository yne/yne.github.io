<?php
class Booru{
	static function getRoot(){
		return getcwd().'/';
	}
	static function getUserId(){
		return substr(sha1($_SERVER["REMOTE_ADDR"]),0,8);
	}
	static function listDir($path,$extra=false){
		$list=array();
		$fd = dir($path);
		if(!$fd)return $list;
		while (($entry = $fd->read()) !== false){
			if($entry[0]=='.')continue;
			if($extra)$list[$entry]=$extra($path.'/'.$entry);
			else array_push($list,$entry);
		}
		$fd->close();
		return $list;
	}
}

class Tag extends Booru{
	const DIR='tag/';
	static function ListAll(){
		return Booru::listDir(Booru::getRoot().Tag::DIR);
	}
	private $name;
	function __construct($name,$create=true){
		$name=str_replace(" ","_",str_replace("+"," ",strtolower($name)));
		if(!preg_match ('/^[!@$&%#~]?[0-9a-z_]+$/',$name,$clear))$clear=array('&illegal_tag');
		$this->name=$clear[0];
		if(!file_exists($this->getDir()) && $create==true)
			mkdir($this->getDir(),0777,true);
	}
	function addImage($image){
		touch($this->getDir().$image->getId());
	}
	function removeImage($image){
		unlink($this->getDir().$image->getId());
		if(!count($this->listAll()))
			$this->remove();
	}
	function remove(){
		return unlink($this->getDir());
	}
	function getImages(){
		return Booru::listDir($this->getDir());
	}
	//getter
	function getDir(){
		return Booru::getRoot().Tag::DIR.$this->name.'/';
	}
	function getName(){
		return $this->name;
	}
}

class Image extends Booru{
	const DIR='img/';
	const THUMB_SIZE=192;
	
	static function ListAll($extra=false){
		return Booru::listDir(Booru::getRoot().Image::DIR,$extra);
	}
	static function getColors($src){
		$img=Image::createImageAuto($src);
		$pix=imagecreatetruecolor(3,3);
		imagecopyresampled($pix,$img,0,0,0,0,3,3,imagesx($img),imagesy($img));
		$c=array();
		for($x=0;$x<3;$x++)
			for($y=0;$y<3;$y++)
				array_push($c,imagecolorat($pix,$x,$y));
		return $c;
	}
	static function compareColors($src,$dst){
		$sr=($src>> 0)&0xFF;
		$sg=($src>> 8)&0xFF;
		$sb=($src>>16)&0xFF;
		$sa=($src>>24)&0xFF;
		$tr=($dst>> 0)&0xFF;
		$tg=($dst>> 8)&0xFF;
		$tb=($dst>>16)&0xFF;
		$ta=($dst>>24)&0xFF;
		return abs($tr-$sr)+abs($tg-$sg)+abs($tb-$sb)+abs($ta-$sa);
	}
	static function FindByImage($src){
		$c=Image::getColors($src);
		$list=Booru::listDir(Booru::getRoot().Image::DIR);
		$result=array();
		foreach($list as $img){
			$bin=file_get_contents(Booru::getRoot().Image::DIR.$img.'/color');
			$colors=unpack("V9",$bin);
			$delta=0;
			for($i=0;$i<9;$i++)
				$delta+=abs(Image::compareColors($colors[$i+1],$c[$i]));
			$result[$img]=$delta;
		}
		asort($result);
		return $result;
	}
	static function createImageAuto($src){
		$fd=fopen($src, 'r+b');
		$mime=fread($fd,3);
		fclose($fd);
		switch($mime){
			case chr(0xff).chr(0xd8).chr(0xff):return imagecreatefromjpeg($src);
			case chr(0x89).'PN':return imagecreatefrompng ($src);
			case 'GIF':return imagecreatefromgif ($src);
			default:throw new Exception();
		}
	}
	
	private $id;
	function __construct($src){
		if(strlen($src)==32 && file_exists(Booru::getRoot().Image::DIR.$src)){
			$this->id=$src;
		}elseif(file_exists($src)){
			$this->id=md5_file($src);
			$this->import($src);
		}else
			throw new Exception();
	}
	function addTag($name){
		$tag=new Tag($name);
		$tag->addImage($this);
		touch($this->getTagDir().$tag->getName());
		if(count($this->getTags())>=4)
			$this->removeTag('tag_me');
	}
	function removeTag($name){
		$tag=new Tag($name);
		$tag->removeImage($this);
		unlink($this->getTagDir().$tag->getName());
		if(count($this->getTags())<=2)
			$this->addTag('tag_me');
	}
	function getTags(){
		return Booru::listDir($this->getTagDir());
	}
	function remove(){//TODO:add IP check
		$tags=$this->getTags();
		foreach($tags as $tag){
			$t=new Tag($tag);
			$t->removeImage($this);
		}
		unlink($this->getDir());
	}
	//upload stuff
	private function createThumb($src,$h){
		$img=Image::createImageAuto($src);
		//create thumbnail
		$w = floor(imagesx($img) * ($h / imagesy($img)));
		$thumb = imagecreatetruecolor($w, $h);
		imagecopyresampled($thumb,$img,0,0,0,0,$w,$h,imagesx($img),imagesy($img));
		imagejpeg($thumb,$this->getDir().'thumb');
		//get global color from thumb (faster)
		$c=Image::getColors($this->getDir().'thumb');
		file_put_contents($this->getDir().'color',pack("VVVVVVVVV",$c[0],$c[1],$c[2],$c[3],$c[4],$c[5],$c[6],$c[7],$c[8]));
	}
	private function import($src){
		if(file_exists($this->getDir()))return;
		mkdir($this->getDir(),0777,true);
		mkdir($this->getDir().'/comments');
		mkdir($this->getTagDir());
		$this->createThumb($src,Image::THUMB_SIZE);
		move_uploaded_file($src, $this->getDir().'content');
		$this->addTag('&ip_'.Booru::getUserId());
		$this->addTag('tag_me');
	}
	//getter
	function getId(){
		return $this->id;
	}
	function getDir(){
		return Booru::getRoot().Image::DIR.$this->id.'/';
	}
	function getTagDir(){
		return $this->getDir().Tag::DIR;
	}
}