"use script";
var map //mars3d 主对象
//#region 地球配置
var graphicLayer
function initMap(options) {
    //创建三维地球场景

    map = new mars3d.Map('mars3dContainer', options);

    function showAnhui2Demo() {
        removeLayer()
        var geoJsonLayergj = new mars3d.layer.GeoJsonLayer({
            name: "guojie",
            url: "json/国界.json",
            symbol: {
                type: "wall",
                styleOptions: {
                    width: 8,
                    diffHeight: 200000, // 墙高
                    materialType: mars3d.MaterialType.LineFlow,
                    speed: 10, // 速度
                    image: "images/fence.png", // 图片
                    repeatX: 1, // 重复数量
                    axisY: true, // 竖直方向
                    color: "#c98d3c", // 颜色
                    opacity: 0.9, // 透明度
                    // 高亮时的样式
                    highlight: {
                        type: "click",
                        color: "#ffff00"
                    }
                }
            },
        })
        map.addLayer(geoJsonLayergj);

    }
    graphicLayer = new mars3d.layer.DivLayer();
    map.addLayer(graphicLayer);
//图层管理的相关处理，代码在\js\graphicManager.js
    initLayerManager(graphicLayer);
    graphicLayer.unbindPopup();
    function riverload() {
        var arrgeoJsonLayer = [];
        var arrriverurl = [];
        arrriverurl[0] = "json/一级河流.json";
        arrriverurl[1] = "json/三级河流.json";
        for (i = 0; i < 2; i++) {
            arrgeoJsonLayer[i] = new mars3d.layer.GeoJsonLayer({
                name: "河流",
                url: arrriverurl[i],
                symbol: {
                    type: "polylineCombine",
                    styleOptions: {
                        width: 3 - 2 * i,
                        material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
                            color: "#424cfb",
                            //  image: "images/fenceline.png",
                            speed: 5,
                            repeat_x: 0,

                        }),
                        label: {
                            text: "{name}",
                            font_size: 30,
                            color: "#ffffff",
                            outline: true,
                            outlineColor: "#000000",
                            //   scaleByDistance: true,
                            //   scaleByDistance_far: 20000000,
                            //   scaleByDistance_farValue: 0.001,
                            //   scaleByDistance_near: 1000000,
                            //   scaleByDistance_nearValue: 1,
                            //   distanceDisplayCondition: true,
                            //   distanceDisplayCondition_far: 12000000,
                            //   distanceDisplayCondition_near: 0,
                            //   setHeight: 10000,
                        },
                    },
                },
                popup: "河流名称：{NAME}<br />河流简介：{MORE}",
            });
            map.addLayer(arrgeoJsonLayer[i]);
        }

    }

    showAnhui2Demo();
    riverload();
    startRotate();
    map.viewer.homeButton._element.style.display = "none";
    map.viewer.fullscreenButton.container.style.display =  "none";
    /*    map.viewer.vrButton.container.style.display = "none";
        map.viewer.fullscreenButton.container.style.display = "none";
        //map.viewer.timeline.container.style.display = "none";*/
    map.controls.locationBar.show = false;
    //  map.contextmenu.show= false;
    var layer = new mars3d.layer.XyzLayer({
        //xyz图层类型(type)
        name: "行政区划界线",
        url:
            "https://t{s}.tianditu.gov.cn/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=9ae78c51a0a28f06444d541148496e36",
        subdomains: "01234567",
        maximumLevel: 10,
    });
    this.map.addLayer(layer); //添加叠加层到地图map
    var tileLayer = new mars3d.layer.TdtLayer({
        name: "天地图影像注记",
        layer: "img_z",
        key: mars3d.Token.tiandituArr,
    });
    this.map.addLayer(tileLayer);

    var helper = new Cesium.EventHelper();
    helper.add(map.viewer.scene.globe.tileLoadProgressEvent, function (event) {
        if (event == 0) {
            setTimeout(function () {
                $(".Loading").hide();
            }, 3000);
        }
    });


}

//#endregion

//#region  侧边栏功能


//loadXE();
function LoadEarth() {
    //#region 其他功能
    //添加放大缩小按钮
    var zoom = new mars3d.control.Zoom({
        // insertIndex: 3, //插入的位置顺序
        zoomInClass: "fa fa-plus",
        zoomOutClass: "fa fa-minus",
    });
    //#endregion
    stopRotate();
    map.addControl(zoom);
    $("div[title='放大']").css('display','none');
    $("div[title='缩小']").css('display','none');
    stopRotate();
}
 function  HomeB(){
     $("button.cesium-home-button").click()
 }
function  Fullwindows(){
    $("button.cesium-fullscreenButton").click()
}
 function Zoomin(){
     $("div[title='放大']") .click()
 }
function Zoomout(){
    $("div[title='缩小']") .click()
}
function Moreevent(){
    removeAll();
    map.setCameraView({lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90});
}
var overviewMap = new mars3d.control.OverviewMap({
    basemap: {
        name: "天地图电子",
        type: "group",
        layers: [
            {name: "底图", type: "tdt", layer: "vec_d", key: ["9ae78c51a0a28f06444d541148496e36"]},
            {name: "注记", type: "tdt", layer: "vec_z", key: ["9ae78c51a0a28f06444d541148496e36"]},
        ],
    },
    rectangle: {
        color: "#fecd78",
        opacity: 0.2,
        outline: 1,
        outlineColor: "#ff7800",
    },
    style: {
        right: "5px",
        top: "5px",
        width: "200px",
        height: "150px",
    },
});
function Eyeadd() {

    if (overviewMap.isAdded) {
        overviewMap.remove()
    } else {
        map.addControl(overviewMap);
    }
}
//#region 新闻
//创建DIV数据图层
//
//
//大事件标签
var graphiceventlab = [];
var graphiceventtab = [];
var graphiceventfullab = [];
var graphicpoint = [];
var graphicevent = [];
var graphiceventful = [];
var graphiceventevent = [];
var offsetYvalue = []

