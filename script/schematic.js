/*----------------------------------------------------------------------------
 * Webtronics 1.0
 * SVG schematic drawing Script
 * -----------------------------------------------------------------------------
 * Created by an electronics hobbyist
 * Based on Richdraw by Mark Finkle 
 * -----------------------------------------------------------------------------
 * Copyright (c) 2006 Mark Finkle
 * 
 * This program is  free software;  you can redistribute  it and/or  modify it
 * under the terms of the MIT License.
 * 
 * Permission  is hereby granted,  free of charge, to  any person  obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the  Software without restriction,  including without limitation
 * the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 * and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 * Software is  furnished  to do  so, subject  to  the  following  conditions:
 * The above copyright notice and this  permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 * LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 * FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 * DEALINGS IN THE SOFTWARE.
 * -----------------------------------------------------------------------------
 * History:
 * 2006-04-05 | Created
 * --------------------------------------------------------------------------*/



function Schematic(elem) {
  this.svgNs = 'http://www.w3.org/2000/svg';
  this.wtxNs="http://code.google.com/p/webtronics";
  this.container = elem;
  this.grid = 10;
  this.width=640;
  this.height=480;
  this.maxwidth=2000;
  this.maxheight=2000;
  this.fontsize=12;
  /*main svg element*/	
  this.svgRoot = null;
  /* group to hold drawing*/
  this.drawing=null;
  /* group to hold background*/
  this.background=null;
  /*svg layer for zoom tools*/
  this.zoomtools=null;
  /*element for selection*/
  this.selection=null;
  /*group to display information*/
  
  this.info=null;
  this.graph=false;
  this.connections=false;
  this.inv=false;
  this.mode = 'select';
  /*array of nodes*/
  this.selected = [];
  /* parts to delete*/
  this.garbage = [];
  //this.wirenodes=[];
  this.undolist=[];
  this.redolist=[];
  this.drag=false;
  /*selecting rectangle*/
  this.selectionRect = { x:0, y:0, width:0, height: 0 };
  this.mouseDown={x:0,y:0};
  //	this.viewoffset={x:0,y:0};
  this.onconnector=false;
	this.connector=null;
  
  this.init(this.container);
  
  this.onMouseDownListener = this.onMouseDown.bindAsEventListener(this);
  this.onMouseUpListener = this.onMouseUp.bindAsEventListener(this);
  this.onMouseMove = this.onMouseMove.bindAsEventListener(this);	
  this.onWheelListener = this.onWheel.bindAsEventListener(this);	
  
  Event.observe(this.svgRoot, "mousewheel",this.onWheelListener);
  Event.observe(this.svgRoot, "DOMMouseScroll",this.onWheelListener);
  Event.observe(this.svgRoot, "dragover", this.onMouseMove);
  Event.observe(this.svgRoot, "mousemove", this.onMouseMove); 
  Event.observe(this.svgRoot, "mousedown", this.onMouseDownListener);
  Event.observe(this.svgRoot, "mouseup", this.onMouseUpListener);
  /*this might get the ipad working*/
  Event.observe(this.svgRoot, "onclick", void(0));

  
  
}

//******************************************************
///container functions
Schematic.prototype.getwithselector=function(selector){
	return $$(selector);


}


Schematic.prototype.getnextid=function(elem,count){
  var type=this.readwtx(elem,"type");
  if(!count)count=1;
  var newid=type+count
  var parts=this.drawing.getElementsByTagName("g");
  for(var i=0;i<parts.length;i++){
    var t=this.readwtx(parts[i],"id");
    if((elem!=parts[i])&&(t==newid)){
      count++;
      newid=this.getnextid(elem,count);
    }
  }
  return newid;
}

Schematic.prototype.undo=function(){
if(this.undolist.length > 1){
    this.changeobserver.disconnect();
    this.clearinfo();
    this.unselect();

    
    this.redolist.push(this.undolist.pop());
     
    this.remove(this.drawing);
    this.drawing=this.undolist[this.undolist.length-1].cloneNode(true);
    this.svgRoot.insertBefore(this.drawing,this.zoomtools);
    if(this.background.getAttribute('class')=='inv')this.drawing.setAttribute('class','inv');
    else if(this.drawing.getAttribute('class')=='inv')this.drawing.removeAttribute('class');
    this.drawing.setAttribute('transform',this.background.getAttribute('transform'));

    this.addconnects();
    // configuration of the observer:
    // pass in the target node, as well as the observer options
    this.changeobserver.observe(this.drawing, { attributes: true, childList: true, characterData: true ,subtree:true});

    
}
  
  
}

Schematic.prototype.addhistory=function(){
   if(this.undolist.length>=40)this.undolist.shift();
   this.redolist=[]; 
   this.changeobserver.disconnect();
   this.undolist.push(this.drawing.cloneNode(true));
    // configuration of the observer:
    this.changeobserver.observe(this.drawing, { attributes: true, childList: true, characterData: true ,subtree:true});

}



Schematic.prototype.redo=function(){
if(this.redolist.length){
    this.changeobserver.disconnect();
    this.clearinfo()
    this.unselect()

    this.undolist.push(this.redolist.pop());
    this.remove(this.drawing);
    this.drawing=this.undolist[this.undolist.length-1].cloneNode(true);
    this.svgRoot.insertBefore(this.drawing,this.zoomtools);
    if(this.background.getAttribute('class')=='inv')this.drawing.setAttribute('class','inv');
    else if(this.drawing.getAttribute('class')=='inv')this.drawing.removeAttribute('class');
    this.drawing.setAttribute('transform',this.background.getAttribute('transform'));
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true ,subtree:true};
    // pass in the target node, as well as the observer options
    this.addconnects();
    this.changeobserver.observe(this.drawing, config);
}
  
}




