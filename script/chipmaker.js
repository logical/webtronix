var chipmaker={

	clear:function(elem){

		if ( elem.hasChildNodes() )
		{
		  while ( elem.childNodes.length >= 1 )
		  {
		      elem.removeChild( elem.firstChild );       

		  } 
		}
		elem.removeAttribute('connects');


	},

openmaker:function(){
    $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
    var div=new Element("div",{id:"webtronics_chip_display"});
    $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
    document.forms['webtronics_chips_form'].reset();
    $("webtronics_chip_spice_select").options.length=0;
    $("webtronics_chip_spice_select").appendChild(new Element("option",{"value":""}).update("none"));

    for(var part in webtronics.model){
        $("webtronics_chip_spice_select").insert(new Element("option",{"value":part}).update(part)); 
    }
},


createwtx:function(pins){
    var data=new Element("metadata",{"class":"part"})
        .update(new Element("wtx:part",{"xmlns:wtx":"http://code.google.com/p/webtronics"})
            .insert(new Element("wtx:pins").insert(pins))
            .insert(new Element("wtx:id").update("u"))
            .insert(new Element("wtx:type").update("u"))
            .insert(new Element("wtx:name").update("model"))
            .insert(new Element("wtx:category").update("ic"))
            .insert(new Element("wtx:value"))
            .insert(new Element("wtx:label"))
            .insert(new Element("wtx:spice"))
            .insert(new Element("wtx:flip"))
            .insert(new Element("wtx:model")));

    return data;
/*
<metadata class="part" >
<wtx:part xmlns:wtx="http://code.google.com/p/webtronics" >
    <wtx:pins>
        <analog>
        </analog>
        <digital>
        </digital>    
    </wtx:pins>
    <wtx:id>r</wtx:id>
    <wtx:type>r</wtx:type>
    <wtx:name>resistor</wtx:name>
    <wtx:category>resistors</wtx:category>
    <wtx:value></wtx:value>
    <wtx:label></wtx:label>
    <wtx:spice></wtx:spice>
    <wtx:flip></wtx:flip>
    <wtx:model></wtx:model>
</wtx:part>
</metadata>
*/
},
drawchip:function(h,v){
	var svgNamespace = 'http://www.w3.org/2000/svg';
	var svg;
	var fontsize=8;
	svgRoot=document.createElementNS(svgNamespace, "svg");
	svgRoot.setAttributeNS(null, 'stroke','black');
	svgRoot.setAttributeNS(null, 'width','99%');
	svgRoot.setAttributeNS(null, 'height','99%');
	var chipG = svgRoot.getElementsByTagName("g")[0];

	chipG=document.createElementNS(svgNamespace, 'g');
	chipG.setAttributeNS(null, 'stroke', 'black');
	chipG.setAttributeNS(null, 'stroke-width', '2px');
	svgRoot.appendChild(chipG);
/*space between pins*/
	var space=20;
/*length of pins */
	var pinl=10;
  	var y=space
	var start=pinl;
	var hor=h*space;
	var pincount=0;
	var connections=new Element("wtx:analog");
	if(h==0)
	{
	hor=60;
	y=pinl;
	start=0;
	}

	svg = document.createElementNS(svgNamespace, 'rect');
  	svg.setAttributeNS(null, 'x', pinl);
  	svg.setAttributeNS(null, 'y', start);	
  	svg.setAttributeNS(null, 'width', hor);
  	svg.setAttributeNS(null, 'height', v*space);
  	svg.setAttributeNS(null, 'fill','none');
	
	chipG.appendChild(svg);
/* left horizontal pins*/
	for(;y<(v*space+start+10);y+=space){
		svg = document.createElementNS(svgNamespace, 'line');
		svg.setAttributeNS(null, 'x1',0 );
		svg.setAttributeNS(null, 'y1', y);
		svg.setAttributeNS(null, 'x2', pinl);
		svg.setAttributeNS(null, 'y2', y);
		chipG.appendChild(svg);
		
		svg = document.createElementNS(svgNamespace, 'text');
		svg.setAttributeNS(null, 'x', 0);
		svg.setAttributeNS(null, 'y', y);
		svg.setAttributeNS(null, 'font-size', fontsize);
		svg.setAttributeNS(null, 'stroke','blue');
		svg.setAttributeNS(null, 'stroke-width','0px');

		svg.appendChild(document.createTextNode(pincount+1));
		chipG.appendChild(svg);
        connections.insert(new Element("wtx:node",{"index":pincount,"x":"0","y":y}));
		pincount++;
	}
  	y=space
	start=pinl;
	hor=h*space;

	if(h==0)
	{
	hor=60;
	y=pinl;
	start=0;
	}
/*vertical bottom pins*/
	for(var x=space;x<h*space+space;x+=space){
		svg = document.createElementNS(svgNamespace, 'line');
		svg.setAttributeNS(null, 'x1',x);
		svg.setAttributeNS(null, 'y1',v*space+pinl);
		svg.setAttributeNS(null, 'x2',x);
		svg.setAttributeNS(null, 'y2',v*space+space);
		chipG.appendChild(svg);

		svg = document.createElementNS(svgNamespace, 'text');
		svg.setAttributeNS(null, 'font-size', fontsize);
		svg.setAttributeNS(null, 'stroke','blue');
		svg.setAttributeNS(null, 'stroke-width','0px');
		svg.appendChild(document.createTextNode(pincount+1));
		chipG.appendChild(svg);
		var box=svg.getBoundingClientRect();
		svg.setAttributeNS(null, 'x', (x+(box.width/2)));
		svg.setAttributeNS(null, 'y',(v*space+pinl+fontsize));

        connections.insert(new Element("wtx:node",{"index":pincount,"x":x,"y":v*space+space}));
		pincount++;
	}
   	y=space
	start=0;
	hor=h*space+pinl;
	if(h==0)
	{
	hor=60+pinl;
	y=pinl;
	start=pinl;
	}
/*horizontal right pins*/
	for(var y2=(v*space-start);y2>=y;y2-=space){
		svg = document.createElementNS(svgNamespace, 'line');
		svg.setAttributeNS(null, 'x1',hor );
		svg.setAttributeNS(null, 'y1',y2);
		svg.setAttributeNS(null, 'x2',hor+pinl);
		svg.setAttributeNS(null, 'y2',y2);
		chipG.appendChild(svg);

		svg = document.createElementNS(svgNamespace, 'text');
		svg.setAttributeNS(null, 'x', hor);
		svg.setAttributeNS(null, 'y', y2);
		svg.setAttributeNS(null, 'font-size', fontsize);
		svg.setAttributeNS(null, 'stroke','blue');
		svg.setAttributeNS(null, 'stroke-width','0px');

		svg.appendChild(document.createTextNode(pincount+1));
		chipG.appendChild(svg);
        connections.insert(new Element("wtx:node",{"index":pincount,"x":hor+pinl,"y":y2}));
		pincount++;
	}
   y=space
	start=pinl;
	hor=h*space-pinl;
	if(h==0){
	hor=60;
	y=pinl;
	start=0;
	}
/*vertical top pins*/
  for(var x=h*space;x>=space;x-=space){
		svg = document.createElementNS(svgNamespace, 'line');
		svg.setAttributeNS(null, 'x1',x );
		svg.setAttributeNS(null, 'y1', 0);
		svg.setAttributeNS(null, 'x2', x);
		svg.setAttributeNS(null, 'y2', pinl);
		chipG.appendChild(svg);

		svg = document.createElementNS(svgNamespace, 'text');
		svg.setAttributeNS(null, 'font-size', fontsize);
		svg.setAttributeNS(null, 'stroke','blue');
		svg.setAttributeNS(null, 'stroke-width','0px');
		svg.appendChild(document.createTextNode(pincount+1));
		chipG.appendChild(svg);
		var box=svg.getBoundingClientRect();
		svg.setAttributeNS(null, 'x', x);
		svg.setAttributeNS(null, 'y', fontsize);
        connections.insert(new Element("wtx:node",{"index":pincount,"x":x,"y":0}));
		pincount++;
	}

	
	svg=document.createElementNS(svgNamespace,'circle');
	svg.setAttributeNS(null, 'cx', 20);
	svg.setAttributeNS(null, 'cy', start+10);	
	svg.setAttributeNS(null, 'r', 3);
	chipG.id = 'U-' + createUUID();
	chipG.appendChild(svg);
    chipG.appendChild(this.createwtx(connections));
    return svgRoot;
}
}
