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

fs.createReadStream('C:/Users/kshti/Desktop/db/bra.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row);
    modelOne.push(row.modelone)
    modelTwo.push(row.modeltwo)
    modelThree.push(row.modelthree)
    modelFour.push(row.modelfour)
    modelFive.push(row.modelfive)
    prodId.push(row.prod_id)
    stylecode.push(row.stylecode)
  })
  .on('end', async () => {
    console.log('-----------');
    for(var index =0 ;index<prodId.length; index++) {
      await insert(prodId[index],modelOne[index],
        modelTwo[index],modelThree[index],
        modelFour[index],modelFive[index], stylecode[index])
    }
    // prodId.map(async (id, index) => {
    //   const count = proceedImage.filter((name) => {
    //     return name == prodName[index]
    //   }).length;
    //   console.log(id, prodName[index]+'_'+count+'.jpg')
    //   await test(id, prodName[index]+'_'+count+'.jpg')
    //   proceedImage.push(prodName[index])
    // })
    console.log('-----------')

  });
var insert = async(id, imageone, imagetwo,imagethree,imagefour,imagefive,fileName) => {
  console.log(id, [imageone, imagetwo,imagethree,imagefour,imagefive,fileName].length)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('http://localhost:3000/login');
  console.log('hererere')
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
    
  await page.waitForSelector('#firstName');
  console.log('there')
  await page.goto('http://localhost:3000/admin/product/'+id);
console.log('where')
  const selector = '#name';
  await page.waitForFunction(
    selector => document.querySelector(selector).value.length > 0,
    {},
    selector
);
  const elementHandle = await page.$("input[type=file]");
  if(!fs.existsSync(id)){
    fs.mkdirSync(id);
  }
  
  if(imageone){
    const fileData = await request({
      uri: imageone.replace('?dl=0','?raw=1'),
      encoding: null
  });
  fs.writeFileSync('./'+id+'/'+fileName+'-1'+'.jpg', fileData);
    await elementHandle.uploadFile('./'+id+'/'+fileName+'-1'+'.jpg');
  }
  if(imagetwo){
    const fileData = await request({
      uri: imagetwo.replace('?dl=0','?raw=1'),
      encoding: null
  });
  fs.writeFileSync('./'+id+'/'+fileName+'-2'+'.jpg', fileData);
    await elementHandle.uploadFile('./'+id+'/'+fileName+'-2'+'.jpg');
  }
  if(imagethree){
    const fileData = await request({
      uri: imagethree.replace('?dl=0','?raw=1'),
      encoding: null
  });
  fs.writeFileSync('./'+id+'/'+fileName+'-3'+'.jpg', fileData);
    await elementHandle.uploadFile('./'+id+'/'+fileName+'-3'+'.jpg');
  }
  if(imagefour){
    const fileData = await request({
      uri: imagefour.replace('?dl=0','?raw=1'),
      encoding: null
  });
  fs.writeFileSync('./'+id+'/'+fileName+'-4'+'.jpg', fileData);
    await elementHandle.uploadFile('./'+id+'/'+fileName+'-4'+'.jpg');
  }
  if(imagefive){
    const fileData = await request({
      uri: imagefive.replace('?dl=0','?raw=1'),
      encoding: null
  });
  fs.writeFileSync('./'+id+'/'+fileName+'-5'+'.jpg', fileData);
    await elementHandle.uploadFile('./'+id+'/'+fileName+'-5'+'.jpg');
  }
  // if(imagetwo){
  //   await elementHandle.uploadFile(imagetwo.replace('?dl=0','?raw=1'));
  // }
  // if(imagethree){
  //   await elementHandle.uploadFile(imagethree.replace('?dl=0','?raw=1'));
  // }
  // if(imagefour){
  //   await elementHandle.uploadFile(imagefour.replace('?dl=0','?raw=1'));
  // }
  // if(imagefive){
  //   await elementHandle.uploadFile(imagefive.replace('?dl=0','?raw=1'));
  // }
  const [button] = await page.$x('//*[@id="root"]/main/section/div/div/form/div/div[2]/button/span');
  if (button) {
      await button.click();
  };
  await page.waitFor(5000);
  await page.screenshot({path: id+'.png'});
  await browser.close();
}