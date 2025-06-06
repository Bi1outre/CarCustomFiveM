$(document).ready(function() {


var modeToggle = document.getElementById('mode-toggle2');
var swatches = document.getElementsByClassName('default-swatches2')[0];
var colorIndicator = document.getElementById('color-indicator2');

var spectrumCanvas = document.getElementById('spectrum-canvas2');
var spectrumCtx = spectrumCanvas.getContext('2d');
var spectrumCursor = document.getElementById('spectrum-cursor2'); 
var spectrumRect = spectrumCanvas.getBoundingClientRect();

var hueCanvas = document.getElementById('hue-canvas2');
var hueCtx = hueCanvas.getContext('2d');
var hueCursor = document.getElementById('hue-cursor2'); 
var hueRect = hueCanvas.getBoundingClientRect();

var currentColor = '';
var hue = 0;
var saturation = 1;
var lightness = .5;

var rgbFields = document.getElementById('rgb-fields2');
var hexField = document.getElementById('hex-field2');

var colorRed2 = document.getElementById('red2');
var colorBlue2 = document.getElementById('blue2');
var colorGreen2 = document.getElementById('green2');
var hex = document.getElementById('hex2'); 

function ColorPicker(){
  this.addDefaultSwatches();
  createShadeSpectrum();
  createHueSpectrum();
};

function updateColorFromInputs() {
  var color = tinycolor('rgb ' + parseInt(colorRed2.value) + ' ' + parseInt(colorGreen2.value) + ' ' + parseInt(colorBlue2.value) );
  console.log(color._r)
  colorToPos(color);
  setColorValues(color);
}

ColorPicker.prototype.defaultSwatches = [
  '#FFFFFF', 
  '#FFFB0D', 
  '#0532FF', 
  '#FF9300', 
  '#31c741', 
  '#FF2700', 
  '#000000', 
  '#686868', 
  '#385037', 
  '#7D26CD', 
  '#34bdee', 
  '#E64AA9'
];

function createSwatch(target, color){
  var swatch = document.createElement('button2');
  swatch.classList.add('swatch2');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){
    var color = tinycolor(this.style.backgroundColor);     
    colorToPos(color);
    setColorValues(color);
  });
  target.appendChild(swatch);
  refreshElementRects();
};

ColorPicker.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch(swatches, this.defaultSwatches[i]);
  } 
}

function refreshElementRects(){
  spectrumRect = spectrumCanvas.getBoundingClientRect();
  hueRect = hueCanvas.getBoundingClientRect();
}

function createShadeSpectrum(color) {
  canvas = spectrumCanvas;
  ctx = spectrumCtx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(!color) color = '#f00';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  whiteGradient.addColorStop(0, "#fff");
  whiteGradient.addColorStop(1, "transparent");
  ctx.fillStyle = whiteGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  blackGradient.addColorStop(0, "transparent");
  blackGradient.addColorStop(1, "#000");
  ctx.fillStyle = blackGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousedown', function(e){
    startGetSpectrumColor(e);
  });
};

function createHueSpectrum() {
  var canvas = hueCanvas;
  var ctx = hueCtx;
  var hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  hueGradient.addColorStop(0.00, "hsl(0,100%,50%)");
  hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
  hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
  hueGradient.addColorStop(0.50, "hsl(180, 100%, 50%)");
  hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
  hueGradient.addColorStop(0.83, "hsl(61.2,100%,50%)");
  hueGradient.addColorStop(1.00, "hsl(360,100%,50%)");
  ctx.fillStyle = hueGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener('mousedown', function(e){
    startGetHueColor(e);
  });
};

function colorToHue(color){
  var color = tinycolor(color);
  var hueString = tinycolor('hsl '+ color.toHsl().h + ' 1 .5').toHslString();
  return hueString;
};

function colorToPos(color){
  var color = tinycolor(color);
  var hsl = color.toHsl();
  hue = hsl.h;
  var hsv = color.toHsv();
  var x = spectrumRect.width * hsv.s;
  var y = spectrumRect.height * (1 - hsv.v);
  var hueY = hueRect.height - ((hue / 360) * hueRect.height);
  updateSpectrumCursor(x,y);
  updateHueCursor(hueY);
  setCurrentColor(color);
  createShadeSpectrum(colorToHue(color));   
};

