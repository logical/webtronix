Schematic.prototype.connect =function(line,x,y){
var x1=line.getAttributeNS(null,"x1")-0;
var x2=line.getAttributeNS(null,"x2")-0;
var y1=line.getAttributeNS(null,"y1")-0;
var y2=line.getAttributeNS(null,"y2")-0;
this.remove(line);
this.wireevents(this.createline('black',2,x1,y1,x,y));
this.wireevents(this.createline('black',2,x,y,x2,y2));
if($('templine1')){
x1=$('templine1').getAttributeNS(null,'x1');
y1=$('templine1').getAttributeNS(null,'y1');
x2=$('templine1').getAttributeNS(null,'x2');
y2=$('templine1').getAttributeNS(null,'y2');
var svg=this.createline('black',2, x1, y1,x2, y2);
this.wireevents(svg);
this.drawing.appendChild(svg)
}
if($("templine2")){
x1=$('templine2').getAttributeNS(null,'x1');
y1=$('templine2').getAttributeNS(null,'y1');
x2=$('templine2').getAttributeNS(null,'x2');
y2=$('templine2').getAttributeNS(null,'y2');
var svg=this.createline('black',2, x1, y1,x2, y2);
this.wireevents(svg);
this.drawing.appendChild(svg)
}
    this.remove($("templine1"));
    this.remove($("templine2"));
}
/*
	Event.observe(circle,"mouseover",function(){
	  var data = $A(arguments);
	  data.shift();							
		this.onconnector=true;
		if(this.mode=='line'){	
			var x=data[0].getAttribute("cx");
			var y=data[0].getAttribute("cy");
	  	var line1=$("templine1");
			var line2=$("templine2")
	  	var l1x1=line1.getAttribute("x1");
	  	var l1x2=line1.getAttribute("x2");
//	  	var l2y2=line2.getAttribute("y2");
	  
//	  horizontal x2
      if(l1x1 != l1x2){
      	line1.setAttribute("x2",x);
      	line2.setAttribute("x1",x);
      	line2.setAttribute("x2",x);
      	line2.setAttribute("y2",y);

      	
      }
      else {
      	line1.setAttribute("y2",y);

      	line2.setAttribute("y1",y);
      	line2.setAttribute("y2",y);
      	line2.setAttribute("x2",x);
   		}

		}

	  data[0].setAttribute('visibility','visible');
	}.bindAsEventListener(this,circle));

	Event.observe(circle,"mouseout",function(){
		this.onconnector=false;
	  if(!this.connections){
	    var data = $A(arguments);
	    data.shift();							
	    data[0].setAttribute('visibility','hidden');
	  }
	}.bindAsEventListener(this,circle));

	Event.observe(circle,"mousedown",function(){
	  var data = $A(arguments);
	  data.shift();							
	  if(this.mode=='select'){
	    parent.webtronics.setMode('line','Wire');
	    var svg = this.createline('blue',2, data[0], data[1], data[0], data[1]);
	    svg.id = 'templine1';
	    svg.setAttributeNS(null,'stroke-dasharray','3,2');
	    this.info.appendChild(svg);
	  }
	  else{
 	    this.wiresegment();
	    this.wiresegment();
	    
	    this.remove($("templine1"));
	    parent.webtronics.setMode('select','Selection');
	  }
	}.bindAsEventListener(this,parts[i].analogpins[j].x,parts[i].analogpins[j].y));
*/
Schematic.prototype.maketerminal=function(wire){
	    var circle=this.createdot('red',0,0,5);
	    circle.setAttribute("pointer-events","all");
	    circle.setAttributeNS(null, 'fill-opacity', .35);
	    circle.setAttribute('visibility','hidden');



	    Event.observe(circle,"mouseout",function(){
		  var data = $A(arguments);
		  data.shift();							
			this.onconnector=false;
		  data[0].setAttribute('visibility','hidden');
	    }.bindAsEventListener(this,circle));

/*this makes sure dots are not shown when not moused over*/

	    Event.observe(circle,"mouseover",function(){
		  var data = $A(arguments);
		  data.shift();	
		  this.onconnector=true;
		if(this.mode=='line'){	
			var x=data[0].getAttribute("cx");
			var y=data[0].getAttribute("cy");
	  	var line1=$("templine1");
			var line2=$("templine2")
			if(line1==null)return;
	  	var l1x1=line1.getAttribute("x1");
	  	var l1x2=line1.getAttribute("x2");

//this locks the templine onto the dot	  
//	  horizontal x2
      if(l1x1 != l1x2){
      	line1.setAttribute("x2",x);
				if(line2){
	      	line2.setAttribute("x1",x);
  	    	line2.setAttribute("x2",x);
  	    	line2.setAttribute("y2",y);
				}
      	
      }
      else {
      	line1.setAttribute("y2",y);
				if(line2){
	      	line2.setAttribute("y1",y);
  	    	line2.setAttribute("y2",y);
  	    	line2.setAttribute("x2",x);
				}
   		}

		}		  data[0].setAttribute('visibility','visible');
	    }.bindAsEventListener(this,circle));
	    

	    Event.observe(circle,"mousedown",function(e){
	      var data = $A(arguments);
	      data.shift();
				var x=data[0].getAttribute("cx");
				var y=data[0].getAttribute("cy");
	      var dots=$$("#webtronics_drawing > circle");
					var found=false;
/*
			    for(var i=0;i<dots.length;i++){
			    	if((Math.abs(dots[i].getAttribute("cx")-x)<5)&&(Math.abs(dots[i].getAttribute("cy")-y)<5)){
							x=dots[i].getAttribute("cx");
							y=dots[i].getAttribute("cy");	
							found=true;
							break;
			      }
					}
*/
//	      	if(!found){
	      		if(data[1]!=null){
		      		this.drawing.appendChild(this.createdot('black',x,y,3));
		      		this.connect(data[1],x,y);
					}
//				}
				if(this.mode=='select'){

					parent.webtronics.setMode('line','Wire');
					var svg = this.createline('blue',2, x, y, x, y);
					svg.setAttribute( 'class',"templine");
					svg.id = 'templine1';
					svg.setAttributeNS(null,'stroke-dasharray','3,2');
					this.info.appendChild(svg);
				}
				else{
					this.wiresegment();
					this.wiresegment();
				
					this.remove($("templine2"));
					this.remove($("templine1"));
					parent.webtronics.setMode('select','Selection');
				}
	    }.bindAsEventListener(this,circle,wire));
			return circle;
}