Schematic.prototype.init = function(elem) {
  
  this.container = elem;
  this.container.style.MozUserSelect = 'none';
  this.svgRoot = document.createElementNS(this.svgNs, "svg");
  this.svgRoot.setAttribute('xmlns',this.svgNs);
  //	this.svgRoot.setAttribute('xmlns:wtx',this.wtxNs);
  this.svgRoot.setAttribute('width',2000);
  this.svgRoot.setAttribute('height',2000);
  
  this.container.appendChild(this.svgRoot);
  /*set colors*/
  this.svgRoot.style.backgroundColor="inherit";
  this.container.style.backgroundColor="inherit";
  /*create main group for pan/zoom*/		
  this.drawing=document.createElementNS(this.svgNs,'g');
  this.drawing.id='webtronics_drawing';
  this.svgRoot.appendChild(this.drawing);
  /* create group for user info such as selection boxes */
  this.info=document.createElementNS(this.svgNs,'g');
  this.info.id="information";
  this.svgRoot.appendChild(this.info);
  /*add the background*/
  this.graph=false
  this.showbackground();
  /*add the toolbar*/
  this.addtools();
  // create an observer instance
  if(window.MutationObserver)this.changeobserver = new MutationObserver(this.updateinfo.bind(this));
  else this.changeobserver = new WebKitMutationObserver(this.updateinfo.bind(this));
  // configuration of the observer:
  var config = { attributes: true, childList: true, characterData: true ,subtree:true};
  // pass in the target node, as well as the observer options
  this.changeobserver.observe(this.drawing, config);
  
}

Schematic.prototype.updateinfo=function(mutations){
  //filter the events
  var update= false
  mutations.forEach(function(mutation){if(mutation.target!=this.drawing)update=true});    
  
  
  if(update){
//    console.log("updating");
    if(!this.drag)this.addhistory();
    this.addconnects();
  }
}


Schematic.prototype.addtools=function(){
  if($(this.zoomtools))this.remove(this.zoomtools);
  this.zoomtools=document.createElementNS(this.svgNs,'svg');
  this.zoomtools.setAttribute('xmlns:svg',this.svgNs);
  //this.zoomtools.setAttribute('xmlns:xlink',"http://www.w3.org/1999/xlink");
  this.zoomtools.id='webtronics_zoomtools';
  this.zoomtools.setAttribute('width',this.container.offsetWidth);
  this.zoomtools.setAttribute('height',this.container.offsetHeight);			
  
  /*add the image tools*/
  var normal=document.createElementNS(this.svgNs,'image');
  normal.setAttribute('x',0);
  normal.setAttribute('y',0);
  normal.setAttribute('width',32);
  normal.setAttribute('height',32);
  normal.setAttributeNS("http://www.w3.org/1999/xlink",'xlink:href','./buttons/normal.png');
  /* make sure the mouse events don't go through the image*/
  Event.observe(normal,"mousedown", function(e){e.stopPropagation();}.bind(this));
  Event.observe(normal,"mouseup", function(e){e.stopPropagation();}.bind(this));
  Event.observe(normal,"click", function(e){
    this.drawing.setAttribute('transform','matrix(1,0,0,1,0,0)');
    this.background.setAttribute('transform','matrix(1,0,0,1,0,0)');
    this.info.setAttribute('transform','matrix(1,0,0,1,0,0)');
    e.stopPropagation();}.bind(this));
  this.zoomtools.appendChild(normal);
  var grow=document.createElementNS(this.svgNs,'image');
  
  
  grow.setAttribute('x',(this.container.offsetWidth)-32);
  grow.setAttribute('y',(this.container.offsetHeight)-32);
  grow.setAttribute('width',32);
  grow.setAttribute('height',32);
  grow.setAttributeNS("http://www.w3.org/1999/xlink",'xlink:href','buttons/grow.png');
  Event.observe(grow,"mousedown", function(e){e.stopPropagation();}.bind(this));
  Event.observe(grow,"mouseup", function(e){e.stopPropagation();}.bind(this));
  Event.observe(grow,"click", function(e){
    if(this.svgRoot.getAttribute('width')<this.maxwidth&this.svgRoot.getAttribute('height')<this.maxheight){
      //this.drawing.setAttribute('width',this.svgRoot.getAttribute('width')*2);
      //this.drawing.setAttribute('height',this.svgRoot.getAttribute('height')*2);			
      this.svgRoot.setAttribute('width',this.svgRoot.getAttribute('width')*2);
      this.svgRoot.setAttribute('height',this.svgRoot.getAttribute('height')*2);			
    }
    this.showbackground();
    this.addtools();
    e.stopPropagation();}.bind(this));
  this.zoomtools.appendChild(grow);
  this.svgRoot.appendChild(this.zoomtools);
}

