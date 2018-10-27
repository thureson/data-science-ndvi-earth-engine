var fromFT = ee.FeatureCollection("ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw"),
    modisNDVI = ee.ImageCollection("MODIS/MCD43A4_006_NDVI");
    
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');

// Load a FeatureCollection from a Fusion Table.
var finland = fromFT.filterMetadata('Country', 'equals', 'Finland');

var treeCover = gfc2014.select(['treecover2000']).clip(finland);
var lossImage = gfc2014.select(['loss']).clip(finland);
var gainImage = gfc2014.select(['gain']).clip(finland);
var lossYear = gfc2014.select(['lossyear']).clip(finland);

var forestAreaImage = treeCover.multiply(ee.Image.pixelArea());
var lossAreaImage = lossImage.multiply(ee.Image.pixelArea());
var gainAreaImage = gainImage.multiply(ee.Image.pixelArea());

// --- Pixels count
var forestAreaPixels = forestAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e9
});

var lossAreaPixels = lossImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e9
});

var gainAreaPixels = gainImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e9
});

print('pixels representing gain in Finland: ', gainAreaPixels.get('gain'), "pixels");
print('pixels representing loss in Finland: ', lossAreaPixels.get('loss'), "pixels");

// --- Square meter count    
var forestAreaSqMeter = forestAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e9
});

var lossAreaSqMeter = lossAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e9
});

var gainAreaSqMeter = gainAreaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e9
});

print('Forest Area (square meter) in Finland: ', forestAreaSqMeter.get('treecover2000'), "m²");
print('Forest Gain (square meter) in Finland: ', gainAreaSqMeter.get('gain'), "m²");
print('Forest Loss (square meter) in Finland: ', lossAreaSqMeter.get('loss'), "m²");

// Add the tree cover layer in green.
Map.addLayer(treeCover.updateMask(treeCover),
    {palette: ['000000', '00FF00'], max: 100}, 'Forest Cover');

// Add the loss layer in red.
Map.addLayer(lossImage.updateMask(lossImage),
            {palette: ['FF0000']}, 'Loss');

// Add the gain layer in red.
Map.addLayer(gainImage.updateMask(gainImage),
            {palette: ['FF0000']}, 'Gain');

var i;
var lossSpecificYear;
for (i = 1; i < 15; i++) {
   lossSpecificYear = lossYear.gte(1).and(lossYear.lte(i));
  Map.addLayer(lossSpecificYear.updateMask(lossSpecificYear),
            {palette: ['0000FF']}, 'Loss 200' + i);
} 