function setColorValues(color){  
  //convert to tinycolor object
  var color = tinycolor(color);
  var rgbValues = color.toRgb();
  var hexValue = color.toHex();
  //set inputs
  document.getElementById("red2").value = rgbValues.r
  document.getElementById("green2").value = rgbValues.g
  document.getElementById("blue2").value = rgbValues.b
  hex.value = hexValue;
  // pour Lua//
  red = rgbValues.r;
  green = rgbValues.g;
  blue = rgbValues.b;
  
  $.post('https://r_tuning/colorsmoke', JSON.stringify({
        red : red,
        green : green,
        blue : blue,
  }));
};

function setCurrentColor(color){
  color = tinycolor(color);
  currentColor = color;
  colorIndicator.style.backgroundColor = color;
  spectrumCursor.style.backgroundColor = color; 
  hueCursor.style.backgroundColor = 'hsl('+ color.toHsl().h +', 100%, 50%)';
};

function updateHueCursor(y){
  hueCursor.style.top = y + 'px';
}

function updateSpectrumCursor(x, y){
  //assign position
  spectrumCursor.style.left = x + 'px';
  spectrumCursor.style.top = y + 'px';  
};

var startGetSpectrumColor = function(e) {
  getSpectrumColor(e);
  spectrumCursor.classList.add('dragging');
  window.addEventListener('mousemove', getSpectrumColor);
  window.addEventListener('mouseup', endGetSpectrumColor);
};

function getSpectrumColor(e) {
  // got some help here - http://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
  e.preventDefault();
  //get x/y coordinates
  var x = e.pageX - spectrumRect.left;
  var y = e.pageY - spectrumRect.top;
  //constrain x max
  if(x > spectrumRect.width){ x = spectrumRect.width}
  if(x < 0){ x = 0}
  if(y > spectrumRect.height){ y = spectrumRect.height}
  if(y < 0){ y = .1}  
  //convert between hsv and hsl
  var xRatio = x / spectrumRect.width * 100;
  var yRatio = y / spectrumRect.height * 100; 
  var hsvValue = 1 - (yRatio / 100);
  var hsvSaturation = xRatio / 100;
  lightness = (hsvValue / 2) * (2 - hsvSaturation);
  saturation = (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));
  var color = tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness);
  setCurrentColor(color);  
  setColorValues(color);
  updateSpectrumCursor(x,y);

  rgbValues = color.toRgb();
  red = rgbValues.r;
  green = rgbValues.g;
  blue = rgbValues.b;

  $.post('https://r_tuning/colorsmoke', JSON.stringify({
        red : red,
        green : green,
        blue : blue,
    }));
};

function endGetSpectrumColor(e){
  spectrumCursor.classList.remove('dragging');
  window.removeEventListener('mousemove', getSpectrumColor);
};

function startGetHueColor(e) {
  getHueColor(e);
  hueCursor.classList.add('dragging');
  window.addEventListener('mousemove', getHueColor);
  window.addEventListener('mouseup', endGetHueColor);
};

function getHueColor(e){
  e.preventDefault();
  var y = e.pageY - hueRect.top;
  if (y > hueRect.height){ y = hueRect.height};
  if (y < 0){ y = 0};  
  var percent = y / hueRect.height;
  hue = 360 - (360 * percent);
  var hueColor = tinycolor('hsl '+ hue + ' 1 .5').toHslString();
  var color = tinycolor('hsl '+ hue + ' ' + saturation + ' ' + lightness).toHslString();
  createShadeSpectrum(hueColor);
  updateHueCursor(y, hueColor)
  setCurrentColor(color);
  setColorValues(color);
};

function endGetHueColor(e){
    hueCursor.classList.remove('dragging');
  window.removeEventListener('mousemove', getHueColor);
};

// Add event listeners

colorRed2.addEventListener('change',updateColorFromInputs);

colorGreen2.addEventListener('change', updateColorFromInputs);

colorBlue2.addEventListener('change', updateColorFromInputs);


modeToggle.addEventListener('click', function(){
  if(rgbFields.classList.contains('active') ? rgbFields.classList.remove('active') : rgbFields.classList.add('active'));
  if(hexField.classList.contains('active') ? hexField.classList.remove('active') : hexField.classList.add('active'));
});

window.addEventListener('resize', function(){
  refreshElementRects();
});
/* -------------------------------------------------------------------------------------------------- */

var swatches3 = document.getElementsByClassName('default-swatches3')[0];

function ColorPicker3(){
  this.addDefaultSwatches();
};

