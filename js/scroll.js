const puppeteer = require('puppeteer');

// (async () => { // old
async function getMoviesIds(reqInfo) {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto(reqInfo.link);
  await page.setViewport({
      width: 2880,
      height: 1800
  });
  
  const arr_hrefs = await page.$$eval(reqInfo.sel, as => as.map(a => a.href)); // WORKING
  
  console.log("all " + arr_hrefs.length +  " sel = (" + reqInfo.sel + ") links");
  
  console.log(arr_hrefs);
  
  var search_term = reqInfo.term1;
  var search_end = reqInfo.term2;

  var arr_cleaned_hrefs = cleanLinks(arr_hrefs, search_term, search_end);

  console.log("cleaned " + arr_cleaned_hrefs.length + " movies");
  for (var i = 0; i < arr_cleaned_hrefs.length; ++i) {
    console.log("\t" + arr_cleaned_hrefs[i]);
  }  

    await browser.close();
    return arr_cleaned_hrefs;
};


function cleanLinks(hrefs, search_term, search_end) {
  var arr_clean_links = [];
  for (var i = 0; i < hrefs.length; ++i) {
    var slice_idx_beg = hrefs[i].indexOf(search_term);
    if (slice_idx_beg >= 0) {
      slice_idx_beg = slice_idx_beg + search_term.length + 1;
    }
    // console.log("i " + i + ": " + hrefs[i]);
    var slice_idx_end = hrefs[i].indexOf(search_end, slice_idx_beg);
    // console.log("beg: " + slice_idx_beg);
    // console.log("end: " + slice_idx_end);
    if (slice_idx_end >= 0 && slice_idx_beg >= 0) {
      hrefs[i] = hrefs[i].slice(slice_idx_beg, slice_idx_end);
      // console.log("*** cleaned: " + hrefs[i]);
      arr_clean_links.push(hrefs[i]);
    }
    // console.log(hrefs[i]); 
  }
  return arr_clean_links;
}



class ReqInfo {
  constructor(link, sel, search_term_1, search_term_2) {
    this.link = link;
    this.sel = sel;
    this.term1 = search_term_1;
    this.term2 = search_term_2;
  }
}



async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 400;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

LINK = "https://www.moviemania.io/desktop/wallpapers/popular";
TERM1 = "/wallpaper";
TERM2 = "-";
SEL = "a";

var reqInfo = new ReqInfo(
  LINK, 
  SEL,
  TERM1, 
  TERM2
);



movies = getMoviesIds(reqInfo)
  .then(function(lst_ids) {
    console.log("after: ");
    console.log(lst_ids);

  });

console.log("got:" );
console.log(movies);