Schematic.prototype.wireevents=function(svg){
	this.drawing.appendChild(svg);
	
	var x1=svg.getAttributeNS(null,'x1');
	var y1=svg.getAttributeNS(null,'y1');
	var x2=svg.getAttributeNS(null,'x2');
	var y2=svg.getAttributeNS(null,'y2');


//	extra wide line to help capture events
	var eventline = this.createline('blue',5, x1, y1,x2,y2);
	eventline.setAttribute('class',"webtronics_schematic_wire_eventline");
	eventline.setAttribute("pointer-events","all");
	eventline.setAttribute('visibility','hidden');
 	this.info.appendChild(eventline);
//each line has one terminal


			


	
  //line to make connections
	Event.observe(eventline,"mouseover",function(e){
//	    var connector=$$('#information > .webtronics_schematic_wire_connector');
//	    for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);
	    if(!this.drag){
			
	    var real=this.realPosition(Event.pointerX(e),Event.pointerY(e));
	    var x = real.x;//Math.round(real.x/this.grid) * this.grid;
	    var y =real.y;//Math.round(real.y/this.grid) * this.grid;

			var lx1=svg.getAttribute("x1");
			var lx2=svg.getAttribute("x2");
			if(lx1==lx2){
				x= lx1;
				if($("templine2"))y = $("templine2").getAttribute("y1");
				else if($("templine1"))y = $("templine1").getAttribute("y1");
				//else var y= real.y;
				}
			else {
				if($("templine2"))x = $("templine2").getAttribute("x1");
				else if($("templine1"))x = $("templine1").getAttribute("x1");
				//else var x= real.x;
				y=svg.getAttribute("y2");
			}
		  var terminal=this.maketerminal(eventline);
				terminal.setAttribute('class',"webtronics_wire_terminal");
				this.info.appendChild(terminal);
	   	terminal.setAttribute("cx",x);
	    terminal.setAttribute("cy",y);
 
	  }
	  
	}.bindAsEventListener(this));

 
}

Schematic.prototype.addconnects=function(){
 this.changeobserver.disconnect();

  this.removeconnects();
  var parts=parent.netlistcreator.getwtxdata($$('#webtronics_drawing > g'));
  //this.connectnamewires(parts);
  for(var i=0 ;i<parts.length;i++){
    if(parts[i].analogpins!=undefined)for(var j=0;j<parts[i].analogpins.length;j++){

		var terminal=this.maketerminal(null);
		terminal.setAttribute('class',"webtronics_part_terminal");
		terminal.setAttribute("cx",parts[i].analogpins[j].x);
		terminal.setAttribute("cy",parts[i].analogpins[j].y);
		this.info.appendChild(terminal);

    }
    
    
//    if(parts[i].digitalpins!=undefined)for(var j=0;j<parts[i].digitalpins.length;j++){
//    }
  }
//clean up lines while i'm at it    
  var lines=$$("#webtronics_drawing > line");

  for(var i=0;i<lines.length;i++){

    if(lines[i].getAttributeNS(null,'x1')==lines[i].getAttributeNS(null,'x2') && lines[i].getAttributeNS(null,'y1')==lines[i].getAttributeNS(null,'y2')){
      this.remove(lines[i]);
		}
    else this.wireevents(lines[i]);

    
  }
  this.hideconnects();  
  this.changeobserver.observe(this.drawing, { attributes: true, childList: true, characterData: true ,subtree:true});

  
}

