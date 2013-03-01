// ==UserScript==
// @id             iitc-plugin-find-level-eight-resonators@meadot01
// @name           iitc: find level eight resonators
// @version        0.0.1
// @namespace      https://github.com/meadot01/iitc-plugin-find-level-eight-resonators
// @updateURL      https://github.com/meadot01/iitc-plugin-find-level-eight-resonators/find-level-eight-resonators.user.js
// @downloadURL    https://github.com/meadot01/iitc-plugin-find-level-eight-resonators/find-level-eight-resonators.user.js
// @description    Flags all portals that have one or more level eight resonators attached
// @include        https://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.findLevelEightResonators = function() {};

window.plugin.findLevelEightResonators.setupCallback = function() {
  //$('#toolbox').append('<a onclick="window.plugin.findLevelEightResonators.toggleFind()">find level eight resonators</a> ');
  addHook('portalAdded', window.plugin.findLevelEightResonators.extractPortalData);
}

window.plugin.findLevelEightResonators.addScreenControls = function() {
  plugin.findLevelEightResonators.levelEights = new L.LayerGroup();
  window.layerChooser.addOverlay(plugin.findLevelEightResonators.levelEights, 'Level 8s');
  map.addLayer(plugin.findLevelEightResonators.levelEights);
}

window.plugin.findLevelEightResonators.countLevelEightResonators = function(portal) {
  var resonatorArray = portal.options.details.resonatorArray;
  console.log(resonatorArray);
  var numberLevelEightResonators = 0;
  $.each(resonatorArray.resonators, function(index, reso) {
    if(!reso) return true;
	if (reso.level >= 8) {
      numberLevelEightResonators ++;
	}
  });
  return numberLevelEightResonators;
}

window.plugin.findLevelEightResonators.extractPortalData = function(data) {
  var layer = plugin.findLevelEightResonators.levelEights;
  var coord = [data.portal.options.details.locationE6.latE6/1E6, data.portal.options.details.locationE6.lngE6/1E6];
  var count = window.plugin.findLevelEightResonators.countLevelEightResonators(data.portal);
  if (count > 0) {
    var resonatorCountText = count + ' Level 8 resonator';
	if (count > 1) resonatorCountText += 's';
    var m = L.marker(coord).bindPopup(resonatorCountText);
    m.addTo(layer);
  }
}

var setup =  function() {
  window.plugin.findLevelEightResonators.setupCallback();
  window.plugin.findLevelEightResonators.addScreenControls();
}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