Schematic.prototype.showbackground=function(){
  if(this.background)this.remove(this.background);
  this.background=document.createElementNS(this.svgNs,'g');
  this.svgRoot.insertBefore(this.background,this.drawing);
  var canvas=	this.createrect('white',1,0,0,this.svgRoot.getAttribute('width'),this.svgRoot.getAttribute('height'));
  canvas.id='canvas';
  this.background.appendChild(canvas);
  this.background.id='webtronics_background';
  if(this.drawing.getAttribute('class')=='inv')this.background.setAttribute('class','inv');
  var matrix=this.parseMatrix(this.drawing);
  this.background.setAttribute('transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
  
  if(this.graph){
    var graph=document.createElementNS(this.svgNs,'g');
    this.background.appendChild(graph);
    graph.id='graph';
    for(var x=0;x<this.svgRoot.getAttribute('width');x+=this.grid){
      graph.appendChild(this.createline('lightgrey',0.5,x,0,x,this.svgRoot.getAttribute('height')));
    }
    for(var y=0;y<this.svgRoot.getAttribute('height');y+=this.grid){
      graph.appendChild(this.createline('lightgrey',0.5,0,y,this.svgRoot.getAttribute('width'),y));
    }
  }
}
Schematic.prototype.parseMatrix=function(group){
  var matrix={a:1,b:0,c:0,d:1,e:0,f:0};
  
  try{
    matrix=group.getTransformToElement(group.parentNode);
  }
  catch(e){
    //parse the matrix manualy
    try{
        var tranform=group.getAttributeNS(null,"transform");
        console.log(transform);
        var result=transform.match(/matrix\((\d+)\,(\d+)\,(\d+)\,(\d+)\,(\d+)\,(\d+)\)/);
        matrix={a:result[1],b:result[2],c:result[3],d:result[4],e:result[5],f:result[6]};   
    }
    catch(e){
        console.log("matrix parse error");
        console.log(e.message);
    }
  }
  return matrix;
  
}



Schematic.prototype.addtext=function(str,x,y){
  
  this.unselect();
  
  str=str.replace(/(^\s*|\s*$)/g, "");
  var lines=str.split('\n');
  for(var i=0; i<lines.length;i++){
    var svg =this.createtext(lines[i],'black',x,y+(i*this.fontsize));
    this.drawing.appendChild(svg);
    this.select(svg);
  }
  
}



Schematic.prototype.parseXY=function(elem){
  var point={x:0,y:0};
  if (elem.tagName == 'line') {
    var x=elem.getAttributeNS(null, 'x1')-0;
    var y=elem.getAttributeNS(null, 'y1')-0;	
    point.x=elem.getAttributeNS(null, 'x2')-0;
    point.y=elem.getAttributeNS(null, 'y2')-0;	
    if(x<point.x)point.x=x;
    if(y<point.y)point.y=y;
  }
  else if(elem.tagName=='circle'){
    point.x=elem.getAttributeNS(null, 'cx')-0;
    point.y=elem.getAttributeNS(null, 'cy')-0;
  }
  else if(elem.tagName == 'g'){
    var matrix=this.parseMatrix(elem);
    point.x=matrix.e-0;
    point.y=matrix.f-0;		
  }
  else {
    point.x=elem.getAttributeNS(null, 'x')-0;
    point.y=elem.getAttributeNS(null, 'y')-0;
  }
  return point;	
}



Schematic.prototype.resize = function(shape, fromX, fromY, toX, toY) {
  var deltaX = Math.abs(toX - fromX);
  var deltaY = Math.abs(toY - fromY);
  
  if (shape.tagName == 'line') {
    
    /*if x is longer than y*/ 
    
    if(deltaX>deltaY){
      shape.setAttributeNS(null, 'x2', toX);
      shape.setAttributeNS(null, 'y2', fromY);
    }
    else {
      shape.setAttributeNS(null, 'x2', fromX);
      shape.setAttributeNS(null, 'y2', toY);
    }
    
  }
  
}


Schematic.prototype.tracker = function(elem) {
  var rect={};
  if(elem&&(elem.nodeType==1)){	
    try{
      var bbox=elem.getBBox();
    }
    catch(e){
      return {x:0,y:0,width:0,height:0};
    }
    
    var box={x:0,y:0,width:0,height:0};
    if(bbox){
      box.x=bbox.x;
      box.y=bbox.y;
      box.width=bbox.width;
      box.height=bbox.height;	
      
    }
    
    if(elem.tagName=='g'||elem.tagName=='svg'){
      /*newer versions of firefox need this recursive part to get the right bounding box for some reason
       *otherwise the box width and height are zero if it only contains lines*/
      for(var i= elem.childNodes.length;i>0;i--){
	if(elem.childNodes[i-1].nodeType==1){
	  var chbox=this.tracker(elem.childNodes[i-1]);
	  box.x=Math.min(box.x,chbox.x);
	  box.y=Math.min(box.y,chbox.y);
	  box.width=Math.max(chbox.x+chbox.width,box.width);
	  box.height=Math.max(chbox.y+chbox.height,box.height);
	}	
      }
      
      /*gets corrected bounding box*/
      var matrix=this.parseMatrix(elem);
      var tleft=this.svgRoot.createSVGPoint();
      var bright=this.svgRoot.createSVGPoint();
      tleft.x=box.x;
      tleft.y=box.y;
      tleft=tleft.matrixTransform(matrix);
      
      bright.x=box.x+box.width;
      bright.y=box.y+box.height;
      bright=bright.matrixTransform(matrix);
      
      rect.x=Math.min(tleft.x,bright.x);
      rect.y=Math.min(tleft.y,bright.y);
      rect.width=Math.max(tleft.x,bright.x)-rect.x;			
      rect.height=Math.max(tleft.y,bright.y)-rect.y;			
      
      
    }
    else if (elem.tagName=='line'){
      
      rect.x=box.x-1;
      rect.y=box.y-1;
      rect.width=box.width+2;
      rect.height=box.height+2;
    }		
    else {
      
      rect.x=box.x;
      rect.y=box.y;
      rect.width=box.width;
      rect.height=box.height;
      
    }
    //elem.rect=rect;
    //return rect;
    return rect; 
    
  }
}

Schematic.prototype.showTracker = function(elem) {
  var rect=this.tracker(elem);
  
  var tracked = elem.ownerDocument.createElementNS(this.svgNs, 'g');
  tracked.setAttributeNS(null, 'class', 'schematic_tracker');
  var svg=this.createrect('blue',0.35,rect.x,rect.y,rect.width,rect.height);
  tracked.appendChild(svg)
  
  /*add gadgets*/
  if(elem.tagName=='g'){
    svg=this.createtext('rotate','blue',rect.x+rect.width,rect.y);
    //		svg.rotatorfor=elem;
    
    Event.observe(svg,"mousedown", function(e){
      var data = $A(arguments);
      data.shift();							
      this.mode='rotate';
      this.rotate(data[0]);
      e.stopPropagation();}.bindAsEventListener(this,elem));
    tracked.appendChild(svg);
    
  }
  
  if (this.readwtx(elem,"flip")=="true"){
    svg=this.createtext('flip','blue',rect.x,rect.y+rect.height+10);
    svg.rotatorfor=elem;
    Event.observe(svg,"mousedown", function(e){
      var data = $A(arguments);
      data.shift();							
      this.mode='rotate';
      this.flip(data[0]);
      e.stopPropagation();}.bindAsEventListener(this,elem));
    tracked.appendChild(svg);
    
  }
  this.info.appendChild(tracked);
  /*
   *	if(this.selected.length===1&&this.selected[0].tagName==='g'){
   *		parent.document.getElementById('webtronics_context_menu').select('[Title=Properties]')[0].setAttribute('class','enabled');
   * 
}
else{
  
  parent.document.select('#webtronics_context_menu [Title=Properties]')[0].setAttribute('class','disabled');
}
*/
  
  
}


Schematic.prototype.clearinfo=function(){
  this.remove(this.info);
  this.info=document.createElementNS(this.svgNs,'g');
  this.info.id="information";
  if(this.drawing.getAttribute('class')=='inv')this.info.setAttribute('class','inv');
  this.svgRoot.appendChild(this.info);
  var matrix=this.parseMatrix(this.drawing);
  this.info.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
  this.info
  
}


/*find all tracking boxes and delete them*/
Schematic.prototype.removeTracker=function(){
  var tracker=$$('.schematic_tracker');
  for(var i=0;i<tracker.length;i++){
    if(tracker[i].parentNode!=null)tracker[i].parentNode.removeChild(tracker[i]);
  }
  //	parent.document.getElementById('webtronics_context_menu').select('[Title=Properties]')[0].setAttribute('class','disabled');
  //parent.document.getElementById('webtronics_value_box').hide();
}

Schematic.prototype.remove = function(shape) {
  if(shape){  
    if(shape.parentNode!=null)shape.parentNode.removeChild(shape);
    shape=null;
  }
}


Schematic.prototype.invert=function(check){
  if(check){
    this.inv=true;
    //			console.log('invert');
    this.background.setAttribute('class','inv');
    this.drawing.setAttribute('class','inv');
    this.info.setAttribute('class','inv');
  }
  else{
    this.background.removeAttribute('class');
    this.drawing.removeAttribute('class');
    this.info.removeAttribute('class');
  }
}

Schematic.prototype.showconnections=function(check){
  if(check){
    this.connections=true;
    this.showconnects();
  }
  else{
    this.connections=false;
    this.hideconnects();
  }
  
}

//*************************************************************************************
////Element functions



/*transforms
 * 1  0  0  1 x  y     =normal
 * 0  1 -1  0 x  y     =90`
 * -1  0  0 -1 x  y     =180`
 * 0 -1  1  0 x  y     =270`
 * 0 -1 -1  0 x  y     =fliph and rotate 270`
 */
/*show a box around an element*/
Schematic.prototype.rotate=function(elem){
  var matrix=this.parseMatrix(elem);
  /*center the  object*/
  var box=elem.getBBox();	
  var rotmatrix=this.svgRoot.createSVGTransform();
  var x=box.width/2;//Math.round((box.width/2)/this.grid)*this.grid;
  var y=box.height/2;//Math.round((box.height/2)/this.grid)*this.grid;
  //	console.log(x+" "+y+"\n");
  rotmatrix.setRotate(90,x,y);
  matrix=matrix.multiply(rotmatrix.matrix);
  /*align with grid*/
 matrix.e=Math.round(matrix.e/this.grid)*this.grid;
 matrix.f=Math.round(matrix.f/this.grid)*this.grid;
  elem.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
  this.snaptowire(elem)
  //	var trans=this.svgRoot.createSVGTransform();
  //	trans.setRotate(90,0,0);
  //	elem.transform.baseVal.appendItem(trans);
  //	elem.transform.baseVal.consolidate();
  //	var box2=this.tracker(elem);	
  //	var x=box1.x-box2.x;
  //	var y=box1.y-box2.y;
  //	trans.setTranslate(x,y);
  //	elem.transform.baseVal.appendItem(trans);
  //	elem.transform.baseVal.consolidate();
  
  
  
  this.removeTracker();
  for(i=0;i<this.selected.length;i++){
    this.showTracker(this.selected[i]);		
  }
};

Schematic.prototype.flip=function(elem){
  var matrix=this.parseMatrix(elem);
  var box=this.tracker(elem);	
  matrix=matrix.translate(box.width,0);
  matrix=matrix.flipX();
  
  matrix.e=Math.round(matrix.e/this.grid)*this.grid;
  matrix.f=Math.round(matrix.f/this.grid)*this.grid;
  
  elem.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
  this.removeTracker();
  for(i=0;i<this.selected.length;i++){
    this.showTracker(this.selected[i]);		
  }
  
}





//**********************************************************************
////drawing events

Schematic.prototype.deleteSelection = function() {
  this.drag=false;
  if(!this.selected.length)return; 
  /*delete selected nodes*/  
  for(var i=this.selected.length;i>0;i--){
    if(this.selected[i-1].tagName=='g'&&$(this.readwtx(this.selected[i-1],"label")))
      this.remove($(this.readwtx(this.selected[i-1],"label")));
    this.remove(this.selected[i-1]);
    this.selected.pop();
  }
  /*delete all trackers*/
  this.removeTracker();
}


Schematic.prototype.createvalue=function(elem){
  /*create value text if attribute exists*/
  /*the value contains
   * id - the part id
   *value -the part model or value
   *label -the id of the label text
   */
  
  try{
    var id=this.readwtx(elem,"id");
    var value=this.readwtx(elem,"value");
    var label=this.readwtx(elem,"label");
  }
  catch(e){console.log(e);}
  if(label.length && $(label)){
    /*remove all chilnodes*/
    while ($(label).firstChild) {
      $(label).removeChild($(label).firstChild);
    }
    if(id){
      var idspan=this.createtspan(id,0,0);
      $(label).appendChild(idspan);
    }
    if(value){
      var box=this.tracker($(label));
      var valuespan=this.createtspan(value,-box.width,box.height);
      $(label).appendChild(valuespan);
    }
    $(label).appendChild(idspan);
    $(label).appendChild(valuespan);
  }
  else{
    var text=this.createtext("",'black',0,0-this.fontsize);
    this.drawing.appendChild(text);
    var box=this.tracker(text);
    if(id||value){
      if(id){
	var idspan=this.createtspan(id,0,0);
	text.appendChild(idspan);
      }
      if(value){
	var box=this.tracker(text);
	var valuespan=this.createtspan(value,-box.width,box.height);
	text.appendChild(valuespan);
      }
      text.id='value-'+id+"-"+createUUID();
      this.writewtx(elem,"label",text.id);
      text.setAttribute('x',this.parseXY(elem).x-box.width);
      text.setAttribute('y',this.parseXY(elem).y-box.height);
    }
  }
}


Schematic.prototype.select = function(elem) {
  
  this.selected.push(elem);
  if(elem.tagName=='g'){
    try{
      var label=this.readwtx(elem,"label");
    }
    catch(e){
      var label=null;
    }
    if(label){
      if(!$(label))this.createvalue(elem);
    }
  }
  this.showTracker(this.selected[this.selected.length-1]);
  
}


Schematic.prototype.unselect = function() {
  for(var i=this.selected.length;i>0;i--){
    this.selected[i-1]=null;
    this.selected.pop();
  }
  this.removeTracker();
  
}


Schematic.prototype.getpins=function(part){
  var pins=[];
    var nodes = this.getwtxtagname(part,"node");
    var matrix=this.parseMatrix(part);
    for(var j=0;j<nodes.length;j++){
      var point = parent.netlistcreator.matrixxform( {x:this.getwtxattribute(nodes[j],"x"),y:this.getwtxattribute(nodes[j],"y")},matrix);
      pins.push({x:point.x,y:point.y}) ;
    }
  return pins;
}





Schematic.prototype.gettrash=function(garbage,pin){
  var connected=[];
  var nextpin=undefined;
  var lines =$$('#webtronics_drawing > line');
  lines.forEach(function(l){
    var p1={x:l.getAttribute('x1')-0,y:l.getAttribute('y1')-0};
    var p2={x:l.getAttribute('x2')-0,y:l.getAttribute('y2')-0};
    if(garbage.indexOf(l)<0){
      if(this.ispoint(p1,pin)){
	nextpin=p2;
	connected.push(l);
      }
      else if(this.ispoint(p2,pin)){
	nextpin=p1;
	connected.push(l);
      }
    }
  }.bind(this));
  if(connected.length <2){
    garbage=garbage.concat(connected);
    if(nextpin!=undefined)garbage=this.gettrash(garbage,nextpin);
  }

  return garbage;
}
/*
//check if selection rectangle overlaps part
Schematic.prototype.getPart=function(){
  var parts=$$("#webtronics_drawing > g");
  parts.forEach(function(p){
    var rect=this.tracker(p);
    if(rectsIntersect(this.selectionRect,rect)){
 	this.select(p);  
    }
  }.bind(this));

  this.garbage=[];
  this.selected.forEach(function(p){
    var pins=this.getpins(p);
      pins.forEach(function(n){
	 var wires=[];
	 wires=this.gettrash(wires,n);
	 for(var i=0;i<wires.length;i++){
	   var rect=this.tracker(wires[i]);
	   if(!rectInside(this.selectionRect,rect)){
	     this.garbage=this.garbage.concat(wires);
	     break;
	   }
	 }
      }.bind(this));
  }.bind(this));
  var parts=$$("#webtronics_drawing > circle,#webtronics_drawing > text ,#webtronics_drawing > line");
  parts.forEach(function(p){
    var rect=this.tracker(p);
    if(this.garbage.indexOf(p)<0){
    if(rectsIntersect(rect,this.selectionRect)){
	this.select(p);  
    }
    }
    
  }.bind(this));

}
*/

/*check if selection rectangle overlaps part*/
Schematic.prototype.getPart=function(){
  var parts=$$("#webtronics_drawing > *");
  parts.forEach(function(p){
    var rect=this.tracker(p);
    if(rectsIntersect(this.selectionRect,rect)){
 	this.select(p);  
    }
  }.bind(this));
}


Schematic.prototype.realPosition=function(x,y){
  var real=this.svgRoot.createSVGPoint();
  var matrix=this.parseMatrix(this.drawing);
  real.x=(x-matrix.e)/matrix.a;
  real.y=(y-matrix.f)/matrix.a;
  return real;
}




/*mousedown event handler*/
Schematic.prototype.onMouseDown = function(event){
  if(!this.drag){

    var real=this.realPosition(Event.pointerX(event),Event.pointerY(event));
    this.mouseDown.x = real.x;//Math.round(real.x/this.grid) * this.grid;
    this.mouseDown.y = real.y;//Math.round(real.y/this.grid) * this.grid;
    if (this.mode == 'line') {
      if (!Event.isLeftClick(event)){
		    this.remove($("templine1"));
		    this.remove($("templine2"));
				parent.webtronics.setMode('select','Selection');
				return;
      }
			else this.wiresegment();
    }	
    /*clicked on background  in select mode ,remove selection*/
    else if(this.mode=='select'){
      if(Event.isLeftClick(event)){
	this.selectionRect.x=real.x;
	this.selectionRect.y=real.y;
	this.selectionRect.width=0;
	this.selectionRect.height=0;
	/* if there is already a selection rectangle delete it*/
	if(this.selection)this.remove(this.selection);
	this.selection = this.createrect('blue',0.35,real.x,real.y,0,0);
	this.info.appendChild(this.selection);
	for(var i=0;i<this.selected.length;i++){
	  if(rectsIntersect(this.selectionRect,this.tracker(this.selected[i]))){
	    this.garbage.each( function(p){ this.remove(p);}.bind(this));
	    this.drag=true;
	  }
	  
	}
	if(!this.drag){
	  this.unselect();
	}
      }
    }
    else if(this.mode=='text'){
      if(Event.isLeftClick(event)){
	var addtext=parent.document.getElementById('webtronics_add_text');
	if(addtext.style.display == 'none'||addtext.style.display==""){
	  addtext.style.display = "block";
	  addtext.style.left = Event.pointerX(event)+'px';
	  addtext.style.top = Event.pointerY(event)+'px';
	  addtext.value='';
	}
	else{
	  var comment=parent.document.getElementById('webtronics_comment');
	  if(comment.value){
	    var textpos =this.realPosition(addtext.offsetLeft,addtext.offsetTop);
	    this.addtext(comment.value,textpos.x,textpos.y);
	    addtext.hide();
	  }
	  else{
	    addtext.hide();
	  }	
//	  parent.webtronics.setMode('select','Selection');
	}
      }
      
    }

    
  }
  
  return false;
  
}



Schematic.prototype.dragSelection=function(x ,y){
  var floating=$('schematic_floating');
  if(!floating){
    var parts=[];
    floating = document.createElementNS(this.svgNs, 'g');
    for(var i=0;i<this.selected.length;i++){
      parts.push(this.selected[i]);
 
      /*if a part is selected also get label*/
      if(this.selected[i].tagName=='g'){
	var label=this.readwtx(this.selected[i],"label");
	if(label && $(label)){
	  parts.push($(label));
	}
      }
    }
    
    this.removeTracker();
    parts.forEach(function(s){
      this.showTracker(s);
      floating.appendChild(s);}.bind(this)
    );
    var tracked=$$('.schematic_tracker');
    for(var i=0;i<tracked.length;i++)floating.appendChild(tracked[i]);
    floating.setAttributeNS(null, 'id', 'schematic_floating');
    this.info.appendChild(floating);
//      remove lines that are not inside selection
  }
  floating.setAttributeNS(null,'transform','matrix(1,0,0,1,'+x+','+y+')');
  
} 

Schematic.prototype.move = function(shape, x, y) {

  if (shape.tagName == 'line') {
    var x1=shape.getAttributeNS(null,"x1")-0;
    var y1=shape.getAttributeNS(null,"y1")-0;
    var x2=shape.getAttributeNS(null,"x2")-0;
    var y2=shape.getAttributeNS(null,"y2")-0;

    
    shape.setAttributeNS(null, 'x1', x1-0+x);
    shape.setAttributeNS(null, 'y1', y1-0+y);	
    shape.setAttributeNS(null, 'x2', x2-0+x);
    shape.setAttributeNS(null, 'y2', y2-0+y);
  }
  else if(shape.tagName=='circle'){
    var cx=shape.getAttributeNS(null,"cx")-0;
    var cy=shape.getAttributeNS(null,"cy")-0;
    shape.setAttributeNS(null, 'cx', cx+x);
    shape.setAttributeNS(null, 'cy', cy+y);
  }
  else if(shape.tagName == 'g'){
    var matrix=this.parseMatrix(shape);
    /*if the group has no transform create one*/
    if(matrix.a==0&&matrix.b==0&&matrix.c==0&&matrix.d==0){
      shape.setAttributeNS(null,'transform','matrix(1,0,0,1,'+ x +','+ y +')');
    }
    else {
      shape.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+(matrix.e+x)+','+(matrix.f+y)+')');
    }	
    
  }
  else {
    var px=shape.getAttributeNS(null,"x")-0;
    var py=shape.getAttributeNS(null,"y")-0;

    shape.setAttributeNS(null, 'x', px+x);
    shape.setAttributeNS(null, 'y', py+y);
  }
  
}


