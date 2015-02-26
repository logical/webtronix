	fileio{
		    category:{},
	    	rxdata:	"";
	    	waiting:false,

				insertpart:function(partsvg,partname,cat){
					  var part=new Element("div",{"id":"webtronics_"+partname,'style':"display:none",'title':partname})
					  .update(partsvg);
					  
						Event.observe(part, "mousedown", function(e) {
								webtronics.circuit.unselect();
								var t = Event.element(e);
								while (t.tagName !== "svg") t = t.parentNode;
								var n = t.firstChild;
								while (n.nodeType !== 1 || n.tagName !== "g") n = n.nextSibling;
								webtronics.circuit.getgroup(n), webtronics.setMode("select", "Selection");
					  Event.observe(part,'mouseup',function(e){
								webtronics.circuit.deleteSelection();				
					  });
					  /*this might get the ipad working
					  Event.observe(part, "onclick", void(0));
					  */
						  $("webtronics_"+cat).insert(part);
						},
		    	
		    
			  requestfile:function(url,file){
						repository=var frame=new Element('iframe',{'class':'webtronics_repository_frame','style':'display:none'});
						$("webtronics_main_window").insert(repository);
						$("webtronics_repository_frame").src=url+"?file="file;
						
				},


		  makemenu:function(partlist){
		    var webtronics.parts = JSON.parse(partlist).parts;  
		    for (var cat in webtronics.parts){
		    	if($("webtronics_"+cat)!=undefined){
				    category=new Element("div",{"id":"webtronics_"+cat})
				    	.insert(new Element("p").update(cat)
				    	.observe('click',function(e){
								var menuitems=$$('#webtronics_parts_list>div>div');
								for(var i=0;i<menuitems.length;i++){
									if(menuitems[i].parentNode==Event.element(e).parentNode){
							  		if(menuitems[i].style.display=='none'){
							    		menuitems[i].style.display='block';
							  		}
							  		else{
							    		menuitems[i].style.display='none';
							  		}
									}
									else{
							  		menuitems[i].style.display='none';
									}
								}
				    	}
  			      $("webtronics_parts_list").insertBefore(category,$("webtronics_parts_list").firstChild);
				    }
		      
		      for(var partname in parts[cat]){
		      
						addpart(cat,partname);

		      }                
		      
		    }

		    var models = partlist.evalJSON(true).models;  
		      for(var partname in parts[cat]){
		      
						if($("webtronics_"+partname)==undefined)addpart(cat,partname);

		      }                

		  },
		    

		  addpart:function(url,cat,partname) {
				
		   var listfile=function(partsvg){
		    	
		      var part=new Element("div",{"id":"webtronics_"+partname,'style':"display:none",'title':partname})
		      .update(partsvg);
		      
		      Event.observe(part,'mousedown',function(e){
						webtronics.circuit.unselect();
						var element=Event.element(e);
						while(element.tagName!=="svg"){
							element=element.parentNode;
						}
						var group=element.firstChild;
						while(group.nodeType!==1||group.tagName!=="g"){
					  	group=group.nextSibling;
						}
						webtronics.circuit.getgroup(group);
						webtronics.setMode('select','Selection');
		      });
		      Event.observe(part,'mouseup',function(e){
						webtronics.circuit.deleteSelection();				
		      });
		      /*this might get the ipad working*/
		      Event.observe(part, "onclick", void(0));
		      $("webtronics_"+cat).insert(part);
		    }

				if(url=="."){
		    	openfile(cat+'/'+partname+'.svg',listfile);
		    }
		    else{
		    	requestfile(url,cat+'/'+partname+'.svg',waitforfile());
		    }
		    );
		  },
				

		    
		 	 },

			init:function(){

//			loading local parts is faster
				openfile:function("webtronix_server/parts.json", makemenu);
				
				

				
				for( site in webtronics.repositories){
					
			
				}
				load(json)

	//http://stackoverflow.com/questions/3076414/ways-to-circumvent-the-same-origin-policy
	// Internet Explorer
				if(window.attachEvent)window.attachEvent('onmessage',receivefile);
			  // Opera/Mozilla/Webkit
				else window.addEventListener("message", receivefile, false);

			}	
	}

