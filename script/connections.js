
Schematic.prototype.matrixxform=function(point,matrix){
  var pin=this.svgRoot.createSVGPoint();
  pin.x=point.x;
  pin.y=point.y;
  pin=pin.matrixTransform(matrix);
  return {x:Math.round(pin.x),y:Math.round(pin.y)};
}

/*tests if 2 point are within 3 pixels of each other*/
Schematic.prototype.ispoint=function(point1,point2){
  return (Math.abs(point2.x-point1.x)<3)&&(Math.abs(point2.y-point1.y)<3); 
}

Schematic.prototype.sortnetlist=function(list){
  var G=[];
  var A=[];
  var B=[];
  var C=[];
  var D=[];
  var I=[];
  var J=[];
  var K=[];
  var L=[];
  var M=[];
  var N=[];
  var P=[];
  var Q=[];
  var R=[];
  var U=[];
  var V=[];
  var wire=[];
  var other=[]
  for(var i=0;i<list.length;i++){
    if(list[i].type=='gnd'){
      G.push(list[i]);
    }
    else if(list[i].type=='v'){
      V.push(list[i]);
    }
    else if(list[i].type=='wire'){
      wire.push(list[i]);			
    }		
    else if(list[i].type=='b'){
      B.push(list[i]);
    }
    else if(list[i].type=='c'){
      C.push(list[i]);	
    }
    else if(list[i].type=='d'){
      D.push(list[i]);
    }
    else if(list[i].type=='i'){	
      J.push(list[i]);
    }
    else if(list[i].type=='j'){	
      J.push(list[i]);
    }
    else if(list[i].type=='k'){
      K.push(list[i]);
    }
    else if(list[i].type=='l'){
      L.push(list[i]);
    }
    else if(list[i].type=='m'){
      M.push(list[i]);
    }
    else if(list[i].type=='n'){
      N.push(list[i]);
    }
    else if(list[i].type=='plot'){
      P.push(list[i]);
    }
    else if(list[i].type=='q'){
      Q.push(list[i]);
    }
    else if(list[i].type=='r'){
      R.push(list[i]);
    }
    else if(list[i].type=='u'){	
      U.push(list[i]);
    }
    /* this is the best way I could think to tell if a part i digital */
    else if(list[i].category=="digital"){	
      A.push(list[i]);
    }
    else {
      list[i].error='unknown device';
      other.push(list[i]);
    }
  }
  
  var sortfunction=function(a,b){
    var apart=a.id.replace(a.type,"");
    var bpart=b.id.replace(b.type,"");
    if(!apart)apart=0;
    if(!bpart)bpart=0;
    return (apart>bpart);
  };
  V.sort(sortfunction);
  wire.sort(sortfunction);
  B.sort(sortfunction);
  C.sort(sortfunction);
  D.sort(sortfunction);
  I.sort(sortfunction);
  J.sort(sortfunction);
  K.sort(sortfunction);
  L.sort(sortfunction);
  M.sort(sortfunction);
  N.sort(sortfunction);
  P.sort(sortfunction);
  Q.sort(sortfunction);
  R.sort(sortfunction);
  U.sort(sortfunction);
  A.sort(sortfunction);
  
  var newlist=[];
  G.each(function(item){newlist.push(item)});		
  G.reverse();
  V.each(function(item){newlist.push(item)});		
  wire.each(function(item){newlist.push(item)});		
  B.each(function(item){newlist.push(item)});		
  C.each(function(item){newlist.push(item)});		
  D.each(function(item){newlist.push(item)});		
  I.each(function(item){newlist.push(item)});		
  J.each(function(item){newlist.push(item)});		
  K.each(function(item){newlist.push(item)});		
  L.each(function(item){newlist.push(item)});		
  M.each(function(item){newlist.push(item)});		
  N.each(function(item){newlist.push(item)});		
  Q.each(function(item){newlist.push(item)});		
  R.each(function(item){newlist.push(item)});		
  U.each(function(item){newlist.push(item)});		
  A.each(function(item){newlist.push(item)});		
  other.each(function(item){newlist.push(item)});		
  
  /*plots go last*/
  P.each(function(item){newlist.push(item)});		
  return newlist;
}