function eventgraph() {
    graphiceventtab[0] = `2019年9月18日`;
    graphiceventtab[1] = `2021年5月14日`;
    graphiceventtab[2] = `2014年3月14日`;
    graphiceventtab[3] = `2021年10月8日`;
    graphiceventtab[4] = `2021年10月22日`;
    graphiceventtab[5] = `2021年11月19日`;
    offsetYvalue[0] = "30";
    offsetYvalue[1] = "30";
    offsetYvalue[2] = "140";
    offsetYvalue[3] = "70";
    offsetYvalue[4] = "30";
    offsetYvalue[5] = "30";
    graphiceventlab[0] = `习近平总书记在黄河流域生态保护和高质量发展座谈会上的讲话<br />`;
    graphiceventlab[1] = `习近平总书记主持召开推进南水北调后续工程高质量发展座谈会并发表重要讲话<br />`;
    graphiceventlab[2] = `习近平总书记提出“节水优先、空间均衡、系统治理、两手发力”的新时期水利工作思路。<br />`;
    graphiceventlab[3] = `中共中央 国务院印发《黄河流域生态保护和高质量发展规划纲要》<br />`;
    graphiceventlab[4] = `习近平总书记主持召开深入推动黄河流域生态保护和高质量发展座谈会并发表重要讲话<br />`;
    graphiceventlab[5] = `水利部党组书记、部长李国英主持召开推动新阶段水利高质量发展院士专家座谈会<br />`;
    graphicpoint[0] = [113.646031, 34.915779, 72.9];
    graphicpoint[1] = [111.709242, 32.674438, 151.6];
    graphicpoint[2] = [116.387764, 39.903585, 52.8];
    graphicpoint[3] = [116.373923, 39.90646, 48.6];
    graphicpoint[4] = [117.014778, 36.667915, 24.3];
    graphicpoint[5] = [116.352525, 39.883917, 44.8];
    graphiceventevent[0] = {"lat": 34.918798, "lng": 113.670924, "alt": 57471, "heading": 357, "pitch": -90};
    graphiceventevent[1] = {"lat": 32.775906, "lng": 111.891375, "alt": 55844, "heading": 357, "pitch": -90};
    graphiceventevent[2] = {"lat": 39.905838, "lng": 116.392435, "alt": 1765, "heading": 357, "pitch": -90};
    graphiceventevent[3] = {"lat": 39.908048, "lng": 116.375969, "alt": 1066, "heading": 357, "pitch": -90};
    graphiceventevent[4] = {"lat": 36.682547, "lng": 117.040476, "alt": 7782, "heading": 357, "pitch": -90};
    graphiceventevent[5] = {"lat": 39.886255, "lng": 116.356394, "alt": 1414, "heading": 357, "pitch": -90};
    graphiceventfullab[0] = `<div class="marsTiltPanel marsTiltPanel-theme-red">
        <div class="marsTiltPanel-wrap">
            <div class="area">
                <div class="arrow-lt"></div>
                <div class="b-t"></div>
                <div class="b-r"></div>
                <div class="b-b"></div>
                <div class="b-l"></div>
                <div class="arrow-rb"></div>
                <div class="label-wrap">
                    <div class="title">习近平总书记在黄河流域生态保护和高质量发展座谈会上的讲话</div>
                    <div class="label-content">
                    <iframe title="myFrame" width="600" height="600" scrolling="yes" margin-right: 50px src='https://www.xuexi.cn/lgpage/detail/index.html?id=104219961068337129'></iframe>
                    </div>
                </div>
            </div>
            <div class="b-t-l"></div>
            <div class="b-b-r"></div>
        </div>
        <div class="arrow" ></div>
    </div>`;
    graphiceventfullab[1] = `<div class="marsTiltPanel marsTiltPanel-theme-red">
    <div class="marsTiltPanel-wrap">
        <div class="area">
            <div class="arrow-lt"></div>
            <div class="b-t"></div>
            <div class="b-r"></div>
            <div class="b-b"></div>
            <div class="b-l"></div>
            <div class="arrow-rb"></div>
            <div class="label-wrap">
                <div class="title">习近平总书记主持召开推进南水北调后续工程高质量发展座谈会并发表重要讲话</div>
                <div class="label-content">
                <iframe title="myFrame" width="600" height="600" scrolling="yes" margin-right: 50px src='https://www.xuexi.cn/lgpage/detail/index.html?id=12104092459343926152&amp;item_id=12104092459343926152'></iframe>
                </div>
            </div>
        </div>
        <div class="b-t-l"></div>
        <div class="b-b-r"></div>
    </div>
    <div class="arrow" ></div>
</div>`;
    graphiceventfullab[2] = `<div class="marsTiltPanel marsTiltPanel-theme-red">
<div class="marsTiltPanel-wrap">
    <div class="area">
        <div class="arrow-lt"></div>
        <div class="b-t"></div>
        <div class="b-r"></div>
        <div class="b-b"></div>
        <div class="b-l"></div>
        <div class="arrow-rb"></div>
        <div class="label-wrap">
            <div class="title">习近平总书记提出“节水优先、空间均衡、系统治理、两手发力”的新时期水利工作思路。<br /></div>
            <div class="label-content">
            <iframe title="myFrame" width="600" height="600" scrolling="yes" margin-right: 50px src='http://www.zhuji.gov.cn/art/2019/1/3/art_1388669_29043887.html'></iframe>
            </div>
        </div>
    </div>
    <div class="b-t-l"></div>
    <div class="b-b-r"></div>
</div>
<div class="arrow" ></div>
</div>`;
    graphiceventfullab[3] = `<div class="marsTiltPanel marsTiltPanel-theme-red">
<div class="marsTiltPanel-wrap">
    <div class="area">
        <div class="arrow-lt"></div>
        <div class="b-t"></div>
        <div class="b-r"></div>
        <div class="b-b"></div>
        <div class="b-l"></div>
        <div class="arrow-rb"></div>
        <div class="label-wrap">
            <div class="title">中共中央 国务院印发《黄河流域生态保护和高质量发展规划纲要》</div>
            <div class="label-content">
            <iframe title="myFrame" width="600" height="600" scrolling="yes"  margin-right: 50px src='https://www.xuexi.cn/lgpage/detail/index.html?id=8585299029490723998&amp;item_id=8585299029490723998'></iframe>
            </div>
        </div>
    </div>
    <div class="b-t-l"></div>
    <div class="b-b-r"></div>
</div>
<div class="arrow" ></div>
</div>`;
    graphiceventfullab[4] = `<div class="marsTiltPanel marsTiltPanel-theme-red">
<div class="marsTiltPanel-wrap">
    <div class="area">
        <div class="arrow-lt"></div>
        <div class="b-t"></div>
        <div class="b-r"></div>
        <div class="b-b"></div>
        <div class="b-l"></div>
        <div class="arrow-rb"></div>
        <div class="label-wrap">
            <div class="title">习近平总书记主持召开深入推动黄河流域生态保护和高质量发展座谈会并发表重要讲话</div>
            <div class="label-content">
            <iframe title="myFrame" width="600" height="600" scrolling="yes" margin-right: 50px src='https://www.xuexi.cn/lgpage/detail/index.html?id=7062800996701661126&amp;item_id=7062800996701661126'></iframe>
            </div>
        </div>
    </div>
    <div class="b-t-l"></div>
    <div class="b-b-r"></div>
</div>
<div class="arrow" ></div>
</div>`;
    graphiceventfullab[5] = `<div class="marsTiltPanel marsTiltPanel-theme-red">
<div class="marsTiltPanel-wrap">
    <div class="area">
        <div class="arrow-lt"></div>
        <div class="b-t"></div>
        <div class="b-r"></div>
        <div class="b-b"></div>
        <div class="b-l"></div>
        <div class="arrow-rb"></div>
        <div class="label-wrap">
            <div class="title">水利部党组书记、部长李国英主持召开推动新阶段水利高质量发展院士专家座谈会</div>
            <div class="label-content">
            <iframe title="myFrame" width="600" height="600" scrolling="yes" margin-right: 50px src='https://baijiahao.baidu.com/s?id=1717542620568503505'></iframe>
            </div>
        </div>
    </div>
    <div class="b-t-l"></div>
    <div class="b-b-r"></div>
</div>
<div class="arrow" ></div>
</div>`;
    for (i = 0; i < 6; i++) {
        graphiceventful[i] = {
            position: graphicpoint[i],
            style: {
                html: graphiceventfullab[i],
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), //按视距距离显示
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),

                clampToGround: true,
            },
            pointerEvents: false, //false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
        };
        graphicevent[i] = new mars3d.graphic.DivGraphic({
            position: graphicpoint[i],
            style: {
                html: ` <div class="mars3d-camera-content">
                    <img class="mars3d-camera-img" src="images/news.svg" >
                    </div>
                    <div id="height1" class="mars3d-camera-line-red"  style="height: ` + offsetYvalue[i] + `px ;" ></div>
                    <div class="mars3d-camera-point-red"></div>`
                ,
                offsetX: -16,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(200000), //按视距距离显示


            },

        });
    }
}

eventgraph();
// eventon();

graphicevent[0].bindTooltip(function (event) {
    return graphiceventlab[0];
});
graphicevent[1].bindTooltip(function (event) {
    return graphiceventlab[1];
});
graphicevent[2].bindTooltip(function (event) {
    return graphiceventlab[2];
});
graphicevent[3].bindTooltip(function (event) {
    return graphiceventlab[3];
});
graphicevent[4].bindTooltip(function (event) {
    return graphiceventlab[4];
});
graphicevent[5].bindTooltip(function (event) {
    return graphiceventlab[5];
});
graphicevent[0].on(mars3d.EventType.click, () => {
    graphicLayer.addGraphic(new mars3d.graphic.DivGraphic(graphiceventful[0]));
    map.setCameraView(graphiceventevent[0]);
});
graphicevent[1].on(mars3d.EventType.click, () => {
    graphicLayer.addGraphic(new mars3d.graphic.DivGraphic(graphiceventful[1]));
    map.setCameraView(graphiceventevent[1]);
});
graphicevent[2].on(mars3d.EventType.click, () => {
    graphicLayer.addGraphic(new mars3d.graphic.DivGraphic(graphiceventful[2]));
    map.setCameraView(graphiceventevent[2]);
});
graphicevent[3].on(mars3d.EventType.click, () => {
    graphicLayer.addGraphic(new mars3d.graphic.DivGraphic(graphiceventful[3]));
    map.setCameraView(graphiceventevent[3]);
});
graphicevent[4].on(mars3d.EventType.click, () => {
    graphicLayer.addGraphic(new mars3d.graphic.DivGraphic(graphiceventful[4]));
    map.setCameraView(graphiceventevent[4]);
});
graphicevent[5].on(mars3d.EventType.click, () => {
    graphicLayer.addGraphic(new mars3d.graphic.DivGraphic(graphiceventful[5]));
    map.setCameraView(graphiceventevent[5]);
});
var graphicImgP = [];
var graphicImgIcon = [];
var graphicImgpop = [];
var graphicImgV = [];
var graphicImg = [];

function graphicImgshow() {
    graphicImgP[0] = [113.547321, 35.292197, 59.8];
    graphicImgP[1] = [124.259888, 48.675508, 285.6];
    graphicImgP[2] = [114.053596, 35.420391, 52.4];
    graphicImgP[3] = [86.853151, 28.0488886, 5866.5];
    graphicImgP[4] = [113.641667, 34.756134, 81.9];
    graphicImgP[5] = [118.77811, 38.091211, -91.6];
    graphicImgIcon[0] = "images/GIF-1.svg";
    graphicImgIcon[1] = "images/video1.svg";
    graphicImgIcon[2] = "images/video1.svg";
    graphicImgIcon[3] = "images/video1.svg";
    graphicImgIcon[4] = "images/video1.svg";
    graphicImgIcon[5] = "images/video1.svg";
    graphicImgpop[0] = `<img src="images/img1.gif" style="width: 680px;" ></img><div>河南暴雨受灾情况</div>`;
    graphicImgpop[1] = `<div style=" display: grid;" ><div style="grid-column: 1;grid-row: 1/3;" ><img src="images/img3.gif" style="width: 300px;" ></div><div  style="grid-column: 2/4;grid-row: 1;"><video src='images/neimen.avi' controls autoplay style="width: 380px;" ></video>
                </div><div style="grid-column: 2/4;grid-row: 2;font-size:20px;">内蒙古呼伦贝尔大坝溃坝，利用雷达遥感</br>变化监测技术可清晰发现受灾区与水流走势。</div></div>`;
    graphicImgpop[2] = `<div style=" display: grid;" ><div style="grid-column: 1;grid-row: 1/3;" ><img src="images/img2.gif" style="width: 680px;" ></img></div><div  style="grid-column: 2/4;grid-row: 1;"><video src='images/xinxiang.avi' controls autoplay style="width: 350px;" ></video>
                </div><div style="grid-column: 2/4;grid-row: 2;font-size:20px;">新乡卫辉同样遭受暴雨袭击，</br>数以万计的百姓无家可归</div></div>`;
    graphicImgpop[3] = `<video src='images/mp4.avi' controls autoplay style="width: 480px;" ></video><div>珠穆朗玛峰</div>`;
    graphicImgpop[4] = `<div style=" display: grid;" ><div style="grid-column: 1;grid-row: 1/3;" ><img src="images/zhenzouw.png" style="width: 580px;" ></img></div><div  style="grid-column: 2/4;grid-row: 1;"><video src='images/zz.avi' controls autoplay style="width: 450px;" ></video>
                </div><div style="grid-column: 2/4;grid-row: 2;">“7.20”暴雨给郑州带来了巨大的伤痛，暴雨后的城市满目疮痍，大街小巷上挤满了前来救灾的志愿者，让人心痛。
                </br>  项目组第一时间从“常庄水库保住了”、“贾鲁河下游出现大面积洪涝区”、“惊魂地铁5号线雷达影像有显示”、</br> “恐怖京广快速路隧道雷达影像有响应”、“郑州沉降漏斗区受灾严重”5个方面阐述了郑州市的洪涝形式及灾害风险。</div></div>`;
    graphicImgpop[5] = `<div style=" display: grid;" ><div style="grid-column: 1;grid-row: 1/3;" ><img src="images/huanghe.gif" style="width: 380px;" ></img></div><div  style="grid-column: 2/4;grid-row: 1;"><video src='images/huanhe.avi' controls autoplay style="width: 480px;" ></video>
                </div><div style="grid-column: 2/4;grid-row: 2;font-size:20px;">黄河入海口</div></div>`;
    graphicImgV[0] = {"lat": 35.536895, "lng": 114.07997, "alt": 139006, "heading": 357, "pitch": -90};
    graphicImgV[1] = {"lat": 48.94312, "lng": 124.727066, "alt": 244429, "heading": 352, "pitch": -88};
    graphicImgV[2] = {"lat": 35.678243, "lng": 114.695823, "alt": 141841, "heading": 357, "pitch": -90};
    graphicImgV[3] = {"lat": 28.375239, "lng": 87.706838, "alt": 454436, "heading": 356, "pitch": -90};
    graphicImgV[4] = {"lat": 35.127965, "lng": 114.284038, "alt": 157383, "heading": 357, "pitch": -90};
    graphicImgV[5] = {"lat": 38.12877, "lng": 118.265958, "alt": 371375, "heading": 357, "pitch": -90};
    for (i = 0; i < 6; i++) {
        graphicImg[i] = new mars3d.graphic.DivGraphic({
            position: graphicImgP[i],
            style: {
                html: ` <div class="mars3d-camera-content">
                          <img class="mars3d-camera-img" src="` + graphicImgIcon[i] + `" >
                          </div>
                          <div class="mars3d-camera-line" ></div>
                          <div class="mars3d-camera-point"></div>
                      `,
                offsetX: -16,
            },
            popup: graphicImgpop[i],
            popupOptions: {
                offsetY: -70, //显示Popup的偏移值，是DivGraphic本身的像素高度值
                template: `<div class="marsBlackPanel animation-spaceInDown">
                              <div class="marsBlackPanel-text">{content}</div>
                              <span class="mars3d-popup-close-button closeButton" >×</span>
                          </div>`,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
            },
        });
    }
}

