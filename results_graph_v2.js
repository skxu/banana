  
/*
d3.text("trace10", function(d) {
  data = d3.csv.parseRows(d).map(function(row) {
    return row.map(function(value) {
      value_array = value.split(" ");
      return {
        total_pkt: +value_array[0],
        avg_pkt_size: +value_array[1],
        avg_size_ip: +value_array[2],
        total_src_ip: +value_array[3],
        entropy_src_ip: +value_array[4],
        total_dst_ip: +value_array[5],
        entropy_dst_ip: +value_array[6],
        total_src_prt: +value_array[7],
        entropy_src_prt: +value_array[8],
        total_dst_prt: +value_array[9],
        entropy_dst_prt: +value_array[10],
        entropy_tcp_flag: +value_array[11],
        avg_window_size: +value_array[12]
      }
    });
  });
//do stuff with data here

};
*/

    var margin = {top: 10, right: 10, bottom: 100, left: 80},
    margin2 = {top: 430, right: 10, bottom: 20, left: 80},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%S").parse;

var x = d3.scale.linear().range([0, width]),
    x2 = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

/*
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.avg_pkt_size); });
*/

var area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return y(d.avg_pkt_size);
      } else {
        return 500.0;
      }
    });

var area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return y(d.avg_pkt_size);
      } else {
        return 500.0;
      }
    });

var area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return y(d.avg_pkt_size);
      } else {
        return 500.0;
      }
    });


var area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "attack") {
        return y(d.avg_pkt_size);
      } else {
        return 500.0;
      }
    });


/*
var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) { return y2(d.avg_pkt_size); });
*/


var area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return y2(d.avg_pkt_size);
      } else {
        return 50.0;
      }
    });

var area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return y2(d.avg_pkt_size);
      } else {
        return 50.0;
      }
    });

var area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return y2(d.avg_pkt_size);
      } else {
        return 50.0;
      }
    });

var area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "attack") {
        return y2(d.avg_pkt_size);
      } else {
        return 50.0;
      }
    });


d3.select("body").append("h1").text("AVERAGE PACKET SIZE");

var avg_pkt_size_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



avg_pkt_size_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = avg_pkt_size_svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = avg_pkt_size_svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




/* =============== TOTAL PACKET COUNT PER 10 SECOND SLICE ===== 
  =============================================================
  
*/

var tp_x = d3.scale.linear().range([0, width]),
    tp_x2 = d3.scale.linear().range([0, width]),
    tp_y = d3.scale.linear().range([height, 0]),
    tp_y2 = d3.scale.linear().range([height2, 0]);

var tp_xAxis = d3.svg.axis().scale(tp_x).orient("bottom"),
    tp_xAxis2 = d3.svg.axis().scale(tp_x2).orient("bottom"),
    tp_yAxis = d3.svg.axis().scale(tp_y).orient("left");

var tp_brush = d3.svg.brush()
    .x(tp_x2)
    .on("brush", tp_brushed);

/*
var tp_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tp_x(d.time); })
    .y0(height)
    .y1(function(d) { return tp_y(d.total_pkt); });


var tp_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tp_y2(d.total_pkt); });
*/

var tp_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
        if (d.color == "false_positive") {
          return tp_y2(d.total_pkt);
        } else {
          return 50.0;
        }
    });

var tp_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
        if (d.color == "false_negative") {
          return tp_y2(d.total_pkt);
        } else {
          return 50.0;
        }
    });

var tp_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
        if (d.color == "attack") {
          return tp_y2(d.total_pkt);
        } else {
          return 50.0;
        }
    });

var tp_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
        if (d.color == "no_attack") {
          return tp_y2(d.total_pkt);
        } else {
          return 50.0;
        }
    });

var tp_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return tp_y(d.total_pkt);
      } else {
        return 500.0;
      }
    });

var tp_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return tp_y(d.total_pkt);
      } else {
        return 500.0;
      }
    });

var tp_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "attack") {
        return tp_y(d.total_pkt);
      } else {
        return 500.0;
      }
    });

var tp_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return tp_y(d.total_pkt);
      } else {
        return 500.0;
      }
    });



d3.select("body").append("h1").text("TOTAL PACKET COUNT");

var tp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var tp_focus = tp_svg.append("g")
    .attr("class", "tp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tp_context = tp_svg.append("g")
    .attr("class", "tp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== AVG BYTES SENT PER UNIQUE IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var asi_x = d3.scale.linear().range([0, width]),
    asi_x2 = d3.scale.linear().range([0, width]),
    asi_y = d3.scale.linear().range([height, 0]),
    asi_y2 = d3.scale.linear().range([height2, 0]);

var asi_xAxis = d3.svg.axis().scale(asi_x).orient("bottom"),
    asi_xAxis2 = d3.svg.axis().scale(asi_x2).orient("bottom"),
    asi_yAxis = d3.svg.axis().scale(asi_y).orient("left");

var asi_brush = d3.svg.brush()
    .x(asi_x2)
    .on("brush", asi_brushed);
/*
var asi_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return asi_x(d.time); })
    .y0(height)
    .y1(function(d) { return asi_y(d.avg_size_ip); });

var asi_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return asi_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return asi_y2(d.avg_size_ip); });
*/

var asi_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return asi_y(d.avg_size_ip);
      } else {
        return 500.0;
      }
    });

var asi_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return asi_y(d.avg_size_ip);
      } else {
        return 500.0;
      }
    });

var asi_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return asi_y(d.avg_size_ip);
      } else {
        return 500.0;
      }
    });

var asi_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "attack") {
        return asi_y(d.avg_size_ip);
      } else {
        return 500.0;
      }
    });

var asi_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return asi_y2(d.avg_size_ip);
      } else {
        return 50.0;
      }
    });

var asi_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return asi_y2(d.avg_size_ip);
      } else {
        return 50.0;
      }
    });

var asi_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return asi_y2(d.avg_size_ip);
      } else {
        return 50.0;
      }
    });

var asi_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return asi_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "attack") {
        return asi_y2(d.avg_size_ip);
      } else {
        return 50.0;
      }
    });

d3.select("body").append("h1").text("AVERAGE BYTES SENT PER UNIQUE IP");

var asi_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



