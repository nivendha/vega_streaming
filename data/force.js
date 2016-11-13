var forceData= require('./forceData.js');

module.exports={
  "width": 500,
  "height": 500,
  "padding": {"top":0, "bottom":0, "left":0, "right":0},

  "data": [
    {
      "name": "edges",
      "values":forceData.links
    },
    {
      "name": "nodes",
      "values":forceData.nodes,
      "transform": [
        {
          "type": "force",
          "links": "edges",
          "linkDistance": 70,
          "charge": -80,
          "iterations": 1000
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "shapes",
      "type": "ordinal",
      "domain": {"data": "nodes", "field": "group"},
      "range": "shapes"
    }
  ],

  "marks": [
    {
      "type": "path",
      "from": {
        "data": "edges",
        "transform": [
          { "type": "lookup", "on": "nodes",
            "keys": ["source", "target"],
            "as":   ["_source", "_target"] },
          { "type": "linkpath", "shape": "line" }
        ]
      },
      "properties": {
        "update": {
          "path": {"field": "layout_path"},
          "stroke": {"value": "#ccc"},
          "strokeWidth": {"value": 0.5}
        }
      }
    },
    {
      "type": "symbol",
      "from": {"data": "nodes"},
      "properties": {
        "enter": {
          "shape": {"scale": "shapes", "field": "group"},
          "fillOpacity": {"value": 0.3},
          "stroke": {"value": "steelblue"}
        },
        "update": {
          "x": {"field": "layout_x"},
          "y": {"field": "layout_y"},
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "#f00"}
        }
      }
    }
  ]
}