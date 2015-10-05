initialCall();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)
	[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-68124588-1', 'auto') ; 


var str;
function getIdFromUrl(url){
	values=url.split('/');
	id = values[4];
	return id;
}
function stopAnimating(){
	$(".previewCanvas").remove();
	block =false;
	keepGoing = false;
	iCount=0;
}
function getUrlAndLength(str){
	// var scriptFile = eval(str);
	// var url = ytplayer.config.args.storyboard_spec;
	// var length = ytplayer.config.args.length_seconds;
	var url="";
	var length="";
	var start = str.indexOf("storyboard_spec");
	var lenStart = str.indexOf("length_seconds");
	var tempStr = str[start+18];
	var tt =0;
	while(tempStr!="\""){
		url=url+tempStr;
		tt=tt+1;
		tempStr = str[start+18+tt];
	}
	tt=0;
	tempStr = str[lenStart+17];
	while(tempStr!="\""){
		length=length+tempStr;
		tt=tt+1;
		tempStr = str[lenStart+17+tt];
	}
	return [url, parseInt(length)];  
}
function getImgsFromSource(html,id){
	var imgs = [];
	var parser = new DOMParser();
	var doc = parser.parseFromString(html, "text/html");   
	str = doc.getElementsByTagName("script")[10].innerHTML;
	
	if(str.indexOf("storyboard_spec")<0){
		return imgs;
	}
	var urlAndLength = getUrlAndLength(str); 
	var length = urlAndLength[1];
	b = urlAndLength[0].split("|");
	base = "https://i.ytimg.com/sb/"+id+"/storyboard3_L2/M";
	c = b[3].split("#");
	sigh = c[c.length - 1];
	var n;
	i=0;
	if (length<60)
		n=1;
	else if (length < 60*20 & length>60 )
		n=3;
	else{
		n = Math.floor(length / (60 * 4));
		i=1;
	}
	
	j=Math.floor(n/3)+1;
	while(i<n){
		imgs.push(base + i + ".jpg?sigh=" + sigh);
		i+=j;
	}
	return imgs;
}

function preloadImages(srcs,child,canvas,fn) {
	var imgs = [], img;
	var remaining = srcs.length;
	for (var i = 0; i < srcs.length; i++) {
		img = new Image();
		img.onerror=function(){
			--remaining;
			if (remaining == 0) {
				fn(srcs,child,canvas);
			}
		}	
		img.onload = function() {
			imgs.push(img);
			--remaining;
			if (remaining == 0) {
				fn(srcs,child,canvas);
			}
		};
		img.src = srcs[i];
	}
	return(imgs);
}

var iCount=0;
var keepGoing=true;
var block = false;
function initialCall(){

	$(document).on( "mouseenter", ".yt-thumb-simple,.yt-uix-simple-thumb-wrap,.yt-uix-simple-thumb-related", function(){
		ga('send', 'event', 'img', 'mouseenter' );
		$(".previewCanvas").remove();	
		if(!block){
			block = true;
			keepGoing=true;
			var canvas = document.createElement('canvas');
			canvas.className = "previewCanvas";
			var c = canvas.getContext('2d');
			child = $(this).children( "img[src*='ytimg.com']" );
			if((child.attr("src") !== undefined)&&(child.attr("src").indexOf("vi")>-1)&&(child.attr("src").indexOf("poster_wide")==-1)){
				url = child.attr("src");
				id = getIdFromUrl(url);
				urlForSource = 'https://www.youtube.com/watch?v='+id;
				$.ajax({
					url : urlForSource,
					async: true,
					success: function(html) {
						imgArray = getImgsFromSource(html,id);
						var loadedImgs = preloadImages(imgArray,child,canvas,animate);
						block = false;
						// keepGoing=true;
					},
					error: function(xhr, textStatus, errorThrown){
						block = false;
					}		
				});
			}
			else{
				stopAnimating();
			}
		} 
	});

$(document).on( "mouseleave", ".yt-thumb-simple,.yt-uix-simple-thumb-wrap,.yt-uix-simple-thumb-related",".previewCanvas", function(){
	ga('send', 'event', 'img', 'mouseleave' );
	stopAnimating();
});

}

function animate(array,child,canvas){
	var width = child.attr("width");
	var	height = child.attr("height");
	var coin,
	coinImage;					
	function gameLoop () {
		if(keepGoing){
			window.requestAnimationFrame(gameLoop);
			coin.update();
			coin.render();
		}
		else{
			return;
		}
	}


	function sprite (options) {

		var that = {},
		frameIndex = 0,
		heightIndex = 1,
		tickCount = 0,
		ticksPerFrame = options.ticksPerFrame || 0,
		numberOfFrames = options.numberOfFrames || 1
		numberOfHeight = options.numberOfHeight|| 1;

		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;

		that.update = function () {
			tickCount += 1;
			if (tickCount > ticksPerFrame) {

				tickCount = 0;

				if (frameIndex < numberOfFrames - 1) {	
					frameIndex += 2;
				} else {
					heightIndex += 2;
					frameIndex = 0;
				}
				if (heightIndex>numberOfHeight - 1){
					heightIndex = 1;
					iCount+=1;
					if(iCount>=array.length)
					{

						keepGoing = false;
						block = false;
						$(".previewCanvas").remove();
					}
					coinImage.src = array[iCount%array.length];
					ticksPerFrame +=30;
				}

			}
		};

		that.render = function () {
			if(keepGoing){
// Clear the canvas
that.context.clearRect(0, 0, that.width, that.height);
// Draw the animation
that.context.drawImage(
	that.image,
	frameIndex *that.width /numberOfFrames,
	heightIndex *that.height/ numberOfHeight,
	that.width / numberOfFrames,
	that.height/ numberOfHeight,
	0,
	0,
	width,
	height);
}
};
return that;
}
canvas.width = width;
if(height==undefined)
	height = 110;
canvas.height = height;
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
$(child).parent().append(canvas);
coinImage = new Image();	
coinImage.src = array[iCount];
coinImage.addEventListener("load", gameLoop);
// Create sprite
coin = sprite({
	context: canvas.getContext("2d"),
	width: coinImage.width,
	height: coinImage.height,
	image: coinImage,
	numberOfFrames: 5,
	numberOfHeight:5,
	ticksPerFrame: 30
});

// Load sprite sheet
}