/* draws wires to namewire ports with the same id*/
Schematic.prototype.connectnamewires=function(list){
  
  for(var i=0;i<list.length;i++){
    if((list[i].type=="wire") || (list[i].type=="gnd")){
      for(var j=i;j<list.length;j++){
	if( (list[i]!=list[j]) && ((list[i].id==list[j].id) || (list[i].type=="gnd" && list[j].type=="gnd"))   ){
	  var line= this.createline('yellow',1,list[i]['analogpins'][0]['x'],list[i]['analogpins'][0]['y'],list[j]['analogpins'][0]['x'],list[j]['analogpins'][0]['y']);
	  line.setAttributeNS(null,'class','webtronics_namewire_connector');
	  this.info.appendChild(line);
	  //console.log(line);            
	  break; 
	}
      }    
    }
  }
}

/*check for vectors and convert them*/
Schematic.prototype.tovector=function(pin,nodenumber){
  var v ="";   
  if(pin.parentNode.tagName=="wtx:vector"){
    var vector=Element.descendants(pin.parentNode);
    if(pin==vector[0]){v+="["}
    v+="a"+nodenumber;
    if(pin==vector[vector.length-1]){v+="]";}
  }
  else{
    v+="a"+nodenumber;
  }
  
  return v;
}

/*
 *    <wtx:pins>
 *		<wtx:analog>
 *		  <wtx:node index="1" x="0" y="10"></wtx:node>
 *		  <wtx:node index="2" x="40" y="10"></wtx:node>
 *		</wtx:analog>
 *    </wtx:pins>
 *    <wtx:id>r</wtx:id>
 *    <wtx:type>r</wtx:type>
 *    <wtx:name>testresistor</wtx:name>
 *    <wtx:category>resistors</wtx:category>
 *    <wtx:value></wtx:value>
 *    <wtx:label></wtx:label>
 *    <wtx:spice></wtx:spice>
 *    <wtx:flip></wtx:flip>
 *    <wtx:model></wtx:model>
 */


Schematic.prototype.getwtxdata=function(parts){
  list=[];
  for(var i=0;i<parts.length;i++){
    var part={error:"", elem:{}, analogpins:[],digitalpins:[],type:"", name:"", category:"", value:"", spice:"", model:"",measure:""}
    /*
     *        try{
     *            part.nodes=this.getwtxpins(part[i]);        
  }
  catch{part.error="wtx:pins not found"}
  */
    part.elem=parts[i];
    try{
      var category=this.getwtxtagname(parts[i],"analog")[0];
      var nodes = this.getwtxtagname(category,"node");
      for(var j=0;j<nodes.length;j++){
	var point = this.matrixxform( {x:this.getwtxattribute(nodes[j],"x"),y:this.getwtxattribute(nodes[j],"y")},this.parseMatrix(part.elem));
	part.analogpins.push({index:this.getwtxattribute(nodes[j],"index"),x:point.x,y:point.y,node:undefined}) ;
      }
      //sort nodes int correct order
      part.analogpins.sort(function(a,b){if (a.name > b.name)return 1;if (a.name < b.name)return -1;return 0;});
    }
    catch(e){}
    
    try{
      var category=this.getwtxtagname(parts[i],"digital")[0];
      var nodes = this.getwtxtagname(category,"node");
      for(var j=0;j<nodes.length;j++){
	var point = this.matrixxform( {x:this.getwtxattribute(nodes[j],"x"),y:this.getwtxattribute(nodes[j],"y")},this.parseMatrix(part.elem));
	part.digitalpins.push({index:this.getwtxattribute(nodes[j],"index"),x:point.x,y:point.y,node:undefined}) ;
      }
      part.digitalpins.sort(function(a,b){if (a.name > b.name)return 1;if (a.name < b.name)return -1;return 0;});
    }
    catch(e){}
    try{
      part.id=this.readwtx(parts[i],'id');
    }
    catch(e){part.error="wtx:id not found";}    
    try{
      part.type=this.readwtx(parts[i],'type');
    }
    catch(e){
      part.error="wtx:type not found";
    }
    try{
      part.name=this.readwtx(parts[i],'name');
    }
    catch(e){part.error="wtx:name not found";}
    try{
      part.category=this.readwtx(parts[i],'category');
    }
    catch(e){part.error="wtx:category not found";}    
    try{
      part.value=this.readwtx(parts[i],'value');
    }
    catch(e){part.error="wtx:value not found";}    
    try{
      part.spice=this.readwtx(parts[i],'spice');
    }
    catch(e){part.error="wtx:spice not found";}    
    try{        
      part.model=this.readwtx(parts[i],'model');
    }
    catch(e){part.error="wtx:model not found";}    
    //special tag for parts that do simulation
    try{        
      part.measure=this.readwtx(parts[i],'measure');
    }
    catch(e){}    
    
    list.push(part);
  }
  return list;
  
}
/*detect analog and digital mix*/
Schematic.prototype.mixedsignals=function(analogwires,digitalwires){
  
  for(var j=1;j<analogwires.length;j++){
    var crossed=this.getconnected(digitalwires,analogwires[j]);
    if(crossed>-1){
      return true;  
    }
  }
  return false;
}

