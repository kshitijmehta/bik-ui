const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const request = require('request-promise');
// const events = require('events');
require('events').EventEmitter.defaultMaxListeners = 30;


var modelOne = [];
var modelTwo = [];
var modelThree = [];
var modelFour = [];
var modelFive = [];
var prodId = [];
var stylecode = [];
var proceedImage = [];
// const emitter = new events.EventEmitter()

fs.createReadStream('C:/Users/kshti/Desktop/db/BelliesandWedges-Wedges_csv.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row);
    modelOne.push(row.model)
    modelTwo.push(row.model2)
    modelThree.push(row.model3)
    modelFour.push(row.model4)
    modelFive.push(row.model5)
    prodId.push(row.prod_id)
   stylecode.push(row.stylecode)
  })
  .on('end', async () => {
    console.log('-----------');
    console.log(stylecode)
    for(var index =0 ;index<prodId.length; index++) {
      if(index === 0 || prodId[index-1] != prodId[index])
      await insert(prodId[index],modelOne[index],
        modelTwo[index],modelThree[index],
        modelFour[index],modelFive[index], stylecode[index])
    }
    console.log('-----------')

  });
var insert = async(id, imageone, imagetwo,imagethree,imagefour,imagefive,fileName) => {
  console.log(id, imageone, imagetwo,imagethree,imagefour,imagefive,fileName)
  const browser = await puppeteer.launch({args: [
    '--incognito',
  ],});
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('https://basickart.com/login');
  console.log('login page')
  var functionToInject = function(){
    const input1 = document.getElementById('email');
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input1, 'admin@admin.com');
    
    var ev2 = new Event('change', { bubbles: true});
    input1.dispatchEvent(ev2);
}
    await page.evaluate(functionToInject);
  var functionToInject2 = function(){
    const input2 =document.getElementById('password');
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input2, 'ps');
    
    var ev2 = new Event('change', { bubbles: true});
    input2.dispatchEvent(ev2);
}
  await page.evaluate(functionToInject2);
  await page.$eval('#loginbtn', el => el.click());
    
  // await page.waitForSelector('.uk-container uk-height-1-1');
  await page.$x('//*[@id="root"]/main/section[1]/ul/li[1]/a/figure/img')
  await page.waitFor(5000);
  // await page.screenshot({path: id+'.png', fullPage: true})
  console.log('https://basickart.com/admin/product/'+id)
  await page.goto('https://basickart.com/admin/product/'+id);
  console.log('product page')
  // await page.screenshot({path: id+'1.png', fullPage: true})
  const selector = '#name';
  await page.waitForFunction(
    selector => document.querySelector(selector).value.length > 0,
    {},
    selector
);
console.log('attaching image')
  const elementHandle = await page.$("input[type=file]");
  if(!fs.existsSync('./images/'+id)){
    fs.mkdirSync('./images/'+id);
  }
  try{

    if(imageone){
      const fileData = await request({
        uri: imageone.replace('?dl=0','?raw=1'),
        encoding: null
    });
    fs.writeFileSync('./images/'+id+'/'+fileName+'-1'+'.jpg', fileData);
      await elementHandle.uploadFile('./images/'+id+'/'+fileName+'-1'+'.jpg');
    }
    if(imagetwo){
      const fileData = await request({
        uri: imagetwo.replace('?dl=0','?raw=1'),
        encoding: null
    });
    fs.writeFileSync('./images/'+id+'/'+fileName+'-2'+'.jpg', fileData);
      await elementHandle.uploadFile('./images/'+id+'/'+fileName+'-2'+'.jpg');
    }
    if(imagethree){
      const fileData = await request({
        uri: imagethree.replace('?dl=0','?raw=1'),
        encoding: null
    });
    fs.writeFileSync('./images/'+id+'/'+fileName+'-3'+'.jpg', fileData);
      await elementHandle.uploadFile('./images/'+id+'/'+fileName+'-3'+'.jpg');
    }
    if(imagefour){
      const fileData = await request({
        uri: imagefour.replace('?dl=0','?raw=1'),
        encoding: null
    });
    fs.writeFileSync('./images/'+id+'/'+fileName+'-4'+'.jpg', fileData);
      await elementHandle.uploadFile('./images/'+id+'/'+fileName+'-4'+'.jpg');
    }
    if(imagefive){
      const fileData = await request({
        uri: imagefive.replace('?dl=0','?raw=1'),
        encoding: null
    });
    fs.writeFileSync('./images/'+id+'/'+fileName+'-5'+'.jpg', fileData);
      await elementHandle.uploadFile('./images/'+id+'/'+fileName+'-5'+'.jpg');
    }
    
    const [button] = await page.$x('//*[@id="root"]/main/section/div/div/form/div/div[2]/button');
    if (button) {
        await button.click();
    };
    console.log('done')
    await page.waitFor(5000);
    // await page.screenshot({path: id+'.png', fullPage: true});
    await browser.close();
  }
  catch(e){
    console.log(e)
    console.log(id)
  }
}