const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin())

var urlimg

const extURLrule34 = async function extURLrule34() {

  // Logic for rand post on rule34 , need update after last post number excide last number in bracket
  let x = Math.floor(Math.random() * 6000000)
  const a = "https://rule34.xxx/index.php?page=post&s=view&id="+x
  console.log(a)

  const BASE_URL = a.toString()

  //Opening browser instance
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()
  await page.goto(BASE_URL)

  page.setDefaultTimeout(1000)

  //if our page is redirected on page in 'if' then try again 
  if (page.url() == "https://rule34.xxx/index.php?page=post&s=list&tags=all"){
    console.log("Post with id ",x," notfound!")
    await browser.close()
    urlimg = await extURLrule34()
  }else {
    //else first test is post a video , and if it is try again
    try {

     //await page.waitFor(1000)
      await page.waitForSelector('#gelcomVideoPlayer')
      await browser.close()
      console.log("Its video")
      urlimg = await extURLrule34()

    }catch {

      //then try to click on resize to get best rez
      try {
       await page.click('#resized_notice > a:nth-child(1)')
     } catch (error) {
       //if dont need resize
       console.log("The element didn't appear.")
     }
  
     //logic for extracting imgURL
      await page.waitForSelector('#image')

      urlimg = await page.$$eval('#image', anchors => [].map.call(anchors, img => img.src))
      //console.log("lele")
    }
    //close browser
      await browser.close()
  }
  await browser.close()
  return urlimg
}

module.exports = extURLrule34