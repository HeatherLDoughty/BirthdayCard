/****************************************/
/***shim animation frame (paul irish)***/
/**************************************/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime =  +new Date;
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/**************************************/

var Dragon = (function (){
var left = false;
var requestId = 0;
var upDraft, dragonImg;
var hazSheep= false;
var hazCake = false;
var sLoopL;
var sLoopT = 300;
var loopPhase = 0;
var LoopCheckPointx = [0,182,273,364,309,273,228,182,273,364,546]; 

var publicInit  = function () {
 toggleButtons(false);
 upDraft = document.getElementById("upDraft");
 dragonImg = document.getElementById("dragon");
};

function getBirthdayDiv(){
var ele = document.createElement('div')
ele.id= "win";
ele.innerHTML = '<img src="./images/casey.gif" alt="I love you!"/>';
return ele;
}

function animateHorizontal() {
  var numpart= parseFloat(upDraft.offsetLeft);
  if (!left) {numpart +=6;} else {numpart -=6;}
  upDraft.style.left = numpart + "px";
  requestId = window.requestAnimationFrame(animateHorizontal);
  if (numpart > document.documentElement.offsetWidth -600) {start(true);} else if (numpart < 10) {start(false);}  //keep in limit
  if (hazCake) {dropCake(numpart);}
}

function start(goLeft) {
  stopAnimate();
  left = goLeft;
  upDraft.setAttribute("class", GetDirectionClass(left));
  setFlyGIF();
  requestId = window.requestAnimationFrame(animateHorizontal);
}

function goingRightCheckPoint(numL){
 if ((numL - sLoopL) >= LoopCheckPointx[loopPhase]) {loopPhase +=1; }
}

function goingLeftCheckPoint(numL){
 if ((numL - sLoopL) <= LoopCheckPointx[loopPhase]) {loopPhase +=1; }
}

function setFlyGIF () {
if (hazCake) {
 dragonImg.src = "./images/dragonCake.gif";
}else{
 dragonImg.src = "./images/dragon.gif";
} 
}

function winning () {
 takeSheep();
 document.getElementById("hinthint").innerHTML = "from Mom! :)"
 document.body.appendChild(getBirthdayDiv());
} 


var publicMouseDown = function(e){
var hinthint = document.getElementById("hinthint");
if (document.getElementById("box").getElementsByTagName('div').length === 5 && (this.getAttribute('id') ==="sheep")){
hinthint.innerHTML = "I said... 'I'M SURE HE'D LIKE SOME CAKE!'"
hinthint.style.fontSize = "30px";
}
sLoopT
start(left);
};

function apoligise(draggable){
if (document.getElementById("box").getElementsByTagName('div').length !== 4) {return;}
var hinthint = document.getElementById("hinthint");
if (hinthint.style.fontSize !== "30px") {hinthint.innerHTML = "...maybe he burned it because he loved it so much?"; return;}
hinthint.innerHTML = "oh. wow... my bad....";
hinthint.style.fontSize = "12px";
setTimeout(function(){document.getElementById("hinthint").innerHTML = "I really thought dragons liked cake.";},7000);
}

var publicAnimateCake = function(event, ui) {
if (hazCake) {return;}
var draggable = ui.draggable;
draggable.draggable("destroy");
draggable.remove();
if (draggable.attr("disable") === "disabled") {return;}
draggable.attr("disable", "disabled");
if (draggable.attr('id') ==="sheep") {winning(); return;}
hazCake = true
left = false;
upDraft.setAttribute("class", GetDirectionClass(left));
publicAnimateLoop();
return false;
};

var publicAnimateLoop = function() {
  var numL= parseFloat(upDraft.offsetLeft);
  var numT= parseFloat(upDraft.offsetTop);
  switch (loopPhase)
  {
  case 0: //0,0 SETUP
   toggleButtons(true);
   stopAnimate();
   setFlyGIF();
   sLoopL = numL;
   upDraft.style.top = sLoopT + "px";     
   loopPhase +=1
	break;
  case 1: //182,91
    numL +=6; 
	numT -=3;
	break;
  case 2: //273,182
    numL +=3; 
	numT -=3; 
	break;
  case 3: //364,364
    numL +=3; 
	numT -=3;
	break;
  case 4: //309,546
    numL +=3;
	break;
  case 5: //273,546 TOP
    numL -=3; 
	break;
  case 6: //228,546
    numL -=3; 
	numT +=6; 
	break;
  case 7: //182,364
    numL +=3; 
	numT +=6;
	break;
  case 8: //273,182
    numL +=3; 
	numT +=3;	
	break;
  case 9: //364,91
    numL +=6; 
	numT +=3;
	break;
  case 10: //546,0 FINISH
    numL +=6; 
	numT +=3;
	break;
  case 11: // FINISH
    upDraft.style.top = sLoopT + "px";
    stopAnimate();
   	loopPhase=0;
	toggleButtons(false);
	start(left);
	apoligise();
	return;
  }
  
  upDraft.style.left = numL + "px";
  upDraft.style.top = numT + "px";
  requestId = window.requestAnimationFrame(publicAnimateLoop);
  if (loopPhase > 0) {upDraft.setAttribute("class", "loop" + loopPhase);}
  if (loopPhase >= 5 && loopPhase <= 6) {goingLeftCheckPoint(numL);} else {goingRightCheckPoint(numL);} 
};

function dropCake(leftPosition){
if (leftPosition = 20){
toggleButtons(true);
stopAnimate();
dragonImg.src = "./images/dragonCakeToss.gif";
hazCake = false;
setTimeout(function(){toggleButtons(false); start(left);},6500);}
}


function stopAnimate() {
  window.cancelAnimationFrame(requestId);
  requestId = 0;
}

function toggleButtons(disabled) {
 var disabledString = ""
 if (disabled) {disabledString = "disabled";}
 var buttons = document.getElementsByTagName("button");
 var len = buttons.length;
 for (var i = 0; i<len; i++)
 {buttons[i].disabled = disabledString;}
}


function GetDirectionClass(getLeft){
if (getLeft){return "flyLeft";} else {return "flyRight";}
}

var publicChangeDirection = function (){
   if (dragonImg.srcs.indexOf("hasSheep") != -1 || hazCake) {return;}
   left = !left;
   start(left);
};

var publicSit = function (){
  setSitGIF ();
  if (!requestId) {return;}
  stopAnimate();
};

function setSitGIF () {
if (hazSheep) {
 dragonImg.src = "./images/hasSheep.gif";
}else{
 dragonImg.src = "./images/dragonSit.gif";
} 
}

function takeSheep(){
  hazSheep = true;
  hazCake = false;
  dragonImg.src = "./images/hasSheep.gif";
  if (!requestId) {return;}
  stopAnimate();
};

return {init: publicInit, sit: publicSit, changeDirection:publicChangeDirection, loop:publicAnimateLoop, takeCake:publicAnimateCake, cakeMouseDown:publicMouseDown};
})();

$( function () {
Dragon.init();
var onOver = function(event,ui){
Dragon.takeCake(event,ui); 
$('#sheep').draggable( "enable" );
};
$("#upDraft").droppable({tolerance: "touch", over: onOver});
$(".cake").draggable({drag: Dragon.cakeDrag});
$('#sheep').draggable( "disable" )
$(".cake").mousedown(Dragon.cakeMouseDown);
$("#upDraft").click(Dragon.changeDirection);
$("#sit").click(Dragon.sit);
})
