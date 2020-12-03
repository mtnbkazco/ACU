class CategoriesChart {
    constructor(plotData) {
        this.plotData = plotData;

        this.vizWidth = 600;
        this.vizHeight = 600;
        this.margin = {
            bottom: 20,
            top: 20,
            left: 40,
            right: 20
        }

        this.heightDomainMax = 50000000

        // Make the scales
    }

    drawTable() {
        // Make the scales
        let heightScale = d3.scaleLinear()
            .domain([0, this.heightDomainMax])
            .range([this.vizHeight - this.margin.bottom, this.margin.top]);

        console.log("zero", heightScale(0));
        console.log('2', heightScale(2.0));
        console.log('10', heightScale(10.0));

        let widthScale = d3.scaleBand()
            .domain(this.plotData.map(d => d.month))
            .range([this.margin.left, this.vizWidth - this.margin.right])
            .padding(.1);

        // Draw the axis
        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(heightScale).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())

        let xAxis = g => g
            .attr("transform", `translate(0,${this.vizHeight - this.margin.bottom})`)
            .call(d3.axisBottom(widthScale).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())

        let svg = d3.select("#categories-plot");

        svg.attr('height', this.vizHeight)
            .attr('width', this.vizWidth);

        svg.append('g')
            .call(yAxis);

        svg.append('g')
            .call(xAxis);

        // Add the bars
        // Wine
        svg.append('g')
            .selectAll('rect')
            .data(this.plotData)
            .join('rect')
            .attr('x', d => widthScale(d.month))
            .attr('y', d => heightScale(d.totals.wine))
            .attr('height', d => heightScale(0) - heightScale(d.totals.wine))
            .attr('width', widthScale.bandwidth())
            .classed('wine', true);

        // Beer
        svg.append('g')
            .selectAll('rect')
            .data(this.plotData)
            .join('rect')
            .attr('x', d => widthScale(d.month))
            .attr('y', d => heightScale(d.totals.beer) - (heightScale(0) - heightScale(d.totals.wine)))
            .attr('height', d => heightScale(0) - heightScale(d.totals.beer))
            .attr('width', widthScale.bandwidth())
            .classed('beer', true);

        // Spirits
        svg.append('g')
            .selectAll('rect')
            .data(this.plotData)
            .join('rect')
            .attr('x', d => widthScale(d.month))
            .attr('y', d => heightScale(d.totals.spirits) - (heightScale(0) - heightScale(d.totals.wine)) - (heightScale(0) - heightScale(d.totals.beer)))
            .attr('height', d => heightScale(0) - heightScale(d.totals.spirits))
            .attr('width', widthScale.bandwidth())
            .classed('spirits', true);
    }
}