ColorPicker3.prototype.defaultSwatches = [
  "#0d1116",
  "#1c1d21",
  "#32383d",
  "#454b4f",
  "#999da0",
  "#c2c4c6",
  "#979a97",
  "#637380",
  "#63625c",
  "#3c3f47",
  "#444e54",
  "#1d2129",
  "#13181f",
	"#26282a",
  "#515554",
	"#151921",
  "#1e2429",
  "#333a3c",
	"#8c9095",
  "#39434d",
  "#506272",
	"#1e232f",
  "#363a3f",
  "#a0a199",
  "#d3d3d3",
  "#b7bfca",
  "#778794",
  "#c00e1a",
  "#da1918",
  "#b6111b",
  "#a51e23",
  "#7b1a22",
  "#8e1b1f",
  "#6f1818",
  "#49111d",
  "#b60f25",
  "#d44a17",
  "#c2944f",
  "#f78616",	
  "#cf1f21",
  "#732021",
  "#f27d20",
  "#ffc91f",
  "#9c1016",
  "#de0f18",
  "#8f1e17",
  "#a94744",
  "#b16c51",
  "#371c25",
  "#132428",
  "#122e2b",
  "#12383c",
  "#31423f",
  "#155c2d",
  "#1b6770",	
  "#66b81f",	
  "#22383e",
	"#1d5a3f",
  "#2d423f",
	"#45594b",
  "#65867f",
  "#222e46",
	"#233155",
  "#304c7e",
  "#47578f",
  "#637ba7",
  "#394762",
  "#d6e7f1",
  "#76afbe",
  "#345e72",
  "#0b9cf1",
  "#2f2d52",
  "#282c4d",
  "#2354a1",
  "#6ea3c6",
  "#112552",
  "#1b203e",
  "#275190",
  "#608592",
  "#2446a8",
  "#4271e1",
  "#3b39e0",
  "#1f2852",
  "#253aa7",
  "#1c3551",
  "#4c5f81",
  "#58688e",
  "#74b5d8",
  "#ffcf20",
  "#fbe212",
  "#916532",
  "#e0e13d",
  "#98d223",
  "#9b8c78",
  "#503218",
  "#473f2b",
  "#221b19",
  "#653f23",
  "#775c3e",
  "#ac9975",
  "#6c6b4b",
  "#402e2b",
  "#a4965f",
  "#46231a",
  "#752b19",
  "#bfae7b",
  "#dfd5b2",
  "#f7edd5",
  "#3a2a1b",
  "#785f33",
  "#b5a079",
  "#fffff6",	
  "#eaeaea",
  "#b0ab94",
  "#453831",
  "#2a282b",
  "#726c57",
  "#6a747c",
  "#354158",
  "#9ba0a8",
  "#5870a1",
  "#eae6de",
  "#dfddd0",
  "#f2ad2e",
  "#f9a458",
  "#83c566",
  "#f1cc40",
  "#4cc3da",
  "#4e6443",
  "#bcac8f",
  "#f8b658",
  "#fcf9f1",
  "#fffffb",
  "#81844c",
  "#ffffff",
  "#f21f99",
  "#fdd6cd",
  "#df5891",
  "#f6ae20",
  "#b0ee6e",
  "#08e9fa",
  "#0a0c17",
  "#0c0d18",
  "#0e0d14",
  "#9f9e8a",
  "#621276",
  "#0b1421",
  "#11141a",
  "#6b1f7b",
  "#1e1d22",
  "#bc1917",
  "#2d362a",
  "#696748",
  "#7a6c55",
  "#c3b492",
  "#5a6352",
  "#81827f",
  "#afd6e4",
  "#7a6440",
  "#7f6a48",
];

function createSwatch3(target, color, index){
  var swatch = document.createElement('button3');
  swatch.classList.add('swatch3');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){
    setColorValues3(index);
  });
  target.appendChild(swatch);
};

ColorPicker3.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch3(swatches3, this.defaultSwatches[i],i);
  } 
}

function setColorValues3(index){  
  $.post('https://r_tuning/interieur', JSON.stringify({
        red : index
  }));
};

/* -------------------------------------------------------------------------------------------------- */

var swatches4 = document.getElementsByClassName('default-swatches4')[0];

function ColorPicker4(){
  this.addDefaultSwatches();
};

