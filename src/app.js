//import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
/*@Component({
  selector: 'app-widget-monitor-panel',
  template: '',
  styleUrls: ['./widget-monitor-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetMonitorPanelComponent implements OnInit, OnChanges {

  @Input()
  private widgetMonitorFlags: WidgetMonitorFlag[];

  private localWidgetMonitorFlags: WidgetMonitorFlag[];

  constructor(private mainElement: ElementRef) { }

  ngOnInit() {

    if (widgetMonitorFlags.length > 0) {
      localWidgetMonitorFlags = Object.create(widgetMonitorFlags);
      processRawData(localWidgetMonitorFlags);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (widgetMonitorFlags.length > 0) {
      processRawData(widgetMonitorFlags);
    }
  }
*/
function getOrderCorrect(a, k1, k2) {
    var ss = a[k1];
    if (+a[k1] > +a[k2]) {
        a[k1] = a[k2];
        a[k2] = ss;
    }
}
function processRawData(rawData) {
    var processData = rawData;
    processData.forEach(function (objd) {
        if (objd.scaleUpperValue == null)
            objd.scaleUpperValue = 100;
        if (objd.scaleLowerValue == null)
            objd.scaleLowerValue = 0;
        var ddata = [];
        var ss = objd.scaleLowerValue;
        objd.linedata = [];
        var b1 = objd.almostOutlierLowerValue <= objd.scaleLowerValue ? objd.scaleLowerValue : objd.almostOutlierLowerValue;
        var b2 = objd.compliantLowerValue <= objd.scaleLowerValue ? objd.scaleLowerValue : objd.compliantLowerValue;
        var b3 = objd.compliantUpperValue >= objd.scaleUpperValue ? objd.scaleUpperValue : objd.compliantUpperValue;
        var b4 = objd.almostOutlierUpperValue >= objd.scaleUpperValue ? objd.scaleUpperValue : objd.almostOutlierUpperValue;
        console.log(b1 + 'yellow' + b2 + 'green' + b3 + 'yellow' + b4);
        ddata.push(b1);
        ddata.push(b2);
        ddata.push(b3);
        ddata.push(b4);
        ddata.forEach(function (d, i) {
            var here = {};
            here.index = +i;
            here.start = +ss;
            here.value = +d;
            ss = here.value;
            here.end = +ss;
            objd.linedata.push(here);
            console.log(here.start + ' ' + here.end);
        });
    });
    processData.forEach(function (item) {
        var start = item.linedata[item.linedata.length - 1].end;
        var index = item.linedata[item.linedata.length - 1].index + 1;
        var value = item.scaleUpperValue;
        var end = value;
        item.linedata.push({
            index: index,
            start: start,
            value: value,
            end: end
        });
    });
    var sideScale = 0.1, hh = 280 * sideScale * processData.length, vertspace = hh * 5e-2, margin = {
        top: 0 * sideScale,
        right: 0 * sideScale,
        bottom: 0 * sideScale,
        left: 0 * sideScale
    }, ww = 1200 * sideScale, width = ww - margin.left - margin.right, height = hh - margin.top - margin.bottom, linechartmargin = {
        left: 500 * sideScale,
        right: 160 * sideScale,
        side: 5 * sideScale,
        sideScale: sideScale
    };
    var rootElement = "body";
    var currentElement = d3.select(rootElement).select('svg').remove();
    var svg = d3.select(rootElement)
        .append('svg')
        .attr('width', ww)
        .attr('height', hh)
        .append('g');
    var plotall = true;
    var down = 0;
    processData.forEach(function (item) {
        down += 0.9;
        panel(margin, width, linechartmargin, plotall, false, down * vertspace, item, svg);
    });
}
function panel(margin, width, linechartmargin, all, warning, refheight, lineitem, svg) {
    var sideScale = linechartmargin.sideScale, keepleft = linechartmargin.left, formatC = d3.format('.2f'), triangledown = function (ll) {
        return "\n        M0 0\n        l" + -ll / 3 + "  " + -ll + "\n        l" + 2 * ll / 3 + " 0\n        z";
    }, warningthing = function (ll) {
        return "\n        M0 0\n        l" + 2 * ll * 0.6 + "  " + ll + "\n        l" + ll * 0.9 + "   0\n        l0 " + ll * 1.5 + "\n        l" + -ll * 0.9 + " 0\n        l" + -2 * ll * 0.6 + " " + ll + "\n        z";
    }, triangleup = function (ll) {
        return "\n        M0 0\n        l" + -ll / 3 + "  " + ll + "\n        l" + 2 * ll / 3 + "   0\n        z";
    }, deviation = lineitem.deviation, pdata = lineitem.linedata, KE = lineitem.ke, sidelabel = lineitem.title;
    if (!all)
        linechartmargin.left = 0;
    var x = d3.scaleLinear().range([0, width - linechartmargin.left - linechartmargin.right])
        .domain([lineitem.scaleLowerValue, lineitem.scaleUpperValue])
    /*      , xAxis = d3.axisTop(x)
              , myXAxis = (g:any) =>{
                g.call(xAxis);
            g.select(".domain").remove();
            g.selectAll(".tick text").attr('class','ticktext');
        }*/
    , rect = function (obj) {
        var x1 = x(obj.start), x2 = x(obj.end), rectside = linechartmargin.side, seg = "M" + x1 + " " + rectside + " L" + x2 + " " + rectside + " L" + x2 + " 0 L" + x1 + " 0Z";
        if (x2 > x1) {
            console.log('line' + 'panel' + (obj.index + 1) + ' ' + obj.start + ' ' + obj.end);
            return seg;
        }
        else {
            console.log('panel' + (obj.index + 1) + ' ' + obj.start + ' ' + obj.end);
            return ' ';
        }
    };
    var trianglecase = 'triangleup';
    if (lineitem.proposedPortfolioValue >= lineitem.compliantLowerValue && lineitem.proposedPortfolioValue <= lineitem.compliantUpperValue) {
        trianglecase = 'triangleup';
    }
    else if (lineitem.proposedPortfolioValue >= lineitem.almostOutlierLowerValue && lineitem.proposedPortfolioValue <= lineitem.almostOutlierUpperValue) {
        trianglecase = 'triangleupO';
    }
    else
        trianglecase = 'triangledanger';
    var linecharttop = svg.selectAll("linechart").data(pdata).enter().append("g").attr('transform', "translate(" + (margin.left + linechartmargin.left) + "," + (margin.top + refheight - linechartmargin.side) + ")");
    linecharttop.append("path").attr('d', rect).attr("id", 'panel6');
    var linecharttbot = svg.selectAll("linechart").data(pdata).enter().append("g").attr('transform', "translate(" + (margin.left + linechartmargin.left) + "," + (margin.top + refheight + linechartmargin.side) + ")");
    linecharttbot.append("path").attr('d', rect).attr("id", 'panel6');
    var linechart = svg.selectAll("linechart").data(pdata).enter().append("g").attr('transform', "translate(" + (margin.left + linechartmargin.left) + "," + (margin.top + refheight) + ")");
    var changestyle = linechart;
    linechart.append("path").attr('d', rect).attr("id", function (d) {
        return 'panel' + (d.index + 1);
    });
    changestyle = linechart.append('text').attr('class', 'sidetext').attr('transform', "translate(" + (x.range()[1] + linechartmargin.right) + "," + linechartmargin.side * 2 + ")").style('text-anchor', 'end').text(formatC(deviation) + "%");
    if (sideScale != 1) {
        console.log(changestyle.attr('class'));
        var fontMinMax = +changestyle.style('font-size').replace('px', '') * sideScale;
        changestyle.style('font-size', fontMinMax + 'px');
        console.log(changestyle.style('font-size'));
    }
    changestyle = linechart.append('path').attr('transform', "translate(" + (x(lineitem.currentPortfolioValue < lineitem.scaleUpperValue && lineitem.currentPortfolioValue > lineitem.scaleLowerValue ? lineitem.currentPortfolioValue : lineitem.currentPortfolioValue >= lineitem.scaleUpperValue ? lineitem.scaleUpperValue : lineitem.scaleLowerValue) - linechartmargin.side * 0) + "," + linechartmargin.side / 2 + ")").attr('d', function () {
        return triangledown(linechartmargin.side * 5);
    }).attr('class', "" + (lineitem.currentPortfolioValue < lineitem.scaleUpperValue && lineitem.currentPortfolioValue > lineitem.scaleLowerValue ? 'triangledown' : 'triangledown'));
    if (sideScale != 1) {
        var endtextF = +changestyle.style('stroke-width').replace('px', '') * sideScale;
        changestyle.style('stroke-width', endtextF + 'px');
        //console.log(changestyle.style('stroke-width'));
    }
    changestyle = linechart.append('path').attr('transform', "translate(" + (x(lineitem.proposedPortfolioValue < lineitem.scaleUpperValue && lineitem.proposedPortfolioValue > lineitem.scaleLowerValue ? lineitem.proposedPortfolioValue : lineitem.proposedPortfolioValue >= lineitem.scaleUpperValue ? lineitem.scaleUpperValue : lineitem.scaleLowerValue) - linechartmargin.side * 0) + "," + linechartmargin.side / 2 + ")").attr('d', function () {
        return triangleup(linechartmargin.side * 5);
    }).attr('class', trianglecase);
    if (sideScale != 1) {
        var endtextF = +changestyle.style('stroke-width').replace('px', '') * sideScale;
        changestyle.style('stroke-width', endtextF + 'px');
        //console.log(changestyle.style('stroke-width'));
    }
    var flagstart = -linechartmargin.left + linechartmargin.side * 15, textstart = flagstart + linechartmargin.side * 10;
    if (all) {
        changestyle = linechart.append('text').attr('class', 'sidetext').attr('transform', "translate(" + textstart + "," + linechartmargin.side * 2 + ")").text(sidelabel);
        if (sideScale != 1) {
            console.log(changestyle.attr('class'));
            var fontMinMax = +changestyle.style('font-size').replace('px', '') * sideScale;
            changestyle.style('font-size', fontMinMax + 'px');
            console.log(changestyle.style('font-size'));
        }
        var good_1 = +lineitem.proposedPortfolioValue >= +lineitem.compliantLowerValue && +lineitem.proposedPortfolioValue <= +lineitem.compliantUpperValue;
        if (lineitem.status) {
            good_1 = lineitem.status == "COMPLIANT";
        }
        if (!warning) {
            changestyle = linechart.append('text').attr('class', 'sidetext')
                .attr('id', "" + (good_1 ? 'panel3' : 'panel1'))
                .attr('transform', "translate(" + flagstart + "," + linechartmargin.side * 2 + ")").text(function () {
                return "" + (good_1 ? '✓' : (lineitem.keStatus != "") ? 'K' : '✕');
            }).on("click", function () {
                d3.select(d3.event.currentTarget).attr('id', 'panel6').attr('dx', -10).transition().duration(1000).attr('dx', 0).attr('id', "" + (good_1 ? 'panel3' : 'panel1'));
                //callback(lineitem);
            });
            if (sideScale != 1) {
                console.log(changestyle.attr('class'));
                var fontMinMax = +changestyle.style('font-size').replace('px', '') * sideScale;
                changestyle.style('font-size', fontMinMax + 'px');
                console.log(changestyle.style('font-size'));
            }
        }
        else {
            changestyle = linechart.append('path').attr('d', function () {
                return warningthing(linechartmargin.side + 1);
                //Make it bigger by 1?
            }).attr('class', 'sidetext').attr('id', "" + (good_1 ? 'panel3' : 'panel4'))
                .attr('transform', "translate(" + (flagstart + linechartmargin.side) + "," + -linechartmargin.side * 2 + ")").on("click", function () {
                d3.select(d3.event.currentTarget).attr('id', 'panel6').attr('transform', "translate(" + (flagstart + linechartmargin.side - 10) + "," + -linechartmargin.side * 2 + ")")
                    .transition().duration(1000).attr('transform', "translate(" + (flagstart + linechartmargin.side) + "," + -linechartmargin.side * 2 + ")").attr('id', "" + (good_1 ? 'panel3' : 'panel4'));
                //callback(lineitem);sideScale
            });
            if (sideScale != 1) {
                console.log(changestyle.attr('class'));
                var fontMinMax = +changestyle.style('font-size').replace('px', '') * sideScale;
                changestyle.style('font-size', fontMinMax + 'px');
                console.log(changestyle.style('font-size'));
            }
        }
    }
    //let svgX = svg.append('g').attr('transform', `translate(${margin.left + linechartmargin.left},${margin.top + (refheight + 5) - linechartmargin.side})`).style('stroke-width', '0px').call(myXAxis)
    var svgEnds = svg.selectAll('endlabs').data(x.domain()).enter().append('text').attr('transform', "translate(" + (margin.left + linechartmargin.left) + "," + (margin.top + (refheight + 5 * sideScale) - linechartmargin.side) + ")").attr('class', 'ticktext').attr('x', function (d) {
        return x(d);
    }).text(function (d) {
        return d;
    }).attr('y', -14 * sideScale);
    if (sideScale != 1) {
        var fontMinMax = +svgEnds.style('font-size').replace('px', '') * sideScale;
        svgEnds.style('font-size', fontMinMax + 'px');
    }
    if (!all)
        linechartmargin.left = keepleft;
}
var BendixData = [{ type: "issuerConcentration", title: "Issuer Concentration", status: "OUTLIER", keStatus: "", compliantLowerValue: 0.0, compliantUpperValue: 19.00001, almostOutlierLowerValue: 0.0, almostOutlierUpperValue: 20.00001, currentValue: 100.46666, proposedValue: 4, deviation: 80.14176, chartType: "TOLERANCE", scaleLowerValue: 0,
        scaleUpperValue: 100
    },
    { type: "anomalousHoldings", title: "High Volatility Holding", status: "COMPLIANT", keStatus: "", compliantLowerValue: 0.0, compliantUpperValue: 5.0, almostOutlierLowerValue: 0.0, almostOutlierUpperValue: 6.0, currentValue: 110.23334, proposedValue: 13, deviation: 95.14177, chartType: "TOLERANCE", scaleLowerValue: -10,
        scaleUpperValue: 20
    },
    { type: "buyListOutlier",
        title: "80/20 Exposure",
        status: "COMPLIANT",
        keStatus: "",
        compliantLowerValue: 0,
        compliantUpperValue: 18,
        almostOutlierLowerValue: 0,
        almostOutlierUpperValue: 20,
        currentValue: 15,
        proposedValue: 20,
        deviation: 100,
        chartType: "TOLERANCE",
        scaleLowerValue: -10,
        scaleUpperValue: 100
    },
    {
        type: "stockLevelTotalRisk",
        title: "Volatility",
        status: "OUTLIER",
        keStatus: "Pending",
        compliantLowerValue: -2,
        compliantUpperValue: 30,
        almostOutlierLowerValue: -10,
        almostOutlierUpperValue: 40,
        currentValue: 28.66219,
        proposedValue: 28.66219,
        deviation: 28.66219,
        chartType: "TOLERANCE",
        scaleLowerValue: -30,
        scaleUpperValue: 39
    }], BelData = [];
BendixData.forEach(function (d) {
    var obj = {};
    for (var key in d) {
        if (key == "title")
            obj["title"] = d[key];
        else if (key == "proposedValue")
            obj["proposedPortfolioValue"] = d[key];
        else if (key == "currentValue")
            obj["currentPortfolioValue"] = d[key];
        else
            obj[key] = d[key];
    }
    BelData.push(obj);
});
processRawData(BelData);
//}
//# sourceMappingURL=app.js.map