Schematic.prototype.dropSelection=function(){
  var floating=$('schematic_floating');
  var matrix=this.parseMatrix(floating);

  for(var i=floating.childNodes.length;i>0;i--){
//this aligns the prt to the grid but it won't work if the parts are incorrectly aligned to begin with
		matrix.e=Math.round(matrix.e/this.grid) * this.grid;
		matrix.f=Math.round(matrix.f/this.grid) * this.grid;
		
    /*move other parts*/
    this.move(floating.childNodes[i-1],matrix.e, matrix.f);
    if(floating.childNodes[i-1].getAttribute('class')!='schematic_tracker'){

//snap pins to wires		

/*
    	if(floating.childNodes[i-1].tagName=="g"){
    		this.snaptowire(floating.childNodes[i-1]);
    	}
*/
      this.drawing.appendChild(floating.childNodes[i-1]);
    }
    else {
      this.info.appendChild(floating.childNodes[i-1]);
    }
  }
  this.remove(floating);	
}



Schematic.prototype.onMouseUp = function(event) {
//  if(this.mode=="line")return;
  if(event.isLeftClick(event)){
    //        console.log('mouseup');
    /*hide the menu*/
//     var menu=window.parent.document.getElementById('webtronics_context_menu');
//     if(menu){
//       menu.style.display='none';        
//     }
    this.drag=false;
    if(this.mode=='select'){
    
      var floating=$('schematic_floating');
      if(floating){
			this.dropSelection();
      }
      else{
	this.unselect();
	this.getPart();
      }
      
    }
    else if(this.mode=='rotate'){
      this.mode='select';
    }

    if (this.selection) {
      this.remove(this.selection);
      this.selectionRect.x=0;
      this.selectionRect.y=0;
      this.selectionRect.width=0;
      this.selectionRect.height=0;
    }
    /*skip the mouseup after a rotate*/
  }
  else if(this.mode=="line"){
    var menu=window.parent.document.getElementById('webtronics_context_menu');
    if(menu){
      menu.style.display='none';        
    }
    this.remove($("templine1"));	
    this.remove($("templine2"));
    parent.webtronics.setMode('select','Selection');
  }
  
}


