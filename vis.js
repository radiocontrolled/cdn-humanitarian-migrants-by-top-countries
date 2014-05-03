var w = window.innerWidth/1.1;
var h = window.innerHeight/1.5;
var barWidth, year, bars, svg, scaleX, scaleY;

var opts = {
	"stroke": "none",
	"fill": "#333333",
	"font-size": ".5em",
	"font-weight": "bold"
};

d3.select("section").append("svg");

var drawBarChart = function(w,h) {

	d3.json("source.json", function(error, json) {
		if(json){
					
			var drawRects = function(year){
				
				barWidth = w/json[year].length -1;

				svg = d3.select("svg")
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
					
				scaleX = d3.scale.ordinal()
					.domain(json.Source.map(function(d) { return d; }))
					.rangeRoundBands([0, w]);
				
				bars  = svg.selectAll("g")
					.data(json[year], function(d){return d;});
					
				bars.enter()
					.append("g")
					.classed("bar",true);
				
				// Create the spacing between each g 
				bars.attr("transform", function(d,i) { 
						return "translate(" + (i*barWidth) + ",0)";
					});

				// Nest a rect within each g 
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
					.style({
						"fill":"#75DCCD",
						"stroke-width": 0.5, 
						"stroke": "#fff"	
					});
					
				bars
					.exit().remove();
			
					
				// Nest text within each g
				bars.append("text")
					.classed("total",true)
					.text(function(d) {
						return d;
					})
					.attr({
						"y": function(d){
							return scaleY(d) - 1;
						},
						"x": function(){
							return barWidth * 0.5;
						},
						"text-anchor": "middle",
						"alignment-baseline": "middle"
					})
					.style(opts)
					.style("display","none");
				
				
				// On hover, change rect colour and display tooltip
				bars.on("mouseover", function(){
						
					d3.select(this.firstChild).style("fill","#4DC2CA");
					d3.select(this.lastChild).style("display","inline");
					
				});
				
				bars.on("mouseout", function(){
					d3.select(this.firstChild).style("fill","#75DCCD");
					d3.select(this.lastChild).style("display","none");
				});
				
				// Create a y axis for the bar chart 
				d3.select("section svg")
					.append("g")
					.attr("transform", "translate(-5,0)")
					.style({
						"fill":"none",
						"stroke":"#333333"
					})
					.call(d3.svg.axis().scale(scaleY).orient("left").ticks(10).tickSize([5]))
	
					// Give the y axis a title
					.append("text")
					.attr({
						"transform":"rotate(-90)",
						"x": -h,
						"y": ".6em",
						"dy": "-5em",
						"text-anchor":"start",
					})
					.style(opts)
					.text("Total entries of humanitarian population by top source countries");
					
				// Create an x asis for the bar chart 
				
				var xAxis = d3.svg.axis()
					.scale(scaleX)
					.orient("bottom");
				
				svg.append("g")
					.classed("xAxis",true)
					.style("fill","none")
					.attr("transform", "translate(0," + h + ")")
					.call(xAxis);
						
				d3.selectAll(".xAxis text")
					.attr("transform","rotate(65) translate(1,5)")
					.style("text-anchor","start")
					
				d3.selectAll(".tick").style(opts);

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
			
			// getYear gives user control of data displayed
			var getYear = function (){	
				var years = document.querySelectorAll("li text");
				for (var i = 0; i < years.length; i++){
					years[i].addEventListener("click", trigger);
				}
				function trigger(){
					year = this.innerHTML;
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
	h = window.innerHeight/1.5;
	
	drawBarChart(w,h);
	
	bars = svg.selectAll("g").remove();
	
};

d3.select(window).on('resize', resize); 