asi_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var asi_focus = asi_svg.append("g")
    .attr("class", "asi_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var asi_context = asi_svg.append("g")
    .attr("class", "asi_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== TOTAL SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var tsip_x = d3.scale.linear().range([0, width]),
    tsip_x2 = d3.scale.linear().range([0, width]),
    tsip_y = d3.scale.linear().range([height, 0]),
    tsip_y2 = d3.scale.linear().range([height2, 0]);

var tsip_xAxis = d3.svg.axis().scale(tsip_x).orient("bottom"),
    tsip_xAxis2 = d3.svg.axis().scale(tsip_x2).orient("bottom"),
    tsip_yAxis = d3.svg.axis().scale(tsip_y).orient("left");

var tsip_brush = d3.svg.brush()
    .x(tsip_x2)
    .on("brush", tsip_brushed);

/*
var tsip_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tsip_x(d.time); })
    .y0(height)
    .y1(function(d) { return tsip_y(d.total_src_ip); });

var tsip_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tsip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tsip_y2(d.total_src_ip); });
*/

var tsip_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return tsip_y(d.total_src_ip);
      } else {
        return 500.0;
      }
    });

var tsip_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return tsip_y(d.total_src_ip);
      } else {
        return 500.0;
      }
    });

var tsip_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "attack") {
        return tsip_y(d.total_src_ip);
      } else {
        return 500.0;
      }
    });

var tsip_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return tsip_y(d.total_src_ip);
      } else {
        return 500.0;
      }
    });

var tsip_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return tsip_y2(d.total_src_ip);
      } else {
        return 50.0;
      }
    });

var tsip_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return tsip_y2(d.total_src_ip);
      } else {
        return 50.0;
      }
    });

var tsip_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "attack") {
        return tsip_y2(d.total_src_ip);
      } else {
        return 50.0;
      }
    });

var tsip_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) {return tsip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return tsip_y2(d.total_src_ip);
      } else {
        return 50.0;
      }
    });

d3.select("body").append("h1").text("TOTAL UNIQUE SOURCE IP");

var tsip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tsip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var tsip_focus = tsip_svg.append("g")
    .attr("class", "tsip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tsip_context = tsip_svg.append("g")
    .attr("class", "tsip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== ENTROPY SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var esip_x = d3.scale.linear().range([0, width]),
    esip_x2 = d3.scale.linear().range([0, width]),
    esip_y = d3.scale.linear().range([height, 0]),
    esip_y2 = d3.scale.linear().range([height2, 0]);

var esip_xAxis = d3.svg.axis().scale(esip_x).orient("bottom"),
    esip_xAxis2 = d3.svg.axis().scale(esip_x2).orient("bottom"),
    esip_yAxis = d3.svg.axis().scale(esip_y).orient("left");

var esip_brush = d3.svg.brush()
    .x(esip_x2)
    .on("brush", esip_brushed);

/*
var esip_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return esip_x(d.time); })
    .y0(height)
    .y1(function(d) { return esip_y(d.entropy_src_ip); });

var esip_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return esip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return esip_y2(d.entropy_src_ip); });
*/

var esip_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return esip_y(d.entropy_src_ip);
      } else {
        return 500.0;
      }
    });

var esip_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return esip_y(d.entropy_src_ip);
      } else {
        return 500.0;
      }
    });

var esip_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "attack") {
        return esip_y(d.entropy_src_ip);
      } else {
        return 500.0;
      }
    });

var esip_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return esip_y(d.entropy_src_ip);
      } else {
        return 500.0;
      }
    });

var esip_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "false_positive") {
        return esip_y2(d.entropy_src_ip);
      } else {
        return 50.0;
      }
    });

var esip_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "false_negative") {
        return esip_y2(d.entropy_src_ip);
      } else {
        return 50.0;
      }
    });

var esip_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "attack") {
        return esip_y2(d.entropy_src_ip);
      } else {
        return 50.0;
      }
    });

var esip_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if (d.color == "no_attack") {
        return esip_y2(d.entropy_src_ip);
      } else {
        return 50.0;
      }
    });

d3.select("body").append("h1").text("ENTROPY OF SOURCE IP");

var esip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



esip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var esip_focus = esip_svg.append("g")
    .attr("class", "esip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var esip_context = esip_svg.append("g")
    .attr("class", "esip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== TOTAL UNIQUE DST IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var tdip_x = d3.scale.linear().range([0, width]),
    tdip_x2 = d3.scale.linear().range([0, width]),
    tdip_y = d3.scale.linear().range([height, 0]),
    tdip_y2 = d3.scale.linear().range([height2, 0]);

var tdip_xAxis = d3.svg.axis().scale(tdip_x).orient("bottom"),
    tdip_xAxis2 = d3.svg.axis().scale(tdip_x2).orient("bottom"),
    tdip_yAxis = d3.svg.axis().scale(tdip_y).orient("left");

var tdip_brush = d3.svg.brush()
    .x(tdip_x2)
    .on("brush", tdip_brushed);

/*
var tdip_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tdip_x(d.time); })
    .y0(height)
    .y1(function(d) { return tdip_y(d.total_dst_ip); });

var tdip_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tdip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tdip_y2(d.total_dst_ip); });
*/

var tdip_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "false_positive") {
        return tdip_y(d.total_dst_ip); 
      } else {
        return 500.0;
      }
    });

var tdip_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "false_negative") {
        return tdip_y(d.total_dst_ip); 
      } else {
        return 500.0;
      }
    });

var tdip_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "attack") {
        return tdip_y(d.total_dst_ip); 
      } else {
        return 500.0;
      }
    });

var tdip_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "no_attack") {
        return tdip_y(d.total_dst_ip); 
      } else {
        return 500.0;
      }
    });

var tdip_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "false_positive") {
        return tdip_y2(d.total_dst_ip); 
      } else {
        return 50.0;
      }
    });

var tdip_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "false_negative") {
        return tdip_y2(d.total_dst_ip); 
      } else {
        return 50.0;
      }
    });

var tdip_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "attack") {
        return tdip_y2(d.total_dst_ip); 
      } else {
        return 50.0;
      }
    });

var tdip_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "no_attack") {
        return tdip_y2(d.total_dst_ip); 
      } else {
        return 50.0;
      }
    });


d3.select("body").append("h1").text("UNIQUE DST IP'S");

var tdip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tdip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var tdip_focus = tdip_svg.append("g")
    .attr("class", "tdip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tdip_context = tdip_svg.append("g")
    .attr("class", "tdip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== ENTROPY DST IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var edip_x = d3.scale.linear().range([0, width]),
    edip_x2 = d3.scale.linear().range([0, width]),
    edip_y = d3.scale.linear().range([height, 0]),
    edip_y2 = d3.scale.linear().range([height2, 0]);

var edip_xAxis = d3.svg.axis().scale(edip_x).orient("bottom"),
    edip_xAxis2 = d3.svg.axis().scale(edip_x2).orient("bottom"),
    edip_yAxis = d3.svg.axis().scale(edip_y).orient("left");

var edip_brush = d3.svg.brush()
    .x(edip_x2)
    .on("brush", edip_brushed);

/*
var edip_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return edip_x(d.time); })
    .y0(height)
    .y1(function(d) { return edip_y(d.entropy_dst_ip); });

var edip_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return edip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return edip_y2(d.entropy_dst_ip); });
*/

var edip_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return edip_y(d.entropy_dst_ip);
      } else {
        return 500.0;
      }
    });