ColorPicker4.prototype.defaultSwatches = [
  "#0d1116",
  "#1c1d21",
  "#32383d",
  "#454b4f",
  "#999da0",
  "#c2c4c6",
  "#979a97",
  "#637380",
  "#63625c",
  "#3c3f47",
  "#444e54",
  "#1d2129",
  "#13181f",
	"#26282a",
  "#515554",
	"#151921",
  "#1e2429",
  "#333a3c",
	"#8c9095",
  "#39434d",
  "#506272",
	"#1e232f",
  "#363a3f",
  "#a0a199",
  "#d3d3d3",
  "#b7bfca",
  "#778794",
  "#c00e1a",
  "#da1918",
  "#b6111b",
  "#a51e23",
  "#7b1a22",
  "#8e1b1f",
  "#6f1818",
  "#49111d",
  "#b60f25",
  "#d44a17",
  "#c2944f",
  "#f78616",	
  "#cf1f21",
  "#732021",
  "#f27d20",
  "#ffc91f",
  "#9c1016",
  "#de0f18",
  "#8f1e17",
  "#a94744",
  "#b16c51",
  "#371c25",
  "#132428",
  "#122e2b",
  "#12383c",
  "#31423f",
  "#155c2d",
  "#1b6770",	
  "#66b81f",	
  "#22383e",
	"#1d5a3f",
  "#2d423f",
	"#45594b",
  "#65867f",
  "#222e46",
	"#233155",
  "#304c7e",
  "#47578f",
  "#637ba7",
  "#394762",
  "#d6e7f1",
  "#76afbe",
  "#345e72",
  "#0b9cf1",
  "#2f2d52",
  "#282c4d",
  "#2354a1",
  "#6ea3c6",
  "#112552",
  "#1b203e",
  "#275190",
  "#608592",
  "#2446a8",
  "#4271e1",
  "#3b39e0",
  "#1f2852",
  "#253aa7",
  "#1c3551",
  "#4c5f81",
  "#58688e",
  "#74b5d8",
  "#ffcf20",
  "#fbe212",
  "#916532",
  "#e0e13d",
  "#98d223",
  "#9b8c78",
  "#503218",
  "#473f2b",
  "#221b19",
  "#653f23",
  "#775c3e",
  "#ac9975",
  "#6c6b4b",
  "#402e2b",
  "#a4965f",
  "#46231a",
  "#752b19",
  "#bfae7b",
  "#dfd5b2",
  "#f7edd5",
  "#3a2a1b",
  "#785f33",
  "#b5a079",
  "#fffff6",	
  "#eaeaea",
  "#b0ab94",
  "#453831",
  "#2a282b",
  "#726c57",
  "#6a747c",
  "#354158",
  "#9ba0a8",
  "#5870a1",
  "#eae6de",
  "#dfddd0",
  "#f2ad2e",
  "#f9a458",
  "#83c566",
  "#f1cc40",
  "#4cc3da",
  "#4e6443",
  "#bcac8f",
  "#f8b658",
  "#fcf9f1",
  "#fffffb",
  "#81844c",
  "#ffffff",
  "#f21f99",
  "#fdd6cd",
  "#df5891",
  "#f6ae20",
  "#b0ee6e",
  "#08e9fa",
  "#0a0c17",
  "#0c0d18",
  "#0e0d14",
  "#9f9e8a",
  "#621276",
  "#0b1421",
  "#11141a",
  "#6b1f7b",
  "#1e1d22",
  "#bc1917",
  "#2d362a",
  "#696748",
  "#7a6c55",
  "#c3b492",
  "#5a6352",
  "#81827f",
  "#afd6e4",
  "#7a6440",
  "#7f6a48",
];

function createSwatch4(target, color, index){
  var swatch = document.createElement('button4');
  swatch.classList.add('swatch4');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){    
    setColorValues4(index);
  });
  target.appendChild(swatch);
};

ColorPicker4.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch4(swatches4, this.defaultSwatches[i],i);
  } 
}

function setColorValues4(index){  
  $.post('https://r_tuning/tableaubord', JSON.stringify({
        red : index
  }));
};

/* ---------------------------------------------------------------------------------------------------- */

var swatches5 = document.getElementsByClassName('default-swatches5')[0];
function ColorPicker5(){
  this.addDefaultSwatches();
};

ColorPicker5.prototype.defaultSwatches = [
  "#dedeff",
  "#0217ff",
  "#0353ff",
  "#00ff8c",
  "#5eff01",
  "#ffff00",
  "#ff9600",
  "#ff3e00",
  "#ff0101",
  "#ff3265",
  "#ff05be",
  "#6c2ce3",
];

