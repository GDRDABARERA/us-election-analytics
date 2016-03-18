/********************************************************************************************************************************************************************************
* Community Graph
*********************************************************************************************************************************************************************************/
 var dasIp="52.77.25.83";

 var authenticatingString= window.btoa("admin:user@das");
  var topname,topdescription, topfullName;

function communityGraph(divId){
        drawCommunityGraph(divId );
	 setInterval(function() {
              // Do something every 5 seconds
              drawCommunityGraph(divId );


        }, 600000); 
}


function drawCommunityGraph(divId){
        var divID ="#"+divId;
   console.log(divID);



    d3.select(divID).select("svg").remove();

       var graph = new Object();
       var map = new Object();
           var index = 0;

           var linkIndex = 0;
           var Nodes = [];
           var Edges = [];
           var dataN1=[];
           var dataE1=[];



         var width = $(divID).width();
         var height = $(divID).height() ;
        console.log("width"+ width);
        console.log("height"+height);


       

        var svg = d3.select(divID).append('svg')
                .attr("width", width)
                .attr("height", height) ;




           // tool tip with the label
          var tip = d3.tip()
                   .attr('class', 'd3-tip')
                   .offset([-10, 0])
                   .html(function (d) {
                       return d.name + "";
                   })
           svg.call(tip); 



            var tableNodes=[],tableEdges=[];

     


                 var nodeUrl1 = "https://52.77.25.83:9453/analytics/tables/ELECNODE",
                     edgeUrl1 = "https://52.77.25.83:9453/analytics/tables/ELECEDGE" ;



     $.when(


                   $.ajax({

                                url: nodeUrl1,
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("Authorization", "Basic "+authenticatingString);
                                },
                                method: "GET",
                                contentType: "application/json",
                                success:function(data){
                                 dataN1=data;
                                }
                            }),


                     $.ajax({

                                url: edgeUrl1,
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("Authorization", "Basic "+authenticatingString);
                                },
                                method: "GET",
                                contentType: "application/json",
                                success:function(data){
                                    dataE1=data;
	                            			   
                                }
                            })

       ).then(function(){



            loadNodeData2(Nodes,dataN1);
           // console.log(Nodes);
            loadEdgesData2(Edges,dataE1);
             //console.log("Edges:"+ Edges);
            renderNodesEdges(Nodes,Edges);



     });




    function loadNodeData2(Nodes,dataN1){
                 for (var i = 0; i < dataN1.length; i++) {//
                                   var d = dataN1[i].values;
                           
                                      Nodes.push(d);
										

                               }


     }

     function loadEdgesData2(Edges,dataE1){
                         for (var i = 0; i < dataE1.length; i++) {  //
                                var d = dataE1[i].values;
                                Edges.push(d);

                            }


     }


function renderNodesEdges(dataset1,dataset2){
              console.log("render graph");
                dataset1.forEach(function (d) {
                   // alert(d.name);
                   map[d.name] = index;
                   d.degree = parseInt(d.degree)
                   index++;
               });

               graph.nodes = dataset1;
            //  tlinks = new Object();
               dataset2.forEach(function (d) {

                   /*
                    Data Format Edge
                    ================
                    source
                    target
                    value

                    Data Format Vertex
                    ================
                    name
                    group
                    degree - decide size of the vertex

                    */

                  var s = map[d.source];
                   var t = map[d.target];

                   if (typeof  s === "undefined" || typeof  t === "undefined") {
                       d.source = 1
                       d.target = 2;

                   } else {
                       d.source = map[d.source];
                       d.target = map[d.target];
                       d.value = parseInt(d.value)
                   }
               });

               graph.links = dataset2;
               drapGraph(graph);



}



   function drapGraph(graph) {
               console.log("drap graph");
             svg.selectAll(".link").remove();
             svg.selectAll(".gnode").remove();
                var radius =80;
             var  force = self.force = d3.layout.force()
                       .nodes(graph.nodes)
                       .links(graph.links)
                       .gravity(.05)
                       .distance(60)
                       .charge(-120)
                       .size([width, height])
                       .start();
                setTimeout(function(){force.stop();},2000);

               //map radius  domain--> range
               var rScale = d3.scale.linear()
                           .domain([d3.min(graph.nodes, function (d) {
                                       return (d.degree);
                                     }), d3.max(graph.nodes, function (d) {
                                        return (d.degree);
                                        })])  
                            .range([6, radius]);
  var topdegree= d3.max(graph.nodes, function (d) {
                                        return (d.degree);
                                        });
  


               var link = svg.selectAll(".link")
                       .data(graph.links)
                       .enter().append("line")
                       .attr("class", "link")
                       .style("stroke-width", 2)
                       .style("stroke-length", 150);//function (d) {return (d.value * 10); });// 2 * Math.sqrt(d.value)



               var node = svg.selectAll(".gnode")
                       .data(graph.nodes)
                       .enter().append("g")
                       .attr("class", "gnode")
                        .on( 'click', function(d){
                            var url = "https://twitter.com/"+d.name+"/profile_image?size=original";

                            // popUp(url);

                              } )
                       .call(force.drag);


               var circle = node.append("circle")
                       .attr("r", function (d) {
                           return rScale(d.degree);
                       })
                       .style("fill", function (d) {
                            return d.color;


                       })
                       .style("fill-opacity", 0.7)
                       .style("stroke",function (d) {
                              return d.color;

                                   })
                        .on("click", function(d){
				 $("#UserName").text(d.name);
                                 var url = "https://twitter.com/"+d.name+"/profile_image?size=original";
                                 $("#UserImage").attr("src",url);
                                 $("#UserDescription").text(d.description);
 

			})
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                       .call(force.drag);

               var label = node.append("text")
                       .style("font-family", "sans-serif")
                       .style("text-anchor", "middle")
                       .style("font-size",function (d) {
					if(d.degree==topdegree){
						topname=d.name;
						topdescription= d.description;
						topfullName= d.fullName;
					}
                                       return (Math.log10(d.degree)*2);
                          })
                       .style("fill", function (d) {
                              
                                       return "#000000";
                               
                                 

   

                           })
                       .text(function (d) {
                            if(d.degree>2000){
                                var str=d.name;
                               return  str;
                               }

                       });

	console.log("topname "+ topname +" "+ topdescription+" "+topfullName);
	$("#UserName").text(topname);
        var topurl = "https://twitter.com/"+topname+"/profile_image?size=original";
        $("#UserImage").attr("src",topurl);
	$("#UserDescription").text(topdescription);

                                                
       force.on("tick", function () {



                  circle.attr("cx", function (d) {
                                return d.x = Math.max(radius/2, Math.min(width - radius/2, d.x))
                            })
                           .attr("cy", function (d) {
                               return d.y = Math.max(radius/2, Math.min(height - radius/2, d.y));
                           });
                 //   circle.each(collide(0.5));
                   label.attr("x", function (d) {
                       return d.x;
                   })
                           .attr("y", function (d) {
                               return d.y;
                           });

                    link.attr("x1", function (d) {
                                               return d.source.x;
                                               })
                                              .attr("y1", function (d) {
                                                  return d.source.y;
                                              })
                                              .attr("x2", function (d) {
                                                  return d.target.x;
                                              })
                                              .attr("y2", function (d) {
                                                  return d.target.y;
                                              });



               });

       }




}
