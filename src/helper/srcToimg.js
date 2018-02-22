const http=require('http');
const https=require('https');
const fs=require('fs');
const path=require('path');
const {promisify}=require('util');
const writeFile=promisify(fs.writeFile);

module.exports=async(src,dir)=>{
	if(/\.(jpg|png|gif)$/.test(src)){
		await urlToimg(src,dir);
	}else{
		await base64Toimg(src,dir);
	}
};

//url=>image
const urlToimg=promisify((url,dir,callback)=>{
	const mod=/^https:/.test(url)?https:http;
	const ext=path.extname(url);
	const file=path.join(dir,`${Date.now()}${ext}`);

	mod.get(url,res=>{
		res.pipe(fs.createWriteStream(file))
		   .on('finish',()=>{
		   	 callback();
		   	 console.log(file);
		   })
	});
});

//base64=>image
const base64Toimg=async function(base64Str,dir){
	//data:image/jpeg;base64,/asdasda(从左到右依次是拓展名，编码方式，内容)
	const matches=base64Str.match(/^data:(.+?);base64,(.+)$/);
	try {
		const ext=matches[1].split('/')[1]
			.replace('jpeg','jpg');
		const file=path.join(dir,`${Date.now()}.${ext}`);

		await writeFile(file,matches[2],'base64');
		console.log(file);
	}catch(ex){
		console.log('非法base64字符串');
	}
}