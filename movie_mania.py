from requests_html import HTMLSession 
from pprint import pprint
import sys
sys.path.append("../")
import urllib.request

# url = 'http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg'
# urllib.request.urlretrieve(url, './images/')

from color_output import hprint

session = HTMLSession()

r = session.get('https://www.moviemania.io/desktop/wallpapers/popular')

pprint(r)

# r.html.render()

pprint(r.html.links)

hprint("response")
wallpapers = r.html.find(".wallpaper")

# pprint(wallpapers)

hprint("wallpapers")
for wp in wallpapers: 
  pprint(wp)




