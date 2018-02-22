const puppeteer=require('puppeteer');
const {mn}=require('./config/default.js');
const srcToimg=require('./helper/srcToimg.js');

(async ()=>{
	//启动浏览器打开一个页面
	const browser=await puppeteer.launch();
	const page=await browser.newPage();
	await page.goto('https://image.baidu.com/');
	console.log('go to https://image.baidu.com/');

	//重置页面窗口大小
	await page.setViewport({
		width:1920,
		height:1080
	});
	console.log('reset viewport');

	/*模拟用户搜索：
	1、将焦点放在输入框内
	2、模拟键盘输入
	3、触发点击搜索
	*/
	await page.focus('#kw');
	await page.keyboard.sendCharacter('狗');
	await page.click('.s_search');
	console.log('go to search list');

	//等待图片加载完成，获取图片
	page.on('load',async ()=>{
		console.log('page loading done,start fetch...');

		const srcs=await page.evaluate(()=>{
			const images=document.querySelectorAll('img.main_img');
			return Array.prototype.map.call(images,img=>img.src);
		});
		console.log(`get ${srcs.length} images,start download`);

		srcs.forEach(async (src)=>{
			//sleep,下载之前停一段时间，防晒反爬虫
			await page.waitFor(200);
			await srcToimg(src,mn);
		});

		await browser.close();
		
	});
})();