graphicImgshow();

graphicImg[0].on(mars3d.EventType.popupOpen, function (event) {
    map.setCameraView(graphicImgV[0]);
});

graphicImg[1].on(mars3d.EventType.popupOpen, function (event) {
    map.setCameraView(graphicImgV[1]);
});

graphicImg[2].on(mars3d.EventType.popupOpen, function (event) {
    map.setCameraView(graphicImgV[2]);
});

graphicImg[3].on(mars3d.EventType.popupOpen, function (event) {
    map.setCameraView(graphicImgV[3]);
});

graphicImg[4].on(mars3d.EventType.popupOpen, function (event) {
    map.setCameraView(graphicImgV[4]);
});
graphicImg[5].on(mars3d.EventType.popupOpen, function (event) {
    map.setCameraView(graphicImgV[5]);
});

//添加大事件按钮


//#endregion
function NewReport(){
    removeAll();
    if (graphicevent[0].isAdded) {
        for (i = 0; i < 6; i++) {
            graphicevent[i].remove();
        }
        for (i = 0; i < 6; i++) {
            graphicImg[i].remove();
        }
        graphicLayer.clear();
        map.setCameraView({"lat": 36.730036, "lng": 110.103195, "alt": 7027705, "heading": 357, "pitch": -90});
    } else {
        for (i = 0; i < 6; i++) {
            graphicLayer.addGraphic(graphicImg[i]);
        }
        for (i = 0; i < 6; i++) {
            graphicLayer.addGraphic(graphicevent[i]);
        }
        map.setCameraView({"lat": 36.730036, "lng": 110.103195, "alt": 7027705, "heading": 357, "pitch": -90});
    }
}
var graphic = new mars3d.graphic.DivGraphic({
    position: Cesium.Cartesian3.fromDegrees(113.790445, 34.780833, 63.5),
    style: {
        html: `<div class="marsTiltPanel marsTiltPanel-theme-blue">
      <div class="marsTiltPanel-wrap">
          <div class="area">
              <div class="arrow-lt"></div>
              <div class="b-t"></div>
              <div class="b-r"></div>
              <div class="b-b"></div>
              <div class="b-l"></div>
              <div class="arrow-rb"></div>
              <div class="label-wrap">
                  <div class="title">华北水利水电大学刘文锴团队</div>
                  <div class="label-content">
                      <div class="data-li">
                          <div class="data-label">团队介绍：</div>
                          <div class="data-value"><span class="label-num"></span><span class="label-unit">团队长期从事智慧水利、水利工程安全监测等方向。</span>
                          </div>
                      </div>
                      <div class="data-li">
                          <div class="data-label">团队成员：</div>
                          <div class="data-value"><span class="label-unit"> </span>
                          </div>
                      </div>
                      <div class="data-li">
                          <div class="data-label1">成员一：刘文锴</div>
                          <div>
                          <img class="dataimage" src="images/no1.jpg"></img>
                          <div class="data-value"><span class="label-num"></span><span class="label-unit">华北水利水电大学校长</span>                                                   
                          </div>
                          </div>

                      <div class="data-li">
                          <div class="data-label">成员二：刘辉</div>
                          <div>
                          <img class="dataimage" src="images/no2.jpg"></img>
                          <div class="data-value"><span class="label-num"></span><span class="label-unit">华北水利水电大学测绘与地理信息学院科研主任</span>                                                   
                          </div>                                               
                      </div>
                      <div class="data-li">
                          <div class="data-label">成员三：韩洋</div>
                          <div>
                          <img class="dataimage" src="images/no3.jpg"></img>
                          <div class="data-value"><span class="label-num"></span><span class="label-unit">华北水利水电大学2018级优秀学生</span>                                                   
                          </div>                                               
                      </div>
                  </div>
              </div>
          </div>
          <div class="b-t-l"></div>
          <div class="b-b-r"></div>
      </div>
      <div class="arrow" ></div>
  </div>`,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1000, 200000), //按视距距离显示
    },
});
function TeamMade(){
    removeAll();
    if (graphic.isAdded) {
        graphic.remove()
    } else {
        graphicLayer.addGraphic(graphic);

        map.setCameraView({
            lat: 34.771055,
            lng: 113.789695,
            alt: 2094,
            heading: 358,
            pitch: -57
        }, {duration: 5});
    }
}
//#endregion

//#region 登陆事件处理
function loadin() {
    if (document.getElementById("username").value == "user1") {
        if (document.getElementById("password").value == "123") {

            map.controls.locationBar.show = true;
            LoadEarth();
            stopRotate();
            var boxr = document.getElementsByClassName('btnbar_item');
            boxr[0].style.hidden = "hidden";
            boxr[0].style.display = "none";
            boxr[0].style.visibility = "hidden";
            var boxr = document.getElementById("JSTEXT");
            boxr.style.hidden = "hidden";
            boxr.style.display = "none";
            boxr.style.visibility = "hidden";
            $("div.MenuFor").css('pointer-events','auto');
            map.setCameraView({lat: 35.343197, lng: 110.798275, alt: 6218595, heading: 357, pitch: -90}, {duration: 3});
        } else {
            var a = document.getElementById("loginlab");
            a.innerHTML = '错误';

        }
    } else {
        var a = document.getElementById("loginlab");
        a.innerHTML = '错误';

    }


}

//#endregion

//#region 地球旋转代码
function startRotate() {
    stopRotate();

    previousTime = map.clock.currentTime.secondsOfDay;
    map.on(mars3d.EventType.clockTick, map_onClockTick);
}

function stopRotate() {
    map.off(mars3d.EventType.clockTick, map_onClockTick);
}

var previousTime;

function map_onClockTick(clock) {
    var spinRate = 1;

    var currentTime = map.clock.currentTime.secondsOfDay;
    var delta = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    map.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
}

//#endregion

//#region 示例处理代码
//#region 定义图层
var czmlLayer;
var graphicLayerRoad;
var graphicLayerRoad2;
var graphicLayerRiver;
var osmBuildingsLayer;
var echartsLayer;
var geoJsonLayerGDP;
var geoJsonLayerGDP1;
var graphicLayerP;
var graphicLayerW;
var waterLayer;
var kmlLayer;
var geoJsonLayerline;
var geoJsonLayerarea;
var geoJsonLayerp;
var geoJsonLayerpc;
var tiles3dLayer;
var geoJsonLayerpcmk;
var geojsonncwu;
var geojsonncwuw;
var tiles3dLayerncwu;
var geojsonhe;
//#endregion
//#region 清除已有图层
function removeLayer(mlLayer) {
    map.trackedEntity = null;
    if (mlLayer) {
        map.removeLayer(mlLayer, true);
        mlLayer = null;
    }
}