var edip_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return edip_y(d.entropy_dst_ip);
      } else {
        return 500.0;
      }
    });

var edip_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "attack") {
        return edip_y(d.entropy_dst_ip);
      } else {
        return 500.0;
      }
    });

var edip_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return edip_y(d.entropy_dst_ip);
      } else {
        return 500.0;
      }
    });

var edip_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return edip_y2(d.entropy_dst_ip);
      } else {
        return 50.0;
      }
    });

var edip_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return edip_y2(d.entropy_dst_ip);
      } else {
        return 50.0;
      }
    });

var edip_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "attack") {
        return edip_y2(d.entropy_dst_ip);
      } else {
        return 50.0;
      }
    });

var edip_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edip_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return edip_y2(d.entropy_dst_ip);
      } else {
        return 50.0;
      }
    });



d3.select("body").append("h1").text("ENTROPY OF DST IP");

var edip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



edip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var edip_focus = edip_svg.append("g")
    .attr("class", "edip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var edip_context = edip_svg.append("g")
    .attr("class", "edip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== TOTAL SRC PORT PER 10 SECOND SLICE ======
   =============================================================
  
*/

var tsp_x = d3.scale.linear().range([0, width]),
    tsp_x2 = d3.scale.linear().range([0, width]),
    tsp_y = d3.scale.linear().range([height, 0]),
    tsp_y2 = d3.scale.linear().range([height2, 0]);

var tsp_xAxis = d3.svg.axis().scale(tsp_x).orient("bottom"),
    tsp_xAxis2 = d3.svg.axis().scale(tsp_x2).orient("bottom"),
    tsp_yAxis = d3.svg.axis().scale(tsp_y).orient("left");

var tsp_brush = d3.svg.brush()
    .x(tsp_x2)
    .on("brush", tsp_brushed);


/*
var tsp_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tsp_x(d.time); })
    .y0(height)
    .y1(function(d) { return tsp_y(d.total_src_prt); });

var tsp_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tsp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tsp_y2(d.total_src_prt); });
*/

var tsp_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return tsp_y(d.total_src_prt);
      } else {
        return 500.0;
      }
    });
      
var tsp_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return tsp_y(d.total_src_prt);
      } else {
        return 500.0;
      }
    });
      

var tsp_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "attack") {
        return tsp_y(d.total_src_prt);
      } else {
        return 500.0;
      }
    });
      

var tsp_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return tsp_y(d.total_src_prt);
      } else {
        return 500.0;
      }
    });

var tsp_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return tsp_y2(d.total_src_prt);
      } else {
        return 50.0;
      }
    });
      
var tsp_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return tsp_y2(d.total_src_prt);
      } else {
        return 50.0;
      }
    });
      

var tsp_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "attack") {
        return tsp_y2(d.total_src_prt);
      } else {
        return 50.0;
      }
    });
      

var tsp_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tsp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return tsp_y2(d.total_src_prt);
      } else {
        return 50.0;
      }
    });
      



d3.select("body").append("h1").text("TOTAL SRC PORT");

var tsp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tsp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var tsp_focus = tsp_svg.append("g")
    .attr("class", "tsp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tsp_context = tsp_svg.append("g")
    .attr("class", "tsp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== ENTROPY SRC PORT PER 10 SECOND SLICE ======
   =============================================================
  
*/

var esp_x = d3.scale.linear().range([0, width]),
    esp_x2 = d3.scale.linear().range([0, width]),
    esp_y = d3.scale.linear().range([height, 0]),
    esp_y2 = d3.scale.linear().range([height2, 0]);

var esp_xAxis = d3.svg.axis().scale(esp_x).orient("bottom"),
    esp_xAxis2 = d3.svg.axis().scale(esp_x2).orient("bottom"),
    esp_yAxis = d3.svg.axis().scale(esp_y).orient("left");

var esp_brush = d3.svg.brush()
    .x(esp_x2)
    .on("brush", esp_brushed);

/*
var esp_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return esp_x(d.time); })
    .y0(height)
    .y1(function(d) { return esp_y(d.entropy_src_prt); });

var esp_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return esp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return esp_y2(d.entropy_src_prt); });
*/

var esp_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return esp_y(d.entropy_src_prt);
      } else {
        return 500.0;
      }
    });

var esp_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return esp_y(d.entropy_src_prt);
      } else {
        return 500.0;
      }
    });

var esp_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "attack") {
        return esp_y(d.entropy_src_prt);
      } else {
        return 500.0;
      }
    });

var esp_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return esp_y(d.entropy_src_prt);
      } else {
        return 500.0;
      }
    });

var esp_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return esp_y2(d.entropy_src_prt);
      } else {
        return 50.0;
      }
    });

var esp_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return esp_y2(d.entropy_src_prt);
      } else {
        return 50.0;
      }
    });

var esp_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "attack") {
        return esp_y2(d.entropy_src_prt);
      } else {
        return 50.0;
      }
    });

var esp_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return esp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return esp_y2(d.entropy_src_prt);
      } else {
        return 50.0;
      }
    });


d3.select("body").append("h1").text("ENTROPY OF SRC PORT");

var esp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



esp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var esp_focus = esp_svg.append("g")
    .attr("class", "esp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var esp_context = esp_svg.append("g")
    .attr("class", "esp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== TOTAL DST PORT PER 10 SECOND SLICE ======
   =============================================================
  
*/

var tdp_x = d3.scale.linear().range([0, width]),
    tdp_x2 = d3.scale.linear().range([0, width]),
    tdp_y = d3.scale.linear().range([height, 0]),
    tdp_y2 = d3.scale.linear().range([height2, 0]);

var tdp_xAxis = d3.svg.axis().scale(tdp_x).orient("bottom"),
    tdp_xAxis2 = d3.svg.axis().scale(tdp_x2).orient("bottom"),
    tdp_yAxis = d3.svg.axis().scale(tdp_y).orient("left");

var tdp_brush = d3.svg.brush()
    .x(tdp_x2)
    .on("brush", tdp_brushed);

/*
var tdp_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tdp_x(d.time); })
    .y0(height)
    .y1(function(d) { return tdp_y(d.total_dst_prt); });

var tdp_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tdp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tdp_y2(d.total_dst_prt); });
*/

var tdp_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "false_positive") {
        return tdp_y(d.total_dst_prt);
      } else {
        return 500.0;
      }
    });

var tdp_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "false_negative") {
        return tdp_y(d.total_dst_prt);
      } else {
        return 500.0;
      }
    });

