const svg = document.getElementById('radar');
const shape = document.getElementById('radar-shape');
const outline = document.getElementById('radar-outline');
const guidesGroup = document.getElementById('guides');
const labelsGroup = document.getElementById('labels');

const center = { x:150, y:150 };
const maxR = 110;
const steps = 5;
const anglesDeg = [];
for(let i=0;i<steps;i++) anglesDeg.push(-90 + i*360/steps);

const attrOrder = ['INT','PRE','FOR','AGI','VIG'];

function regularPolygonPoints(f){
  return anglesDeg.map(a => {
    const rad = a*Math.PI/180;
    return {
      x:center.x + Math.cos(rad)*maxR*f,
      y:center.y + Math.sin(rad)*maxR*f
    };
  });
}

function pointsToString(arr){
  return arr.map(p=>`${p.x},${p.y}`).join(" ");
}

function drawGuides(){
  guidesGroup.innerHTML = "";
  [0.25,0.5,0.75,1].forEach(f=>{
    const el = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    el.setAttribute("points", pointsToString(regularPolygonPoints(f)));
    el.setAttribute("stroke","#3a0000");
    el.setAttribute("fill","none");
    guidesGroup.appendChild(el);
  });
}

function placeLabels(){
  labelsGroup.innerHTML = "";
  anglesDeg.forEach((a,i)=>{
    const rad = a*Math.PI/180;
    const lx = center.x + Math.cos(rad)*(maxR+18);
    const ly = center.y + Math.sin(rad)*(maxR+18);

    const t = document.createElementNS("http://www.w3.org/2000/svg","text");
    t.setAttribute("x",lx);
    t.setAttribute("y",ly);
    t.setAttribute("text-anchor","middle");
    t.textContent = attrOrder[i];
    labelsGroup.appendChild(t);
  });
}

function valuePoint(v, ang){
  const rad = ang*Math.PI/180;
  return {
    x:center.x + Math.cos(rad)*(maxR*(v/10)),
    y:center.y + Math.sin(rad)*(maxR*(v/10))
  };
}

function updateRadar(){
  const vals = attrOrder.map(id => Number(document.getElementById(id).value));
  const pts = vals.map((v,i)=>valuePoint(v, anglesDeg[i]));
  shape.setAttribute("points", pointsToString(pts));
  outline.setAttribute("points", pointsToString(regularPolygonPoints(1)));
}

drawGuides();
placeLabels();
