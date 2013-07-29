var gl;

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function loadTexture(url,cb){
	tex = gl.createTexture();
	tex.image = new Image();
	tex.image.onload = (function() {
		gl.bindTexture(gl.TEXTURE_2D, this);
//		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
		cb();
	}).bind(tex);
	tex.image.src = url;
	return tex;
}

function getShader(gl, id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
				return null;
		}

		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
				if (k.nodeType == 3) {
						str += k.textContent;
				}
				k = k.nextSibling;
		}

		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
				return null;
		}

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(shader));
				return null;
		}

		return shader;
}
function var2shader(array,shade){
	gl.bindBuffer(gl.ARRAY_BUFFER,array);
	gl.vertexAttribPointer(shade, array.itemSize, gl.FLOAT, false, 0, 0);
}

var shader;

function initShaders(list) {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shader = gl.createProgram();
	gl.attachShader(shader, vertexShader);
	gl.attachShader(shader, fragmentShader);
	gl.linkProgram(shader);

	if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
	}

	gl.useProgram(shader);

	for(var i=0;i<list.length;i++){
		if(list[i][0]=='a')
			gl.enableVertexAttribArray(shader[list[i]] = gl.getAttribLocation(shader, list[i]));
		if(list[i][0]=='u')
			shader[list[i]] = gl.getUniformLocation(shader, list[i]);
	}
}

window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}
function mvPopMatrix() {
	if (mvMatrixStack.length == 0)
		throw "Invalid popMatrix!";
	mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
	gl.uniformMatrix4fv(shader.uPMatrix, false, pMatrix);
	gl.uniformMatrix4fv(shader.uMVMatrix, false, mvMatrix);
}