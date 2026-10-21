"""Serve AVIF where available, retaining the original image as a fallback."""
import re
from pathlib import Path
ASSETS=Path(__file__).resolve().parents[1]/'assets'

def responsive_media(markup):
    def picture(match):
        img=match.group()
        srcset=re.search(r'srcset="([^"]+)"',img)
        if not srcset or '-optimized.webp' not in srcset[1]:return img
        candidates=srcset[1].split(',')
        if not all((ASSETS/Path(c.strip().split()[0]).name).with_suffix('.avif').exists() for c in candidates):return img
        sizes=re.search(r'sizes="([^"]+)"',img)
        size_attr=' sizes="'+sizes[1]+'"' if sizes else ''
        return '<picture class="performance-picture" style="display:contents"><source type="image/avif" srcset="'+srcset[1].replace('.webp','.avif')+'"'+size_attr+'>'+img+'</picture>'
    markup=re.sub(r'<img\b[^>]*>',picture,markup)
    return re.sub(r'(hero-[\w-]+-loop)\.mp4(?:\?v=\d+)?',r'\1-efficient.mp4',markup)
