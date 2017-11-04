var board = new Array();
var score = 0;
var hasConflicted = new Array();//查看元素是否已经变化过

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
	prepareForMobile();
	newgame();
});
//准备移动端的显示
function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机的两个格子里生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i = 0 ; i < 4 ; i++)
		for(var j = 0 ; j < 4 ; j++){

			var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
		}


	for(var i = 0 ; i < 4 ; i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0 ; j < 4 ; j++)
			board[i][j] = 0;
			hasConflicted[i][j] = false;
	}

	updateBoardView();

	score = 0;
}
//棋盘数据刷新
function updateBoardView(){
	$(".number-cell").remove();
	for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }
            hasConflicted[i][j] = false;//新的一轮开始，清空数据
        }
        $('.number-cell').css('line-height',cellSideLength+'px');
    	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
//随机生成数
function generateOneNumber(){
	if(nospace(board))
		return false;

	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));

	//优化随机数字生成的机制
	var times = 0;
	while( times < 50 ){
		if( board[randx][randy] == 0 )
			break;

		randx = parseInt(Math.floor(Math.random()*4));
		randy = parseInt(Math.floor(Math.random()*4));

		times++;
	}
	if( times == 50 ){
		for( var i = 0 ; i < 4 ; i++)
			for( var j = 0 ; j < 4 ; j++){
				if( board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}
	}

	//随机一个数
	var randNumber = Math.random()<0.5?2:4;

	//在随机的位置显示随机的数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
}
//检测用户按下按键
$(document).keydown( function ( event ){
	switch (event.keyCode){
		//左方向键
		case 37:
			if( moveLeft() ){
				event.preventDefault();//取消默认情况
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		break;
		//上方向键
		case 38:
			if( moveUp() ){
				event.preventDefault();
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		break;
		//右方向键
		case 39:
			if( moveRight() ){
				event.preventDefault();
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		break;
		//下方向键
		case 40:
			if( moveDown() ){
				event.preventDefault();
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		break;
		default:
		break;
	}
});

//增加触摸情况
document.addEventListener('touchstart',function( event ){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
//为了处理可能出现的bug
document.addEventListener('touchmove',function( event ){
	event.preventDefault();
});

document.addEventListener('touchend',function( event ){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if( Math.abs( deltax ) < 0.3*documentWidth && Math.abs( deltay ) < 0.3*documentWidth)
		return;
	//滑动方向是x轴
	if( Math.abs( deltax ) >= Math.abs( deltay )){
		if(deltax > 0){//向右方向移动
			if( moveRight() ){
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		}else{//左
			if( moveLeft() ){
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		}
	}else{//y轴
		if(deltay > 0){//向下方向移动
			if( moveDown() ){
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		}else{//上
			if( moveUp() ){
				setTimeout("generateOneNumber()",210);//新增数字 延迟发生
				setTimeout("isgameover()",300);//是否游戏结束
			}
		}
	}
});


//判断游戏是否已经结束
function isgameover(){
	if( nospace ( board ) && nomove( board )){
		gameover();
	}
}

//游戏结束
function gameover(){
	alert('Game Over!');
}

//向左移动
function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    //开始移动 1.在落脚处是否有空位2.在落脚点的数字是否和该数字相等3.移动路径上是否有障碍
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //分数增加
                        score += board[i][k];
                        updateScore( score );//更新分数
                        hasConflicted[i][k] = true;//该元素已经发生过移动
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}
//向右移动
function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k]){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k);
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        //分数增加
                        score += board[i][k];
                        updateScore( score );//更新分数
                        hasConflicted[i][k] = true;//该元素已经发生过移动
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}
//向上移动
function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) && !hasConflicted[i][k]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        //分数增加
                        score += board[i][k];
                        updateScore( score );//更新分数
                        hasConflicted[i][k] = true;//该元素已经发生过移动
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}
//向下移动
function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[i][k]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        //分数增加
                        score += board[i][k];
                        updateScore( score );//更新分数
                        hasConflicted[i][k] = true;//该元素已经发生过移动
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}