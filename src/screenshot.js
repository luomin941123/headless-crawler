/*可以通过Puppeteer的提供的api直接控制Chrome
模拟大部分用户操作来进行UI Test或者作为爬虫访问页面来收集数据*/
const puppeteer=require('puppeteer');
const {screenshot}=require('./config/default.js');

(async ()=>{
	const browser=await puppeteer.launch();
	const page=await browser.newPage();
	await page.goto('https://www.baidu.com');
	await page.screenshot({
		path:`${screenshot}/${Date.now()}.png`
	});
	await browser.close();
})();