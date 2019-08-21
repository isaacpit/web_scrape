const puppeteer = require('puppeteer');

async function getMoviesIds(reqData) {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto(reqData.link);
  await page.setViewport({
      width: reqData.width,
      height: reqData.height
  });
  
  const arr_hrefs = await page.$$eval(reqData.sel, as => as.map(a => a.href)); // WORKING
  
  console.log("all " + arr_hrefs.length +  " sel = (" + reqData.sel + ") links");
  
  console.log(arr_hrefs);
  
  var search_term = reqData.term1;
  var search_end = reqData.term2;

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

async function downloadMovies(movieData) {
  console.log("working on " + movieData.lst_movie_ids.length + " download links: " );
  for (var i = 0; i < movieData.lst_movie_ids.length; ++i) {
    var download_link = movieData.download_link + movieData.lst_movie_ids[i] + "/" + movieData.width + "x" + movieData.height;
     console.log(download_link);
  }
}

class ReqData {
  constructor(link, sel, search_term_1, search_term_2, width, height) {
    this.link = link;
    this.sel = sel;
    this.term1 = search_term_1;
    this.term2 = search_term_2;
    this.width = width;
    this.height = height;

  }
}

class MovieData {
  constructor(lst_movie_ids, download_link, width, height) {
    this.lst_movie_ids = lst_movie_ids;
    this.download_link = download_link;
    this.width = width;
    this.height = height;
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

const STARTING_LINK = "https://www.moviemania.io/desktop/wallpapers/popular";
const DOWNLOAD_LINK = "https://www.moviemania.io/download/";

const TERM1 = "/wallpaper";
const TERM2 = "-";
const SEL = "a";
const WIDTH = 2880;
const HEIGHT = 1800;

var reqData = new ReqData(
  STARTING_LINK, 
  SEL,
  TERM1, 
  TERM2,
  WIDTH,
  HEIGHT
);

movies = getMoviesIds(reqData)
  .then(function(lst_movie_ids) {
    console.log("after: ");
    console.log(lst_movie_ids);
    
    var movieData = new MovieData(lst_movie_ids, DOWNLOAD_LINK, WIDTH, HEIGHT);
    downloadMovies(movieData);
    
  });

console.log("got:" );
console.log(movies);