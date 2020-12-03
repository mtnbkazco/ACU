d3.csv("/Data/ACU_DATA_FINAL_SLIM.csv").then(data =>
    {    
    let bubble = new Bubble(data);
    bubble.drawBubble();

    });
