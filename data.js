module.exports=	{
  "width": 400,
  "height": 200,
  "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},

  "signals": [
    {
      "name": "tooltip",
      "init": {},
      "streams": [
        {"type": "rect:mouseover", "expr": "datum"},
        {"type": "rect:mouseout", "expr": "{}"}
      ]
    },
    {
    	"name": "A", "init": 1
	}
  ],
  "data": [
    {
      "name": "table",
      "values": [
        {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
        {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
        {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
        {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
        {"x": 9,  "y": 52}, {"x": 10, "y": 48},
        {"x": 11, "y": 24}, {"x": 12, "y": 49},
        {"x": 13, "y": 87}, {"x": 14, "y": 66},
        {"x": 15, "y": 17}, {"x": 16, "y": 27},
        {"x": 17, "y": 68}, {"x": 18, "y": 16},
        {"x": 19, "y": 49}, {"x": 20, "y": 15}
      ],
      "modify": [
          {"type": "insert", "signal": "A"}
        ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "ordinal",
      "range": "width",
      "domain": {"data": "table", "field": "x"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "domain": {"data": "table", "field": "y"},
      "nice": true
    }
  ],

  "axes": [{"type": "x", "scale": "x"}],

  "marks": [
    {
      "type": "rect",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"scale": "x", "field": "x"},
          "width": {"scale": "x", "band": true, "offset": -1},
          "y": {"scale": "y", "field": "y"},
          "y2": {"scale": "y", "value": 0}
        },
        "update": {
		  "x": {"scale": "x", "field": "x"},
          "width": {"scale": "x", "band": true, "offset": -1},
          "y": {"scale": "y", "field": "y"},
          "y2": {"scale": "y", "value": 0},
          "fill": [
            { "test": "datum._id == tooltip._id",
              "value": "red"
            },
            {"value": "steelblue"}
          ]
        }
      }
    },
    {
      "type": "text",
      "properties": {
        "enter": {
          "align": {"value": "center"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "x", "signal": "tooltip.x"},
          "dx": {"scale": "x", "band": true, "mult": 0.5},
          "y": {"scale": "y", "signal": "tooltip.y", "offset": -5},
          "text": {"signal": "tooltip.y"},
          "fillOpacity": [
            { "test": "!tooltip._id",
              "value": 0
            },
            {"value": 1}
          ]
        }
      }
    }
  ]
}