function removeAll() {
    removeLayer(czmlLayer);
    removeLayer(geojsonhe);
    removeLayer(tiles3dLayer);
    removeLayer(graphicLayerRoad);
    removeLayer(graphicLayerRoad2);
    removeLayer(graphicLayerRiver);
    removeLayer(osmBuildingsLayer);
    removeLayer(echartsLayer);
    removeLayer(geoJsonLayerGDP);
    removeLayer(geoJsonLayerGDP1);
    removeLayer(graphicLayerP);
    removeLayer(graphicLayerW);
    removeLayer(waterLayer);
    removeLayer(geoJsonLayerline);
    removeLayer(geoJsonLayerarea);
    removeLayer(geoJsonLayerp);
    removeLayer(geoJsonLayerpc);
    removeLayer(kmlLayer);
    removeLayer(geoJsonLayerpcmk);
    removeLayer(geojsonncwu);
    removeLayer(geojsonncwuw);
    removeLayer(tiles3dLayerncwu);
    map.basemap = 2021;
    var boxr = document.getElementById('showriver');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    var boxr = document.getElementById('viewSL1');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    var boxr = document.getElementById('loadlegend');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    var boxr = document.getElementById('popv');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    boxr.style.visibility = "hidden";
    var boxr = document.getElementById('water');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    boxr.style.visibility = "hidden";
    var boxr = document.getElementById('osgb');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    boxr.style.visibility = "hidden";
    var boxr = document.getElementById('bdv');
    boxr.style.hidden = "hidden";
    boxr.style.display = "none";
    boxr.style.visibility = "hidden";
    boxr.innerHTML = "";
    map.viewer.scene.globe.depthTestAgainstTerrain = false;
}

//#endregion
//#region  北斗卫星
function showBDWeixinDemo() {
    removeAll();

    var box1 = document.getElementById('bdv');
    if (box1.style.visibility == "hidden") {
        box1.style.hidden = "";
        box1.style.visibility = "visible";
        box1.style.display = "block";
        //更新地球参数
        map.setSceneOptions({
            cameraController: {
                maximumZoomDistance: 500000000,
            },
        });

        czmlLayer = new mars3d.layer.CzmlLayer({
            name: "北斗卫星",
            url: "czml/satellite.czml",
            //center: { lng: 10, lat: 111.833884, z: 150000000, heading: 0, pitch: -90, roll: 0 },
            //flyTo: true,
            popup: "{description}"
        });
        map.setCameraView({"lat": 68.166116, "lng": -170, "alt": 150000000, "heading": 0, "pitch": -90}, {duration: 5});
        map.addLayer(czmlLayer);
        var boxx = document.getElementById('bdv');
        boxx.innerHTML = "<div id='vid'><video  src='images/mp41.avi' controls autoplay style='width: 300px;' ></video></div>";
    } else {
        box1.style.hidden = "hidden";
        box1.style.display = "none";
        box1.style.visibility = "hidden";
    }


}

//#endregion
//#region 火箭发射
function showHuojianDemo() {
    removeAll();

    // map.basemap = "ArcGIS影像";

    czmlLayer = new mars3d.layer.CzmlLayer({
        name: "火箭发射",
        url: "czml/space.czml",
        flyTo: true,
    });
    map.addLayer(czmlLayer);

    //绑定事件
    czmlLayer.on(mars3d.EventType.load, function (event) {
        console.log("数据加载完成", event);
        map.setCameraView({lat: 28.561843, lng: -80.577575, alt: 630, heading: 359, pitch: -85}, {duration: 7});

        //火星发射时，锁定火箭模型对象
        map.trackedEntity = event.dataSource.entities.getById("Vulcan");

        initTree(event.list);
    });
    czmlLayer.on(mars3d.EventType.click, function (event) {
        console.log("单击了图层", event);
    });
}

//#endregion
//#region 一带一路
function showOneRoad() {
    removeAll();
    map.basemap = 2017;
    var box1 = document.getElementById('loadlegend');
    if (box1.style.display == "none") {
        box1.style.hidden = "";
        box1.style.display = "block";
        queryoneBeltOneRoadApiData()
            .then(function (res) {
                showRoad(res.data.land, {
                    name: "丝绸之路经济带",
                    color: Cesium.Color.CORAL,
                });

                showRoad2(res.data.sea, {
                    name: "21世纪海上丝绸之路",
                    color: Cesium.Color.DEEPSKYBLUE,
                });
                map.setCameraView({
                    "lat": 42.311212,
                    "lng": 89.850254,
                    "alt": 17040736,
                    "heading": 0,
                    "pitch": -90
                }, {duration: 3});
            })
        //  .catch(function () {
        //     haoutil.msg("实时查询信息失败，请稍候再试");
        //  });    
    } else {
        box1.style.hidden = "hidden";
        box1.style.display = "none";
        removeLayer(graphicLayerRoad);
        removeLayer(graphicLayerRoad2);
    }

}

function showRoad(arr, options) {
    graphicLayerRoad = new mars3d.layer.GraphicLayer();
    map.addLayer(graphicLayerRoad);

    const arrPosition = [];
    for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];

        const position = Cesium.Cartesian3.fromDegrees(item.x, item.y);
        item.position = position;

        arrPosition.push(position);

        // 创建点
        if (item.icon) {
            var billboardPrimitive = new mars3d.graphic.BillboardPrimitive({
                name: item.name,
                position: position,
                style: {
                    image: "images/country/" + item.icon,
                    scale: 0.7,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    label: {
                        text: item.name,
                        font_size: 17,
                        font_family: "楷体",
                        color: Cesium.Color.WHITE,
                        outline: true,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 2,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -30),
                    },
                },
            });
            graphicLayerRoad.addGraphic(billboardPrimitive);

            let html = `<div class="mars-load-location">
    ${item.continent} - ${item.country} - <i style="color: #00ffff;">${item.name}</i>
    <br />${item.More}
</div>`;
            billboardPrimitive.bindPopup(html);
        }
    }

    var positions = mars3d.PolyUtil.getBezierCurve(arrPosition);
    positions.push(arrPosition[arrPosition.length - 1]);

    var primitive = new mars3d.graphic.PolylinePrimitive({
        positions: positions,
        style: {
            width: 4,
            material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
                image: "images/LinkPulse.png",
                color: options.color,
                repeat: new Cesium.Cartesian2(10.0, 1.0),
                speed: 2,
            }),
        },
    });
    graphicLayerRoad.addGraphic(primitive);

    primitive.bindTooltip(options.name);
}

function showRoad2(arr, options) {
    graphicLayerRoad2 = new mars3d.layer.GraphicLayer();
    map.addLayer(graphicLayerRoad2);

    const arrPosition = [];
    for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];

        const position = Cesium.Cartesian3.fromDegrees(item.x, item.y);
        item.position = position;

        arrPosition.push(position);

        // 创建点
        if (item.icon) {
            var billboardPrimitive = new mars3d.graphic.BillboardPrimitive({
                name: item.name,
                position: position,
                style: {
                    image: "images/country/" + item.icon,
                    scale: 0.7,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    label: {
                        text: item.name,
                        font_size: 17,
                        font_family: "楷体",
                        color: Cesium.Color.WHITE,
                        outline: true,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 2,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -30),
                    },
                },
            });
            graphicLayerRoad2.addGraphic(billboardPrimitive);

            let html = `<div class="mars-load-location">
    ${item.continent} - ${item.country} - <i style="color: #00ffff;">${item.name}</i>
     <br />${item.More}
</div>`;
            billboardPrimitive.bindPopup(html);
        }
    }

    var positions = mars3d.PolyUtil.getBezierCurve(arrPosition);
    positions.push(arrPosition[arrPosition.length - 1]);

    var primitive = new mars3d.graphic.PolylinePrimitive({
        positions: positions,
        style: {
            width: 4,
            material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
                image: "images/LinkPulse.png",
                color: options.color,
                repeat: new Cesium.Cartesian2(10.0, 1.0),
                speed: 2,
            }),
        },
    });
    graphicLayerRoad2.addGraphic(primitive);

    primitive.bindTooltip(options.name);
}

//访问后端接口，取数据
function queryoneBeltOneRoadApiData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "json/oneBeltOneRoad.json",
            type: "get",
            dataType: "json",
            success: function (result) {
                resolve(result);
            },
            error: function (data) {
                reject(data);
            },
        });
    });
}

//#endregion
//#region 水库放水
function showWaterP() {
    removeAll();
    var box1 = document.getElementById('water');
    if (box1.style.visibility == "hidden") {
        box1.style.hidden = "";
        box1.style.visibility = "visible";
        box1.style.display = "block";
        showWater();
    } else {
        box1.style.hidden = "hidden";
        box1.style.display = "none";
        box1.style.visibility = "hidden";
        removeLayer(graphicLayerW);
        removeLayer(waterLayer);
    }
}

function showWater() {
    waterLayer = new mars3d.layer.GeoJsonLayer({
        url: "json/wangjiaba.json",
        symbol: {
            type: "waterCombine",
            styleOptions: {
                height: 32, //水面高度
                normalMap: "images/waterNormals.jpg", // 水正常扰动的法线图
                frequency: 9000.0, // 控制波数的数字。
                animationSpeed: 0.03, // 控制水的动画速度的数字。
                amplitude: 5.0, // 控制水波振幅的数字。
                specularIntensity: 0.2, // 控制镜面反射强度的数字。
                baseWaterColor: "#123e59", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
                blendColor: "#123e59", // 从水中混合到非水域时使用的rgba颜色对象。
            },
        },
    });
    map.addLayer(waterLayer);
    graphicLayerW = new mars3d.layer.GraphicLayer();
    map.addLayer(graphicLayerW);

    for (var i = 0, len = posArr.length; i < len; i++) {
        var pos = posArr[i];
        var position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]);

        var particleSystem = new mars3d.graphic.ParticleSystem({
            id: i + 1,
            position: position, //位置
            style: {
                image: "images/smoke.png",
                particleSize: 28,
                startColor: Cesium.Color.LIGHTCYAN.withAlpha(0.3), //粒子出生时的颜色
                endColor: Cesium.Color.WHITE.withAlpha(0.0), //当粒子死亡时的颜色

                startScale: 2.0, //粒子出生时的比例，相对于原始大小
                endScale: 4.0, //粒子在死亡时的比例
                minimumParticleLife: 1.1, //设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随机生成
                maximumParticleLife: 3.1, //设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随机生成
                minimumSpeed: 1.0, //设置以米/秒为单位的最小界限，超过该最小界限，随机选择粒子的实际速度。
                maximumSpeed: 4.0, //设置以米/秒为单位的最大界限，超过该最大界限，随机选择粒子的实际速度。

                emissionRate: 100.0, //每秒要发射的粒子数。
                lifetime: 8.0, //粒子的生命周期为（以秒为单位）。
            },
            gravity: -11,
            target: new Cesium.Cartesian3(-0.13, 0.09, 0.28), //粒子的方向
            maxHeight: 2000, //超出该高度后不显示粒子效果
        });

        graphicLayerW.addGraphic(particleSystem);
    }
    map.setCameraView({"lat": 32.432745, "lng": 115.601935, "alt": 131, "heading": 237, "pitch": -31}, {duration: 5});
}

