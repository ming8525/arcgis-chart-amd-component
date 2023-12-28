require([
  "esri/core/urlUtils",
  "esri/config",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "arcgis-charts-components/index"
], function (urlUtils, esriConfig, WebMap, MapView, LayerList, Search, ArcgisChartsComponentsDefault) {
  //initialize AMD code
  customElements.whenDefined("arcgis-charts-bar-chart").then(function () {
    // Manipulate or use the componentElement here
    init();
  });
  const getAbsoluteAssetPath = (chartsPackageName) => {
    let nodeModulesRelativePath = "./node_modules";
    let packageBundleFolder = chartsPackageName;
    return urlUtils.makeAbsolute(
      `${nodeModulesRelativePath}/${chartsPackageName.replace(
        "arcgis-charts",
        "@arcgis/charts"
      )}/dist/${packageBundleFolder}/t9n`
    );
  };
  esriConfig.portalUrl = "https://devext.arcgis.com";

  ArcgisChartsComponentsDefault.setAssetPath(getAbsoluteAssetPath("arcgis-charts-components"));

  let view, webmap, chartsComponent;

  function init() {
    // Pull webmap id from URL Param
    const urlParams = new URLSearchParams(window.location.search);
    const webmapId = urlParams.get("webmap");

    // Webmap
    webmap = new WebMap({
      portalItem: {
        id: webmapId ?? "6c3ca24f98eb45788224fbd96b8da999"
      }
    });
    // View
    view = new MapView({
      container: "viewDiv",
      map: webmap
    });

    // View has loaded
    view.when(() => {
      // Layer list widget
      const layerList = new LayerList({
        view: view,
        listItemCreatedFunction: async (event) => {
          const item = event.item;
          await item.layer.when();
          item.actionsSections = [
            [
              {
                title: "Open chart",
                className: "esri-icon-chart",
                id: "open-chart"
              }
            ]
          ];
        }
      });

      // Open chart action
      layerList.on("trigger-action", (event) => {
        if (event.action.id === "open-chart") {
          // Charts component
          chartsComponent?.remove();
          const layer = event.item.layer;
          const chart = layer.charts[0];
          const chartType = chart.series[0].type ?? "barSeries";
          if (chartType === "barSeries") {
            chartsComponent = document.createElement("arcgis-charts-bar-chart");
          } else if (chartType === "histogramSeries") {
            chartsComponent = document.createElement("arcgis-charts-histogram");
          } else if (chartType === "scatterSeries") {
            chartsComponent = document.createElement("arcgis-charts-scatter-plot");
          } else if (chartType === "lineSeries") {
            chartsComponent = document.createElement("arcgis-charts-line-chart");
          } else if (chartType === "pieSeries") {
            chartsComponent = document.createElement("arcgis-charts-pie-chart");
          }
          chartsComponent.layer = layer;
          chartsComponent.config = chart;
          chartsComponent.autoDisposeChart = false;
          // chartsComponent.view = view;
          document.getElementById("chartRef").appendChild(chartsComponent);
        }
      });

      view.ui.add(layerList, {
        position: "top-left"
      });

      // Search widget
      const search = new Search({
        view: view
      });

      view.ui.add(search, {
        position: "top-right"
      });

      // Zoom widget
      view.ui.move("zoom", "bottom-right");
    });
  }
});
