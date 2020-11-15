d3.csv("/data/ACU_DATA_FINAL.csv").then(data =>
    {    
    let bubble = new Bubble(data);
    bubble.drawBubble();

    });