/* test if wires are connected anywhere*/
Schematic.prototype.getconnected=function(wirelist,wire){
  for(var i=0;i<wirelist.length;i++){
    for(var j=0;j<wirelist[i].length;j++){
      for(var k=0;k<wire.length;k++){
	if(this.ispoint(wirelist[i][j],wire[k])){
	  return i;
	}
      }
    }
  }
  return -1;
}

//returns points connected by lines
//it is recursive and should be called with NULL for wires
Schematic.prototype.followwires=function(wires,pin){
  if(wires==null)wires=[];
  var points=[];
  points.push(pin);	
  var lines =$$('#webtronics_drawing > line, #information > .webtronics_namewire_connector');
  for(var i =0 ;i<lines.length;i++){
    var point1={x:lines[i].getAttribute('x1')-0,y:lines[i].getAttribute('y1')-0};
    var point2={x:lines[i].getAttribute('x2')-0,y:lines[i].getAttribute('y2')-0};
    if(wires.indexOf(lines[i])<0){		
      if(this.ispoint(point1,pin)){
	wires.push(lines[i]);
	var p=this.followwires(wires,point2);
	for(var j=0;j<p.length;j++)points.push(p[j]);				
      }
      else if(this.ispoint(point2,pin)){
	wires.push(lines[i]);
	var p=this.followwires(wires,point1);
	for(var j=0;j<p.length;j++)points.push(p[j]);				
      }
    }
  }
  return points;
}



//sets the node numbers for parts
Schematic.prototype.numberwires=function(parts){
  var analogpoints=[];
  var digitalpoints=[];
  for(var i=0;i<parts.length; i++){
    //analog node numbering loop
    if(parts[i].type=="wire")continue;

    if( parts[i].type=="gnd"){
      if (analogpoints.length==0 ){
	var wire=this.followwires(null,{x:parts[i].analogpins[0]['x'],y:parts[i].analogpins[0]['y']});
	analogpoints.push(wire);
//add this node to thelist of digital wires
	digitalpoints.push(wire);
      }
      parts[i].analogpins[0]["node"]=0;
//      parts[i].digitalpins[0]["node"]=0;
      continue;
    }
    if(parts[i].analogpins!=undefined){
      for(var j=0;j<parts[i].analogpins.length;j++){
	var wire=this.followwires(null,{x:parts[i].analogpins[j]['x'],y:parts[i].analogpins[j]['y']});
	var found=this.getconnected(analogpoints,wire);
	if(found<0){
	  analogpoints.push(wire);
	  parts[i].analogpins[j]["node"]=analogpoints.length-1;
	}
	else{
	  parts[i].analogpins[j]["node"]=found;
	}
      }
    }
    //digital node numbering loop
    
    if(parts[i].digitalpins!=undefined){
      for(var j=0;j<parts[i].digitalpins.length;j++){
	var wire=this.followwires(null,{x:parts[i].digitalpins[j]['x'],y:parts[i].digitalpins[j]['y']});
	var found=this.getconnected(digitalpoints,wire);
	if(found<0){
	  digitalpoints.push(wire);
	  parts[i].digitalpins[j]["node"]=digitalpoints.length-1;
	}
	else{
	  parts[i].digitalpins[j]["node"]=found;
	}
      }	
    }
  }
  //returns true if digital and analog are mixed
  return this.mixedsignals(analogpoints,digitalpoints);
}  