function createSwatch5(target, color, index){
  var swatch = document.createElement('button5');
  swatch.classList.add('swatch5');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){    
    setColorValues5(index);
  });
  target.appendChild(swatch);
};  

ColorPicker5.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch5(swatches5, this.defaultSwatches[i],i);
  } 
}

function setColorValues5(index){  
  console.log(index)
  $.post('https://r_tuning/NeonColor', JSON.stringify({
      indexcouleurneon : index
  }));
};

/* ------------------------------------------------------------------------------------------------- */

var swatches6 = document.getElementsByClassName('default-swatches6')[0];
function ColorPicker6(){
  this.addDefaultSwatches();
};

ColorPicker6.prototype.defaultSwatches6 = [
  "#dedeff",
  "#0217ff",
  "#0353ff",
  "#00ff8c",
  "#5eff01",
  "#ffff00",
  "#ff9600",
  "#ff3e00",
  "#ff0101",
  "#ff3265",
  "#ff05be",
  "#6c2ce3",
];

function createSwatch6(target, color, index){
  var swatch = document.createElement('button6');
  swatch.classList.add('swatch6');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){    
    setColorValues6(index);
  });
  target.appendChild(swatch);
};

ColorPicker6.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches6.length; ++i){
    createSwatch6(swatches6, this.defaultSwatches6[i],i);
  } 
}

function setColorValues6(index){  
  $.post('https://r_tuning/XenonColor', JSON.stringify({
      indexcouleurxenon : index
  }));
};

/* -------------------------------------------------------------- */ 

var swatches7 = document.getElementsByClassName('default-swatches7')[0];

function ColorPicker7(){
  this.addDefaultSwatches();
};

ColorPicker7.prototype.defaultSwatches = [
  "#0d1116",
  "#1c1d21",
  "#32383d",
  "#454b4f",
  "#999da0",
  "#c2c4c6",
  "#979a97",
  "#637380",
  "#63625c",
  "#3c3f47",
  "#444e54",
  "#1d2129",
  "#13181f",
	"#26282a",
  "#515554",
	"#151921",
  "#1e2429",
  "#333a3c",
	"#8c9095",
  "#39434d",
  "#506272",
	"#1e232f",
  "#363a3f",
  "#a0a199",
  "#d3d3d3",
  "#b7bfca",
  "#778794",
  "#c00e1a",
  "#da1918",
  "#b6111b",
  "#a51e23",
  "#7b1a22",
  "#8e1b1f",
  "#6f1818",
  "#49111d",
  "#b60f25",
  "#d44a17",
  "#c2944f",
  "#f78616",	
  "#cf1f21",
  "#732021",
  "#f27d20",
  "#ffc91f",
  "#9c1016",
  "#de0f18",
  "#8f1e17",
  "#a94744",
  "#b16c51",
  "#371c25",
  "#132428",
  "#122e2b",
  "#12383c",
  "#31423f",
  "#155c2d",
  "#1b6770",	
  "#66b81f",	
  "#22383e",
	"#1d5a3f",
  "#2d423f",
	"#45594b",
  "#65867f",
  "#222e46",
	"#233155",
  "#304c7e",
  "#47578f",
  "#637ba7",
  "#394762",
  "#d6e7f1",
  "#76afbe",
  "#345e72",
  "#0b9cf1",
  "#2f2d52",
  "#282c4d",
  "#2354a1",
  "#6ea3c6",
  "#112552",
  "#1b203e",
  "#275190",
  "#608592",
  "#2446a8",
  "#4271e1",
  "#3b39e0",
  "#1f2852",
  "#253aa7",
  "#1c3551",
  "#4c5f81",
  "#58688e",
  "#74b5d8",
  "#ffcf20",
  "#fbe212",
  "#916532",
  "#e0e13d",
  "#98d223",
  "#9b8c78",
  "#503218",
  "#473f2b",
  "#221b19",
  "#653f23",
  "#775c3e",
  "#ac9975",
  "#6c6b4b",
  "#402e2b",
  "#a4965f",
  "#46231a",
  "#752b19",
  "#bfae7b",
  "#dfd5b2",
  "#f7edd5",
  "#3a2a1b",
  "#785f33",
  "#b5a079",
  "#fffff6",	
  "#eaeaea",
  "#b0ab94",
  "#453831",
  "#2a282b",
  "#726c57",
  "#6a747c",
  "#354158",
  "#9ba0a8",
  "#5870a1",
  "#eae6de",
  "#dfddd0",
  "#f2ad2e",
  "#f9a458",
  "#83c566",
  "#f1cc40",
  "#4cc3da",
  "#4e6443",
  "#bcac8f",
  "#f8b658",
  "#fcf9f1",
  "#fffffb",
  "#81844c",
  "#ffffff",
  "#f21f99",
  "#fdd6cd",
  "#df5891",
  "#f6ae20",
  "#b0ee6e",
  "#08e9fa",
  "#0a0c17",
  "#0c0d18",
  "#0e0d14",
  "#9f9e8a",
  "#621276",
  "#0b1421",
  "#11141a",
  "#6b1f7b",
  "#1e1d22",
  "#bc1917",
  "#2d362a",
  "#696748",
  "#7a6c55",
  "#c3b492",
  "#5a6352",
  "#81827f",
  "#afd6e4",
  "#7a6440",
  "#7f6a48",
];

