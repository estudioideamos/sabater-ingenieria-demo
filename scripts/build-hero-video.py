from pathlib import Path
import subprocess,imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
base="scale=4096:1536,zoompan=z='1.015+0.025*(1-cos(2*PI*on/360))/2':x='(iw-iw/zoom)*(0.55+0.12*sin(2*PI*on/360))':y='(ih-ih/zoom)*0.45':d=360:s=1920x720:fps=30,eq=brightness='0.004*sin(2*PI*t/12)':eval=frame,format=yuv420p"
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i','assets/home-hd.webp','-vf',base,'-frames:v','360','-an','-c:v','libx264','-preset','slow','-crf','21','-movflags','+faststart','assets/hero-home.mp4'],check=True)
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i','assets/hero-home.mp4','-vf','scale=960:360','-an','-c:v','libx264','-preset','slow','-crf','23','-movflags','+faststart','assets/hero-home-mobile.mp4'],check=True)
for f in Path('assets').glob('hero-home*.mp4'):print(f.name,round(f.stat().st_size/1024/1024,2),'MB')