$(".chkZMKZ").change(function (e) {
    var show = $(this).is(":checked");
    var id = Number($(this).attr("data-id"));

    var particleSystem = graphicLayerW.getGraphicById(id);
    if (particleSystem) {
        particleSystem.show = show;
    }
});

$("#selecteAll").change(function (e) {
    var show = $(this).is(":checked");
    $(".chkZMKZ").prop("checked", show);
    graphicLayerW.eachGraphic((graphic1) => {
        graphic1.show = show;
    });
});
//水柱位置
var posArr = [
    [115.600031, 32.43217, 38],
    [115.600104, 32.432121, 38],
    [115.600163, 32.432059, 38],
    [115.600246, 32.432014, 38],
    [115.600324, 32.431971, 38],
    [115.600404, 32.431927, 38],
    [115.600484, 32.431882, 38],
    [115.600563, 32.431839, 38],
    [115.600646, 32.431793, 38],
    [115.600727, 32.431749, 38],
    [115.600806, 32.431706, 38],
    [115.600886, 32.431661, 38],
    [115.600967, 32.431617, 38],
];
//#endregion
//#region 动态河流

function showRiver() {
    removeAll();
    map.viewer.scene.globe.depthTestAgainstTerrain = true;
    var box1 = document.getElementById('showriver');
    if (box1.style.display == "none") {
        box1.style.hidden = "";
        box1.style.display = "block";
        riveradd();
        map.setCameraView({lat: 30.422407, lng: 115.820222, alt: 3498, heading: 67, pitch: -32}, {duration: 5});

    } else {
        box1.style.hidden = "hidden";
        box1.style.display = "none";
        removeLayer(graphicLayerRiver);
    }
}

function riveradd() {
    graphicLayerRiver = new mars3d.layer.GraphicLayer();
    map.addLayer(graphicLayerRiver);
    var dynamicRiver = new mars3d.graphic.DynamicRiver({
        positions: [
            [115.906607, 30.441582, 555.9],
            [115.899964, 30.438543, 467.3],
            [115.893105, 30.440714, 374.6],
            [115.88362, 30.443924, 340.7],
            [115.873948, 30.444827, 299],
            [115.864003, 30.442111, 292.2],
            [115.850741, 30.438108, 189.9],
        ],
        style: {
            image: "images/movingRiver.png",
            width: 280,
            height: 30,
            speed: 10,
        },
    });
    graphicLayerRiver.addGraphic(dynamicRiver);
    console.log(dynamicRiver);
    //属性动态更新
    $("#txtWidth").change(function (e) {
        if (!dynamicRiver) {
            return;
        }
        var value = Number($(this).val());
        dynamicRiver.width = value;
    });

    $("#txtHeight").change(function (e) {
        if (!dynamicRiver) {
            return;
        }
        var value = Number($(this).val());
        dynamicRiver.height = value;
    });

    $("#txtSpeed")
        .slider({min: 0, max: 50, step: 1, value: 10})
        .on("change", (e) => {
            if (dynamicRiver && e && e.value) {
                dynamicRiver.speed = e.value.newValue;
            }
        });

    //清除
    $("#btnClear").click(function (e) {
        graphicLayer.clear();
        dynamicRiver = null;
    });

    $("#btnAddHeight").click(function (e) {
        if (!dynamicRiver) {
            return;
        }
        dynamicRiver.offsetHeight(30, 5); //5秒内抬高30米
    });

    $("#btnLowerHeight").click(function (e) {
        if (!dynamicRiver) {
            return;
        }
        dynamicRiver.offsetHeight(-30, 5); //5秒内降低30米
    });

    $("#btnDrawLine").click(function (e) {
        map.graphicLayer.startDraw({
            type: "polyline",
            style: {
                color: "#55ff33",
                width: 3,
            },
            success: (graphic) => {
                var points = graphic.points;

                console.log(JSON.stringify(graphic.coordinates)); //打印下边界

                graphic.remove(); //删除绘制的线

                var width = Number($("#txtWidth").val());
                var height = Number($("#txtHeight").val());
                var speed = Number($("#txtSpeed").val());

                dynamicRiver = new mars3d.graphic.DynamicRiver({
                    positions: points,
                    style: {
                        image: "images/movingRiver.png",
                        width: width,
                        height: height,
                        speed: speed,
                    },
                });
                graphicLayerRiver.addGraphic(dynamicRiver);
            },
        });
    });
}

//#endregion
//#region 城市模型
function showOsm() {
    removeAll();
    showNcwuDemo();
   osmBuildingsLayer = new mars3d.layer.OsmBuildingsLayer({
        luminanceAtZenith: 1.0,
        style: {
            color: "#90caf9"
        },
        highlight: {
            type: "click",
            color: "#90caf9",
        },
        popup: "all",
    });
    map.addLayer(osmBuildingsLayer);
    map.setCameraView({"lat": 34.768357, "lng": 113.789369, "alt": 2035, "heading": 355, "pitch": -54}, {duration: 7});
}

function showNcwuDemo() {
    map.basemap = 2017;
    geojsonncwu = new mars3d.layer.GeoJsonLayer({
        name: "华水边界",
        url: "json/华水边界.json",
        symbol: {
            type: "wall",
            styleOptions: {
                width: 8,
                diffHeight: 250, // 墙高
                materialType: mars3d.MaterialType.LineFlow,
                speed: 10, // 速度
                image: "images/fence.png", // 图片
                repeatX: 1, // 重复数量
                axisY: true, // 竖直方向
                color: "#c98d3c", // 颜色
                opacity: 0.9, // 透明度
                // 高亮时的样式
                highlight: {
                    type: "click",
                    color: "#ffff00"
                },
                clampToGround: true,
            }
        },
    })
    map.addLayer(geojsonncwu);


/*    geojsonncwuw = new mars3d.layer.GeoJsonLayer({
        type: "geojson",
        name: "河流",
        url: "json/华水河流.json",
        symbol: {
            type: "waterCombine",
            styleOptions: {
                normalMap: "images/waterNormals.jpg", // 水正常扰动的法线图
                frequency: 5000.0, // 控制波数的数字。
                animationSpeed: 0.05, // 控制水的动画速度的数字。
                amplitude: 9.0, // 控制水波振幅的数字。
                specularIntensity: 0.8, // 控制镜面反射强度的数字。
                baseWaterColor: "#00baff", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
                blendColor: "#00baff", // 从水中混合到非水域时使用的rgba颜色对象。
                clampToGround: true,
            },
        },
        popup: "all",
        zIndex: 10,
        show: true,
    })
    map.addLayer(geojsonncwuw);*/

    tiles3dLayerncwu = new mars3d.layer.TilesetLayer({
        name: "华水建筑物",
        url: "http://localhost:9003/model/thV8lHoL5/tileset.json",
        position: { alt: 86.6 },
        maximumScreenSpaceError: 10,
        maximumMemoryUsage: 1024,
        dynamicScreenSpaceError: true,
        cullWithChildrenBounds: false,
        skipLevelOfDetail: true,
        preferLeaves: true,
    });
    map.addLayer(tiles3dLayerncwu);
    geojsonncwuw = new mars3d.layer.TilesetLayer({
        name: "学校介绍",
        url: "http://localhost:9003/model/tM0WFk02B/tileset.json",
        position: { alt: -1.1 },
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        maximumScreenSpaceError: 8,
        maximumMemoryUsage: 256,
        style: {
            color: "rgba(255, 255, 255, 0.01)",
        },
        highlight: {
            type: mars3d.EventType.click,
            color: "#00ff00",
            opacity: 0.4
        },
        popup: [
            {field: "More", name: "地址："},
            {field: "name", name: "详情："},

        ],
    })
    map.addLayer(geojsonncwuw);

}

//#endregion
//#region 人口迁移
function showPM() {
    removeAll();
    map.basemap = 2017;
    getdata1().then(function (res) {
        var options1 = getEchartsOption(res);
        echartsLayer = new mars3d.layer.EchartsLayer(options1);
        map.setCameraView({
            "lat": 35.343197,
            "lng": 110.798275,
            "alt": 6218595,
            "heading": 357,
            "pitch": -90
        }, {duration: 7});
        map.addLayer(echartsLayer);
    });

}

function getdata1() {
    return new Promise(function (resolve, reject) {
        $.get("json/movelines.json", function (result) {
            resolve(result);
        });
    });
}