function createSwatch7(target, color, index){
  var swatch = document.createElement('button7');
  swatch.classList.add('swatch7');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){
    setColorValues7(index);
  });
  target.appendChild(swatch);
};

ColorPicker7.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch7(swatches7, this.defaultSwatches[i],i);
  } 
}

function setColorValues7(index){  
  $.post('https://r_tuning/colorwheel', JSON.stringify({
        red : index
  }));
};

/* -------------------------------------------------------------- */ 

var swatches8 = document.getElementsByClassName('default-swatches8')[0];

function ColorPicker8(){
  this.addDefaultSwatches();
};

ColorPicker8.prototype.defaultSwatches = [
  "#0d1116",
  "#1c1d21",
  "#32383d",
  "#454b4f",
  "#999da0",
  "#c2c4c6",
  "#979a97",
  "#637380",
  "#63625c",
  "#3c3f47",
  "#444e54",
  "#1d2129",
  "#13181f",
	"#26282a",
  "#515554",
	"#151921",
  "#1e2429",
  "#333a3c",
	"#8c9095",
  "#39434d",
  "#506272",
	"#1e232f",
  "#363a3f",
  "#a0a199",
  "#d3d3d3",
  "#b7bfca",
  "#778794",
  "#c00e1a",
  "#da1918",
  "#b6111b",
  "#a51e23",
  "#7b1a22",
  "#8e1b1f",
  "#6f1818",
  "#49111d",
  "#b60f25",
  "#d44a17",
  "#c2944f",
  "#f78616",	
  "#cf1f21",
  "#732021",
  "#f27d20",
  "#ffc91f",
  "#9c1016",
  "#de0f18",
  "#8f1e17",
  "#a94744",
  "#b16c51",
  "#371c25",
  "#132428",
  "#122e2b",
  "#12383c",
  "#31423f",
  "#155c2d",
  "#1b6770",	
  "#66b81f",	
  "#22383e",
	"#1d5a3f",
  "#2d423f",
	"#45594b",
  "#65867f",
  "#222e46",
	"#233155",
  "#304c7e",
  "#47578f",
  "#637ba7",
  "#394762",
  "#d6e7f1",
  "#76afbe",
  "#345e72",
  "#0b9cf1",
  "#2f2d52",
  "#282c4d",
  "#2354a1",
  "#6ea3c6",
  "#112552",
  "#1b203e",
  "#275190",
  "#608592",
  "#2446a8",
  "#4271e1",
  "#3b39e0",
  "#1f2852",
  "#253aa7",
  "#1c3551",
  "#4c5f81",
  "#58688e",
  "#74b5d8",
  "#ffcf20",
  "#fbe212",
  "#916532",
  "#e0e13d",
  "#98d223",
  "#9b8c78",
  "#503218",
  "#473f2b",
  "#221b19",
  "#653f23",
  "#775c3e",
  "#ac9975",
  "#6c6b4b",
  "#402e2b",
  "#a4965f",
  "#46231a",
  "#752b19",
  "#bfae7b",
  "#dfd5b2",
  "#f7edd5",
  "#3a2a1b",
  "#785f33",
  "#b5a079",
  "#fffff6",	
  "#eaeaea",
  "#b0ab94",
  "#453831",
  "#2a282b",
  "#726c57",
  "#6a747c",
  "#354158",
  "#9ba0a8",
  "#5870a1",
  "#eae6de",
  "#dfddd0",
  "#f2ad2e",
  "#f9a458",
  "#83c566",
  "#f1cc40",
  "#4cc3da",
  "#4e6443",
  "#bcac8f",
  "#f8b658",
  "#fcf9f1",
  "#fffffb",
  "#81844c",
  "#ffffff",
  "#f21f99",
  "#fdd6cd",
  "#df5891",
  "#f6ae20",
  "#b0ee6e",
  "#08e9fa",
  "#0a0c17",
  "#0c0d18",
  "#0e0d14",
  "#9f9e8a",
  "#621276",
  "#0b1421",
  "#11141a",
  "#6b1f7b",
  "#1e1d22",
  "#bc1917",
  "#2d362a",
  "#696748",
  "#7a6c55",
  "#c3b492",
  "#5a6352",
  "#81827f",
  "#afd6e4",
  "#7a6440",
  "#7f6a48",
];

