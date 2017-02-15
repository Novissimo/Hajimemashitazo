var margin = {top: 20, right: 10, bottom: 100, left:50},
    width = 700 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body")
        .append("svg")
          .attr ({
            "width": width + margin.right + margin.left,
            "height": height + margin.top + margin.bottom
          })
        //.append("g")
          //.attr("transform","translate(" + margin.left + "," + margin.right + ")");

var xScale = d3.scale.ordinal()
      .rangeRoundBands([0,width], 0.2, 0.2);

var yScale = d3.scale.linear()
      .range([height, 0]);

          // define x axis and y axis
var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

d3.csv("data_exports.csv", function(error,data) {
        if(error) console.log("Error: data not loaded!");

        data.forEach(function(d) {
            d.country = d.country;
            d.value= +d.value;       // try removing the + and see what the console prints
            console.log(d.value);   // use console.log to confirm
          });

          // sort the gdp values
          data.sort(function(a,b) {
            return b.value - a.value;
          });

          // Specify the domains of the x and y scales
          xScale.domain(data.map(function(d) { return d.country; }) );
          yScale.domain([0, d3.max(data, function(d) { return d.value; } ) ]);

          svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("height", 0)
            .attr("y", height)
            .transition().duration(3000)
            .delay( function(d,i) { return i * 200; })
            // attributes can be also combined under one .attr
            .attr({
              "x": function(d) { return xScale(d.country); },
              "y": function(d) { return yScale(d.value); },
              "width": xScale.rangeBand(),
              "height": function(d) { return  height - yScale(d.value); }
            })
            .style("fill", function(d,i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')'});


                svg.selectAll('text')
                    .data(data)
                    .enter()
                    .append('text')



                    .text(function(d){
                        return d.value;
                    })
                    .attr({
                        "x": function(d){ return xScale(d.country) +  xScale.rangeBand()/2; },
                        "y": function(d){ return yScale(d.value)+ 12; },
                        "font-family": 'sans-serif',
                        "font-size": '13px',
                        "font-weight": 'bold',
                        "fill": 'white',
                        "text-anchor": 'middle'
                    });

            // Draw xAxis and position the label
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("dx", "-.8em")
                .attr("dy", ".25em")
                .attr("transform", "rotate(-60)" )
                .style("text-anchor", "end")
                .attr("font-size", "10px");


            // Draw yAxis and postion the label
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height/2)
                .attr("dy", "-3em")
                .style("text-anchor", "middle")
                .text("Trillions of US Dollars ($)");
        });
