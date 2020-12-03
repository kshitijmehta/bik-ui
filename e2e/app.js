const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
// const events = require('events');
require('events').EventEmitter.defaultMaxListeners = 30;


var prodName = [];
var prodId = [];
var proceedImage = [];
// const emitter = new events.EventEmitter()

fs.createReadStream('C:/Users/kshti/Desktop/db/bind_image.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row.prod_id, row.prod_name);
    prodName.push(row.image)
    prodId.push(row.prod_id)
  })
  .on('end', async () => {
    console.log('-----------');
    for(var index =0 ;index<prodName.length; index++) {
      // const count = proceedImage.filter((name) => {
      //   return name == prodName[index]
      // }).length;
      // console.log(prodId[index], prodName[index]+'.jpg')
      await insert(prodId[index], prodName[index]+'.jpg')
      proceedImage.push(prodName[index])
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
var insert = async(id, imageName) => {
  console.log(id,imageName)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('https://basickart.com/login');
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
  await page.goto('https://basickart.com/admin/product/'+id);
console.log('where')
  const selector = '#name';
  await page.waitForFunction(
    selector => document.querySelector(selector).value.length > 0,
    {},
    selector
);
  const elementHandle = await page.$("input[type=file]");
  await elementHandle.uploadFile('C:/Users/kshti/Desktop/db/bindi/bindi/'+imageName);
  const [button] = await page.$x('//*[@id="root"]/main/section/div/div/form/div/div[2]/button');
  if (button) {
      await button.click();
  };
  await page.waitFor(5000);
  await page.screenshot({path: id+'.png'});
  await browser.close();
}

var test = async(id,name) => {
  let promise = new Promise((res, rej) => {
    setTimeout(() => res("Now it's done!"), 1000)
    });
  let result = await promise;
  console.log(result)
  return result
};