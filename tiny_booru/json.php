<?php
require_once 'Booru.php';
error_reporting(0);
$json=array();
$json['results']=array();
switch($_GET['cmd']){//todo:refactoring
	case 'recent':{
		$json['results']=Image::ListAll('filectime');
	}break;
	case 'all':{
		$json['results']=Image::ListAll();
	}break;
	case 'info':{
		$img=new Image($_GET['q']);
		$json['results']=$img->getTags();
	}break;
	case 'delimg':{
		$img=new Image($_GET['q']);
		$img->remove();
	}break;
	case 'addtag':{
		$img=new Image($_GET['h']);
		if(isset($_GET['q']) && $_GET['q'][0]!='&')
			$img->addTag($_GET['q']);
	}break;
	case 'exist':{
		$list=json_decode($_POST['q']);
		foreach($list as $img){
			try{
				new Image($img);
				$json['results'][$img]=true;
			}catch(Exception $e){
				$json['results'][$img]=false;
			}
		}
	}break;
	case 'upload':{
		try{
			if($_FILES["file"]["error"]>0)break;
			$img=new Image($_FILES["file"]["tmp_name"]);
			$json['results']=$img->getId();
		}catch(Exception $e){
			
		}
	}break;
	case 'flagged':{
		$tags=Tag::ListAll();
		$flags=array();
		foreach($tags as $tag)if($tag[0]=='!')array_push($flags,$tag);
		foreach($flags as $flag){
			$tag=new Tag($flag);
			$json['results']=array_merge($json['results'],$tag->getImages());
		}
	}break;
	case 'tag':{
		if(!isset($_GET['q']) || $_GET['q']=="")break;
		$words=explode(' ',$_GET['q']);
		$i=0;
		foreach($words as $word){
			if($word=="")continue;
			$tag=new Tag($word,false);
			$json['results']=$i?
				array_intersect($json['results'],$tag->getImages()):
				$tag->getImages();
			$i++;
		}
	}break;
	case 'tagall':{
		$json['results']=Tag::ListAll();
	}break;
	default:;
}
echo json_encode($json);