var tdp_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "attack") {
        return tdp_y(d.total_dst_prt);
      } else {
        return 500.0;
      }
    });

var tdp_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "no_attack") {
        return tdp_y(d.total_dst_prt);
      } else {
        return 500.0;
      }
    });

var tdp_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "false_positive") {
        return tdp_y2(d.total_dst_prt);
      } else {
        return 50.0;
      }
    });

var tdp_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "false_negative") {
        return tdp_y2(d.total_dst_prt);
      } else {
        return 50.0;
      }
    });

var tdp_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "attack") {
        return tdp_y2(d.total_dst_prt);
      } else {
        return 50.0;
      }
    });

var tdp_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return tdp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "no_attack") {
        return tdp_y2(d.total_dst_prt);
      } else {
        return 50.0;
      }
    });

d3.select("body").append("h1").text("TOTAL UNIQUE DST PORT");

var tdp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tdp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var tdp_focus = tdp_svg.append("g")
    .attr("class", "tdp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tdp_context = tdp_svg.append("g")
    .attr("class", "tdp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


/* ============================================================= 
   ===== ENTROPY DST PORT PER 10 SECOND SLICE ======
   =============================================================
  
*/

var edp_x = d3.scale.linear().range([0, width]),
    edp_x2 = d3.scale.linear().range([0, width]),
    edp_y = d3.scale.linear().range([height, 0]),
    edp_y2 = d3.scale.linear().range([height2, 0]);

var edp_xAxis = d3.svg.axis().scale(edp_x).orient("bottom"),
    edp_xAxis2 = d3.svg.axis().scale(edp_x2).orient("bottom"),
    edp_yAxis = d3.svg.axis().scale(edp_y).orient("left");

var edp_brush = d3.svg.brush()
    .x(edp_x2)
    .on("brush", edp_brushed);

/*
var edp_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return edp_x(d.time); })
    .y0(height)
    .y1(function(d) { return edp_y(d.entropy_dst_prt); });

var edp_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return edp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return edp_y2(d.entropy_dst_prt); });
*/

var edp_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return edp_y(d.entropy_dst_prt); 
      } else {
        return 500.0;
      }
    });

var edp_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return edp_y(d.entropy_dst_prt); 
      } else {
        return 500.0;
      }
    });

var edp_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "attack") {
        return edp_y(d.entropy_dst_prt); 
      } else {
        return 500.0;
      }
    });

var edp_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return edp_y(d.entropy_dst_prt); 
      } else {
        return 500.0;
      }
    });
var edp_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return edp_y2(d.entropy_dst_prt); 
      } else {
        return 50.0;
      }
    });

var edp_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return edp_y2(d.entropy_dst_prt); 
      } else {
        return 50.0;
      }
    });

var edp_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "attack") {
        return edp_y2(d.entropy_dst_prt); 
      } else {
        return 50.0;
      }
    });

var edp_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return edp_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return edp_y2(d.entropy_dst_prt); 
      } else {
        return 50.0;
      }
    });



d3.select("body").append("h1").text("ENTROPY OF DST PORT");

var edp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



edp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var edp_focus = edp_svg.append("g")
    .attr("class", "edp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var edp_context = edp_svg.append("g")
    .attr("class", "edp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");







/* ============================================================= 
   ===== ENTROPY TCP FLAG PER 10 SECOND SLICE ======
   =============================================================
  
*/

var etcpf_x = d3.scale.linear().range([0, width]),
    etcpf_x2 = d3.scale.linear().range([0, width]),
    etcpf_y = d3.scale.linear().range([height, 0]),
    etcpf_y2 = d3.scale.linear().range([height2, 0]);

var etcpf_xAxis = d3.svg.axis().scale(etcpf_x).orient("bottom"),
    etcpf_xAxis2 = d3.svg.axis().scale(etcpf_x2).orient("bottom"),
    etcpf_yAxis = d3.svg.axis().scale(etcpf_y).orient("left");

var etcpf_brush = d3.svg.brush()
    .x(etcpf_x2)
    .on("brush", etcpf_brushed);

/*
var etcpf_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return etcpf_x(d.time); })
    .y0(height)
    .y1(function(d) { return etcpf_y(d.entropy_tcp_flag); });

var etcpf_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return etcpf_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return etcpf_y2(d.entropy_tcp_flag); });
*/

var etcpf_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "false_positive") {
        return etcpf_y(d.entropy_tcp_flag);
      } else {
        return 500.0;
      }
    });

var etcpf_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "false_negative") {
        return etcpf_y(d.entropy_tcp_flag);
      } else {
        return 500.0;
      }
    });

var etcpf_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "attack") {
        return etcpf_y(d.entropy_tcp_flag);
      } else {
        return 500.0;
      }
    });

var etcpf_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x(d.time); })
    .y0(height)
    .y1(function(d) { 
      if(d.color == "no_attack") {
        return etcpf_y(d.entropy_tcp_flag);
      } else {
        return 500.0;
      }
    });


var etcpf_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "false_positive") {
        return etcpf_y2(d.entropy_tcp_flag);
      } else {
        return 50.0;
      }
    });

var etcpf_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "false_negative") {
        return etcpf_y2(d.entropy_tcp_flag);
      } else {
        return 50.0;
      }
    });

var etcpf_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "attack") {
        return etcpf_y2(d.entropy_tcp_flag);
      } else {
        return 50.0;
      }
    });

var etcpf_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return etcpf_x2(d.time); })
    .y0(height2)
    .y1(function(d) { 
      if(d.color == "no_attack") {
        return etcpf_y2(d.entropy_tcp_flag);
      } else {
        return 50.0;
      }
    });



d3.select("body").append("h1").text("ENTROPY OF TCP FLAG");

var etcpf_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



etcpf_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var etcpf_focus = etcpf_svg.append("g")
    .attr("class", "etcpf_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var etcpf_context = etcpf_svg.append("g")
    .attr("class", "etcpf_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


/* ============================================================= 
   ===== AVG TCP WINDOW SIZE PER 10 SECOND SLICE ======
   =============================================================
  
*/

var avgw_x = d3.scale.linear().range([0, width]),
    avgw_x2 = d3.scale.linear().range([0, width]),
    avgw_y = d3.scale.linear().range([height, 0]),
    avgw_y2 = d3.scale.linear().range([height2, 0]);

var avgw_xAxis = d3.svg.axis().scale(avgw_x).orient("bottom"),
    avgw_xAxis2 = d3.svg.axis().scale(avgw_x2).orient("bottom"),
    avgw_yAxis = d3.svg.axis().scale(avgw_y).orient("left");

var avgw_brush = d3.svg.brush()
    .x(avgw_x2)
    .on("brush", avgw_brushed);

/*
var avgw_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return avgw_x(d.time); })
    .y0(height)
    .y1(function(d) { return avgw_y(d.avg_window_size); });

var avgw_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return avgw_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return avgw_y2(d.avg_window_size); });
*/

var avgw_area_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return avgw_y(d.avg_window_size); 
      } else {
        return 500.0;
      }
    });