Schematic.prototype.onMouseMove = function(event) {
  
  
  
  if(this.mode=='select'){
    /*clicked inside bounds*/
    
    if(this.drag){
      var real=this.realPosition(Event.pointerX(event),Event.pointerY(event));
      mouseAt={x:0,y:0};
      mouseAt.x = Math.round(real.x);//Math.round(real.x / this.grid) * this.grid;
      mouseAt.y =Math.round(real.y);//Math.round(real.y / this.grid) * this.grid;
      this.dragSelection(mouseAt.x-this.mouseDown.x,mouseAt.y-this.mouseDown.y);

      
    }
    else{
      if (this.selection) {
	
	var real=this.realPosition(Event.pointerX(event),Event.pointerY(event));
	//mouseAt={x:0,y:0};
	//mouseAt.x = Math.round(real.x / this.grid) * this.grid;
	//mouseAt.y =Math.round(real.y / this.grid) * this.grid;
	this.selectionRect.width=real.x-this.selectionRect.x;
	this.selectionRect.height=real.y-this.selectionRect.y;
	if(this.selectionRect.width<0)this.selection.setAttributeNS(null,'x', real.x);
	if(this.selectionRect.height<0)this.selection.setAttributeNS(null,'y',real.y);		
	this.selection.setAttributeNS(null,'width', Math.abs(this.selectionRect.width));
	this.selection.setAttributeNS(null,'height',Math.abs(this.selectionRect.height));
      }
    }
  }
  
  
  
  else if (this.mode=='line'){
		if(!this.onconnector){
    if ($('templine1')){
    	
      var real=this.realPosition(Event.pointerX(event),Event.pointerY(event));
      mouseAt={x:0,y:0};
      mouseAt.x = Math.round(real.x);//Math.round(real.x / this.grid) * this.grid;
      mouseAt.y =Math.round(real.y);//Math.round(real.y / this.grid) * this.grid;

//		if(!this.onconnector){
      
      var x=$('templine1').getAttribute('x1')-0;
      var y=$('templine1').getAttribute('y1')-0;
      
      
      if(Math.abs(x-real.x)>=Math.abs(y-real.y)){
	
			this.resize($('templine1'), x, y, mouseAt.x, y);
			this.remove($('templine2'));	
			var svg = this.createline('blue',2, mouseAt.x, y, mouseAt.x, mouseAt.y);
			svg.setAttribute( 'class',"templine");
			svg.id = 'templine2';
			svg.setAttributeNS(null,'stroke-dasharray','3,2');
			this.info.appendChild(svg);
	
	
      }
      else{
	
	this.resize($('templine1'), x, y, x, mouseAt.y);
	this.remove($('templine2'));	
	var svg = this.createline('blue',2, x, mouseAt.y, mouseAt.x, mouseAt.y);
	svg.setAttribute( 'class',"templine");
	svg.id = 'templine2';
	svg.setAttributeNS(null,'stroke-dasharray','3,2');
	this.info.appendChild(svg);
	
      }
      
    }
    }
  }
}