function getEchartsOption(data) {

    var option = {
        animation: false,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: true,
        title: {
            text: "人口迁徙图",
            left: "center",
            textStyle: {
                color: "#fff",
            },
        },
        legend: {
            show: true,
            orient: "vertical",
            top: "center",
            left: "left",
            data: ["地点", "线路"],
            textStyle: {
                color: "#fff",
            },
        },
        series: [
            {
                name: "地点",
                type: "effectScatter",
                coordinateSystem: "mars3dMap",
                zlevel: 1,
                rippleEffect: {
                    brushType: "stroke",
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke",
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: "{b}",
                        position: "right",
                        show: true,
                    },
                },
                symbolSize: 2,
                itemStyle: {
                    normal: {
                        color: "#46bee9",
                    },
                },
                data: data.citys,
            },
            {
                name: "线路",
                type: "lines",
                coordinateSystem: "mars3dMap",
                zlevel: 2,
                large: true,
                effect: {
                    show: true,
                    constantSpeed: 30,
                    symbol: "pin",
                    symbolSize: 3,
                    trailLength: 0,
                },
                label: {
                    emphasis: {
                        show: true,
                        position: "right",
                        formatter: function (params, ticket, callback) {
                            return "流出地: " + params.data.fromName + "\n流入地: " + params.data.toName;
                        },
                        fontSize: "15",
                        color: "#fff",
                        backgroundColor: "rgba(63, 72, 84, 0.9)", //标签背景颜色
                        borderColor: "#03717b",  //外层边框颜色
                        borderWidth: 2, //外层边框宽度
                        borderRadius: 5, //外层边框圆角
                    },
                },
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "#58B3CC",
                                },
                                {
                                    offset: 1,
                                    color: "#F58158",
                                },
                            ],
                            false
                        ),
                        width: 1,
                        opacity: 1,
                        curveness: 0.1,
                    },
                },
                data: data.moveLines,
            },
        ],
    };
    return option;
}

//#endregion
//#region 柱状统计图
function showGDP() {
    removeAll();
    map.basemap = 2017;
    geoJsonLayerGDP1 = new mars3d.layer.GeoJsonLayer();
    map.addLayer(geoJsonLayerGDP1);
    geoJsonLayerGDP = new mars3d.layer.GeoJsonLayer({
        id: 1987,
        name: "黄河流域各省GDP统计",
        url: "json/黄河流域各省.json",
        symbol: {
            type:"polygon",
            styleOptions: {
                //materialType: mars3d.MaterialType.PolyGradient, //重要参数，指定材质
                color: "#3388cc",
                // opacity: 0.9,
                alphaPower: 1.3,
                //面中心点，显示文字的配置
                label: {
                    text: "{name}", //对应的属性名称
                    opacity: 1,
                    font_size: 40,
                    color: "#ffffff",
                    outline: true,
                    pixelOffsetY: -50,
                    outlineColor: "#000000",
                    scaleByDistance: true,
                    scaleByDistance_far: 20000000,
                    scaleByDistance_farValue: 0.1,
                    scaleByDistance_near: 1000,
                    scaleByDistance_nearValue: 1,
                },
            },
            callback: function (attr, styleOpt) {
                let randomHeight = attr.GDP *2; //测试的高度
                return {
                    color: getColor(),
                    diffHeight: randomHeight,
                };
            },
        },
    });
    map.addLayer(geoJsonLayerGDP);
    let arrColor = ["rgb(15,176,255)", "rgb(18,76,154)", "#40C4E4", "#42B2BE", "rgb(51,176,204)", "#8CB7E5", "rgb(0,244,188)", "#139FF0"];

    let index = 0;
    function getColor() {
        return arrColor[++index % arrColor.length];
    }
    geojsonhe = new mars3d.layer.GeoJsonLayer({
        name: "黄河流域边界",
        url: "json/黄河流域边界.json",
        symbol: {
            type: "wall",
            styleOptions: {
                width: 20,
                diffHeight: 200000, // 墙高
                materialType: mars3d.MaterialType.LineFlow,
                speed: 10, // 速度
                image: "images/fence.png", // 图片
                repeatX: 1, // 重复数量
                axisY: true, // 竖直方向
                color: "#d5ea4a", // 颜色
                opacity: 0.9, // 透明度
                // 高亮时的样式
            }
        },
    })
    map.addLayer(geojsonhe);
    queryHuaiHaiApiData()
        .then(function (res) {
            conventChartsData(res.data); //单击显示的popup
            showYearZT(res.data); //柱状图
            bindHaihuaiPopup();
            map.setCameraView({"lat":21.78063,"lng":111.126277,"alt":1947512,"heading":355,"pitch":-52}, {duration: 3});
        })
        .catch(function () {
            haoutil.msg("获取信息失败，请稍候再试");
        });
    map.on(mars3d.EventType.load, function (event) {
        console.log("矢量数据对象加载完成", event);
    });
}


// 访问后端接口，取数据
function queryHuaiHaiApiData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "json/黄河经济.json",
            type: "get",
            dataType: "json",
            success: function (result) {
                resolve(result);
            },
            error: function (data) {
                reject(data);
            },
        });
    });
}


/**
 * 展示某年的椎体
 */
function showYearZT(data) {
    const yearArr = Object.keys(data);
    let arr = data[yearArr[4]];

    for (let i = 0; i < arr.length; i += 1) {
        const attr = arr[i];
        const jwd = getJWDByName(attr["name"]);

        const num1 = attr["第一产业"];
        const num2 = attr["第二产业"];
        const num3 = attr["第三产业"];
        const numall = Number(num1 + num2 + num3).toFixed(2);
        const html = `2019${attr["name"]}：<br/>
                        <span style="color:#63AEFF">第一产业：${num1}亿元</span><br/>
                        <span style="color:#FFB861">第二产业：${num2}亿元</span><br/>
                        <span style="color:#FF6D5D">第三产业：${num3}亿元</span>`;

        var height1 = Math.floor(num1 * 10);
        var height2 = Math.floor(num2 * 10);
        var height3 = Math.floor(num3 * 10);

        var p1 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 / 2);
        var p2 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 + height2 / 2);
        var p3 = Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height3 + height2 + height1 / 2);

        // 添加柱体
        createZT(p1, height3, "#63AEFF", html);
        createZT(p2, height2, "#FFB861", html);
        createZT(p3, height1, "#FF6D5D", html);

        // 添加文字
        var primitive = new mars3d.graphic.LabelPrimitive({
            position: Cesium.Cartesian3.fromDegrees(jwd[0], jwd[1], height1 + height2 + height3),
            style: {
                text: numall,
                font_size: 18,
                font_family: "楷体",
                color: "#00ff00",
                outline: true,
                outlineColor: "#000000",
                outlineWidth: 1,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20),
            },
        });
        geoJsonLayerGDP1.addGraphic(primitive);
        primitive.bindTooltip(html);

    }
}

/**  创建柱体 */
function createZT(position, len, color, html) {
    var graphiczt = new mars3d.graphic.CylinderEntity({
        position: position,
        style: {
            length: len,
            topRadius: 60000.0,
            bottomRadius: 60000.0,
            color: color,
        },
    });
    geoJsonLayerGDP1.addGraphic(graphiczt);

    graphiczt.bindTooltip(html);

    // graphic._position_show = position
    // graphic._length_show = len
    return graphiczt;
}

var cityPosition = [
    {name: "四川省", jwd: [102.482777, 30.535158]},
    {name: "甘肃省", jwd: [103.934925, 35.201088]},
    {name: "宁夏回族自治区", jwd: [105.8662, 37.213784]},
    {name: "青海省", jwd: [97.292455, 35.700049]},
    {name: "陕西省", jwd: [108.352184, 34.150131]},
    {name: "山西省", jwd: [111.286266, 38.4121]},
    {name: "内蒙古自治区", jwd: [109.353202, 41.81189]},
    {name: "河南省", jwd: [113.271593, 34.090351]},
    {name: "山东省", jwd: [117.776857, 36.409937]}
];

/**
 * 根据名称获取坐标
 */
function getJWDByName(name) {
    for (let i = 0; i < cityPosition.length; i += 1) {
        const item = cityPosition[i];
        if (item.name === name) {
            return item.jwd;
        }
    }
    return [];
}


//================以下是单击显示的echarst图表的相关代码===============
let arrYear;
let objCity = {};

// 转换值
function conventChartsData(arrOld) {
    console.log("转换前数据=>", arrOld);

    arrYear = Object.keys(arrOld); //[年份]

    objCity = {}; //十一个城市对应的各年度数据

    for (let a = 0; a < arrYear.length; a++) {
        let arrCity = arrOld[arrYear[a]]; //指定某年的11个城市对应数据

        // 循环十次
        for (let b = 0; b < arrCity.length; b++) {
            let item = arrCity[b];

            if (!objCity[item.code]) {
                objCity[item.code] = [];
            }
            objCity[item.code].push(item.GDP);
        }
    }

    console.log("转换完成的数据=>", objCity);
}