var avgw_area_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return avgw_y(d.avg_window_size); 
      } else {
        return 500.0;
      }
    });

var avgw_area_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "attack") {
        return avgw_y(d.avg_window_size); 
      } else {
        return 500.0;
      }
    });

var avgw_area_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x(d.time); })
    .y0(height)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return avgw_y(d.avg_window_size); 
      } else {
        return 500.0;
      }
    });

var avgw_area2_inc = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_positive") {
        return avgw_y2(d.avg_window_size); 
      } else {
        return 50.0;
      }
    });

var avgw_area2_corr = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "false_negative") {
        return avgw_y2(d.avg_window_size); 
      } else {
        return 50.0;
      }
    });

var avgw_area2_atk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "attack") {
        return avgw_y2(d.avg_window_size); 
      } else {
        return 50.0;
      }
    });

var avgw_area2_natk = d3.svg.area()
    .interpolate("step-before")
    .x(function(d) { return avgw_x2(d.time); })
    .y0(height2)
    .y1(function(d) {
      if(d.color == "no_attack") {
        return avgw_y2(d.avg_window_size); 
      } else {
        return 50.0;
      }
    });



d3.select("body").append("h1").text("AVERAGE TCP WINDOW SIZE (BYTES)");

var avgw_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



avgw_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var avgw_focus = avgw_svg.append("g")
    .attr("class", "avgw_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var avgw_context = avgw_svg.append("g")
    .attr("class", "avgw_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");















function graph(source) {
  clean(source);
  
  d3.csv(source, type, function(error, data) {
    x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    y.domain([0, d3.max(data.map(function(d) { return d.avg_pkt_size; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", area_natk);
    
    focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", area_atk);
    
    focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", area_corr);
    
    focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", area_inc);

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    
    context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", area2_corr);
    
    context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", area2_inc);
    
    context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", area2_natk);

    context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", area2_atk);
    
    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Average Packet Size (Bytes)");

    //TOTAL PACKET FOR 10 SECOND SLICES

    tp_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    tp_y.domain([0, d3.max(data.map(function(d) { return d.total_pkt; }))]);
    tp_x2.domain(tp_x.domain());
    tp_y2.domain(tp_y.domain());
    
    tp_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tp_area_inc);
    
    tp_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tp_area_corr);
    
    tp_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tp_area_natk);
    
    tp_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tp_area_atk);

    tp_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tp_xAxis);

    tp_focus.append("g")
        .attr("class", "y axis")
        .call(tp_yAxis);

    tp_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tp_area2_inc);
    
    tp_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tp_area2_natk);
    
    tp_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tp_area2_corr);
    
    tp_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tp_area2_atk);

    tp_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tp_xAxis2);

    tp_context.append("g")
        .attr("class", "x brush")
        .call(tp_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
    
    tp_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    tp_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Packet Count In Past 10 Seconds");

    //AVERAGE SIZE IN BYTES PER UNIQUE IP PER 10 SECOND SLICE 

    asi_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    asi_y.domain([0, d3.max(data.map(function(d) { return d.avg_size_ip; }))]);
    asi_x2.domain(asi_x.domain());
    asi_y2.domain(asi_y.domain());

    asi_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", asi_area_natk);
    
    asi_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", asi_area_atk);
    
    asi_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", asi_area_inc);
    
    asi_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", asi_area_corr);

    asi_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(asi_xAxis);

    asi_focus.append("g")
        .attr("class", "y axis")
        .call(asi_yAxis);

    asi_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", asi_area2_natk);
    
    asi_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", asi_area2_atk);
    
    asi_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", asi_area2_inc);

    asi_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", asi_area2_corr);


    asi_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(asi_xAxis2);

    asi_context.append("g")
        .attr("class", "x brush")
        .call(asi_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
    
    asi_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    asi_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Avg Bytes Sent Per Unique IP");


    //TOTAL SRC IP PER 10 SECOND SLICE 

    tsip_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    tsip_y.domain([0, d3.max(data.map(function(d) { return d.total_src_ip; }))]);
    tsip_x2.domain(tsip_x.domain());
    tsip_y2.domain(tsip_y.domain());

     tsip_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tsip_area_natk);
    
    tsip_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tsip_area_atk);
    
    tsip_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tsip_area_inc);
    
    tsip_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tsip_area_corr);

    tsip_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tsip_xAxis);

    tsip_focus.append("g")
        .attr("class", "y axis")
        .call(tsip_yAxis);

    tsip_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tsip_area2_natk);
    
    tsip_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tsip_area2_atk);
    
    tsip_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tsip_area2_inc);

    tsip_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tsip_area2_corr);
    
    tsip_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tsip_xAxis2);

    tsip_context.append("g")
        .attr("class", "x brush")
        .call(tsip_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
    
    tsip_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    tsip_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Unique SRC IP's");

    //ENTROPY SRC IP PER 10 SECOND SLICE 

    esip_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    esip_y.domain([0, d3.max(data.map(function(d) { return d.entropy_src_ip; }))]);
    esip_x2.domain(esip_x.domain());
    esip_y2.domain(esip_y.domain());

    esip_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", esip_area_natk);
    
    esip_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", esip_area_atk);
    
    esip_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", esip_area_inc);
    
    esip_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", esip_area_corr);

    esip_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(esip_xAxis);

    esip_focus.append("g")
        .attr("class", "y axis")
        .call(esip_yAxis);

    esip_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", esip_area2_natk);
    
    esip_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", esip_area2_atk);
    
    esip_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", esip_area2_inc);

    esip_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", esip_area2_corr);
    
    esip_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(esip_xAxis2);

    esip_context.append("g")
        .attr("class", "x brush")
        .call(esip_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
    
    esip_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    esip_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Shannon Entropy of SRC IP's");

    //TOTAL UNIQUE DST IP FOR 10 SECOND SLICES

    tdip_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    tdip_y.domain([0, d3.max(data.map(function(d) {return d.total_dst_ip; }))]);
    tdip_x2.domain(tdip_x.domain());
    tdip_y2.domain(tdip_y.domain());
    
  tdip_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tdip_area_natk);
    
    tdip_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tdip_area_atk);
    
    tdip_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tdip_area_inc);
    
    tdip_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tdip_area_corr);

    tdip_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tdip_xAxis);

    tdip_focus.append("g")
        .attr("class", "y axis")
        .call(tdip_yAxis);

    tdip_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tdip_area2_natk);
    
    tdip_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tdip_area2_atk);
    
    tdip_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tdip_area2_inc);

    tdip_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tdip_area2_corr);

    tdip_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tdip_xAxis2);

    tdip_context.append("g")
        .attr("class", "x brush")
        .call(tdip_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    tdip_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    tdip_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("Unique DST IP's");

    //ENTROPY OF TCP FLAG FOR 10 SECOND SLICES

    edip_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    edip_y.domain([0, d3.max(data.map(function(d) {return d.entropy_dst_ip; }))]);
    edip_x2.domain(edip_x.domain());
    edip_y2.domain(edip_y.domain());
    
    edip_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", edip_area_natk);
    
    edip_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", edip_area_atk);
    
    edip_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", edip_area_inc);
    
    edip_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", edip_area_corr);

    edip_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(edip_xAxis);

    edip_focus.append("g")
        .attr("class", "y axis")
        .call(edip_yAxis);

    edip_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", edip_area2_natk);
    
    edip_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", edip_area2_atk);
    
    edip_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", edip_area2_inc);

    edip_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", edip_area2_corr);
    
    edip_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(edip_xAxis2);

    edip_context.append("g")
        .attr("class", "x brush")
        .call(edip_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    edip_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    edip_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("ENTROPY OF DST IP");
    
    //TOTAL SRC PRT FOR 10 SECOND SLICES

    tsp_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    tsp_y.domain([0, d3.max(data.map(function(d) {return d.total_src_prt; }))]);
    tsp_x2.domain(tsp_x.domain());
    tsp_y2.domain(tsp_y.domain());
    
    tsp_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tsp_area_natk);
    
    tsp_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tsp_area_atk);
    
    tsp_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tsp_area_inc);
    
    tsp_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tsp_area_corr);

    tsp_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tsp_xAxis);

    tsp_focus.append("g")
        .attr("class", "y axis")
        .call(tsp_yAxis);

    tsp_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tsp_area2_natk);
    
    tsp_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tsp_area2_atk);
    
    tsp_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tsp_area2_inc);

    tsp_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tsp_area2_corr);

    tsp_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tsp_xAxis2);

    tsp_context.append("g")
        .attr("class", "x brush")
        .call(tsp_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    tsp_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    tsp_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("TOTAL SRC PRT");
    
    //ENTROPY OF SRC PRT FOR 10 SECOND SLICES

    esp_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    esp_y.domain([0, d3.max(data.map(function(d) {return d.entropy_src_prt; }))]);
    esp_x2.domain(esp_x.domain());
    esp_y2.domain(esp_y.domain());
    
    esp_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", esp_area_natk);
    
    esp_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", esp_area_atk);
    
    esp_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", esp_area_inc);
    
    esp_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", esp_area_corr);

    esp_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(esp_xAxis);

    esp_focus.append("g")
        .attr("class", "y axis")
        .call(esp_yAxis);

    esp_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", esp_area2_natk);
    
    esp_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", esp_area2_atk);
    
    esp_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", esp_area2_inc);

    esp_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", esp_area2_corr);

    esp_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(esp_xAxis2);

    esp_context.append("g")
        .attr("class", "x brush")
        .call(esp_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    esp_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    esp_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("ENTROPY OF SRC PRT");
  
    //TOTAL DST PORT FOR 10 SECOND SLICES

    tdp_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    tdp_y.domain([0, d3.max(data.map(function(d) {return d.total_dst_prt; }))]);
    tdp_x2.domain(tdp_x.domain());
    tdp_y2.domain(tdp_y.domain());
    
   tdp_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tdp_area_natk);
    
    tdp_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tdp_area_atk);
    
    tdp_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tdp_area_inc);
    
    tdp_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tdp_area_corr);

    tdp_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tdp_xAxis);

    tdp_focus.append("g")
        .attr("class", "y axis")
        .call(tdp_yAxis);

    tdp_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", tdp_area2_natk);
    
    tdp_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", tdp_area2_atk);
    
    tdp_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", tdp_area2_inc);

    tdp_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", tdp_area2_corr);

    tdp_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tdp_xAxis2);

    tdp_context.append("g")
        .attr("class", "x brush")
        .call(tdp_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    tdp_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    tdp_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("UNIQUE DST PRT");
    
  //ENTROPY OF DST PORT FOR 10 SECOND SLICES

    edp_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    edp_y.domain([0, d3.max(data.map(function(d) {return d.entropy_dst_prt; }))]);
    edp_x2.domain(edp_x.domain());
    edp_y2.domain(edp_y.domain());
    
  edp_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", edp_area_natk);
    
    edp_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", edp_area_atk);
    
    edp_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", edp_area_inc);
    
    edp_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", edp_area_corr);

    edp_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(edp_xAxis);

    edp_focus.append("g")
        .attr("class", "y axis")
        .call(edp_yAxis);

    edp_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", edp_area2_natk);
    
    edp_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", edp_area2_atk);
    
    edp_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", edp_area2_inc);

    edp_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", edp_area2_corr);

    edp_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(edp_xAxis2);

    edp_context.append("g")
        .attr("class", "x brush")
        .call(edp_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    edp_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    edp_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("ENTROPY OF DST PRT");
      
    
    
  //ENTROPY OF TCP FLAG FOR 10 SECOND SLICES

    etcpf_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    etcpf_y.domain([0, d3.max(data.map(function(d) {return d.entropy_tcp_flag; }))]);
    etcpf_x2.domain(etcpf_x.domain());
    etcpf_y2.domain(etcpf_y.domain());
    
   etcpf_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", etcpf_area_natk);
    
    etcpf_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", etcpf_area_atk);
    
    etcpf_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", etcpf_area_inc);
    
    etcpf_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", etcpf_area_corr);

    etcpf_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(etcpf_xAxis);

    etcpf_focus.append("g")
        .attr("class", "y axis")
        .call(etcpf_yAxis);

    etcpf_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", etcpf_area2_natk);
    
    etcpf_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", etcpf_area2_atk);
    
    etcpf_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", etcpf_area2_inc);

    etcpf_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", etcpf_area2_corr);

    etcpf_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(etcpf_xAxis2);

    etcpf_context.append("g")
        .attr("class", "x brush")
        .call(etcpf_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    etcpf_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    etcpf_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("ENTROPY OF TCP FLAG");
    
    //AVG TCP WINDOW SIZE FOR 10 SECOND SLICES

    avgw_x.domain(d3.extent(data.map(function(d,i) { 
      return i*10; 
    })));
    avgw_y.domain([0, d3.max(data.map(function(d) {return d.avg_window_size; }))]);
    avgw_x2.domain(avgw_x.domain());
    avgw_y2.domain(avgw_y.domain());
    
  avgw_focus.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", avgw_area_natk);
    
    avgw_focus.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", avgw_area_atk);
    
    avgw_focus.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", avgw_area_inc);
    
    avgw_focus.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", avgw_area_corr);

    avgw_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(avgw_xAxis);

    avgw_focus.append("g")
        .attr("class", "y axis")
        .call(avgw_yAxis);

    avgw_context.append("path")
        .datum(data)
        .attr("class", "area_blue")
        .attr("d", avgw_area2_natk);
    
    avgw_context.append("path")
        .datum(data)
        .attr("class", "area_purple")
        .attr("d", avgw_area2_atk);
    
    avgw_context.append("path")
        .datum(data)
        .attr("class", "area_red")
        .attr("d", avgw_area2_inc);

    avgw_context.append("path")
        .datum(data)
        .attr("class", "area_green")
        .attr("d", avgw_area2_corr);
    
    avgw_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(avgw_xAxis2);

    avgw_context.append("g")
        .attr("class", "x brush")
        .call(avgw_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    avgw_focus.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height+30)
        .text("Time (seconds)");

    avgw_focus.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -60)
        .attr("x", -90)
        .attr("dy", "0.75em")
        .attr("transform", "rotate(-90)")
        .text("AVG TCP WINDOW SIZE (BYTES)");
    
  });


}


