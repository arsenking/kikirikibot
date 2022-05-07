const Canvas = require("canvas")
const Discord = require("discord.js")
const { DiscordAPIError } = require("discord.js")
//const puppeteer = require("puppeteer-extra");
//const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const extURLrule34 = require("./extURLrule34")

//moved in diff js file
/*puppeteer.use(StealthPlugin())

var urlimg = ''

async function scrapeOpenTable() {

  // Logic for rand post on rule34 , need update after last post number excide last number in bracket
  let x = Math.floor(Math.random() * 6000000)
  const a = "https://rule34.xxx/index.php?page=post&s=view&id="+x
  console.log(a)

  const BASE_URL = a.toString()

  //Opening browser instance
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()
  await page.goto(BASE_URL)

  //if our page is redirected on page in 'if' then try again 
  if (page.url() == "https://rule34.xxx/index.php?page=post&s=list&tags=all"){
    console.log("Post with id ",x," notfound!")
    await browser.close()
    await scrapeOpenTable()
  }else {
    //else first test is post a video , and if it is try again
    try {

     await page.waitFor(1000)
      await page.waitForSelector('#gelcomVideoPlayer')
     await browser.close()
     console.log("Its video")
     await scrapeOpenTable()

    }catch {

      //then try to click on resize to get best rez

      await page.waitFor(1000)
      try {
       await page.click('#resized_notice > a:nth-child(1)')
     } catch (error) {
       //if dont need resize
       console.log("The element didn't appear.")
     }
  
     //logic for extracting imgURL
      await page.waitForSelector('#image')

      urlimg = await page.$$eval('#image', anchors => [].map.call(anchors, img => img.src))
      console.log("lele")
    }
    //close browser
      await browser.close()
  }
}*/






var background
// usless now , usde in example
/*const dim = {
    height: 1080,
    width:1920,
    margin:50
}

const av = {
    size:512,
    x:704,
    y:294
}
*/

// start of generating or image post
const generateImage = async (member) => {
  // calling our function to extract imgURL
    var urlimg = await extURLrule34()

    background = urlimg.toString()

    //logic for getting user name and number
    let username = member.user.username
    let discrim = member.user.discriminator

    //old locaton for code
    //let avatarURL = member.user.displayAvatarURL({format:"png",dynamic: false,size: avr })
    
    //const canvas = Canvas.createCanvas(dim.width,dim.height)
    //const ctx = canvas.getContext("2d")
    //

    // draw in the backgraund
    console.log(background)
    const backImg = await Canvas.loadImage(background)

    // logic for calculating needed sizes,margine and size of avatar
    var avr = 0
    var marg = 0
    if (backImg.width<backImg.height){
      marg = Math.floor((backImg.width/100) * 5)
      avr = Math.floor((backImg.width - (2 * marg) - (0.3 * marg))/2)

    }else{
      marg = Math.floor((backImg.height/100) * 5)
      avr = Math.floor((backImg.height - (2 * marg )- (0.3 * marg))/2)
    }

    console.log(avr,marg)

    //logic for calculating x and y coordinates of avatar, avatar needs to be in center
    const avx = backImg.width/2 -avr/2
    const avy = backImg.height/2 -avr/2
    console.log(avx,avy)

    //new location for code in example xD
    let avatarURL = member.user.displayAvatarURL({format:"png",dynamic: false,size: 512 })

    const canvas = Canvas.createCanvas(backImg.width,backImg.height)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(backImg, 0, 0)
    
    //draw black tinted box
    ctx.fillStyle = "rgba(0,0,0,0.8)"
    ctx.fillRect(marg, marg, backImg.width - 2* marg,backImg.height - 2 * marg)

    //loading avatar and drawing it
    const avimg = await Canvas.loadImage(avatarURL)
    ctx.save()

    ctx.beginPath()
    ctx.arc(avx + avr/2 , avy + avr/2 , avr/2, 0, Math.PI*2, true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avimg,avx,avy,avr,avr)
    ctx.restore()

    // write in text
    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    // draw in wellcum
    var wc

      //logic for calculating size of Wellcum message
    if(backImg.height>backImg.width){
      wc = Math.floor(backImg.height/8)
    }else{
      wc = Math.floor(backImg.height/6)
    }
    var fontic = wc.toString()+"px Roboto"

    ctx.font = fontic
    ctx.fillText("WellCum" , backImg.width/2, marg + wc)

    //draw in the username

      //logic for calculating size of username and nuber combo

    fontic = (wc/2).toString()+"px Roboto"

    wc = wc - wc/3

    ctx.font = fontic
    ctx.fillText(username + discrim,backImg.width/2,backImg.height - marg - wc)

    //draw in server

      //logic for calculating size of to the server message

    fontic = (wc/2).toString()+"px Roboto"


    ctx.font = fontic
    ctx.fillText("to the server",backImg.width/2,backImg.height - marg - wc + wc/2)

    const attacment = new Discord.MessageAttachment(canvas.toBuffer(),"wellcum.png")
    return attacment

}

module.exports = generateImage