function bindHaihuaiPopup() {
    var layerHuaihai = map.getLayer(1987, "id"); // 获取config.json中对应图层

    //在layer上绑定Popup单击弹窗
    layerHuaihai.bindPopup(
        `<div class="gdpView">
            <div class="gdpCharts" id="gdpCharts"></div>
            <input type="button" class="btnClosePopup closeButton" value="×" />
            </div>`,
        {
            template: false,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    );

    let gdpCharts;
    layerHuaihai.on(mars3d.EventType.popupOpen, function (event) {
        let container = event.container; //popup对应的DOM
        console.log("图层上打开了popup", container);

        let option = getCityChartsOptions(event.graphic?.attr);
        if (!option) {
            return;
        }
        gdpCharts = echarts.init(container.querySelector("#gdpCharts"));
        gdpCharts.setOption(option);
    });
    layerHuaihai.on(mars3d.EventType.popupClose, function (event) {
        let container = event.container; //popup对应的DOM
        console.log("图层上移除了popup", container);

        gdpCharts.dispose();
        gdpCharts = null;
    });
}

function getCityChartsOptions(attr) {
    let arrGDPvalues = objCity[attr.adcode];
    if (!arrGDPvalues) {
        haoutil.msg(attr.Name + " 无经济数据");
        return;
    }

    // arrGDPvalues  是点击的城市的数值,需要以[b,0,value]的方式重新排列
    let arrData = [];
    for (let b = 0; b < arrGDPvalues.length; b++) {
        arrData[b] = [b, 0, arrGDPvalues[b]];
    }

    var option = {
        visualMap: {
            max: 4500,
            show: false,
            inRange: {
                color: ["#32C5E9", "#67E0E3", "#FFDB5C", "#37A2DA", "#9FE6B8"],
            },
        },
        title: {
            text: attr.name + "   近五年GDP（亿元）",
            top: "10",
            left: "5",
            textStyle: {
                color: "white",
                fontSize: "17",
                fontWidth: "normal",
            },
        },
        tooltip: {
            show: "true",
            trigger: "item",
            showContent: "true",
            position: "top",
            textStyle: {
                fontSize: "12",
                color: "black",
            },
            formatter: function formatter(params) {
                return "GDP:" + params.data[2];
            },
        },
        // x轴是横向，是时间
        xAxis3D: {
            type: "category",
            data: arrYear,
            nameTextStyle: {
                color: "rgb(0, 0, 0, 0.1)",
            },
            // splitLine不可见时仅仅线不可见
            splitLine: {
                show: false,
            },
        },
        // y轴被缩小
        yAxis3D: {
            type: "category",
            data: [" "],
            nameTextStyle: {
                color: "rgb(0, 0, 0, 0.1)",
            },
            splitLine: {
                show: false,
            },
        },
        // z轴是gdp的值
        zAxis3D: {
            type: "value",
            name: "GDP",
            axisLine: {
                lineStyle: {
                    color: "rgb(0, 0, 0, 0.1)",
                },
            },
            nameTextStyle: {
                color: "white",
                fontSize: "18",
            },
            nameGap: "50",
        },
        grid3D: {
            boxWidth: 180, //缩大放小x轴
            boxDepth: 10, // 缩大放小y轴
            top: "20",
            // left: '50',
            // 視角的設置
            viewControl: {
                alpha: 8,
                beta: 0,
                distance: 162,
                center: [-20, 0, 0],
            },
            axisLabel: {
                textStyle: {
                    color: "white",
                    fontSize: 15,
                },
            },
            axisPointer: {
                //坐标轴指示线，就是鼠标移入时，指向x轴，y轴的线
                show: false,
            },
        },
        series: [
            {
                type: "bar3D",
                data: arrData,
                shading: "lambert",
                label: {
                    position: "top",
                    show: true,
                    color: "white",
                },
                emphasis: {
                    label: {
                        textStyle: {
                            color: "white",
                            fontSize: "18",
                        },
                    },
                },
            },
        ],
    };
    return option;
}

//#endregion
//#region  人口
// 访问后端接口，取数据
function showData() {
    removeAll();
    map.basemap = 2017;

    geoJsonLayerGDP = new mars3d.layer.GeoJsonLayer({
        name: "黄河流域各省人口统计",
        url: "json/黄河流域各省.json",
        symbol: {
            type:"polygon",
            styleOptions: {
                //materialType: mars3d.MaterialType.PolyGradient, //重要参数，指定材质
                color: "#3388cc",
               // opacity: 0.9,
                alphaPower: 1.3,
                //面中心点，显示文字的配置
               label: {
                    text: "{name}", //对应的属性名称
                    opacity: 1,
                   font_size: 40,
                   color: "#ffffff",
                   outline: true,
                   pixelOffsetY: -50,
                   outlineColor: "#000000",
                    scaleByDistance: true,
                    scaleByDistance_far: 20000000,
                    scaleByDistance_farValue: 0.1,
                    scaleByDistance_near: 1000,
                    scaleByDistance_nearValue: 1,
                },
            },
            callback: function (attr, styleOpt) {
                let randomHeight = attr.PopSum * 10; //测试的高度
                return {
                    color: getColor(),
                    diffHeight: randomHeight,
                };
            },
        },
        popup: "{name} : {PopSum}万人  ",
    });
    map.addLayer(geoJsonLayerGDP);
    bindPopPopup();
    let arrColor = ["rgb(15,176,255)", "rgb(18,76,154)", "#40C4E4", "#42B2BE", "rgb(51,176,204)", "#8CB7E5", "rgb(0,244,188)", "#139FF0"];

    let index = 0;
    function getColor() {
        return arrColor[++index % arrColor.length];
    }
    geojsonhe = new mars3d.layer.GeoJsonLayer({
        name: "黄河流域边界",
        url: "json/黄河流域边界.json",
        symbol: {
            type: "wall",
            styleOptions: {
                width: 20,
                diffHeight: 200000, // 墙高
                materialType: mars3d.MaterialType.LineFlow,
                speed: 10, // 速度
                image: "images/fence.png", // 图片
                repeatX: 1, // 重复数量
                axisY: true, // 竖直方向
                color: "#d5ea4a", // 颜色
                opacity: 0.9, // 透明度
                // 高亮时的样式
            }
        },
    })
    map.addLayer(geojsonhe);
    map.setCameraView({"lat":25.206996,"lng":106.841908,"alt":3415220,"heading":359,"pitch":-72}, {duration: 5});


}
function bindPopPopup() {
    //在layer上绑定Popup单击弹窗
    geoJsonLayerGDP.bindPopup(
        function (event) {
            let attr = event.graphic?.attr;
            var box1 = document.getElementById('popv');
            if (box1.style.visibility == "hidden") {
                box1.style.hidden = "";
                box1.style.visibility = "visible";
                box1.style.display = "block";
            }
            var City=attr.City
            var PCity=attr.name
            var RealPop =attr.RealPop;
            var Strman =attr.Strman ;
            var Strfeman =attr.Strfeman ;
            var AgMan =attr.AgMan ;
            var Agfeman =attr.Agfeman ;
            var PopBir =attr.PopBir;
            var PopDe =attr.PopDe;
            var PopNum =attr.PopNum ;
            var PopMan =attr.PopMan;
            var PopFM =attr.PopFM;
            box1.innerHTML = '<div class="realPopulation"><div class="populationView_text"><span id="city" class="firstBox text_population"></span><span class="firstBox text_icon">/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/</span></div><div class="container"><div class="comment populationNumber"><span class="columnar"></span><span id="PopNum" class="number"></span><p class="text-num">实有人口（人）</p></div><div class="comment birthRate"><span class="columnar"></span><span id="PopBir" class="number"></span><p class="text-num">人口出生率</p></div><div class="comment deathRate"><span class="columnar"></span><span id="PopDe" class="number"></span><p class="text-num">人口死亡率</p></div></div><div id="population" class="population"></div></div><div class="populationStructure"><div class="populationView_text"><span class="firstBox text_population">人口结构</span><span class="firstBox text_icon">/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/</span></div><div class="male"><span class="genderIcon genderIcon-nan1"></span><span>男性</span></div><div class="female"><span class="genderIcon genderIcon-nv1"></span><span>女性</span></div><div id="structure" class="structure"></div></div><div class="aging"><div class="populationView_text"><span class="firstBox text_population">老龄化分析</span><span class="firstBox text_icon">/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/</span></div><span class="man_icon genderIcon genderIcon-nan"></span><span class="woman_icon genderIcon genderIcon-nv"></span><div class="man_display"><span class="genderIcon genderIcon-nan"></span><span id="PopMan"></span></div><div class="woman_display"><span class="genderIcon genderIcon-nv"></span><span id="PopFM"></span></div><div id="agingAnalysis" class="agingAnalysis"></div></div>'
            initEchartsPop(RealPop, Strman, Strfeman, AgMan, Agfeman);
            document.getElementById('city').innerHTML = PCity+"省会城市"+City+"实有人口"
            document.getElementById('PopNum').innerHTML = PopNum.toString()
            document.getElementById('PopBir').innerHTML = PopBir
            document.getElementById('PopDe').innerHTML = PopDe
            document.getElementById('PopMan').innerHTML = PopMan
            document.getElementById('PopFM').innerHTML = PopFM
            return ``;
        },
        {
            template: false,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    );
}

//#endregion
//#region 水库变形

function showkml(urltext) {
    removeAll();
    geoJsonLayerp = new mars3d.layer.GeoJsonLayer({
        name: "变形监测点",
        // url: "json/text.json",
        url: "json/" + urltext + ".json",
        symbol: {
            styleOptions: {
                image: "images/".concat("{icon}"),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 1,
                clampToGround: true,
            }
        },
        popup: [
            {field: "description", name: "详细信息"},
        ],
    })
    map.addLayer(geoJsonLayerp);
    var box1 = document.getElementById('viewSL1');
    box1.style.hidden = "";
    box1.style.display = "block";
}

function showline() {
    removeAll();
    geoJsonLayerline = new mars3d.layer.GeoJsonLayer({
        name: "guojie",
        url: "json/省界_line.json",
        symbol: {
            type: "wall",
            styleOptions: {
                width: 8,
                diffHeight: 100000, // 墙高
                materialType: mars3d.MaterialType.LineFlow,
                speed: 10, // 速度
                image: "images/fence.png", // 图片
                repeatX: 1, // 重复数量
                axisY: true, // 竖直方向
                color: "#b8d095", // 颜色
                opacity: 0.9, // 透明度
                // 高亮时的样式
                highlight: {
                    type: "click",
                    color: "#ffff00"
                }
            }
        },
        popup: "{name}"
        // "tooltip": "{name}",
        // flyTo: true,
    })
    map.addLayer(geoJsonLayerline)
    geoJsonLayerarea = new mars3d.layer.GeoJsonLayer({
        name: "水库区域",
        url: "json/水库位置.json",
        symbol: {
            styleOptions: {
                image: "images/mark3.png",
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 1,
                clampToGround: true,
                label: {
                    text: "{name}",
                    font_size: 15,
                    outline: true,
                    pixelOffsetY: 10,
                    outlineColor: "#000000",
                    outlineWidth: 3,
                },
            }
        },

        // popup: `{name}水库</br><input type='button'  value='查看' onclick=' showkml(\"{name}\") ;map.setCameraView({view}) ' />`
    })
    map.addLayer(geoJsonLayerarea)
    map.setCameraView({"lat": 34.053055, "lng": 114.722092, "alt": 1212491, "heading": 0, "pitch": -90}, {duration: 5});
    bindsuikuPopup();
}

function bindsuikuPopup() {
    //在layer上绑定Popup单击弹窗
    geoJsonLayerarea.bindPopup(
        function (event) {
            let attr = event.graphic?.attr;
            viewd = attr.view;
            getlab1(attr.lableimg);
            return `<div class="gdpView">
            <div class="gdpCharts" id="gdpCharts" ><div >` + attr.name + `
            <input type='button' class="btn btn-primary active"  value='查看' onclick=' showkml(\"` + attr.name + `\") ;map.setCameraView(` + attr.view + `)' />
           </div>
            <div id="container">
            <div id="photo">
                <img src="` + attr.img1 + `" />
                <img src="` + attr.img2 + `" />
                <img src="` + attr.img3 + `" />
                <img src="` + attr.img4 + `" />
            </div>
        </div>
            </div>
            </div>`;
        },
        {
            template: false,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    );

    let gdpCharts;
    geoJsonLayerarea.on(mars3d.EventType.popupOpen, function (event) {
        let container = event.container; //popup对应的DOM
        console.log("图层上打开了popup", container);
    });
    geoJsonLayerarea.on(mars3d.EventType.popupClose, function (event) {
        let container = event.container; //popup对应的DOM
        console.log("图层上移除了popup", container);

        gdpCharts = null;
    });
}

//#endregion
//#region 导入带图表kml
function showkmls() {
    removeAll();
    var box1 = document.getElementById('viewSL1');
    box1.style.hidden = "";
    box1.style.display = "block";
    geoJsonLayerpc = new mars3d.layer.GeoJsonLayer({
        name: "变形监测点",
        // url: "json/text.json",
        url: "json/text (11).json",

        symbol: {
            styleOptions: {
                //image: "images/".concat("{icon}"),
                pixelSize: "10",
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.2,
                color: "{iconcolor}",
                clampToGround: true,

            }
        },
        // popup:`
        //     <div id="graphdiv" style="height: 320px; width: 480px;" >`,

    })
    map.setCameraView({"lat": 33.524529, "lng": 113.147389, "alt": 9870, "heading": 357, "pitch": -90}, {duration: 5});

    map.addLayer(geoJsonLayerpc);

    bindsuikuPopup1();
    getlab();
}

function getchart1(jscode) {

    $("#3323").append(" <b><div id=\"graphdiv\" style=\"height: 600px; height: 200px\"></div></b>");
    eval(jscode);
}

function getlab() {
    $("#viewSL1").empty();
    $("#viewSL1").append(" <div class='divPanel'><img src='images/label.png' style='width: 600px'  /></div>");
}

function getlab1(htmllab) {
    $("#viewSL1").empty();
    $("#viewSL1").append(" <div class='divPanel'><img src='images/" + htmllab + "' style='height: 300px'  /></div>");
}

function bindsuikuPopup1() {
    //在layer上绑定Popup单击弹窗
    var attr
    geoJsonLayerpc.bindPopup(
        function (event) {
            attr = event.graphic?.attr;
            return ` 
    <div id="3323" class="infoview_panel" style="height: 600px;width: 600px;overflow:auto">
` + attr.description + `
        
</div>
`;
        },
        {
            template: false,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    );

    let gdpCharts;
    geoJsonLayerpc.on(mars3d.EventType.popupOpen, function (event) {
        let container = event.container; //popup对应的DOM
        getchart1(attr.js);
    });
    geoJsonLayerpc.on(mars3d.EventType.popupClose, function (event) {
        let container = event.container; //popup对应的DOM
        console.log("图层上移除了popup", container);
        gdpCharts = null;
    });
}


//#endregion
//#region 倾斜模型
function showkosgb() {
    map.fixedLight = true;

    /* map.keyboardRoam.enabled = true;
     map.keyboardRoam.minHeight = 80;
     map.keyboardRoam.setOptions({
         moveStep: 0.1, //平移步长 (米)。
         dirStep: 2, //相机原地旋转步长，值越大步长越小。
         rotateStep: 1.0, //相机围绕目标点旋转速率，0.3-2.0
         minPitch: 0.1, //最小仰角  0-1
         maxPitch: 0.95, //最大仰角  0-1
     });*/
    if (haoutil.system.isPCBroswer()) {
        // Cesium 1.61以后会默认关闭反走样，对于桌面端而言还是开启得好，
        map.scene.postProcessStages.fxaa.enabled = true;

        //鼠标滚轮放大的步长参数
        map.scene.screenSpaceCameraController._zoomFactor = 2.0;

        //IE浏览器优化
        if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
            map.viewer.targetFrameRate = 60; //限制帧率
            map.viewer.requestRenderMode = true; //取消实时渲染
        }
    } /*else {
        //鼠标滚轮放大的步长参数
        map.scene.screenSpaceCameraController._zoomFactor = 5.0;

        //移动设备上禁掉以下几个选项，可以相对更加流畅
        map.viewer.requestRenderMode = true; //取消实时渲染
        map.scene.fog.enabled = false;
        map.scene.skyAtmosphere.show = false;
        map.scene.globe.showGroundAtmosphere = false;
    }*/
    tiles3dLayer = new mars3d.layer.TilesetLayer({
        name: "村庄模型",
        position: {"lng": 111.569679, "lat": 23.93403, "alt": -16.2},
        url: "OSGB/111/tileset.json",
        maximumScreenSpaceError: 1,
        maximumMemoryUsage: 3000,
        dynamicScreenSpaceError: true,
        cullWithChildrenBounds: false,
        skipLevelOfDetail: true,
        preferLeaves: true,
    });
    map.addLayer(tiles3dLayer);
    var viewPoints = [
        {lng: 111.569661, lat: 23.933857, alt: 373, heading: 330, pitch: -85, duration: 5, stop: 0},
        {lng: 111.569792, lat: 23.934059, alt: 85, heading: 232, pitch: -3, duration: 2, stop: 0},
    ];

    // 视角切换（分步执行）
    map.setCameraViewList(viewPoints);

}

function helpalert() {
    alert("单击鼠标后开始漫游\n" +
        "键盘按键说明\n" +
        "W(↑) \t水平方向前进\n" +
        "A(←) \t水平方向左移\n" +
        "S(↓) \t水平方向后退\n" +
        "D(→) \t水平方向右移\n" +
        "SHIFT + W(↑) \t视线方向前进\n" +
        "SHIFT + S(↓) \t视线方向后退\n" +
        "Q \t向左旋转\n" +
        "E \t向右旋转\n" +
        "R \t视点抬高\n" +
        "F \t视点降低\n" +
        "1 \t减速（默认速度的基础上*0.8）\n" +
        "2 \t恢复默认速度\n" +
        "3 \t提速（默认速度的基础上*1.2）\n" +
        "4 \t切换 固定速度模式/自动速度模式 ");
}

function StartPlay() {
    /*   earth.camera.immersion.enabled=true;
       earth.camera.immersion.ghostMode=true;*/
}

function showmodule() {
    removeAll();
    showkosgb();
    var box1 = document.getElementById('osgb');
    if (box1.style.visibility == "hidden") {
        box1.style.hidden = "";
        box1.style.visibility = "visible";
        box1.style.display = "block";

    } else {
        box1.style.hidden = "hidden";
        box1.style.display = "none";
        box1.style.visibility = "hidden";
        removeLayer(tiles3dLayer);
    }
}

/*$("#txtStep")
    .slider({
        min: 0.1,
        max: 300.0,
        step: 0.01,
        value: 10,
    })
    .on("change", (e) => {
        //修改步长
        if (e && e.value) {
            map.keyboardRoam.moveStep = e.value.newValue;
        }
    });*/

//#endregion
//#region 煤矿变形
function showkmlsmk() {
    removeAll();
    var box1 = document.getElementById('viewSL1');
    box1.style.hidden = "";
    box1.style.display = "block";
    geoJsonLayerpcmk = new mars3d.layer.GeoJsonLayer({
        name: "变形监测点",
        url: "json/text (15).json",

        symbol: {
            styleOptions: {
                //image: "images/".concat("{icon}"),
                pixelSize: "10",
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.2,
                color: "{iconcolor}",
                clampToGround: true,

            }
        },
        // popup:`
        //     <div id="graphdiv" style="height: 320px; width: 480px;" >`,

    })
    map.setCameraView({"lat": 37.762507, "lng": 113.535097, "alt": 26171, "heading": 357, "pitch": -90}, {duration: 5});
    map.addLayer(geoJsonLayerpcmk);

    bindsuikuPopup2();
    getlab2();
}

function getchart2(jscode) {

    $("#3323").append(" <b><div id=\"graphdiv\" style=\"height: 600px; height: 200px\"></div></b>");
    eval(jscode);
}

function getlab2() {
    $("#viewSL1").empty();
    $("#viewSL1").append(" <div class='divPanel'><img src='images/label2.png' style='width: 600px'  /></div>");
}

function getlab3(htmllab) {
    $("#viewSL1").empty();
    $("#viewSL1").append(" <div class='divPanel'><img src='images/" + htmllab + "' style='height: 300px'  /></div>");
}

function bindsuikuPopup2() {
    //在layer上绑定Popup单击弹窗
    var attr
    geoJsonLayerpcmk.bindPopup(
        function (event) {
            attr = event.graphic?.attr;
            return ` 
    <div id="3323" class="infoview_panel" style="height: 600px;width: 600px;overflow:auto">
` + attr.description + `
        
</div>
`;
        },
        {
            template: false,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
        }
    );

    let gdpCharts;
    geoJsonLayerpcmk.on(mars3d.EventType.popupOpen, function (event) {
        let container = event.container; //popup对应的DOM
        getchart2(attr.js);
    });
    geoJsonLayerpcmk.on(mars3d.EventType.popupClose, function (event) {
        let container = event.container; //popup对应的DOM
        console.log("图层上移除了popup", container);
        gdpCharts = null;
    });
}


//#endregion
//#endregion