function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area_blue").attr("d", area_natk);
  focus.select(".area_purple").attr("d", area_atk);
  focus.select(".area_red").attr("d", area_inc);
  focus.select(".area_green").attr("d", area_corr);
  focus.select(".x.axis").call(xAxis);
}

//TOTAL PACKET FOR 10 SECOND SLICES

function tp_brushed() {
  tp_x.domain(tp_brush.empty() ? tp_x2.domain() : tp_brush.extent());
  tp_focus.select(".area_blue").attr("d", tp_area_natk);
  tp_focus.select(".area_purple").attr("d", tp_area_atk);
  tp_focus.select(".area_red").attr("d", tp_area_inc);
  tp_focus.select(".area_green").attr("d", tp_area_corr);
  tp_focus.select(".x.axis").call(tp_xAxis);
}

//AVG SIZE IN BYTES PER IP PER 10 SECOND SLICE

function asi_brushed() {
  asi_x.domain(asi_brush.empty() ? asi_x2.domain() : asi_brush.extent());
  asi_focus.select(".area_blue").attr("d", asi_area_natk);
  asi_focus.select(".area_purple").attr("d", asi_area_atk);
  asi_focus.select(".area_red").attr("d", asi_area_inc);
  asi_focus.select(".area_green").attr("d", asi_area_corr);
  asi_focus.select(".x.axis").call(asi_xAxis);
}

