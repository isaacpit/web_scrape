from requests_html import HTMLSession 
from pprint import pprint

# https://stackoverflow.com/questions/287871/how-to-print-colored-text-in-terminal-in-python
class bcolors:
  HEADER = '\033[95m'
  OKBLUE = '\033[94m'
  OKGREEN = '\033[92m'
  WARNING = '\033[93m'
  FAIL = '\033[91m'
  ENDC = '\033[0m'
  BOLD = '\033[1m'
  UNDERLINE = '\033[4m'

def hprint(item, pre=bcolors.HEADER, post=bcolors.ENDC):
  print(pre + item + post)

def test_color():
  print("test_coloring color output")
  hprint("HEADER", bcolors.HEADER)
  hprint("OKBLUE", bcolors.OKBLUE)
  hprint("OKGREEN", bcolors.OKGREEN)
  hprint("WARNING", bcolors.WARNING)
  hprint("FAIL", bcolors.FAIL)
  hprint("BOLD", bcolors.BOLD)
  hprint("UNDERLINE", bcolors.UNDERLINE)

def all_color():
  x = 0
  for i in range(24):
    colors = ""
    for j in range(5):
      code = str(x+j)
      colors = colors + "\33[" + code + "m\\33[" + code + "m\033[0m "
    print(colors)
    x=x+5

test_color()
all_color()

session = HTMLSession()

r = session.get('https://www.basketball-reference.com/boxscores/201810160BOS.html')

# all links
print(bcolors.BOLD + "all links" + bcolors.ENDC)
pprint(r.html.links)

# absolute links
print("absolute links")
pprint(r.html.absolute_links)

# selecting certain links
print("find by selector")
about = r.html.find('#about', first=True)
print(about)

print("about.text")
print(about.text)