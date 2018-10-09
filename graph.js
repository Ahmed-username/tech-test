// draw a graph for an exhange rate over a period of time
function drawGraph(data) {
  const nodes = createNodes(data);

  createGraph(nodes, createEdges(nodes));
}

// creates an array of nodes based on the exchange rate data
function createNodes(data) {
  const minRate = getY(getMinRate(data));
  return Object.keys(data.rates).map((day, index) => {
    const dailyRate = data.rates[day][Object.keys(data.rates[day]).join("")];
    const positionX = index * 30;
    const positionY = (getY(dailyRate) - minRate) * 40;
    const label = `(${index + 1})${Math.round(dailyRate * 100) / 100}`;
    const colour = (index + 1) % 2 === 0 ? "#bb3e3b" : "#779126";
    const textPosition = (index + 1) % 2 === 0 ? "top" : "bottom";
    const node = {
      group: "nodes",
      data: { id: label },
      position: { x: positionX, y: positionY },
      style: {
        color: colour,
        "background-color": colour,
        "text-valign": textPosition
      }
    };
    return node;
  });
}

//connect the nodes
function createEdges(nodes) {
  let edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const egde = {
      group: "edges",
      data: {
        id: `e${i}`,
        source: nodes[i].data.id,
        target: nodes[i + 1].data.id
      }
    };
    edges.push(egde);
  }
  return edges;
}

//create the graph from a given nodes and egdes
function createGraph(nodes, edges) {
  let cy = cytoscape({
    container: document.getElementById("cy"),
    zoom: 1,
    pan: { x: 0, y: 0 },
    style: [
      // the stylesheet for the graph
      {
        selector: "node",
        style: {
          "background-color": "#779126",
          label: "data(id)",
          color: "black"
        }
      }
    ]
  });

  cy.add(nodes);
  cy.add(edges);

  cy.animate({
    pan: { x: 100, y: 50 },
    zoom: 0.7,
    duration: 1000
  });
}

// find the smallest exchange rate in a given list
function getMinRate(data) {
  let min = Infinity;
  Object.keys(data.rates).forEach(day => {
    let dailyRate = data.rates[day][Object.keys(data.rates[day]).join("")];
    min = Math.min(min, dailyRate);
  });
  return min;
}

// magnify the rate to an integer of 3 digits
function getY(rate) {
  let arrayFromRate = Array.from(rate.toString());
  let value = "";

  if (rate < 1) {
    for (let i = 2; i < arrayFromRate.length; i++) {
      if (arrayFromRate[i] == 0) continue;

      value = arrayFromRate[i] + arrayFromRate[i + 1] + arrayFromRate[i + 2];
      break;
    }
  } else if (rate > 1) {
    value = arrayFromRate[0] + arrayFromRate[2] + arrayFromRate[3];
  } else value = 1;

  return Number(value);
}
