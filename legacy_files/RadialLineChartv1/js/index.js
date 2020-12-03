////////////////////////////
// data pull and organize //
////////////////////////////


class DataPull {
    constructor(data) {
        this.data = data
        console.log(data)
        this.buildChart(data)
    }

    buildChart(data) {
        console.log(data)
        let margin = { top: 20, right: 10, bottom: 20, left: 10 }
        let width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom

        let svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        let insideRadius = 100
        let outsideRadius = Math.min(width, height) / 2 - 6
        let setTime = d3.timeParse("%Y-%m-%d")
        let formatMonth = d3.timeFormat("%b")

        let makeCircle = 2 * Math.PI

        let x = d3.scaleTime().range([0, makeCircle])
        let y = d3.scaleRadial().range([insideRadius, outsideRadius])

        let data1 = []
        let data2 = []
        let data3 = []
        for (let d = 0; d < data.length; d++) {
            if (data[d].MonthDate.includes("2020")) {
                data1.push(data[d])
            }
            if (data[d].MonthDate.includes("2019")) {
                data2.push(data[d])
            }
            if (data[d].MonthDate.includes("2018")) {
                data3.push(data[d])
            }
        }

        let line = d3.lineRadial().angle(function(data1) { return x(data1.MonthDate) })
            .radius(function(data1) { return y(data1.SalesTotal) })

        let lineTwo = d3.lineRadial().angle(function(data2) { return x(data2.MonthDate) })
            .radius(function(data2) { return y(data2.SalesTotal) })

        let lineThree = d3.lineRadial().angle(function(data3) { return x(data3.MonthDate) })
            .radius(function(data3) { return y(data3.SalesTotal) })

        for (let d of data) {
            d.MonthDate = setTime(d.MonthDate)
            d.SalesTotal = +d.SalesTotal
        }

        x.domain(d3.extent(data, function(d) { return d.MonthDate }))
        y.domain(d3.extent(data, function(d) { return d.SalesTotal }))

        let plotLineOne = g.append("path")
            .datum(data1)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", "4px")
            .attr("d", line)

        let plotLineTwo = g.append("path")
            .datum(data2)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", "4px")
            .attr("d", lineTwo)

        let plotLineThree = g.append("path")
            .datum(data3)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", "4px")
            .attr("d", lineThree)

        let yAx = g.append("g")
            .attr("text-anchor", "middle")

        let setTicksY = yAx.selectAll("g")
            .data(y.ticks(5))
            .enter()
            .append("g")
        setTicksY.append("circle")
            .attr("fill", "none")
            .attr("stoke", "black")
            .attr("opacity", 0.2)
            .attr("r", y)

        yAx.append("circle")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("opacity", 0.2)
            .attr("r", function() { return y(y.domain()[0]) })

        let labels = setTicksY.append("text")
            .attr("y", function(d) { return -y(d) })
            .attr("dy", "0.35em")
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .text(function(d) { return "$" + d })

        setTicksY.append("text")
            .attr("y", function(d) { return -y(d) })
            .attr("dy", "0.35em")
            .text(function(d) { return "$" + d })

        let xAx = g.append("g")

        let setTicksX = xAx.selectAll("g")
            .data(x.ticks(12))
            .enter()
            .append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + insideRadius + ",0)"
            })

        setTicksX.append("line")
            .attr("x2", -5)
            .attr("stroke", "#000")

        let axisLabels = ["Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
        setTicksX.append("text")
            .data(axisLabels)
            .attr("transform", function(d) {
                let month = x(d)
                return ((month < Math.PI / 2) || (month > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"
            })
            .text(function(d) {
                return d
            })
            .style("font-size", 10)
            .attr("opacity", 0.6)

        let lengthOfLineOne = plotLineOne.node().getTotalLength()
        let lengthOfLineTwo = plotLineTwo.node().getTotalLength()
        let lengthOfLineThree = plotLineThree.node().getTotalLength()

        plotLineOne
            .attr("stroke-dasharray", lengthOfLineOne + " " + lengthOfLineOne)
            .attr("stroke-dashoffset", -lengthOfLineOne)
            .transition()
            .duration(2600)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

        plotLineTwo
            .attr("stroke-dasharray", lengthOfLineTwo + " " + lengthOfLineTwo)
            .attr("stroke-dashoffset", -lengthOfLineTwo)
            .transition()
            .duration(2600)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

        plotLineThree
            .attr("stroke-dasharray", lengthOfLineThree + " " + lengthOfLineThree)
            .attr("stroke-dashoffset", -lengthOfLineThree)
            .transition()
            .duration(2600)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
    }
}

// Month: "April"
// MonthDate: "2018-04-01"
// SalesTotal: "30033047.65"
