describe("graph.js", function() {
  describe("performs operations of a list of exchange rates", function() {
    let data, data2;
    beforeAll(function() {
      data = {
        rates: {
          day1: { currency: 1239 },
          day2: { currency: 1231 },
          day3: { currency: 1232 }
        }
      };

      data2 = {
        rates: {
          day1: { currency: 13200 },
          day2: { currency: 1232 },
          day3: { currency: 1234 }
        }
      };
    });

    it("returns min value in a list of exchange rates", function() {
      console.log("this", this);
      expect(getMinRate(data)).toBe(1231);
      expect(getMinRate(data2)).toBe(1232);
    });

    it("returns a list of nodes", function() {
      const result = [
        {
          group: "nodes",
          data: { id: "(1)1239" },
          position: { x: 0 * 30, y: (1239 - 1231) * 40 },
          style: {
            color: "#779126",
            "background-color": "#779126",
            "text-valign": "bottom"
          }
        },
        {
          group: "nodes",
          data: { id: "(2)1231" },
          position: { x: 1 * 30, y: (1231 - 1231) * 40 },
          style: {
            color: "#bb3e3b",
            "background-color": "#bb3e3b",
            "text-valign": "top"
          }
        },
        {
          group: "nodes",
          data: { id: "(3)1232" },
          position: { x: 2 * 30, y: (1232 - 1231) * 40 },
          style: {
            color: "#779126",
            "background-color": "#779126",
            "text-valign": "bottom"
          }
        }
      ];
      expect(createNodes(data)).toEqual(result);
    });
  });

  it("magnifies a number to an integer of 3 digits", function() {
    const number1 = 0.000053694;
    expect(getY(number1)).toBe(536);

    const number2 = 1.526353;

    expect(getY(number2)).toBe(152);
  });

  it("returns a list of edges that connects a given nodes", function() {
    const nodes = [
      {
        group: "nodes",
        data: { id: "(1)1239" },
        position: { x: 0 * 30, y: (1239 - 1231) * 40 },
        style: {
          color: "#779126",
          "background-color": "#779126",
          "text-valign": "bottom"
        }
      },
      {
        group: "nodes",
        data: { id: "(2)1231" },
        position: { x: 1 * 30, y: (1231 - 1231) * 40 },
        style: {
          color: "#bb3e3b",
          "background-color": "#bb3e3b",
          "text-valign": "top"
        }
      },
      {
        group: "nodes",
        data: { id: "(3)1232" },
        position: { x: 2 * 30, y: (1232 - 1231) * 40 },
        style: {
          color: "#779126",
          "background-color": "#779126",
          "text-valign": "bottom"
        }
      }
    ];

    const result = [
      {
        group: "edges",
        data: {
          id: `e0`,
          source: "(1)1239",
          target: "(2)1231"
        }
      },
      {
        group: "edges",
        data: {
          id: `e1`,
          source: "(2)1231",
          target: "(3)1232"
        }
      }
    ];

    expect(createEdges(nodes)).toEqual(result);
  });
});