/* creates all netlist data from parts data*/
Schematic.prototype.getnodes=function(parts){
  var sections={netlist:[],coupling:[],firstdir:[],simulation:[],lastdir:[]};    
  
  //if(this.numberwires(parts))return {firstdir:[],netlist:[{error:"pin is both analog and digital"}],lastdir:[],plot:[]};
  this.numberwires(parts);
  for(var i=0;i<parts.length; i++){
    //    if(parts[i].type=="wire")continue;
    // check what type of simulation to use
    if(parts[i].type=='gnd' || parts[i].type=='wire')continue;
    if(parts[i].type=="plot"){
	if(sections.simulation.length==0){
	  sections.simulation.push(".op");
	  sections.simulation.push(".print tran");
	}
	if(sections.simulation[1] !=undefined && sections.simulation[1].match(/\.print\sac/g)==null){
	  sections.simulation[1]+=" v("+parts[i].analogpins[0]["node"]+")";
	  sections.simulation[1]+=" "+parts[i].measure;
	  if(parts[i].model)sections.simulation.push(parts[i].model);
	}
	
      
    }
    else{
      if(parts[i].type=="v"){
	if(sections.simulation.length==0 && parts[i].model.length){
	  sections.simulation.push(".op");
	  sections.simulation.push(".print ac "+parts[i].measure);
	  sections.simulation.push(parts[i].model);
	}
      }
      else if(parts[i].type=="l"){
	if(parts[i].model.length){
	    sections.coupling.push(parts[i].model);  
	}
      }
      else{
	if(parts[i].model.match(/\.mod/i) && !parts[i].id.match(/^x/))parts[i].id="x"+parts[i].id;
	if(parts[i].model.length)sections.firstdir.push(parts[i].model);
	
      }
      //create pins array
      var net={error:parts[i].error,partid:parts[i].id,pins:{analog:parts[i].analogpins,digital:parts[i].digitalpins},model:parts[i].value};
      if(net!=null)sections.netlist.push(net);
    }
    
  }
  
  return sections;
}



/* organizes data into netlist*/
Schematic.prototype.createnetlist=function(responsefunc){
  
  var parts=$$('#webtronics_drawing > g');
  if(parts.length<1){
    responsefunc("no parts found\n");
    return;
  }
  var partswtx=this.sortnetlist(this.getwtxdata(parts));
  if(partswtx[0].type.toLowerCase()!='gnd'){
    responsefunc('no ground node');
    return;
  }
  this.connectnamewires(partswtx);
  var spice=".title webtronics\n";
  var sections=this.getnodes(partswtx);
//  console.log(sections);
  //dump models into spice	
  var modelloader={
    modeltext:"",
    modelcount:0,
    responsecount:0,
    download:function(name){

      openfile( "../spice/"+ name,modelloader.responder);
      modelloader.modelcount++;
    },
    finish:function(){
      spice+=modelloader.modeltext; 
      if(sections.simulation.length){
	for(var i=0;i<sections.simulation.length;i++){
	  if(sections.simulation[i]!="")spice+=sections.simulation[i]+"\n";
	}
      }
      if(sections.lastdir.length){
	sections.lastdir=sections.lastdir.uniq();
	for(var i=0;i<sections.lastdir.length;i++){
	  if(sections.lastdir[i]!="")spice+=sections.lastdir[i]+"\n";
	}
      }
      
      var connector=$$('#information > .webtronics_namewire_connector')
      for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);
      
      responsefunc(spice.toLowerCase());
    },
    
    responder:function(text){
      modelloader.modeltext+=text;
      modelloader.responsecount++;
      if(modelloader.responsecount==modelloader.modelcount){
	modelloader.finish();
	spice=spice.concat(".end \n");	
	
      }       
    }
  }
  if(sections.netlist.length){
    var command="";
    for(var i=0;i<sections.netlist.length;i++){
      if(sections.netlist[i].error!=""){
	spice+=sections.netlist[i].error+'\n';
	continue;
      }
      command=sections.netlist[i].partid;
      var pins=[];
      for(var j=0;j<sections.netlist[i].pins['analog'].length;j++)pins.push(sections.netlist[i].pins['analog'][j]);
      for(var j=0;j<sections.netlist[i].pins['digital'].length;j++)pins.push(sections.netlist[i].pins['digital'][j]);
      pins.sort(function(a,b){return a.index > b.index? 1:a.index < b.index?-1:0;})
//      console.log(pins);
      for(var j=0;j<pins.length;j++)command += " "+pins[j].node;

      command+=" "+sections.netlist[i].model;
      if(command!="")spice+=command+'\n';
    }
  }
  
  if(sections.coupling.length){
    for(var i=0;i<sections.coupling.length;i++){
      spice+=sections.coupling[i]+'\n';
    }
  }
  
  if(sections.firstdir.length){
    sections.firstdir=sections.firstdir.uniq();
    
    for(var i=0;i<sections.firstdir.length;i++){
//      console.log(sections.firstdir[i]);
      
      if(sections.firstdir[i].length){
	var directive=sections.firstdir[i].split(' ');
	modelloader.download(directive[1]);
      }
    }
  }
  else modelloader.finish();
  
  
  
}





