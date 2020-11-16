words = d3.json('categories.json');

words.then( data => {
    console.log(data);

    // console.log("total", d3.min(data, d => parseInt(d.total)));
    // console.log(d3.max(data, d => parseInt(d.total)));
    // console.log(d3.set(data, d => d.category).values());

    let categoriesChart = new CategoriesChart(data);
    categoriesChart.drawTable();
});