const Canvas = require("canvas")
const Discord = require("discord.js")
const { DiscordAPIError } = require("discord.js")

const background = "https://images3.alphacoders.com/249/2499.jpg"

const dim = {
    height: 1080,
    width:1920,
    margin:50
}

const av = {
    size:512,
    x:704,
    y:294
}

const generateImage = async (member) => {
    let username = member.user.username
    let discrim = member.user.discriminator
    let avatarURL = member.user.displayAvatarURL({format:"png",dynamic: false,size: av.size })

    const canvas = Canvas.createCanvas(dim.width,dim.height)
    const ctx = canvas.getContext("2d")

    // draw in the backgraund
    const backImg = await Canvas.loadImage(background)
    ctx.drawImage(backImg, 0, 0)

    //draw black tinted box
    ctx.fillStyle = "rgba(0,0,0,0.8)"
    ctx.fillRect(dim.margin, dim.margin, dim.width - 2* dim.margin,dim.height - 2 * dim.margin)

    const avimg = await Canvas.loadImage(avatarURL)
    ctx.save()

    ctx.beginPath()
    ctx.arc(av.x + av.size/2,av.y + av.size /2,av.size/2,0, Math.PI*2,true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avimg,av.x,av.y)
    ctx.restore()

    // write in text
    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    // draw in wellcum

    ctx.font = "180px Roboto"
    ctx.fillText("WellCum" , dim.width/2, dim.margin + 180)

    //draw in the username

    ctx.font = "80px Roboto"
    ctx.fillText(username + discrim,dim.width/2,dim.height - dim.margin - 125)

    //draw in server

    ctx.font = "60px Roboto"
    ctx.fillText("to the server",dim.width/2,dim.height - dim.margin - 50)

    const attacment = new Discord.MessageAttachment(canvas.toBuffer(),"wellcum.png")
    return attacment

}

module.exports = generateImage