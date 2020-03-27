//1.动态生成100个小格 ----> 100个div
//2.leftClick   没有雷  ----> 显示数字(代表以当前小格为中心，周围8个格的雷数)
//              点击会扩散  ---->  说明当前点击小格周围八个格都没有雷，当扩散边界格周围有雷时，会停止扩散
//              有雷 --->游戏结束
//3.rightClick  没有标记并没有数字则进行标记，有标记则取消标记  
//              并且需要判断标记是否正确，若正确，则雷数减1,10个正确标记，提示成功
//              草坪被掀开，出现了数字，右击无效                            


let startBtn = document.getElementById('btn');
let box = document.getElementById('box');
let flagBox = document.getElementById('flagBox');
let alertBox = document.getElementById('alertBox');
let alertImg = document.getElementById('alertImg');
let closeBtn = document.getElementById('close');
let score = document.getElementById('score');
let minesNums;   //存放雷的数量
let mineOver;   //剩余的雷数
let blcok;
let mineMap = [];
let startGameBool = true;

bindEvent();
function bindEvent(){
	startBtn.onclick = function(){
		if(startGameBool){
			box.style.display = 'block';
			flagBox.style.display = 'block';
			//初始化草坪以及雷的界面
			init();
			startGameBool = false;
		}
		
		//startBtn.style.display = 'none';
	}
	//取消当鼠标在扫雷界面时的浏览器默认的右键点击事件
	box.oncontextmenu = function(){
		return false;
	}
	box.onmousedown = function(e){
		let event = e.target;
		if(e.which == 1){   //表示点击的是左键
			leftClick(event);   //左键单击事件
		}else if(e.which == 3){  //表示右键被点击
			rigthClick(event);  //右键单击事件
		}
	}
	closeBtn.onclick = function(){
		alertBox.style.display = 'none';
		flagBox.style.display = 'none';
		box.style.display = 'none';
		//startBtn.style.display = 'block';
		startGameBool = true;
		box.innerHTML = '';   //清空box中的内容
	}
}
//生成100个小格，并随机从100个小格中抽取10个作为放雷的小格
function init(){
	minesNums = 10;
	mineOver = 10;
	score.innerHTML = mineOver;
	//生成100个小格
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10;j++){
			let con = document.createElement('div');
			con.classList.add('block');
			con.setAttribute('id', i + '-' +j);
			box.appendChild(con);
			mineMap.push({mine:0}); //用于添加雷时的标记
		}
	}
	//取出100个小格作为一个数组
	block = document.getElementsByClassName('block');
	while(minesNums){
		//雷的位置
		let mineIndex = Math.floor(Math.random()*100);
		if(mineMap[mineIndex].mine === 0){
			mineMap[mineIndex].mine = 1;  //添加雷后改变标记表明该格有雷
			//给有雷的小格添加类属性
			block[mineIndex].classList.add('isLei');
			minesNums--;
		}
	}	
}

function leftClick(dom){
	//当该小格被插旗后，就不能再左键单击了
	if(dom.classList.contains('flag')){
		return;
	}
	//取出存放雷的小格
	let isLei = document.getElementsByClassName('isLei');
	//游戏失败的情况
	if(dom && dom.classList.contains('isLei')){
		console.log('gameOver');   //游戏结束
		//游戏结束并将所有雷的位置显示出来
		for(let i =0;i < isLei.length;i++){
			isLei[i].classList.add('show');
		}
		//弹出游戏结束的界面，有一个延迟的效果
		setTimeout(function(){
			alertBox.style.display = 'block';
			alertImg.style.backgroundImage = "url('./images/over.jpg')"; 
		},800)
	}else{   //游戏继续运行
		let n = 0;  //若点击小格不是雷，记录该小格周围的雷数
		let posArr = dom && dom.getAttribute('id').split('-');  //若dom存在，做容错处理
		let posX = posArr && +posArr[0];
		let posY = posArr && +posArr[1];
		dom && dom.classList.add('num');  //数字展示的样式
		//遍历找到点击dom周围所有的dom中有雷的个数
		for(let i = posX -1;i <= posX +1; i++){
			for(let j = posY -1; j <= posY +1; j++){
				let aroundBox = document.getElementById(i + '-' + j);
				if(aroundBox && aroundBox.classList.contains('isLei')){
					n++;
				}
			}
		}
		dom && (dom.innerHTML = n);
		//扩散的情况
		if(n == 0){
			for(let i = posX -1;i <= posX +1; i++){
				for(let j = posY -1; j <= posY +1; j++){
					let nearBox = document.getElementById(i + '-' + j);
					if(nearBox && nearBox.length != 0){
						if(!nearBox.classList.contains('check')){
							//若被点击过则添加check类
							nearBox.classList.add('check'); 
							leftClick(nearBox);
						}
					}
						
				}
			}
		}
	}
}

function rigthClick(dom){
	if(dom.classList.contains('num')){
		return;
	}
	dom.classList.toggle('flag');
	if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
		mineOver--;
	}
	if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
		mineOver++;
	}
	score.innerHTML = mineOver;
	if(mineOver == 0){
		setTimeout(function(){
			alertBox.style.display = 'block';
			alertImg.style.backgroundImage = 'url("./images/success.png")';
		},0);
	}
	
}