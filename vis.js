var w = window.innerWidth/1.1;
var h = window.innerHeight/1.1;
var barHeight = 0; // set a minimum barHeight 
var scale, barWidth, year;

d3.select("section").append("svg");

/*
 *  Draw the bar chart
 */
var drawBarChart = function(w,h) {

	d3.json("source.json",function(error, json) {
		if(json){
					
			var drawRects = function(year){
				
				barWidth = w/json[year].length -1;
				
				
				/* calculate height of SVG based on size 
				 * of the dataset
				 */
				var svg = d3.select("svg")
					.attr({
						width: w,
						height: h
					})
					.attr("transform", "translate(21,0)"); // make responsive
																	
				/* Scale which will be used to create 
				 * bar height, and the vertical axis
				*  input domain is the min and max of persons for a given year from the JSON
				*  output range extend is the height of the svg
				*/
				
				scaleY = d3.scale.linear()
					.domain([0, d3.max(json[year], function(d) { return d; })])
					.range([ h,0]);
					
			
				// create a g element for every country 
				var bars = svg.selectAll("g")
					.data(json[year])
					.enter()
					.append("g")
					.classed("bar",true);
					
				/* 
				 * create the spacing between each g 
				 * elements which will hold the bars and their text
				 * via CSS transform
				 */	
				bars.attr("transform", function(d,i) { 
						return "translate(" + (i*barWidth) + ",0)";
					});

				// within each g element, nest a rectangle
				bars.append("rect")
					.attr({
						"height": function(d) { 
							return h - scaleY(d); 
						},
						"width": barWidth,
						"y":function(d) { 
							return scaleY(d); 
						}
					})
					.style("fill","#75DCCD");
					
				/* 
				 *  On hover, change the color of the 
				 *  bar
				 */
					
				bars.on("mouseover", function(){
					d3.select(this.firstChild).style("fill","#4DC2CA");
				});
				bars.on("mouseout", function(){
					d3.select(this.firstChild).style("fill","#75DCCD");
				});
				
				
				bars.append("text")
					.classed("total",true)
					.text(function(d) { 
						return d; 
					})
					.attr({
						"y": function(d){
							return scaleY(d);
						},
						"x": function(d,i){
							return barWidth*0.25;
						}
					});
			

				/* 
				 * Create a y axis for the bar chart 
				 */
				d3.select("section svg")
					.append("g").classed("bulbLabels",true)
					.attr("transform", "translate(-5,0)")
					.style({
						"fill":"none",
						"stroke":"#308CB4"
					})
					.call(d3.svg.axis().scale(scaleY).orient("left").ticks(10).tickPadding([1]))
	
					/*
					*  Give the y axis a title
					*/
					
					.append("text")
					.attr({
						"transform":"rotate(-90)",
						"x": -h,
						"y": ".6em",
						"dy": ".30em",
						"text-anchor":"start"
					})
					.text("Total entries of humanitarian population by top source countries");
						
				
				d3.selectAll("text").style({
					"fill": "#308CB4",
					"stroke": "none",
					"font-size": ".5em"
				});
			};
			
			drawRects(2003);
			
			var drawNavigation = function () {
			
				var navigationYears = [];
				
				for(var prop in json){
					
					if (prop != "Source"){
						navigationYears.push(prop);	
					}
				}

				var ul = d3.select(".navigation")
					.selectAll("li")
					.data(navigationYears)
					.enter()
					.append("li")
					.append("text")
					.text(function(d){
						return d;
					});
					
			}();
			
			
			/* 
			 *  User controls year displayed
			 */
			
			var getYear = function (){	
				var years = document.querySelectorAll("li text");
				for (i = 0; i < years.length; i++){
					years[i].addEventListener("click", trigger);
				}
				function trigger(){
					var year = this.innerHTML;
					drawRects(year);
				}
									
			}();
						
			}
		
		else{
			console.warn(error);
		}
	});


};

drawBarChart(w,h);



/*
 *  Resize the barchart on viewport size change
 */

var resize = function() {
	
	w = window.innerWidth/1.1;
	h = window.innerHeight/1.1;
	
	drawBarChart(w,h);
	
};

d3.select(window).on('resize', resize); 




