// ==UserScript==
// @author         fisher01
// @name           IITC plugin: Wasabee: Mark Portals with Kureze Effect ornaments
// @category       Misc
// @version        0.2.0
// @description    Automark Portals for Kureze Effect
// @id             wb-kureze
// @updateURL      https://github.com/SebastienForay/Wasabee-IITC-Plugins/raw/main/KurezeEffect/wb-kureze.meta.js
// @downloadURL    https://github.com/SebastienForay/Wasabee-IITC-Plugins/raw/main/KurezeEffect/wb-kureze.user.js
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'fisher01';
plugin_info.dateTimeVersion = '2022-03-09-000000';
plugin_info.pluginId = 'wb-kureze';
//END PLUGIN AUTHORS NOTE

// the kureze function is the "worker" of this plugin, called when the toolbox link is clicked
function kureze() {
  // raw is a simple array of portals that match the requirements specified below
  const raw = [];

  for (const k of Object.keys(window.portals)) {
    const d = window.portals[k].options; // use d to save on typing below

    if (d.data.hasOwnProperty("ornaments") && d.data.ornaments.includes("ap2")) {
      // e is an object type defined by Wasabee, a "raw" portal
      var e = {
        id: d.guid,
        lat: (d.data.latE6 / 1e6).toFixed(6),
        lng: (d.data.lngE6 / 1e6).toFixed(6),
        name: d.data.title,
        comment: "",
        hardness: "",
      };
      // add e to our list of portals
      raw.push(e);
    }
  }

  // convert all the raw portals into full wasabee-portal objects, using a method available in the selected operation
  const portals = window.plugin.wasabee._selectedOp.convertPortalsToObjs(raw);

  // for each of the full wasabee-portals, add a "CapturePortalMarker"
  for (const p of portals) {
  // ignore portals that already have a "CapturePortalMarker" market set
    if (
      window.plugin.wasabee._selectedOp.markers.find(
        (marker) =>
          marker.portalId === p.id && marker.type === "CapturePortalMarker"
      )
    ) {
      continue;
    }
    // console.log(p);
    // this adds the portal to the operation, so we can mark it
    window.plugin.wasabee._selectedOp.addPortal(p);
    // add the marker to the portal
    window.plugin.wasabee._selectedOp.addMarker("CapturePortalMarker", p);
  }
}

// setup is called by IITC when the plugin loads
function setup() {
  // this adds the "Wasabee: Kureze Phase 2" link to the IITC toolbox using JQuery syntax
  // the .click(kureze) instructs IITC to call the kureze function (above) when the link is clicked
  $("<a>")
    .html("Wasabee: Kureze Effect")
    .attr("title", "Mark Portals with Kureze Effect ornaments")
    .click(kureze)
    .appendTo("#toolbox");
}

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