function createSwatch8(target, color, index){
  var swatch = document.createElement('button8');
  swatch.classList.add('swatch8');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){
    setColorValues8(index);
  });
  target.appendChild(swatch);
};

ColorPicker8.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch8(swatches8, this.defaultSwatches[i],i);
  } 
}

function setColorValues8(index){  
  $.post('https://r_tuning/nacrage', JSON.stringify({
        red : index
  }));
};

/* -------------------------------------------------------------- */ 

var swatches9 = document.getElementsByClassName('default-swatches9')[0];

function ColorPicker9(){
  this.addDefaultSwatches();
};

ColorPicker9.prototype.defaultSwatches = [
"#FF0000",
"#7B0323", 
"#800080", 
"#0000FF", 
"#008000",
"#32CD32", 
"#B87333", 
"#8C7853", 
"#D4AF37", 
"#FFD700", 
"#96d100", 

"#5b7a0c", 
"#2c3b06", 
"#11524b", 
"#12785e", 
"#0c2b21", 
"#12331d", 
"#172e42",
"#0a211e", 
"#120a21",
"#172366", 
"#57018c",


"#FF00FF", 
"#ADFF2F",  
"#FFFF00", 
"#800020", 
"#00FFFF", 
"#2c133b",
"#FF8C00", 
"#FF4500", 
"#FF4500", 
"#544914", 
"#E6E6FA",

"#360c04", 
"#360c04", 
"#006400", 
"#008080",
"#00008B", 
"#4B0082", 
"#6B8E23", 
"#00FF00",
"#1E90FF", 
"#DA70D6", 
"#FF1493",


"#F5F5DC", 
"#FFC0CB",
"#FFFF00", 
"#00FF00", 
"#0000FF",
"#FFFDD0", 
"#FFFFFF", 
"#2F4F4F", 
"#00008B", 
"#4B0082", 
"#FF69B4", 
"#FF0000", 
"#008000", 
"#000000", 
"#6B8E23", 
"#9400D3", 
"#000000", 
"#FFFFFF", 
"#696969", 
"#fcb900", 
"#8A2BE2",
"#00FF00",

"#3a859e",
"#FF1493", 
"#FFA500", 
"#3a859e", 
"#FFFFFF", 
"#318c27",
"#9400D3", 
"##FF69B4", 
"#DA70D6", 
"#00CED1", 
"#FF0000", 

"#FF8C00",
"#ffee00", 
"#DA70D6", 
"#59b833", 
"#88a3b3"
];

function createSwatch9(target, color, index){
  var swatch = document.createElement('button9');
  swatch.classList.add('swatch9');
  swatch.setAttribute('title', color);
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', function(){
    setColorValues9(index);
  });
  target.appendChild(swatch);
};

ColorPicker9.prototype.addDefaultSwatches = function() {
  for(var i = 0; i < this.defaultSwatches.length; ++i){
    createSwatch9(swatches9, this.defaultSwatches[i],i+161);
  } 
}

function setColorValues9(index){
  console.log(index)
  $.post('https://r_tuning/peinture', JSON.stringify({
        red : index,
        peinture : document.getElementById("PeintureCat").value,
        typeP : "Cameleon"
  }));
};


new ColorPicker9();

new ColorPicker8();

new ColorPicker7();

new ColorPicker6();

new ColorPicker5();

new ColorPicker4();

new ColorPicker3();

new ColorPicker();
});

