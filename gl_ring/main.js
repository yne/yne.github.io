

function Ring(n,size,width,tex,repeat,speed){
	v=[],t=[];
	for(var i=0;i<n;i++){
		var rad=2*Math.PI*i/n;
		v.push(
			size*Math.cos(rad),
			size*Math.sin(rad),
			0,
			size*Math.cos(rad)*width,
			size*Math.sin(rad)*width,
			0
		);
		t.push(
			repeat*i/n,(tex[0]+0)/tex[1],
			repeat*i/n,(tex[0]+1)/tex[1]
		);
	}
	return {
		speed    :speed,
		vertices :v.concat(v.slice(0,3*2)),//loop the 2 first nodes
		texCoords:t.concat(t.slice(0,2*2))
	};
}

var rings=[]
function addRing() {
	var ring = Ring.apply(this,arguments);

	vert = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vert);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ring.vertices), gl.STATIC_DRAW);
	vert.itemSize = 3;
	vert.numItems = ring.vertices.length/vert.itemSize;

	tex = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tex);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ring.texCoords), gl.STATIC_DRAW);
	tex.itemSize = 2;
	tex.numItems = ring.texCoords/tex.itemSize;
	rings.push({vert:vert,tex:tex,speed:ring.speed});
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
function getZoom(now){return 1/Math.sin((((now-start)/1500)*(Math.PI/2)));}
function drawScene() {
	var now=new Date().getTime();
	var z=getZoom(now);
	if(z<1.01)getZoom=function(){return 1.00;}

	setMatrixUniforms();
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [-0.25, 0.2, -z-1.2]);

	gl.bindTexture(gl.TEXTURE_2D, ringsTexture);
	gl.activeTexture(gl.TEXTURE0);

	for(var i=0;i<rings.length;i++){
		mvPushMatrix();
		mat4.rotate(mvMatrix, rings[i].speed(now/1000), [0, 0, -1]);
		var2shader(rings[i].vert,shader.aVertexPosition);
		var2shader(rings[i].tex,shader.aTextureCoord);
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, rings[i].vert.numItems);
		mvPopMatrix();
	}
//	gl.uniform1i(shader.uSampler, 0);
}
var start=new Date().getTime();
function main() {
	initGL(document.getElementById("cnv"));
	initShaders(["aVertexPosition","aTextureCoord","uPMatrix","uMVMatrix","uSampler"]);
	ringsTexture=loadTexture("rings.png",tick);
	var num=16;//ringsTexture.image.height/16;
	addRing(50,0.70,1.10,[0,num],50,function(x){return x/5;});//chain
	addRing(40,0.40,1.10,[1,num],20 ,function(x){return x/-2;});//inner blue
	addRing(50,0.90,1.10,[2,num],25,function(x){return x/8;});//outer grey
	addRing(50,1.00,1.05,[3,num],1 ,function(x){return x/-8;});//large red
	addRing(40,0.50,1.20,[4,num],1 ,function(x){return Math.sin(x/5)*5;});//inner grey
	addRing(20,0.20,0.00,[5,num],1 ,function(x){return 2.35;});//eyes
	addRing(30,0.20,1.70,[6,num],3 ,function(x){return x/3;});//eyes border
	function tick() {
		requestAnimationFrame(tick);
		drawScene();
	}
}
