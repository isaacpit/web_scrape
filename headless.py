import asyncio
from pyppeteer import launch
from pprint import pprint 
import json
import sys
sys.path.append("../")
from color_output import hprint
import urllib.request

async def main():
    browser = await launch()
    page = await browser.newPage()
    opts = { 
      # https://miyakogi.github.io/pyppeteer/reference.html#pyppeteer.page.Page.setViewport
      "viewport": {
        "width": 2880,
        "height": 1880,
        "deviceScaleFactor": 2.0,
        "isLandscape": True,
      }
    }

    await page.emulate(options=opts)

    await page.goto('https://www.moviemania.io/desktop/wallpapers/popular')
    await page.screenshot({'path': 'screenshot.png'})

    # doc = await page.evaluate('''() => {
    #   return { 
    #     html: document.documentElement.innerHTML 
    #   }
    # }''')
    # pprint(doc)

    dimensions = await page.evaluate('''() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        }
    }''')

    # wps = await page.querySelectorAll(".wallpaper");
    # pprint(wps)
    # for element in wps:
    #   title = await page.evaluate('''(element) => element.getAttribute('data-images-urls')''', element)
    #   pprint(title)
    values = await page.evaluate('''() => [...document.querySelectorAll('.wallpaper')]
                   .map(element => { return  {
                    name: element.textContent,
                    data: element.getAttribute('data-images-urls'),
                    href: element.getAttribute('href'),
                     }})
    ''')
    # pprint(values)
    data_images_urls = []
    for item in values: 
      arr_data = json.loads(item['data'])
      name = item['name']
      href = item['href']
      # pprint(arr_data)
      data_images_urls.append({
        "data": arr_data,
        "name": name,
        "href": href,
        })
      # for d in arr_data:
        
    #   js_val = json.loads(item)
    #   data_images_urls.append(js_val)
    hprint("Found {0} titles".format(len(data_images_urls)))
    pprint(data_images_urls)
    
    
    items_seen = {}
    for item in (data_images_urls):
      if item['name'] in items_seen: 
        items_seen[item['name']] += 1
      else: 
        items_seen[item['name']] = 1
      
      url = item['data'][0]['url']
      url = "https://" + url[2:]
      print("url: " + url)
      opener = urllib.request.build_opener()
      opener.addheaders = [('User-agent', 'Mozilla/5.0')]
      urllib.request.install_opener(opener) 
      urllib.request.urlretrieve(url, './images/' + item['name'] + "_" + str(items_seen[item['name']]) + ".jpg")  



    print(dimensions)
    # >>> {'width': 800, 'height': 600, 'deviceScaleFactor': 1}
    await browser.close()

asyncio.get_event_loop().run_until_complete(main())