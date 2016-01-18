var $gameWrapper = $('#gameWrapper'),
$canvas = $('#gameCanvas'),
widthToHeight = 16/9;

function changeSize (argument) {
	var windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		newWidth,
		newHeight,
		windowWidthToHeight = windowWidth / windowHeight
	if (windowWidthToHeight > widthToHeight) {
	  // ширина окна шире, чем желаемая ширина игры 
	  newWidth = windowHeight * widthToHeight;
	  newHeight = windowHeight;
	} else { // высота окна выше желаемой высоты игры
	  newHeight = windowWidth/ widthToHeight;
	  newWidth = windowWidth;
	}
	$gameWrapper.css({width:newWidth,height:newHeight});
	$gameWrapper.css({marginTop:-newHeight / 2,marginLeft:-newWidth / 2});
	// gameArea.style.marginTop = (-newHeight / 2) + 'px';
	// gameArea.style.marginLeft = (-newWidth / 2) + 'px';
	$canvas.css({
		width:newWidth,
		height:newHeight
	})

}
$(window).resize(function (argument) {
	changeSize();
})
changeSize();

