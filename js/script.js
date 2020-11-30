load_categories = d3.json('data/categories.json');
load_spirits = d3.csv('data/spirits.csv');
load_wine = d3.csv('data/wine.csv');
load_beer = d3.csv('data/beer.csv');
load_month = d3.csv('data/MonthSales.csv');
let promises = [load_categories, load_spirits, load_wine, load_beer, load_month];

Promise.all(promises).then(function(values) {
    let [categories, spirits, wine, beer, month] = values;

    // Create Categories Visualization
    let categoriesChart = new CategoriesChart(categories, spirits, wine, beer);
    categoriesChart.drawTable(null);

    // Create monthly sales visualization
    let build = new DataPull(month)
});


d3.csv("/data/ACU_DATA_FINAL_SLIM.csv").then(data =>
    {    
    let bubble = new Bubble(data);
    bubble.drawBubble()
    bubble.updateBubble();

    let linechart = new Line_Chart(data);
    linechart.drawLine();

    });
