var netlistcreator={
matrixxform:function(point,matrix){
  var pin=webtronics.circuit.svgRoot.createSVGPoint();
  pin.x=point.x;
  pin.y=point.y;
  pin=pin.matrixTransform(matrix);
  return {x:Math.round(pin.x),y:Math.round(pin.y)};
},

/*tests if 2 point are within 3 pixels of each other*/
ispoint:function(point1,point2){
  return (Math.abs(point2.x-point1.x)<3)&&(Math.abs(point2.y-point1.y)<3); 
},

sortnetlist:function(list){
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
},

/* draws wires to namewire ports with the same id*/
connectnamewires:function(list){
  
  for(var i=0;i<list.length;i++){
    if((list[i].type=="wire") || (list[i].type=="gnd")){
      for(var j=i;j<list.length;j++){
	if( (list[i]!=list[j]) && ((list[i].id==list[j].id) || (list[i].type=="gnd" && list[j].type=="gnd"))   ){
	  var line= webtronics.circuit.createline('yellow',1,list[i]['analogpins'][0]['x'],list[i]['analogpins'][0]['y'],list[j]['analogpins'][0]['x'],list[j]['analogpins'][0]['y']);
	  line.setAttributeNS(null,'class','webtronics_namewire_connector');
	  webtronics.circuit.info.appendChild(line);
	  //console.log(line);            
	  break; 
	}
      }    
    }
  }
},

/*check for vectors and convert them*/
tovector:function(pin,nodenumber){
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
},

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


getwtxdata:function(parts){
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
      var category=webtronics.circuit.getwtxtagname(parts[i],"analog")[0];
      var nodes = webtronics.circuit.getwtxtagname(category,"node");
      for(var j=0;j<nodes.length;j++){
	var point = this.matrixxform( {x:webtronics.circuit.getwtxattribute(nodes[j],"x"),y:webtronics.circuit.getwtxattribute(nodes[j],"y")},webtronics.circuit.parseMatrix(part.elem));
	part.analogpins.push({index:webtronics.circuit.getwtxattribute(nodes[j],"index"),x:point.x,y:point.y,node:undefined}) ;
      }
      //sort nodes into correct order
      part.analogpins.sort(function(a,b){if (a.index > b.index)return 1;if (a.index < b.index)return -1;return 0;});
		}
    catch(e){console.log("no analog pins found");}
    
    try{
      var category=webtronics.circuit.getwtxtagname(parts[i],"digital")[0];
      var nodes = webtronics.circuit.getwtxtagname(category,"node");
      for(var j=0;j<nodes.length;j++){
	var point = this.matrixxform( {x:webtronics.circuit.getwtxattribute(nodes[j],"x"),y:webtronics.circuit.getwtxattribute(nodes[j],"y")},webtronics.circuit.parseMatrix(part.elem));
	part.digitalpins.push({index:webtronics.circuit.getwtxattribute(nodes[j],"index"),x:point.x,y:point.y,node:undefined}) ;
      }
      part.digitalpins.sort(function(a,b){if (a.index > b.index)return 1;if (a.index < b.index)return -1;return 0;});
    }
    catch(e){console.log("no digital pins found");}
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
  
},
/*detect analog and digital mix*/
mixedsignals:function(analogwires,digitalwires){
  
  for(var j=1;j<analogwires.length;j++){
    var crossed=this.getconnected(digitalwires,analogwires[j]);
    if(crossed>-1){
      return true;  
    }
  }
  return false;
},

/* test if wires are connected anywhere*/
getconnected:function(wirelist,wire){
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
},

//returns points connected by lines
//it is recursive and should be called with NULL for wires
followwires:function(wires,pin){
  if(wires==null)wires=[];
  var points=[];
  points.push(pin);	
  var lines =webtronics.circuit.getwithselector('#webtronics_drawing > line, #information > .webtronics_namewire_connector');
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
},



//sets the node numbers for parts
numberwires:function(parts){
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
} , 



/* creates all netlist data from parts data*/
getnodes:function(parts){
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
			if(parts[i].value!=""){
			  sections.simulation.push(parts[i].value);
			}
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
},