Schematic.prototype.onWheel=function(event){
//this function is very clunky
//And very tough to figure out
  if(Event.element(event)!=this.svgRoot){
    this.changeobserver.disconnect();
    var scale=1;
    var wheel=0;
    if(event.wheelDelta)wheel=-event.wheelDelta/-120;
    else wheel=event.detail;
    var matrix = this.parseMatrix(this.drawing);
    //var real=this.realPosition(Event.pointerX(event),Event.pointerY(event));
 	  var window={x:event.clientX,y:event.clientY};
 	  var offsetx=((this.container.offsetWidth/2)-window.x)/2;
    var offsety=((this.container.offsetHeight/2)-window.y)/2;

    if(wheel>0&&matrix.a<2){
      scale=1.04;
    }
    else if(wheel<0&&matrix.a>0.3){
      scale=0.96;
	  }

    matrix=matrix.scale(scale);
		matrix=matrix.translate(offsetx,offsety);	

// 		matrix.e=matrix.a<1?offsetx*matrix.a:offsetx/matrix.a;
//    matrix.f=matrix.a<1?offsety*matrix.a:offsety/matrix.a;

    
    this.drawing.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
    this.background.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
    this.info.setAttributeNS(null,'transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
    this.changeobserver.observe(this.drawing, { attributes: true, childList: true, characterData: true ,subtree:true});    
	  Event.stop(event);
    }	

}
//**********************************************************************
///file io



Schematic.prototype.svgSize=function(){
  var matrix=this.parseMatrix(this.drawing);
  this.drawing.removeAttribute('transform');
  var svgsize=this.tracker(this.drawing);
  this.drawing.setAttribute('transform','matrix('+matrix.a+','+matrix.b+','+matrix.c+','+matrix.d+','+matrix.e+','+matrix.f+')');
  return svgsize;
  
}


Schematic.prototype.shrink=function(elem){
//fix empty space display 
//maybe add a border like a blueprint?        




}

Schematic.prototype.getDoc = function(shrink,inv) {
  //need to remove the matrix to get the right size
    var doc= document.implementation.createDocument("", "", null);
    var floating= document.createElementNS(this.svgNs, 'g');
    this.info.appendChild(floating);  
    var svg = doc.createElementNS(this.svgNs, "svg");
    if(inv){
      var style=doc.createElementNS(this.svgNs,"style");
      style.setAttribute('type',"text/css");
      style.appendChild(doc.createCDATASection("g,rect,line{fill:black;stroke:white;}"+
      "circle,text{fill:white;stroke:white;}"));
      svg.appendChild(style);
    }

    var bg=doc.createElementNS(this.svgNs,'rect');
    bg.setAttribute('x',0);
    bg.setAttribute('y',0);
    bg.setAttribute('fill','white');
    svg.appendChild(bg);
    var svgsize=this.svgSize();
//remove whitespace
    for(var ch=0;ch<this.drawing.childNodes.length;ch++){

      var part=this.drawing.childNodes[ch].cloneNode(true);
      floating.appendChild(part);
      if(shrink)this.move(part,10-svgsize.x,10-svgsize.y);

    }
    for(var ch=0;ch<floating.childNodes.length;ch++){
        var node=floating.childNodes[ch].cloneNode(true);
        svg.appendChild(node);
    }
    

    if(shrink){
        bg.setAttribute('width',svgsize.width-svgsize.x+20+'px');
        bg.setAttribute('height',svgsize.height-svgsize.y+20+'px');
        svg.setAttribute('width',svgsize.width-svgsize.x+20+'px');
        svg.setAttribute('height',svgsize.height-svgsize.y+20+'px');
    }
    else{
        bg.setAttribute('width',svgsize.width+10+'px');
        bg.setAttribute('height',svgsize.height+10+'px');
        svg.setAttribute('width',svgsize.width+10+'px');
        svg.setAttribute('height',svgsize.height+10+'px');
    }
    doc.appendChild(svg);   
    this.remove(floating);	
    return doc;
}





Schematic.prototype.getparttype=function(elem){
  return this.readwtx(elem,"type");
}

/*change id for part group only*/
Schematic.prototype.changeid=function(elem){
  var type=this.getparttype(elem);
  var id=type +'-'+ createUUID();
  if($(id)){
    this.changeid(elem);
  }
  else this.writewtx(elem,"id",id);
}



Schematic.prototype.getgroup =function(elem){
  if(this.drag)return;
  this.unselect();
  var newelem=document.importNode(elem,true);
  elem.parentNode.appendChild(newelem);
  //this.drawing.appendChild(newelem);
  //hide selection  box
  this.mouseDown.x=this.svgRoot.getAttribute("width");
  this.mouseDown.y=this.svgRoot.getAttribute("height");
  newelem.setAttributeNS(null,'transform','matrix(1,0,0,1,'+this.mouseDown.x+','+this.mouseDown.y+')');
  this.readwtx(newelem,"value"); 
  this.select(newelem);
  //        this.changeid(this.selected[0]);
  this.drag=1;
}


Schematic.prototype.getfile =function(elem){
  this.unselect();
  ch=elem.childNodes;
  for(var i= ch.length;i>0;i--){
    /*only open these nodes*/
    //add wire events
    /*get rid  of empty text*/
    if(ch[i-1].tagName=='circle'||
      ch[i-1].tagName=='line'||
      (ch[i-1].tagName=='text'&&ch[i-1].childNodes.length&&(ch[i-1].id.split("-",1)!='value')))
    {
      var newelem	= document.importNode(ch[i-1],true);
      this.drawing.appendChild(newelem);
      this.select(newelem);
    }
    
    else if(ch[i-1].tagName=='g'){
      var c=ch[i-1].getElementsByTagName('*');
      for(var j=0;j<c.length;j++)c[j].removeAttribute('id');
      var label=this.readwtx(ch[i-1],"label");
      if(label!=null){
	if($(label)){
	  console.log("id taken");           
	}
	else{
	  
	  var oldvalue = ch[i-1].ownerDocument.getElementById(label);
	  if(oldvalue!=null){
	    var newvalue= document.importNode(oldvalue,true);
	    newvalue.id=label;		
	    this.drawing.appendChild(newvalue);
	  }
	}
      }
      var newelem= document.importNode(ch[i-1],true);
      this.drawing.appendChild(newelem);
      this.select(newelem);
    }
  }
  
  
}


Schematic.prototype.copy=function(){
  var buffer=[];
  for(var i=0;i<this.selected.length;i++){
    var svgnode=this.selected[i].cloneNode(true);
    buffer.push(svgnode);
  }
  return buffer;
}

Schematic.prototype.paste=function(elem){
  if(this.drag)return;
  if(elem){
    //change ids first
    for(var i=0;i<elem.length;i++){
      if(elem[i].tagName==='g'){
	var label=this.readwtx(elem[i],"label");
	do{
	  var type=this.getparttype(elem[i]);
	  var id=type+'-'+ createUUID();
	}while($(id));
	this.readwtx(elem[i],"label");
	for(var j=0;j<elem.length;j++){
	  if(elem[j].id==label){
	    elem[j].id=this.readwtx(elem[i],"label");
	    break;      
	  }
	}
      }
    }
    
    this.unselect();
    //		this.mouseDown.x=this.svgRoot.getAttribute("width");
    //		this.mouseDown.y=this.svgRoot.getAttribute("height");
    var newelems=[];
    for(var i=0 ;i<elem.length;i++){
      newelems[i]=elem[i].cloneNode(true);
      this.drawing.appendChild(newelems[i]);
    }
    for(var i=0;i<newelems.length;i++){
      this.select(newelems[i])
    }
    this.drag=1;
  }
}
Schematic.prototype.getwtxtagname=function(elem,tagname){
  
  
  var tag=elem.getElementsByTagName("wtx:"+tagname);
  if(!tag.length){
    tag=elem.getElementsByTagName(tagname);
  }
  if(!tag.length){
    tag=elem.getElementsByTagNameNS(this.wtxNs,tagname);
  }
  if(!tag.length){
    tag=elem.getElementsByTagNameNS("*",tagname);
  }
  return tag;
  
}

Schematic.prototype.getwtxattribute=function(elem,attrib){
  var value=elem.getAttribute(attrib);
  if(value==undefined)value=elem.getAttributeNS(this.wtxNs,attrib);
  if(value==undefined)value=elem.getAttributeNS("*",attrib);
  
  return value;
}

Schematic.prototype.readwtx=function(elem,value){
  var tag=this.getwtxtagname(elem,value);
  if(tag[0])return tag[0].textContent;
  else return "";
}

Schematic.prototype.writewtx=function(elem,value,text){
  var tag=this.getwtxtagname(elem,value);
  if(tag[0])tag[0].textContent=text;
}

//****************************************************************
////utilities
function rectsIntersect(r1, r2) {
  
  return			((r2.width>0)?(r2.x):(r2.x+r2.width)) < ((r1.width>0)?(r1.x+r1.width):(r1.x)) &&
  ((r2.width>0)?(r2.x+r2.width):(r2.x)) > ((r1.width>0)?(r1.x):(r1.x+r1.width)) &&
  ((r2.height>0)?(r2.y):(r2.y+r2.height)) < ((r1.height>0)?(r1.y+r1.height):(r1.y)) &&
  ((r2.height>0)?(r2.y+r2.height):(r2.y)) > ((r1.height>0)?(r1.y):(r1.y+r1.height));
};

function rectInside(r1 ,r2){
//is r2 inside r1 
  return  r1.x<r2.x && r1.y< r2.y && r1.x+r1.width > r2.x+r2.width && r1.y+r1.height >r2.y+r2.height;
  
  
}



