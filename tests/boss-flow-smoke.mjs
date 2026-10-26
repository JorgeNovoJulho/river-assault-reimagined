import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:900,height:900}});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try {
  await page.addInitScript(()=>{
    localStorage.setItem('river_boss_skills_v1',JSON.stringify(['EMP','ICE']));
  });
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.locator('#start-btn').waitFor({state:'visible',timeout:15000});
  await page.locator('#start-btn').click();
  await page.waitForFunction(()=>window.eval('gameState')==='PLAYING',null,{timeout:10000});
  await page.evaluate(()=>window.eval('spawnBoss(-40)'));
  await page.locator('#boss-skill-picker').waitFor({state:'visible',timeout:5000});
  if(await page.evaluate(()=>window.eval('gameState'))!=='BOSS_SELECT')throw Error('A simulação não pausou na escolha');
  // A seleção deve equipar a habilidade que o jogador escolheu.
  await page.locator('#boss-skill-options button').filter({hasText:'Pulso EMP'}).click();
  await page.locator('#boss-skill-confirm').click();
  await page.waitForFunction(()=>window.eval("gameState==='PLAYING' && enemies.some(e=>e.type==='BOSS')"),null,{timeout:10000});
  const snapshot=await page.evaluate(()=>window.eval("({state:gameState,bosses:enemies.filter(e=>e.type==='BOSS').length,skill:bossSkillEquipped,charges:bossSkillCharge})"));
  if(snapshot.bosses!==1||snapshot.skill!=='EMP'||snapshot.charges<=0)throw Error('Boss ou habilidade incorretos: '+JSON.stringify(snapshot));
  if(errors.length)throw Error('Erros JavaScript: '+errors.join('; '));
  console.log('PASS: RED ALERT / habilidade selecionada / chefe ativo',snapshot);
} catch(error) {
  await page.screenshot({path:'test-results/boss-flow-failure.png',fullPage:true}).catch(()=>{});
  console.error(error);
  console.error('Page exceptions:',errors);
  process.exitCode=1;
} finally {
  await browser.close();
}
