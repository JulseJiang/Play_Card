$(function() {
	$cover = $('.cover');//蒙板
	$card_board = $('#card');//卡片面板
	card_mode = $card_board.html();//面板上的第一个卡片作为模型
	$rest_time=$('#rest_time');//剩余次数span
	$seconds = $('#seconds');//剩余时间
	$seconds_all = $('.seconds');
	current_mode = 20;//当前模式下的次数
	success_time=0;//成功次数
//	console.log('$card_mode:'+$card_mode);
	primary();
	$page_bgm= $('#page_bgm');//背景乐
	$delete_bgm=$('#delete_bgm');//清除时音效
	$img= $('.music_icon');//音乐播放器图标
	$img.click(function(){
		console.log('点击声音');
//		$img.toggle();
		$img.toggle();
		
	})
})
function stop_music(){
//	$page_bgm.get(0).currentTime=0;
	$page_bgm.get(0).pause();
	$delete_bgm.get(0).muted=true;
}
function play_music(){
	$page_bgm.get(0).play();
	$delete_bgm.get(0).muted=false;
}
function refresh(){ 
	$cover.show();
	$seconds.text((current_mode/3).toFixed(0));
	var i = $seconds.text();
	var sit = setInterval(function(){
		$front=$('.front');
		$front.hide();
		$back = $('.back');
		$back.removeClass('rotate');
			$seconds.text(--i);
			if(i==0){
				$front.show();
				$back.addClass('rotate');
				clearInterval(sit);
				$cover.hide();
				return;
			}
		},1000);
	$rest_time.text(current_mode);
	var rest_time = current_mode;
	$card_board.empty();
	var temper = [];//记录节点
	var record = []; //记录点击次数
	//生成牌--?生成的牌有重复的情况
//	$cards_create = createCards(3 * 4);
//	var $card = $('.card');
	displayCards(row, col); //发牌
	//	卡片点击事件--点击卡片旋转，牌面消失，牌底出现（牌面为表层牌，牌底为展示牌值的牌）
	$('.card').bind('click', function() {
		if(rest_time==0){
			alert('挑战失败');
			refresh();
			return;
		}
		if(--rest_time<10){
			$rest_time.text("0"+rest_time);
		}else{
			$rest_time.text(--rest_time);
		}
		temper.push($(this));
		console.log("点击face");
		var $taget0 = $(this).find('div:eq(0)').removeClass('rotate'); //正面
		var $taget1 = $(this).find('div:eq(1)').addClass('face_hidden rotate'); //背面
		var val = $(this).attr('data-value');
		record.push(val);
		if(record.length == 2) {
			if(!(temper[0].is(temper[1]))){
				//如果说要判断是否同一对象，当然是用 === 来判断，
				//但实际上两个不同的 jQuery 对象
				//可能是对同一个/组 DOM 对象的封装，
				//这个时候可以用 is 来判断
				juge(temper,record);
			}else{
				record.pop();
				temper.pop();
				return;//返回主函数
			}
			record = []; //清空记录
			temper = [];
		}
	});
}
//判断是否相等
function juge(tem,record){
//	var tem = temper;//由于1500ms的延时，防止temper使用前被清空
			if(record[0]== record[1]) { //两次记录相同   ：data-value
					console.log('完全相同');
					setTimeout(function() {
					$delete_bgm.get(0).play();
					$(tem[0]).remove();
					$(tem[1]).remove();
					if($card_board.html().length==0){
						$card_board.text('挑战成功！');
					}
				}, 1000);
				
			} else { //如果两次记录不同，还原
				setTimeout(function() {
					for (var i = 0; i < tem.length; i++) {
//						$(tem[i]).find('div:eq(0)').addClass('rotate');
//						$(tem[i]).find('div:eq(1)').removeClass('face_hidden rotate');
						$(tem[i]).find('div:eq(0)').addClass('rotate');
						$(tem[i]).find('div:eq(1)').removeClass('face_hidden rotate');
					}
					//					$temper.find('div:eq(0)')
//					$taget0.addClass('rotate');
//					$taget1.removeClass('face_hidden rotate');
					//					$taget1.addClass('rotate_back');
//										$taget1.animate({
//											'transform': 'rotateY(-180deg)',
//											'-webkit-transform': 'rotateY(-180deg)',
//										});
				}, 1000);
			}
}
function createCards(number) {
	//A 2 3 4 5 6 7 8 9 10 k q k ;type:a b c d
	var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	var types = ['A', 'B', 'C', 'D'];
	var json_values = [];
//	console.log("初始化json数组：" + json_values);
	//	var card_strs = [];
	for(var i = 0; i < number / 2; i++) {
		var value = parseInt(Math.random() * values.length);
		var type = parseInt(Math.random() * types.length);
		for(var j = 0; j < 2; j++) { //生成成对的json
//			console.log('插入前的json');
			json_values.push({ 
				"type": type,
				"value": value,
				"str": "card" + types[type] +"" + values[value]
			});
			console.log("打印json");
			console.log(json_values);
		}
		var result = values.splice(value - 1, 1); //删除已经使用过的数字
//		console.log('vlues'+values);
//		console.log("删除的元素" + result);
//		console.log( '删除之后的长度：' + values.length);
		//		card_strs.push("card"+types[type]+values[value]);
	}

	//	console.log(card_strs); 
	//	console.log(json_values[2].value+"" +json_values[2].type);
//	console.log("json_values_length:" + json_values.length);
	var result =json_values.sort(function(a,b){
			return Math.random()>0.5?1:-1;
		});//乱序
	return json_values;
}
//	发牌--发牌效果:num_x:行数，num_y：列数
function displayCards(num_x, num_y) {
	//生成牌
	var cards = createCards(num_x * num_y);
	console.log('cards：');
	console.log(cards);
	var position_y = 10;
//	var $card_board = $('#card');
//	var $card = $('.card');
	var index = 0;

	for(var i = 0; i < num_x; i++) {
		var position_x = 10;
		for(var j = 0; j < num_y; j++) {
			//			if(i==0&&j==0){
			//				position_x +=90;
			//				continue;
			//			}
			card_index = cards[index];
			bg_position_x = -card_index.value * 80;
			bg_position_y = -card_index.type * 120;
			var $card_clone = $(card_mode).clone();
			var $test = $card_clone.find('div:eq(0)'); //得到对应的牌
			$test.css({
				'background-position-x': bg_position_x.toString() + 'px',
				'background-position-y': bg_position_y.toString() + 'px'
			});
//						$test.addClass(card_index.str);
			$card_clone.attr({
				'data-value': card_index.str,
//				'data-value2': 'card'+types[card_index.type]+''+values[card_index.value]
			});
			//			console.log("test:"+$test.code);
//			$card_clone.css({
//				'left': position_x + 'px',
//				'top': position_y + 'px'
//			});
			$card_clone.animate({
				left:position_x + 'px',
				top:position_y + 'px'
				},500);
			position_x += 90;
			$card_board.append($card_clone); //克隆
			index++;
		}
		position_y += 130;
	}
//	$card.remove();z
}
function primary(){
	current_mode = 10;
	row = 2;
	col = 3;
	refresh();
}
function middle(){
	current_mode = 20;
	row = 3;
	col = 4;
	refresh();
}
function master(){
	current_mode = 15;
	row = 3;
	col = 4;
	refresh();
}
