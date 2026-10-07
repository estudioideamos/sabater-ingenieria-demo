"""Portable WordPress WXR draft export; no site writes or credentials."""
from pathlib import Path
from xml.etree import ElementTree as ET
from blog import POSTS,e
import json
from site_meta import BASE
R=Path(__file__).resolve().parents[1]
NS={'wp':'http://wordpress.org/export/1.2/','content':'http://purl.org/rss/1.0/modules/content/','dc':'http://purl.org/dc/elements/1.1/'}
for prefix,uri in NS.items(): ET.register_namespace(prefix,uri)
def node(parent,tag,value):
 if ':' in tag:
  prefix,name=tag.split(':',1);tag='{'+NS[prefix]+'}'+name
 el=ET.SubElement(parent,tag);el.text=str(value);return el
rss=ET.Element('rss',version='2.0');channel=ET.SubElement(rss,'channel')
for k,v in [('title','SABATER Ingeniería · Blog'),('link',BASE),('description','Entradas editoriales para migración'),('language','es-AR'),('wp:wxr_version','1.2'),('wp:base_site_url',BASE),('wp:base_blog_url',BASE)]:node(channel,k,v)
for i,p in enumerate(POSTS):
 attachment=ET.SubElement(channel,'item');asset=BASE+'assets/'+p['image']+'-1200.webp'
 for k,v in [('title',p['alt']),('link',asset),('guid',asset),('wp:post_id',100+i),('wp:post_type','attachment'),('wp:status','inherit'),('wp:attachment_url',asset),('wp:post_parent',200+i)]:node(attachment,k,v)
 meta=ET.SubElement(attachment,'{'+NS['wp']+'}postmeta');node(meta,'wp:meta_key','_wp_attachment_image_alt');node(meta,'wp:meta_value',p['alt'])
 item=ET.SubElement(channel,'item')
 def paragraph(text):return '<!-- wp:paragraph -->\n<p>'+text+'</p>\n<!-- /wp:paragraph -->\n'
 def heading(text,anchor):return '<!-- wp:heading '+json.dumps({'anchor':anchor})+' -->\n<h2 class="wp-block-heading" id="'+anchor+'">'+e(text)+'</h2>\n<!-- /wp:heading -->\n'
 content=paragraph(e(p['intro']))
 for section in p['sections']:
  content+=heading(section['title'],section['id'])
  content+=''.join(paragraph(e(t)) for t in section['paragraphs'])
  if 'source' in section:
   ref=p['sources'][section['source']];content+=paragraph('Referencia: <a href="'+ref['url']+'">'+e(ref['title'])+'</a>')
 content+=heading('Para recordar','para-recordar')+paragraph(e(p['takeaway']))
 content+=heading('Fuentes y lectura complementaria','fuentes')
 for ref in p['sources']:content+=paragraph('<a href="'+ref['url']+'">'+e(ref['title'])+'</a>')
 content+=paragraph('Contenido de divulgación. El diagnóstico y el diseño de una intervención requieren evaluar las condiciones de cada proyecto.')
 for k,v in [('title',p['title']),('link',BASE+'blog/'+p['slug']+'/'),('guid',BASE+'blog/'+p['slug']+'/'),('dc:creator','sabater'),('content:encoded',content),('wp:post_id',200+i),('wp:post_date',p['date']+' 09:00:00'),('wp:post_name',p['slug']),('wp:post_type','post'),('wp:status','draft'),('wp:comment_status','closed'),('wp:ping_status','closed')]:node(item,k,v)
 category=ET.SubElement(item,'category',domain='category',nicename=p['service']);category.text=p['category']
 meta=ET.SubElement(item,'{'+NS['wp']+'}postmeta');node(meta,'wp:meta_key','_thumbnail_id');node(meta,'wp:meta_value',100+i)
 # WordPress excerpt namespace.
 ET.register_namespace('excerpt','http://wordpress.org/export/1.2/excerpt/')
 ET.SubElement(item,'{http://wordpress.org/export/1.2/excerpt/}encoded').text=p['excerpt']
folder=R/'wordpress';folder.mkdir(exist_ok=True)
ET.indent(rss);ET.ElementTree(rss).write(folder/'blog-import.xml',encoding='utf-8',xml_declaration=True)
print('Exported two drafts and featured image attachments.')
