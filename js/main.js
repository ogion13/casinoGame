		$(function() {
		 	var $gameWrapper = $('#gameWrapper'),
		 	$canvas = $('#gameCanvas'),
 			originalSize = {
 				width: 1280,
 	            height: 720
 			},
 			symbols = ['A','B','C','D'],
 			animatedCardSize = [145,165],
 			currentBet = {},
 			betGroup,
 			winNumber,
 			gameButtons = [],
 			selectedCard,
 			winAnimationStarted = 0,
 			winResult = {
 				number: 10,
 				winType:'symbol'
 			},
 			serverData = {},
 			winFrame,
 			direction = 1,
 			scoreNumber = 50,
 			score,
 			stars = [],
 			strokeImagesId = ['image1','image2','image3','image4'],
 			allStrokeImages = [],
 			lastWidth = $canvas.innerWidth(),
 			staticElements = [],
			scaleFactor = getScaleFactor(),
			colorMatchSound = new buzz.sound(["sounds/colorMatch.wav","sounds/colorMatch.mp3"],{volume:50}),
			symbolMatchSound = new buzz.sound(["sounds/symbolMatch.mp3","sounds/symbolMatch.wav"],{volume:50}),
			numberAnimateSound = new buzz.sound(["sounds/numberAnimate.mp3","sounds/numberAnimate.wav"],{volume:100});



		 	// <<<<Resize canvas and elements>>>>

		 	function getScaleFactor() {
		 	    var scaleFactor= $canvas.innerWidth()/originalSize.width;
		 	    return scaleFactor;
		 	}
		 	function changeSize (argument) {
		 		var windowWidth = window.innerWidth,
		 			windowHeight = window.innerHeight,
		 			newWidth,
		 			newHeight,
		 			windowWidthToHeight = windowWidth / windowHeight
		 		if (windowWidthToHeight > widthToHeight) {
		 		  newWidth = windowHeight * widthToHeight;
		 		  newHeight = windowHeight;
		 		} else {
		 		  newHeight = windowWidth/ widthToHeight;
		 		  newWidth = windowWidth;
		 		}
		 		$gameWrapper.css({width:newWidth,height:newHeight});
		 		$gameWrapper.css({marginTop:-newHeight / 2,marginLeft:-newWidth / 2});
		 	}

		 	function getScale() {
		 	    var scale = $canvas.innerWidth()/lastWidth;
		 	    lastWidth = $canvas.innerWidth();
		 	    return scale;
		 	}

		 	function resizeAllElements () {
				var scale = getScale();
		 		scaleFactor = getScaleFactor();
		 		console.log(scale);
		 		for (var i = 0; i < allStrokeImages.length; i++) {
		 			allStrokeImages[i].position*= scale;
		 			allStrokeImages[i].scale(scale);
		 		};
		 		for (var i = 0; i < staticElements.length; i++) {
		 			staticElements[i].position*= scale;
		 			staticElements[i].scale(scale);
		 		};
		 		winNumber.position *= scale;
		 		winNumber.fontSize *= scale;
		 		winFrame.strokeWidth *= scale;
		 	}

		 	view.onResize = resizeAllElements;


		 	
		 	// <<<ELEMENTS CREATING>>>

		 	function createBackground(){
		 		var background = new Path.Rectangle([0,0], [1280*scaleFactor,720*scaleFactor]);
		 		background.fillColor = 'black';
		 		staticElements.push(background);
		 	}
		 	
		 	function createWinFrame () {
		 		winFrame = new Path.Rectangle({
		 			position:[view.center.x,185*scaleFactor],
		 			strokeColor:'white',
		 			size:[170*scaleFactor,270*scaleFactor],
		 			strokeWidth:20*scaleFactor
		 		})
		 		staticElements.push(winFrame);
		 	}
		 	
		 	function createGameButtons () {
		 		for (var i = 0; i < strokeImagesId.length; i++) {
		 			var newRect = new Path.Rectangle([150*scaleFactor + i*120*scaleFactor,525*scaleFactor], [110*scaleFactor, 110*scaleFactor]);
		 			newRect.strokeColor = 'white';
		 			if(i%2>0){
		 				newRect.fillColor = 'red';
		 			}
		 			else{
		 				newRect.fillColor = 'green';
		 			}
		 			var strokeImage = new Raster(strokeImagesId[i]);
		 			strokeImage.position = newRect.position; 
		 			strokeImage.scale(0.30*scaleFactor);

		 			var group = new Group({
		 			    children: [newRect, strokeImage],
		 			});
		 			group.value = i;
		 			gameButtons.push(group);
		 			staticElements.push(group);
		 		};	
		 	}
		 	function createAnimatedStars () {
		 		for (var i = 0; i < 4; i++) {
		 			var star = new Raster('star');
		 			star.opacity  = 0;
		 			star.position= winFrame.position;
		 			stars.push(star);				
		 		};

		 	}
		 	function createStrokeImages () {
		 		for (var i = 0; i <= 7; i++) {
		 			var newRect = new Path.Rectangle([-100*scaleFactor + i*190*scaleFactor,60*scaleFactor], [150*scaleFactor, 250*scaleFactor]);
		 			newRect.strokeColor = 'white';
		 			var random = Math.round(Math.random()*(strokeImagesId.length-1));
		 			if(random%2>0){
		 				newRect.fillColor = 'red';
		 			}
		 			else{
		 				newRect.fillColor = 'green';
		 			}
		 			var strokeImage = new Raster(strokeImagesId[random]);
		 			strokeImage.bounds = new Size (animatedCardSize[0]*scaleFactor,animatedCardSize[1]*scaleFactor);
		 			strokeImage.position = newRect.position; 
		 			var group = new Group({
		 			    children: [newRect, strokeImage],
		 			});
		 			allStrokeImages.push(group);
		 		};
		 	}
		 	function createScore () {
		 		score = new PointText({
		 			position:[190*scaleFactor,460*scaleFactor],
		 			justification:'center',
		 			fontSize:70*scaleFactor,
		 			fillColor:'green',
		 			content:'Score: ' + scoreNumber
		 		});
		 		staticElements.push(score);
		 	}
		 	function createBetButton () {
		 		var upArrow = new Path.RegularPolygon(new Point(1100*scaleFactor, 480*scaleFactor), 3, 40*scaleFactor);
		 		upArrow.fillColor = '#e9e9ff';
		 		var downArrow = new Path.RegularPolygon(new Point(1100*scaleFactor, 680*scaleFactor), 3, 40*scaleFactor);
		 		downArrow.rotate(180);
		 		downArrow.fillColor = '#e9e9ff';
		 		bet = new PointText({
		 			position:[1098*scaleFactor,610*scaleFactor],
		 			justification:'center',
		 			fontSize:100*scaleFactor, 
		 			fillColor:'white',
		 			content:1
		 		});
		 		var betRect = new Path.Rectangle({
		 			position:[1100*scaleFactor,570*scaleFactor],
		 			size:[120*scaleFactor,120*scaleFactor],
		 			strokeColor:'white',
		 		});
		 		betGroup = new Group({
		 		    children: [downArrow, upArrow, bet, betRect],
		 		});
		 		staticElements.push(betGroup);

		 	}
		 	function createWinNumber () {
		 		winNumber = new PointText({
		 			position:[view.center.x,view.center.y+140*scaleFactor],
		 			justification:'center',
		 			fontSize:70*scaleFactor,
		 			fillColor:'green',
		 			opacity:0,
		 			content:0
		 		});
		 	}
		 	function initGame () {
		 		createBackground();
		 		createWinFrame();
		 		createGameButtons();
		 		createAnimatedStars();
		 		createStrokeImages();
		 		createBetButton();
		 		addClickEvents();
		 		createWinNumber();
		 		createScore ();
		 	}
		 	initGame();

		 	

		 	// <<<<EVENTS AND ANIMATIONS>>>>
		 	function changeScore (amount) {
		 		scoreNumber += amount;
		 		score.content = 'Score: '+ scoreNumber;

		 	}
		 	function animateWinNumber (event) {
		 		if(winNumber.content==serverData.winAmount){
		 			changeScore (serverData.winAmount);
		 			paper.view.detach('frame', animateWinNumber);
		 			addClickEvents();
		 			winNumber.content = 0;
		 			winNumber.opacity = 0;
		 			winNumber.fontSize = 70*scaleFactor;
		 			winNumber.animating = false;
		 			return;
		 		}
		 		if(winNumber.content<serverData.winAmount&&event.time-winNumber.startTime >= 0.1){
		 			winNumber.startTime = event.time;
		 			winNumber.content = parseInt(winNumber.content) + 1;
		 			numberAnimateSound.play();
		 			winNumber.fontSize += 140*scaleFactor/serverData.winAmount;
		 		}

		 	}
		 	
		 	function removeClickEvents () {
		 		betGroup.children[0].detach('click');
		 		betGroup.children[1].detach('click');
		 		for (var i = 0; i < gameButtons.length; i++) {
		 			gameButtons[i].detach('click');
		 		};
		 	}

		 	function addClickEvents () {
		 		var downArrow = betGroup.children[0];
		 		var upArrow = betGroup.children[1];
		 		var bet = betGroup.children[2]
		 		upArrow.on('click',function (argument) {
		 			if(bet.content>=10||bet.content>=scoreNumber){
		 				return;
		 			}
		 			bet.content = parseInt(bet.content) + 1;	
		 		})
				downArrow.on('click',function(){
		 			if(bet.content<=1){
		 				return;
		 			}
		 			bet.content = bet.content - 1;
		 		})
		 		for (var i = 0; i < gameButtons.length; i++) {
		 			gameButtons[i].strokeColor = 'white';
		 			gameButtons[i].on('click',function (argument) { 
		 				if(betGroup.children[2].content > scoreNumber){
		 					betGroup.children[2].content = 1;
		 					return;	
		 				}
		 				this.strokeColor = 'blue';
		 				changeScore (-betGroup.children[2].content);
		 				var data = {
		 					action:'bet',
		 					bet_cash:betGroup.children[2].content,
		 					bet_symbol:symbols[this.value]

		 				};
		 				console.log(data);
		 				getServerData(data);
		 				paper.view.attach('frame', animateStroke);
		 				removeClickEvents();	
		 			})
		 		};

		 	}

		 	function animateStroke(event){
		 		for (var i = allStrokeImages.length - 1; i >= 0; i--) {
		 			var card = allStrokeImages[i];
		 			card.position.x += 10*scaleFactor;
		 			if(serverData.returned){
		 				if(card.value == serverData.resultVal&&Math.ceil(card.position.x) === Math.ceil(1280*scaleFactor/2) ){
		 					serverData.returned = false;
		 					paper.view.detach('frame', animateStroke);
		 					selectedCard = card;
		 					animateCard();
		 				}	
		 			}
		 			
		 			
		 		};
		 		var lastImg = allStrokeImages[allStrokeImages.length-1];
		 		if(lastImg.position.x - lastImg.bounds.width/2>1280*scaleFactor){
		 			allStrokeImages.pop();
		 			lastImg.remove();
		 		}
		 		var firstImg = allStrokeImages[0];
		 		if(firstImg.position.x - lastImg.bounds.width/2>=0){
		 			var newRect = new Path.Rectangle([-185*scaleFactor ,60*scaleFactor], [150*scaleFactor, 250*scaleFactor]);
		 			var random = Math.round(Math.random()*(strokeImagesId.length-1));
		 			if(random%2>0){
		 				newRect.fillColor = 'red';
		 			}
		 			else{
		 				newRect.fillColor = 'green';
		 			}
		 			var strokeImage = new Raster(strokeImagesId[random]);
		 			strokeImage.bounds = new Size (animatedCardSize[0]*scaleFactor,animatedCardSize[1]*scaleFactor);
		 			strokeImage.position = newRect.position;
		 			var group = new Group({
		 			    children: [newRect, strokeImage],
		 			});
		 			group.value = random;
		 			allStrokeImages.unshift(group);
		 		}


		 	}
		 	function colorMatchAnimate (event) {
		 		if(winAnimationStarted==0){
		 			winAnimationStarted = event.time;
		 		}
		 		var timePassed = event.time - winAnimationStarted;
		 		showWinNumber(event.time-0.5);
		 		if(event.time - winAnimationStarted>=2){
		 			paper.view.detach('frame',colorMatchAnimate);
		 			selectedCard.children[1].position = selectedCard.children[0].position;
		 			winAnimationStarted = 0;
		 			return;
		 		}
		 		var maxWidth = animatedCardSize[0]/100*20*scaleFactor;
		 		var maxHeight = animatedCardSize[1]/100*20*scaleFactor;
		 		if(timePassed<=1){
		 			var newWidth = animatedCardSize[0]*scaleFactor+maxWidth*timePassed;
		 			var newHeight = animatedCardSize[1]*scaleFactor+maxHeight*timePassed
		 			selectedCard.children[1].bounds = new Size (newWidth,newHeight);
		 			selectedCard.children[1].position = selectedCard.children[0].position;
		 		}
		 		else{
		 			if(!selectedCard.soundPlayed){
		 				selectedCard.soundPlayed = true;
		 				colorMatchSound.play();
		 			}
		 			var newWidth = animatedCardSize[0]*scaleFactor + maxWidth*(2-timePassed);
		 			var newHeight = animatedCardSize[1]*scaleFactor + maxHeight*(2-timePassed);
		 			selectedCard.children[1].bounds = new Size (newWidth,newHeight);
		 			selectedCard.children[1].position = selectedCard.children[0].position;
		 		}

		 	}
		 	function showWinNumber (time) {
		 		if(!winNumber.animating&&(time - winAnimationStarted)>=0.5&&(time - winAnimationStarted)<=0.6){
		 			console.log(15415151);
		 			winNumber.opacity = 1;
		 			winNumber.animating = true;
		 			winNumber.startTime = time;
		 			paper.view.attach('frame',animateWinNumber);
		 		}
		 	}
		 	function animateCard(){
		 		if(!serverData.winAmount){
		 			addClickEvents();
		 			return;

		 		}
		 		if (serverData.winType == 'color') {
		 			paper.view.attach('frame', colorMatchAnimate);
		 		}
		 		else{
		 			selectedCard.direction = 'top';
		 			for (var i = 0; i < stars.length; i++) {
		 				selectedCard.addChild(stars[i]);
		 				stars[i]
		 			};
		 			paper.view.attach('frame', tremble);	
		 		}
		 		
		 		
		 	}


		 	function tremble (event) {
		 		if(winAnimationStarted==0){
		 			winAnimationStarted = event.time;
		 			symbolMatchSound.setTime(1);
		 			symbolMatchSound.play();
		 			symbolMatchSound.loop();
		 		}
		 		showWinNumber(event.time);
		 		if(event.time - winAnimationStarted>=1){
		 			console.log(1);
		 			paper.view.detach('frame',tremble);
		 			for (var i = 0; i < stars.length; i++) {
		 				stars[i].opacity = 0;
		 				stars[i].remove();
		 				
		 			};
		 			selectedCard.children[1].position = selectedCard.children[0].position;
		 			winAnimationStarted = 0;
					symbolMatchSound.unloop();
		 			return;
		 		}
		 		var maxPositionChange = selectedCard.children[1].bounds.width * 10/100;
		 		switch (selectedCard.direction){
		 			case 'top':{
		 				starsDirection = -1;
		 				var difference = selectedCard.children[0].position.y-selectedCard.children[1].position.y;
		 				if(difference>maxPositionChange){
		 					selectedCard.direction = 'down';
		 					return;
		 				}
		 				selectedCard.children[1].position.y-=5*scaleFactor;


		 				break;
		 			}
		 			case 'left':{
		 				var difference = selectedCard.children[0].position.x - selectedCard.children[1].position.x;
		 				if(difference>maxPositionChange){
		 					selectedCard.direction = 'right';
		 					return;
		 				}
		 				selectedCard.children[1].position.x-=5*scaleFactor;
		 				break;
		 			}
		 			case 'down':{
		 				var difference = selectedCard.children[0].position.y-selectedCard.children[1].position.y;
		 				if(difference<-maxPositionChange){
		 					selectedCard.direction = 'left';
		 					return;
		 				}
		 				selectedCard.children[1].position.y+=5*scaleFactor;
		 				break;
		 			}
		 			case 'right':{
		 				starsDirection = -1;
		 				var difference = selectedCard.children[0].position.x-selectedCard.children[1].position.x;
		 				if(difference<-maxPositionChange){
		 					selectedCard.direction = 'top';
		 					return;
		 				}
		 				selectedCard.children[1].position.x+=5*scaleFactor;
		 				break;
		 			} 
		 		}
		 		for (var i = 0; i < stars.length; i++) {
		 			if(stars[i].opacity<1){
		 				stars[i].opacity += 0.1;
		 				continue;
		 			}
		 			
		 			if(i==0){
		 				var positionX = -direction*selectedCard.children[1].bounds.width/2 *Math.random()+ selectedCard.children[1].position.x;
		 				var positionY = -direction*selectedCard.children[1].bounds.height/2 *Math.random()+ selectedCard.children[1].position.y;
		 				stars[i].opacity = 0;
		 				stars[i].position = [positionX,positionY];
		 			}
		 			else if(i==1){
		 				var positionX = direction*selectedCard.children[1].bounds.width/2 *Math.random()+ selectedCard.children[1].position.x;
		 				var positionY = -direction*selectedCard.children[1].bounds.height/2 *Math.random()+ selectedCard.children[1].position.y;
		 				stars[i].opacity = 0;
		 				stars[i].position = [positionX,positionY];
		 			}
		 			else if(i==2){
		 				var positionX = direction*selectedCard.children[1].bounds.width/2 *Math.random()+ selectedCard.children[1].position.x;
		 				var positionY = direction*selectedCard.children[1].bounds.height/2 *Math.random()+ selectedCard.children[1].position.y;
		 				stars[i].opacity = 0;
		 				stars[i].position = [positionX,positionY];
		 			}
		 			else if(i==3){
		 				var positionX = -direction*selectedCard.children[1].bounds.width/2 *Math.random()+ selectedCard.children[1].position.x;
		 				var positionY = direction*selectedCard.children[1].bounds.height/2 *Math.random()+ selectedCard.children[1].position.y;
		 				stars[i].opacity = 0;
		 				stars[i].position = [positionX,positionY];

		 			}
		 		}	

		 	}

		 	// Getting Data from server
		 	function getServerData(obj){
		 		var data = obj;
		 		$.ajax({
		 		  type: "POST",
		 		  url: 'http://testgame.dsd.globo-tech.com/',
		 		  data: data,
		 		  success: serverCallBack,
		 		  dataType:'json'
		 		});
		 	}
		 	function serverCallBack (data) {
		 		console.log(data.result_win)
		 		serverData.returned = true;
		 		serverData.resultVal = symbols.indexOf(data.result_symbol);
		 		serverData.winAmount = data.result_win;
		 		serverData.winType = data.win_type;
		 		console.log(data);
		 		console.log(serverData);
		 	}

		 	

		});
		