Schematic.prototype.writeconnects=function(pins){
  
  var str=[];
  
  for(var i=0;i<pins.length;i++){
    str[i] = pins[i].x +','+pins[i].y;
  }
  return str.join(';'); 
}


Schematic.prototype.getconnects=function(elem){
    var pins=[];    
      var nodes = this.getwtxtagname(elem,"node");
      for(var j=0;j<nodes.length;j++){
//	console.log(nodes[j]);
//	console.log(this.parseMatrix(elem));
	var point = this.matrixxform( {x:this.getwtxattribute(nodes[j],"x"),y:this.getwtxattribute(nodes[j],"y")},this.parseMatrix(elem));
	pins.push({x:point.x,y:point.y}) ;
      }
      //sort nodes int correct order
  return pins;
}

Schematic.prototype.isconnect=function(pin,radius,x,y){
  return (Math.abs(pin.x-x)<3)&&(Math.abs(pin.y-y)<3); 
}

Schematic.prototype.isconnects=function(parts,radius,x,y){
  
  for(var i=0; i<parts.length; i++){
    if(parts[i].tagName =='g'){
     var pins=this.getconnects(parts[i]);
      if(pins){
	for(var j=0;j<pins.length;j++){
	  if(this.isconnect(pins[j],radius,x,y)){
	    return pins[j];
	  }
	}
      }
    }
  }
  return null;
}

//get the number by part id and leg
Schematic.prototype.getnodenumber=function(name, leg){
  //get part by id
  var part=$$("#webtronics_drawing wtx:id "+name )[0];
  var nodes=part.getwtxtagname("node");
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].getAttribute("index")==leg){
      var wire = this.followwires(null,{ x:this.getwtxattribute(node,"x"),y:this.getwtxattribute(node,"y")});
      return this.getconnected(analogwires,wire);
    }
  }
  return -1
}

Schematic.prototype.showconnects=function(elem,pin){
  var connector=$$('#information > .schematic_connector ,#information > .webtronics_namewire_connector')
  for(var i=0;i<connector.length;i++){
	connector[i].setAttribute('visibility','visible');
  }
}

Schematic.prototype.hideconnects=function(){
  var connector=$$('#information > .schematic_connector,#information > .webtronics_namewire_connector')
  for(var i=0;i<connector.length;i++){
	connector[i].setAttribute('visibility','hidden');
  }
}