//TOTAL SRC IP PER 10 SECOND SLICE

function tsip_brushed() {
  tsip_x.domain(tsip_brush.empty() ? tsip_x2.domain() : tsip_brush.extent());
  tsip_focus.select(".area_blue").attr("d", tsip_area_natk);
  tsip_focus.select(".area_purple").attr("d", tsip_area_atk);
  tsip_focus.select(".area_red").attr("d", tsip_area_inc);
  tsip_focus.select(".area_green").attr("d", tsip_area_corr);
  tsip_focus.select(".x.axis").call(tsip_xAxis);
}

//ENTROPY SRC IP PER 10 SECOND SLICE

function esip_brushed() {
  esip_x.domain(esip_brush.empty() ? esip_x2.domain() : esip_brush.extent());
  esip_focus.select(".area_blue").attr("d", esip_area_natk);
  esip_focus.select(".area_purple").attr("d", esip_area_atk);
  esip_focus.select(".area_red").attr("d", esip_area_inc);
  esip_focus.select(".area_green").attr("d", esip_area_corr);
  esip_focus.select(".x.axis").call(esip_xAxis);
}

//TOTAL UNIQUE DST IP PER 10 SECOND SLICE

function tdip_brushed() {
  tdip_x.domain(tdip_brush.empty() ? tdip_x2.domain() : tdip_brush.extent());
  tdip_focus.select(".area_blue").attr("d", tdip_area_natk);
  tdip_focus.select(".area_purple").attr("d", tdip_area_atk);
  tdip_focus.select(".area_red").attr("d", tdip_area_inc);
  tdip_focus.select(".area_green").attr("d", tdip_area_corr);
  tdip_focus.select(".x.axis").call(tdip_xAxis);
}

//ENTROPY DST IP PER 10 SECOND SLICE

function edip_brushed() {
  edip_x.domain(edip_brush.empty() ? edip_x2.domain() : edip_brush.extent());
  edip_focus.select(".area_blue").attr("d", edip_area_natk);
  edip_focus.select(".area_purple").attr("d", edip_area_atk);
  edip_focus.select(".area_red").attr("d", edip_area_inc);
  edip_focus.select(".area_green").attr("d", edip_area_corr);
  edip_focus.select(".x.axis").call(edip_xAxis);
}

//TOTAL SRC PRT PER 10 SECOND SLICE

function tsp_brushed() {
  tsp_x.domain(tsp_brush.empty() ? tsp_x2.domain() : tsp_brush.extent());
  tsp_focus.select(".area_blue").attr("d", tsp_area_natk);
  tsp_focus.select(".area_purple").attr("d", tsp_area_atk);
  tsp_focus.select(".area_red").attr("d", tsp_area_inc);
  tsp_focus.select(".area_green").attr("d", tsp_area_corr);
  tsp_focus.select(".x.axis").call(tsp_xAxis);
}

//ENTROPY SRC PRT PER 10 SECOND SLICE

function esp_brushed() {
  esp_x.domain(esp_brush.empty() ? esp_x2.domain() : esp_brush.extent());
  esp_focus.select(".area_blue").attr("d", esp_area_natk);
  esp_focus.select(".area_purple").attr("d", esp_area_atk);
  esp_focus.select(".area_red").attr("d", esp_area_inc);
  esp_focus.select(".area_green").attr("d", esp_area_corr);
  esp_focus.select(".x.axis").call(esp_xAxis);
}
//TOTAL DST PRT PER 10 SECOND SLICE

function tdp_brushed() {
  tdp_x.domain(tdp_brush.empty() ? tdp_x2.domain() : tdp_brush.extent());
  tdp_focus.select(".area_blue").attr("d", tdp_area_natk);
  tdp_focus.select(".area_purple").attr("d", tdp_area_atk);
  tdp_focus.select(".area_red").attr("d", tdp_area_inc);
  tdp_focus.select(".area_green").attr("d", tdp_area_corr);
  tdp_focus.select(".x.axis").call(tdp_xAxis);
}

