(function () {
  const node_modules = "./node_modules";

  /**
   * Here we point to the AMD Deployment available via the CDN , MV
   * App pulls the JSAPI branch and points to the AMD (CDN) JSAPI build.
   * var apiUrl = "../dist/js/arcgis-js-api/output/cdn/amd";
   * It is the same build we use here as well
   */
  const apiUrl = "https://jsdev.arcgis.com/next";
  const dojo_modules = "./node_modules";

  window.dojoConfig = {
    baseUrl: "./",
    async: true,
    // here we map where each AMD build of a package is located for the dojo AMD loader
    packages: [
      { name: "dojo", location: dojo_modules + "/dojo" },
      { name: "dojox", location: dojo_modules + "/dojox" },
      { name: "dijit", location: dojo_modules + "/dijit" },

      { name: "esri", location: apiUrl + "/esri" },
      { name: "@dojo", location: node_modules + "/@dojo" },
      {
        name: "arcgis-charts-components",
        location: node_modules + "/@arcgis/charts-components/dist/amd",
        main: "index"
      }
    ]
  };
})();
