const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html','utf8');
const menuFile = 'assets/ui/premium/menu/2b81e191-9306-4a6e-aabf-049f60939aa0.png';
const pilotIds = ['snabo_falcao','jhow_vespa','btata_cometa','napas_fenix','casper_aguia_vtol','roger_ufo_aurora','dudu_titan'];

test('approved opening image is available and CSS is not overridden by old procedural background', () => {
  assert.ok(fs.existsSync(menuFile),'premium opening art missing');
  const mode = html.match(/<div id="mode-selection" style="([^"]+)"/);
  assert.ok(mode,'mode screen missing');
  assert.match(mode[1],/background-image:[^;]*assets\/ui\/premium\/menu\//);
  assert.doesNotMatch(mode[1],/(?:^|;)\s*background\s*:/,'background shorthand overwrites artwork');
  assert.match(mode[1],/background-size:cover/);
});

test('seven approved pilot portraits are present and selection detail uses actual image',()=>{
  assert.match(html,/screen\.id='rs-premium-pilots'/);
  for(const id of pilotIds){
    const path='assets/ui/premium/pilots/'+id+'.png';
    assert.ok(fs.existsSync(path),'missing official pilot portrait: '+path);
    assert.ok(html.includes(id),'pilot identity not wired: '+id);
  }
  assert.match(html,/rs-pilot-detail-photo/);
  assert.match(html,/rs-pilot-detail-bars/);
  assert.match(html,/rs-pilot-confirming/);
  assert.match(html,/enterGameplay\(/);
});

test('premium opening, selection and all portrait art are copied into the Vite build',()=>{
  const config=fs.readFileSync('vite.config.js','utf8');
  assert.match(config,/assets\/ui\/premium\/pilots/);
  assert.match(config,/assets\/ui\/premium\/menu/);
  assert.match(html,/mode-single/);
  assert.match(html,/rs-premium-pilot-cards/);
});