//ENTROPY DST PRT PER 10 SECOND SLICE

function edp_brushed() {
  edp_x.domain(edp_brush.empty() ? edp_x2.domain() : edp_brush.extent());
  edp_focus.select(".area_blue").attr("d", edp_area_natk);
  edp_focus.select(".area_purple").attr("d", edp_area_atk);
  edp_focus.select(".area_red").attr("d", edp_area_inc);
  edp_focus.select(".area_green").attr("d", edp_area_corr);
  edp_focus.select(".x.axis").call(edp_xAxis);
}




//ENTROPY TCP FLAG PER 10 SECOND SLICE

function etcpf_brushed() {
  etcpf_x.domain(etcpf_brush.empty() ? etcpf_x2.domain() : etcpf_brush.extent());
  etcpf_focus.select(".area_blue").attr("d", etcpf_area_natk);
  etcpf_focus.select(".area_purple").attr("d", etcpf_area_atk);
  etcpf_focus.select(".area_red").attr("d", etcpf_area_inc);
  etcpf_focus.select(".area_green").attr("d", etcpf_area_corr);
  etcpf_focus.select(".x.axis").call(etcpf_xAxis);
}

//AVG WINDOW SIZE PER 10 SECOND SLICE

function avgw_brushed() {
  avgw_x.domain(avgw_brush.empty() ? avgw_x2.domain() : avgw_brush.extent());
  avgw_focus.select(".area_blue").attr("d", avgw_area_natk);
  avgw_focus.select(".area_purple").attr("d", avgw_area_atk);
  avgw_focus.select(".area_red").attr("d", avgw_area_inc);
  avgw_focus.select(".area_green").attr("d", avgw_area_corr);
  avgw_focus.select(".x.axis").call(avgw_xAxis);
}

function type(d) {
  //d.date = parseDate(d.date);
  d.avg_pkt_size = +d.avg_pkt_size;
  d.total_pkt = +d.total_pkt;
  d.avg_size_ip = +d.avg_size_ip;
  d.total_src_ip = +d.total_src_ip;
  return d;
  }















function clean(trace) {
  
  d3.select("body").selectAll("svg").remove();
  d3.select("body").selectAll("h1").remove();
  d3.select("body").append("h1").text("CURRENTLY DISPLAYING: "+trace);
  d3.select("body").append("h1").text("AVERAGE PACKET SIZE");

avg_pkt_size_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



avg_pkt_size_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

focus = avg_pkt_size_svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

context = avg_pkt_size_svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




/*
  =============================================================
  =============== TOTAL PACKET COUNT PER 10 SECOND SLICE ======
  =============================================================
  
*/

d3.select("body").append("h1").text("TOTAL PACKET COUNT");

tp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tp_focus = tp_svg.append("g")
    .attr("class", "tp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tp_context = tp_svg.append("g")
    .attr("class", "tp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== AVG BYTES SENT PER UNIQUE IP PER 10 SECOND SLICE ======
   =============================================================
  
*/
d3.select("body").append("h1").text("AVERAGE BYTES SENT PER UNIQUE IP");

asi_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



asi_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

asi_focus = asi_svg.append("g")
    .attr("class", "asi_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

asi_context = asi_svg.append("g")
    .attr("class", "asi_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== TOTAL SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("UNIQUE SOURCE IP'S");  
  
tsip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tsip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tsip_focus = tsip_svg.append("g")
    .attr("class", "tsip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tsip_context = tsip_svg.append("g")
    .attr("class", "tsip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== ENTROPY SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("ENTROPY OF SOURCE IP");  
  
esip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



esip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

esip_focus = esip_svg.append("g")
    .attr("class", "esip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

esip_context = esip_svg.append("g")
    .attr("class", "esip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== TOTAL DST IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("UNIQUE DST IP'S");  
  
tdip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tdip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tdip_focus = tdip_svg.append("g")
    .attr("class", "tdip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tdip_context = tdip_svg.append("g")
    .attr("class", "tdip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  /* ============================================================= 
 ===== ENTROPY DST IP PER 10 SECOND SLICE ======
 =============================================================
  
*/

d3.select("body").append("h1").text("ENTROPY OF DST IP");  
  
edip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



edip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

edip_focus = edip_svg.append("g")
    .attr("class", "edip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

edip_context = edip_svg.append("g")
    .attr("class", "edip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  
  /* ============================================================= 
 ===== TOTAL SRC PRT PER 10 SECOND SLICE ======
 =============================================================
  
*/

d3.select("body").append("h1").text("TOTAL UNIQUE SRC PRT");  
  
tsp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tsp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tsp_focus = tsp_svg.append("g")
    .attr("class", "tsp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tsp_context = tsp_svg.append("g")
    .attr("class", "tsp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  
 /* ============================================================= 
 ===== ENTROPY OF SRC PRT PER 10 SECOND SLICE ======
 =============================================================
  
*/

d3.select("body").append("h1").text("ENTROPY OF SRC PRT");  
  
esp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



esp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

esp_focus = esp_svg.append("g")
    .attr("class", "esp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

esp_context = esp_svg.append("g")
    .attr("class", "esp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
      
 /* ============================================================= 
 ===== TOTAL UNIQUE DST PRT PER 10 SECOND SLICE ======
 =============================================================
  
*/

d3.select("body").append("h1").text("TOTAL UNIQUE DST PRT");  
  
tdp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tdp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tdp_focus = tdp_svg.append("g")
    .attr("class", "tdp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tdp_context = tdp_svg.append("g")
    .attr("class", "tdp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  
  
 /* ============================================================= 
 ===== TOTAL UNIQUE DST PRT PER 10 SECOND SLICE ======
 =============================================================
  
*/

d3.select("body").append("h1").text("ENTROPY OF DST PRT");  
  
edp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



edp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

edp_focus = edp_svg.append("g")
    .attr("class", "edp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

edp_context = edp_svg.append("g")
    .attr("class", "edp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
  
    
  
  
  
  /* ============================================================= 
   ===== ENTROPY TCP FLAG PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("ENTROPY OF TCP FLAG");  
  
etcpf_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



etcpf_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

etcpf_focus = etcpf_svg.append("g")
    .attr("class", "etcpf_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

etcpf_context = etcpf_svg.append("g")
    .attr("class", "etcpf_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  
  /* ============================================================= 
   ===== AVG TCP WINDOW SIZE PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("AVG TCP WINDOW SIZE");  
  
avgw_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



avgw_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

avgw_focus = avgw_svg.append("g")
    .attr("class", "avgw_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

avgw_context = avgw_svg.append("g")
    .attr("class", "avgw_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    
  
  
  
}




graph("csvs_v2/trace08.csv");