////////////////////////////
// data pull and organize //
////////////////////////////


class DataPull {
    constructor(data) {
        this.data = data;
        console.log(data);
        this.buildChart(data)
    }

    buildChart(data) {
        let margin = { top: 0, right: 10, bottom: 0, left: 10 };
        let width = 600 - margin.left - margin.right,
            height = 580 - margin.top - margin.bottom;

        let svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let insideRadius = 100;
        let outsideRadius = Math.min(width, height) / 2 - 30;
        let setTime = d3.timeParse("%m");

        let makeCircle = 2 * Math.PI * 11 / 12;

        let x = d3.scaleTime().range([0, makeCircle]);
        let y = d3.scaleRadial().range([insideRadius, outsideRadius]);

        for (let d of data) {
            d.MonthDate = setTime(d.MonthDate);
            d.Year2018 = +d.Year2018;
            d.Year2019 = +d.Year2019;
            d.Year2020 = +d.Year2020
        }

        x.domain(d3.extent(data, function(d) { return d.MonthDate }));
        y.domain(d3.extent(data, function(d) { return d.Year2018 }));

        let xAx = g.append("g");
        let yAx = g.append("g")
            .attr("text-anchor", "middle");

        let setTicksY = yAx.selectAll("g")
            .data(y.ticks(4))
            .enter()
            .append("g");

        setTicksY.append("circle")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("opacity", 0.4)
            .attr("r", y);

        yAx.append("circle")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("opacity", 1)
            .attr("r", function() { return y(y.domain()[0]) });

        let labels = setTicksY.append("text")
            .attr("y", function(d) { return -y(d) })
            .attr("dy", "0.32em")
            .attr("fill", "none")
            .attr("stroke-width", .2)
            .attr("stroke-linejoin", "round")
            .text(function(d) { return "$" + d });

        let title = g.append("g")
            .append("text")
            .attr("class", "radtext")
            .attr("dy", "-1.2em")
            .text("Utah Monthly Alcohol Sales");

        g.append("text")
            .attr("class","radtext")
            .attr("dy", "1.4em")
            .attr("dx", "-4em")
            .attr("stroke", "#00b33c")
            .text("2018");

        g.append("text")
            .attr("class","radtext")
            .attr("dy", "1.4em")
            .attr("dx", "0em")
            .attr("stroke", "blue")
            .text("2019");

        g.append("text")
            .attr("class","radtext")
            .attr("dy", "1.4em")
            .attr("dx", "4em")
            .attr("stroke", "red")
            .text("2020");

        setTicksY.append("text")
            .attr("y", function(d) { return -y(d) })
            .attr("dy", "0.4em")
            .style("font-family", "sans-serif")
            .style("font-size", 14)
            .text(function(d) { return "$" + d / 1000000 + "M" });

        let setTicksX = xAx.selectAll("g")
            .data(x.ticks(13))
            .enter()
            .append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + insideRadius + ",0)"});

        setTicksX.append("line")
            .attr("x2", -5)
            .attr("stroke", "black");

        let axisLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        setTicksX.append("text")
            .data(axisLabels)
            .attr("transform", function(d) {
                let month = x(d);
                return ((month < Math.PI / 2) || (month > (Math.PI * 3 / 2)))
                    ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"
            })
            .attr("class", "axisLabel")
            .text(function(d) {return d});

        this.createLines(g, data, x, y)
    }

    createLines(g, data, x, y){
        d3.selectAll("path").exit().remove();
        let line = d3.lineRadial().angle(function(d) { return x(d.MonthDate) })
            .radius(function(d) { return y(d.Year2018) }).defined(function(d) { return d.Year2018 !== 0 });

        let lineTwo = d3.lineRadial().angle(function(d) { return x(d.MonthDate) })
            .radius(function(d) { return y(d.Year2019) });

        let lineThree = d3.lineRadial().angle(function(d) { return x(d.MonthDate) })
            .radius(function(d) { return y(d.Year2020) }).defined(function(d) { return d.Year2020 !== 0 });

        this.makeLines(g, data, line, lineTwo, lineThree)
    }

    makeLines(g, data, line, lineTwo, lineThree) {
        let plotLineOne = g.append("path")
            .attr("id", "Year2018")
            .attr("fill", "none")
            .attr("stroke", "#00b33c")
            .attr("stroke-width", "2.6px")
            .attr("d", line(data));

        let plotLineTwo = g.append("path")
            .attr("id", "Year2019")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", "2.6px")
            .attr("d", lineTwo(data));

        let plotLineThree = g.append("path")
            .attr("id", "Year2020")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", "2.6px")
            .attr("d", lineThree(data));

        this.drawLines(data, plotLineOne, plotLineTwo, plotLineThree)
    }

    drawLines(data, plotLineOne, plotLineTwo, plotLineThree) {
        let lengthOfLineOne = plotLineOne.node().getTotalLength();
        let lengthOfLineTwo = plotLineTwo.node().getTotalLength();
        let lengthOfLineThree = plotLineThree.node().getTotalLength();

        let toolHover = d3.select("body").append("div");
        let hoverData = this.hoverData;

        plotLineOne
            .data(data)
            .attr("stroke-dasharray", lengthOfLineOne + " " + lengthOfLineOne)
            .attr("stroke-dashoffset", -lengthOfLineOne)
            .transition()
            .duration(6000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        plotLineTwo
            .attr("stroke-dasharray", lengthOfLineTwo + " " + lengthOfLineTwo)
            .attr("stroke-dashoffset", -lengthOfLineTwo)
            .transition()
            .delay(6000)
            .duration(6000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        plotLineThree
            .attr("stroke-dasharray", lengthOfLineThree + " " + lengthOfLineThree)
            .attr("stroke-dashoffset", -lengthOfLineThree)
            .transition()
            .delay(12000)
            .duration(6000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }
}


// Month: "April"
// MonthDate: "2018-04-01"
// SalesTotal: "30033047.65"