Schematic.prototype.removeconnects=function(){
  
  var connector=$$('#information > .schematic_connector,#information > .webtronics_namewire_connector,#information > .webtronics_schematic_wire_eventline ')
  for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);
}

  
Schematic.prototype.addconnects=function(){
 this.changeobserver.disconnect();

  this.removeconnects();
  var parts=this.getwtxdata($$('#webtronics_drawing > g'));
  this.connectnamewires(parts);
  for(var i=0 ;i<parts.length;i++){
    if(parts[i].analogpins!=undefined)for(var j=0;j<parts[i].analogpins.length;j++){
	var circle=this.createdot('red',parts[i].analogpins[j].x,parts[i].analogpins[j].y,4);
	circle.setAttributeNS(null, 'fill-opacity', .35);
	circle.setAttribute('class',"schematic_connector");
	circle.setAttribute("pointer-events","all");
	circle.setAttribute('visibility','hidden');
	this.info.appendChild(circle);

	Event.observe(circle,"mouseover",function(){
	  var data = $A(arguments);
	  data.shift();							
	  data[0].setAttribute('visibility','visible');
	}.bindAsEventListener(this,circle));

	Event.observe(circle,"mouseout",function(){
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
    }
    
    
    if(parts[i].digitalpins!=undefined)for(var j=0;j<parts[i].digitalpins.length;j++){
	var rect=this.createrect('red',100,parts[i].digitalpins[j].x-3,parts[i].digitalpins[j].y-3,6,6);
	rect.setAttributeNS(null, 'fill-opacity', .35);
	rect.setAttribute('class',"schematic_connector");
	rect.setAttribute("pointer-events","all");
	rect.setAttribute("visibility","hidden");
	this.info.appendChild(rect);

	Event.observe(rect,"mouseover",function(){
	  var data = $A(arguments);
	  data.shift();							
	  data[0].setAttribute('visibility','visible');
	}.bindAsEventListener(this,circle));

	Event.observe(rect,"mouseout",function(){
	  if(!this.connections){
	    var data = $A(arguments);
	    data.shift();
	    data[0].setAttribute('visibility','hidden');
	  }
	}.bindAsEventListener(this,circle));

	Event.observe(rect,"mousedown",function(){
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
	
    }
  }

  var lines=$$("#webtronics_drawing > line");
  for(var i=0;i<lines.length;i++){
//clean up lines while i'm at it    
    if(lines[i].getAttributeNS(null,'x1')==lines[i].getAttributeNS(null,'x2') && lines[i].getAttributeNS(null,'y1')==lines[i].getAttributeNS(null,'y2'))
      this.remove(lines[i]);

    else this.wireevents(lines[i]);

    
  }
  this.hideconnects();  
  this.changeobserver.observe(this.drawing, { attributes: true, childList: true, characterData: true ,subtree:true});

  
}


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

    this.remove($('templine1'));
    this.remove($('templine2'));
  
  
}



Schematic.prototype.wireevents=function(svg){
	this.drawing.appendChild(svg);
	
	var x1=svg.getAttributeNS(null,'x1');
	var y1=svg.getAttributeNS(null,'y1');
	var x2=svg.getAttributeNS(null,'x2');
	var y2=svg.getAttributeNS(null,'y2');


//	extra wide line to help capture events
	var eventline = this.createline('blue',4, x1, y1,x2,y2);
	eventline.setAttribute('class',"webtronics_schematic_wire_eventline");
	eventline.setAttribute("pointer-events","all");
	eventline.setAttribute('visibility','hidden');
 	this.info.appendChild(eventline);
	
  //line to make connections
	Event.observe(eventline,"mouseover",function(e){
	    var connector=$$('#information > .webtronics_schematic_wire_connector');
	    for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);
	    if(!this.drag){

	    var real=this.realPosition(Event.pointerX(e),Event.pointerY(e));
	    x = Math.round(real.x/this.grid) * this.grid;
	    y =Math.round(real.y/this.grid) * this.grid;
	    var data = $A(arguments);
	    data.shift();
	    var circle=this.createdot('red',x,y,5);
	    circle.setAttribute('class',"webtronics_schematic_wire_connector");
	    circle.setAttribute("pointer-events","all");
	    circle.setAttributeNS(null, 'fill-opacity', .35);
	    circle.setAttribute('visibility','hidden');



	    Event.observe(circle,"mouseout",function(){
		  var data = $A(arguments);
		  data.shift();							
		  data[0].parentNode.removeChild(data[0]);
	    }.bindAsEventListener(this,circle));

/*this makes sure dots are not shown when not moused over*/

	    Event.observe(circle,"mouseover",function(){
		  var data = $A(arguments);
		  data.shift();							
		  data[0].setAttribute('visibility','visible');
	    }.bindAsEventListener(this,circle));
	    
	    Event.observe(circle,"mousedown",function(){
	      var data = $A(arguments);
	      data.shift();
	      var connect=true;
	      var dots=$$("#webtronics_drawing > circle");
	      dots.each(function(dot){if(dot.getAttribute("cx")==data[1] &&  dot.getAttribute("cy")==data[2])connect=false;});
	      if(connect){
		this.drawing.appendChild(this.createdot('black',data[1],data[2],3));
	      }
//check if there is aalready a dot
	      this.connect(data[0],data[1],data[2]);
	
	      if(this.mode=='select'){
		parent.webtronics.setMode('line','Wire');
		var svg = this.createline('blue',2, data[1], data[2], data[1], data[2]);
		svg.id = 'templine1';
		svg.setAttributeNS(null,'stroke-dasharray','3,2');
		this.info.appendChild(svg);
	      }
	      else{
		parent.webtronics.setMode('select','Selection');
	      }

	      var connector=$$('#information > .webtronics_schematic_wire_connector');
	      for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);
	    }.bindAsEventListener(this,data[0],x,y));
	    this.info.appendChild(circle);
	  }
	  
	}.bindAsEventListener(this,svg));

 
}




