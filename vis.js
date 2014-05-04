var w = window.innerWidth/1.1;
var h = window.innerHeight/1.5;
var barWidth, year, bars, svg, scaleX, scaleY, xAxisLabelTransform;

var opts = {
	"stroke": "none",
	"fill": "#333333",
	"font-size": ".5em",
	"font-weight": "bold"
};

// will hold the bar chart 
d3.select("section").append("svg").append("g").classed("chart",true).attr("transform","translate(45,10)");

// will hold the yAxis
var yAxis = d3.select("section svg").append("g").classed("yAxis",true);

// label for yAxis
yAxis.append("text")
	.attr({
		"transform":"rotate(-90)",
		"x": -h,
		"y": ".6em",
		"dy": "-5em",
		"text-anchor":"start",
	})
	.style(opts)
	.text("Total entries of humanitarian population by top source countries");

// will hold the xAxis
var xAxis = d3.select("section svg").append("g").classed("xAxis",true);
				

var drawBarChart = function(w,h) {

	d3.json("source.json", function(error, json) {
		if(json){
					
			var drawRects = function(year){
				
				barWidth = (w/json[year].length -1)*0.95;

				svg = d3.select("svg")
					.attr({
						width: w,
						height: window.innerHeight/1.1
					});				
																	
				// Scale for y axis. Input range is # of persons, output range is height of svg)			
				scaleY = d3.scale.linear()
					.domain([0, d3.max(json[year], function(d) { return d; })])
					.range([ h,0]);
				
				// Ordinal scale for x axis
				scaleX = d3.scale.ordinal()
					.domain(json.Source.map(function(d) { return d; }))
					.rangeRoundBands([0, w*0.95],0,0);
				
				bars = svg.select("g.chart").selectAll("g.bar")
					.data(json[year], function(d){return d;});
						
				bars.enter()
					.append("g")
					.classed("bar",true);
				

				// Create the spacing between each g 
				bars.attr("transform", function(d,i) { 
						return "translate(" + (i*barWidth) +",0)";
					});

				// Nest a rect within each g 
				bars.append("rect")
					.style({
						"fill":"#75DCCD",
						"stroke-width": 0.5, 
						"stroke": "#fff"	
					})						
					.attr({
						"height": function(d) { 
							return 0; 
						},
						"width": barWidth,
						"y":function(d) { 
							return h; 
						}
					})
					.transition()
					.attr({
						"height": function(d) { 
							return h - scaleY(d); 
						},
						"y":function(d) { 
							return scaleY(d); 
						}
					})
					.duration(1000);

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
							return scaleY(d) - 5;
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
				yAxis
					.attr("transform", "translate(40,10)")
					.style({
						"stroke-width": ".1em",
						"fill":"none",
						"stroke":"#333333"
					})
					.transition().duration(1000).ease("1000")
					.call(d3.svg.axis().scale(scaleY).orient("left").ticks(10).tickSize([2]));
					
				
				// Create an x axis for the bar chart 
				var xAxisScale = d3.svg.axis()
					.scale(scaleX)
					.orient("bottom");
				
				xAxis
					.style("fill","none")
					.attr("transform", "translate(0," + (h+10) + ")")
					.call(xAxisScale)
					.append("text");
					
				// Depending on viewport size, rotate x asis labels for usability
				var positionLabels = function () {
					if (document.body.clientWidth < 600) {
						xAxisLabelTransform = "rotate(90) translate(5,-50)";
					}
					else {
						xAxisLabelTransform = "rotate(70) translate(15,-40)";
					}	
						return xAxisLabelTransform;
					}();
										
				d3.selectAll(".xAxis text")
					.attr("transform",xAxisLabelTransform)
					.style("text-anchor","start");
					
				d3.selectAll(".tick").style(opts);

			};
			
			
			
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
					var clear = document.querySelectorAll(".active");
					for (var i = 0; i < clear.length; i++){
						clear[i].classList.remove("active");
					}
					
					year = this.innerHTML;
					drawRects(year);
					this.parentNode.classList.add("active");
				}
			}();
			
			// initially, the barchart displays 2003 data	
			var init = function (){
				drawRects(2003);
				var initialYearShown = document.querySelectorAll("li");
				initialYearShown[0].classList.add("active");
			}();
						
			}
		
		else{
			console.warn(error);
		}
	});
};

drawBarChart(w,h);

// Resize bar chart on viewport size change 
var resize = function() {
	
	w = window.innerWidth/1.1;
	drawBarChart(w,h);
	d3.select("yAxis").remove();
	
};

d3.select(window).on('resize', resize); 