Schematic.prototype.connect=function(line,x,y){

  

    var x1=line.getAttributeNS(null,"x1")-0;                       
    var x2=line.getAttributeNS(null,"x2")-0;                       
    var y1=line.getAttributeNS(null,"y1")-0;                       
    var y2=line.getAttributeNS(null,"y2")-0;                       
   this.remove(line);
    this.wireevents(this.createline('black',2,x1,y1,x,y));
    this.wireevents(this.createline('black',2,x,y,x2,y2));

    if($('templine1')){  
      x1=$('templine1').getAttributeNS(null,'x1');
      y1=$('templine1').getAttributeNS(null,'y1');
      x2=$('templine1').getAttributeNS(null,'x2');
      y2=$('templine1').getAttributeNS(null,'y2');
      var svg=this.createline('black',2, x1, y1,x2, y2);
      this.wireevents(svg);
      this.drawing.appendChild(svg)
    }
    if($("templine2")){
      x1=$("templine2").getAttributeNS(null,'x1');
      y1=$("templine2").getAttributeNS(null,'y1');
      x2=$("templine2").getAttributeNS(null,'x2');
      y2=$("templine2").getAttributeNS(null,'y2');
      var svg=this.createline('black',2, x1, y1,x2, y2);
      this.wireevents(svg);
      this.drawing.appendChild(svg)
    }

    this.remove($("templine1"));
    this.remove($("templine2"));
  
  
}

Schematic.prototype.snaptowire=function(part){
	var pins=this.getpins(part);
	
	var wires=$$( "#webtronics_drawing > line" );

	for(var i=0;i<wires.length;i++){

		var x1=wires[i].getAttribute("x1");
		var y1=wires[i].getAttribute("y1");	
		var x2=wires[i].getAttribute("x2");
		var y2=wires[i].getAttribute("y2");	
		for(var j=0;j<pins.length;j++){
			if((Math.abs(x1-pins[j].x)<5)&&(Math.abs(y1-pins[j].y)<5)){
				this.move(part,x1-pins[j].x, y1-pins[j].y);
				return;
				}
			if((Math.abs(x2-pins[j].x)<5)&&(Math.abs(y2-pins[j].y)<5)){
				this.move(part,x2-pins[j].x, y2-pins[j].y);
				return ;
			}			
	
		}
	
	}

	return {x:0,y:0};


}



Schematic.prototype.wiresegment=function(){
      if($('templine1')){
	/*create line*/
	var x1=$('templine1').getAttributeNS(null,'x1');
	var y1=$('templine1').getAttributeNS(null,'y1');
	var x2=$('templine1').getAttributeNS(null,'x2');
	var y2=$('templine1').getAttributeNS(null,'y2');
	if(!(x1==x2&&y1==y2)){
	  var svg=this.createline('black',2, x1, y1,x2, y2);
	  
	 this.drawing.appendChild(svg);
  
	  this.wireevents(svg);
	  this.remove($('templine1'));
	  if($('templine2'))$('templine2').id='templine1';					
	  else{
	    svg = this.createline('blue',2, x2, y2,x2,y2);
			svg.setAttribute( 'class',"templine");
	    svg.id = 'templine1';
	    svg.setAttributeNS(null,'stroke-dasharray','3,2');
	    this.info.appendChild(svg);
	  }					
	}
      }
}

Schematic.prototype.showconnects=function(elem,pin){
  var connector=$$('#information > .webtronics_part_terminal')
  for(var i=0;i<connector.length;i++){
	connector[i].setAttribute('visibility','visible');
  }
}

Schematic.prototype.hideconnects=function(){
  var connector=$$('#information > .webtronics_part_terminal')
  for(var i=0;i<connector.length;i++){
	connector[i].setAttribute('visibility','hidden');
  }
}


Schematic.prototype.removeconnects=function(){
  
  var connector=$$('#information > .webtronics_wire_terminal , #information > .webtronics_part_terminal,#information > .webtronics_schematic_wire_eventline ')
  for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);
}

  


