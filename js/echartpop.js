function initEchartsPop(RealPop,Strman,Strfeman,AgMan,Agfeman) {
  initRealPopulation(RealPop);
  initPopulationStructure(Strman,Strfeman);
  initAging(AgMan,Agfeman);
}
//实有人口
function initRealPopulation(RealPop1) {
  let realEcharts = echarts.init(document.getElementById("population"));

  var realPopulationOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "30%",
      left: "3%",
      right: "4%",
      bottom: "-10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.5],
      show: false,
    },
    yAxis: {
      type: "category",
      data: ["男性","女性"],
      axisLabel: {
        show: true,
        color: "#fff", //坐标轴文字颜色
      },
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          color: "#fff",
          fontSize: 10,
        },
        data: RealPop1,
        itemStyle: {

          borderRadius : [15, 15, 15, 15],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#4d68ee", //0%处的颜色
            },
            {
              offset: 0.6,
              color: "#25b1f5", //50%处的颜色
            },
            {
              offset: 1,
              color: "#01f5ff", //100%处的颜色
            },
          ]),

        },
      },
    ],
  };
  realEcharts.setOption(realPopulationOption);

  window.addEventListener("resize", function () {
    realEcharts.resize();
  });
}

//人口结构
function initPopulationStructure(Strman1,Strfeman1) {
  let structureEcharts = echarts.init(document.getElementById("structure"));
  var structureOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
        color: "#fff",

      top: "8%",
      left: "center",
      icon: "circle",
      itemWidth: 10,
    },
    color: ["#a20bd1", "#b2ba00", "#49ad00", "#03dfa7", "#8185b3", "#4c67eb", "#ab7900"],
    series: [
      {
        name: "男性",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["25%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
            fontSize: 10,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "10",
            fontWeight: "bold",
            color: "#fff",
          },
        },
        labelLine: {
          show: false,
        },
        data: Strman1,
      },
      {
        name: "女性",
        type: "pie",
        radius: ["60%", "40%"],
        center: ["75%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inner",
          formatter: "{d}%",
            fontSize: 10,
        },
        data:Strfeman1,
      },
    ],
  };
  structureEcharts.setOption(structureOption);

  window.addEventListener("resize", function () {
    structureEcharts.resize();
  });
}

//人口老龄化分析
function initAging(AgMan1,Agfeman1) {
  let agingEcharts = echarts.init(document.getElementById("agingAnalysis"));
  var agingOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (params, ticket) {
        return "女性：" + params[0].value + "<br/>男性：" + Math.abs(params[1].value);
      },
    },
    color: ["#c145c5", "#21b8f6"],
    legend: {

    },
    grid: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      top: "10%",
      left: "10%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "value",
        axisTick: {
          show: false,
        },
        show: false,
      },
    ],
    yAxis: [
      {
        type: "category",
        data: ["60-65岁", "65-70岁", "70-75岁", "75-80岁", "80岁以上"],
        axisLabel: {
            color: "#fff", //坐标轴文字颜色
        },
      },
    ],

    series: [
      {
        type: "bar",
        stack: "总量",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },

        data: AgMan1,
        barCategoryGap: "50%",
        itemStyle: {
          borderRadius : [15, 15, 15, 15],
        },
      },
      {
        type: "bar",
        stack: "总量",
        label: {
          show: false,
          position: "left",
        },
        emphasis: {
          focus: "series",
        },
        data: Agfeman1,
        itemStyle: {
          borderRadius : [15, 15, 15, 15],
        },
      },
    ],
  };
  agingEcharts.setOption(agingOption);

  window.addEventListener("resize", function () {
    agingEcharts.resize();
  });
}
