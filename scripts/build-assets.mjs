import {build,transform} from 'esbuild';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
const banner='/*! Three.js 0.186.1 | MIT | see THREE-LICENSE.txt */';
await build({entryPoints:['node_modules/three/build/three.module.js'],bundle:true,minify:true,format:'esm',outfile:'assets/vendor/three.module.min.js',banner:{js:banner}});
await copyFile('node_modules/three/LICENSE','assets/vendor/THREE-LICENSE.txt');
let css=(await readFile('assets/fonts/fonts.css','utf8')).replaceAll("url('geist","url('fonts/geist");
for(const name of ['styles.css','premium.css','assets/vibration-lab.css','assets/experience.css','assets/editorial.css'])css+='\n'+(await readFile(name,'utf8')).replaceAll("url('assets/","url('");
await writeFile('assets/site.min.css',(await transform(css,{loader:'css',minify:true,target:['chrome110','safari16','firefox115'],legalComments:'none'})).code);
console.log('Built local CSS and pinned Three.js modules.');

await build({entryPoints:['scripts/lab-postprocessing.mjs'],bundle:true,minify:true,format:'esm',external:['three'],outfile:'assets/vendor/lab-postprocessing.js',banner:{js:banner}});
const post=await readFile('assets/vendor/lab-postprocessing.js','utf8');await writeFile('assets/vendor/lab-postprocessing.js',post.replaceAll('from"three"','from"./three.module.min.js?v=186"'));

// Keep authored JavaScript readable; publish minified equivalents.
for(const [source,output] of [['assets/experience.js','assets/experience.min.js'],['app.js','assets/app.min.js'],['premium.js','assets/premium.min.js'],['assets/microinteractions.js','assets/microinteractions.min.js'],['assets/smooth-wheel.js','assets/smooth-wheel.min.js']]){
 const code=await readFile(source,'utf8');
 await writeFile(output,(await transform(code,{loader:'js',minify:true,target:['chrome110','safari16','firefox115'],legalComments:'none'})).code);
}