/* organizes data into netlist*/
createnetlist:function(responsefunc){
  
  var parts=webtronics.circuit.getwithselector('#webtronics_drawing > g');
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

  //dump models into spice	

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
  var modelloader={
  
    modeltext:"",
    modelcount:0,
    download:function(name){
			var found=false;
			for( var i=0;i<webtronics.partslists.length;i++){
				modelloader.modelcount++;
			}
			for( var i=0;i<webtronics.partslists.length;i++){
			
				if(JSON.stringify(webtronics.partslists[i]).indexOf(name)!=-1){
					found=true;

					if(webtronics.partslists[i].url.indexOf("http://")==-1){//see if path is local

		  	  	openfile( webtronics.partslists[i].url+"/spice/"+ name,modelloader.responder.bind(this));
		  	  }
		  	  else{
		  	  	server.requestfile(list.url,modelloader.responder.bind(this));
		  	  }

				}
				
			}
			if(!found)
				console.log("model not found");
				
    },
    finish:function(){
    	console.log("done");
      spice+=modelloader.modeltext; 
      if(sections.simulation.length){
				for(var i=0;i<sections.simulation.length;i++){
					if(sections.simulation[i]!="")spice+=sections.simulation[i]+"\n";
				}
      }
      else console.log("No simulation in the model");
      if(sections.lastdir.length){
				sections.lastdir=sections.lastdir.uniq();
					for(var i=0;i<sections.lastdir.length;i++){
						if(sections.lastdir[i]!="")spice+=sections.lastdir[i]+"\n";
					}
      }
      responsefunc(spice.toLowerCase());
    },
    
    responder:function(text){
    		console.log("reponded "+ modelloader.modelcount);
	      modelloader.modeltext+=text;
	      modelloader.modelcount--;
	      if(!modelloader.modelcount){
				modelloader.finish();
				spice=spice.concat(".end \n");	
	
      }       
    }
  }
  
  
  if(sections.firstdir.length){
    sections.firstdir=sections.firstdir.uniq();
    
    for(var i=0;i<sections.firstdir.length;i++){
//      console.log(sections.firstdir[i]);
      
      if(sections.firstdir[i].length){



			modelloader.download(sections.firstdir[i],sections,webtronics.partslists);
      }
    }
  }
	else modelloader.finish();
	
  var connector=webtronics.circuit.getwithselector('#information > .webtronics_namewire_connector')
	for(var i=0;i<connector.length;i++)connector[i].parentNode.removeChild(connector[i]);

  
  
},





writeconnects:function(pins){
  
  var str=[];
  
  for(var i=0;i<pins.length;i++){
    str[i] = pins[i].x +','+pins[i].y;
  }
  return str.join(';'); 
},


getconnects:function(elem){
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
},

isconnect:function(pin,radius,x,y){
  return (Math.abs(pin.x-x)<3)&&(Math.abs(pin.y-y)<3); 
},

isconnects:function(parts,radius,x,y){
  
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
},

//get the number by part id and leg
getnodenumber:function(name, leg){
  //get part by id
  var part=webtronics.circuit.getwithselector("#webtronics_drawing wtx:id "+name )[0];
  var nodes=part.getwtxtagname("node");
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].getAttribute("index")==leg){
      var wire = this.followwires(null,{ x:this.getwtxattribute(node,"x"),y:this.getwtxattribute(node,"y")});
      return this.getconnected(analogwires,wire);
    }
  }
  return -1
},
getwtxtagname:function(elem,tagname){
  
  
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
  
},

getwtxattribute:function(elem,attrib){
  var value=elem.getAttribute(attrib);
  if(value==undefined)value=elem.getAttributeNS(this.wtxNs,attrib);
  if(value==undefined)value=elem.getAttributeNS("*",attrib);
  
  return value;
},

readwtx:function(elem,value){
  var tag=this.getwtxtagname(elem,value);
  if(tag[0])return tag[0].textContent;
  else return "";
},

writewtx:function(elem,value,text){
  var tag=this.getwtxtagname(elem,value);
  if(tag[0])tag[0].textContent=text;
},



}
