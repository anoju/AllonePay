/********************************
 * NH카드 모바일 UI 스크립트 *
 * 작성자 : 안효주 *
 ********************************/

$(function(){
	htmlnclude();
	deviceCheck();
	common.init();
	Layer.init();
	buttonUI.init();
	tooltip.init();
	formUI.init();

	$(window).scroll();
	$(window).resize();
});

$(window).on('load',function(){
	//console.log('window load complete');
	formUI.winLoad();
	listUI.winLoad();
	buttonUI.winLoad();
	buttonUI.tabNavi();

	swiperUI.init();

	$(window).scroll();
	$(window).resize();
});

//Html include
var htmlnclude = function(){
	var $elements = $.find('*[data-include-html]');
	var $fileName = location.pathname.split('/').pop();
	if($elements.length){
		$.each($elements,function(){
			var $this = $(this),
				$html = $this.data('include-html'),
				$htmlAry = $html.split('/'),
				$htmlFile = $htmlAry[$htmlAry.length-1],
				$atvIdx = $this.data('active');
			if($atvIdx == undefined)$atvIdx = 1;
			$this.load($html,function(res,sta,xhr){
				if(sta == 'success'){
					console.log('Include '+$htmlFile+'!');
					$this.children().unwrap();

					if($htmlFile == 'inc_guide_navi.html'){
						$('.gd__navi').find('li').each(function(){
							var $href = $(this).find('a').attr('href');
							if($href == $fileName)$(this).addClass('active');
						});
						common.fixed('.gd__navi');
						buttonUI.tabNavi();
					}
				}
			});
		});
	}
};

//body scroll lock
var Body = {
	scrollTop :'',
	lock: function(){
		if(!$('html').hasClass('lock')){
			Body.scrollTop = window.pageYOffset;
			$('#container').css('top',-(Body.scrollTop));
			$('html').addClass('lock');
		}
	},
	unlock: function(){
		if($('html').hasClass('lock')){
			$('html').removeClass('lock');
			$('#container').removeAttr('style');
			window.scrollTo(0, Body.scrollTop);
			window.setTimeout(function (){
				Body.scrollTop = '';
			}, 0);
		}
	}
};

//모바일 디바이스 체크
var isMobile = {
	Android: function(){
		return navigator.userAgent.match(/Android/i) == null ? false : true;
	},
	BlackBerry: function(){
		return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
	},
	iOS: function(){
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
	},
	iPhone :function(){
		return navigator.userAgent.match(/iPhone/i) == null ? false : true;
	},
	iPad :function(){
		return navigator.userAgent.match(/iPad/i) == null ? false : true;
	},
	iPhoneVersion :function(){
		var $sliceStart = navigator.userAgent.indexOf('iPhone OS') + 10,
			$sliceEnd = $sliceStart + 2,
			$version = parseFloat(navigator.userAgent.slice($sliceStart,$sliceEnd));
		return $version;
	},
	Opera: function(){
		return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
	},
	Windows: function(){
		return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
	},
	tablet: function(){
		if(isMobile.any()){
			if(window.screen.width < window.screen.height){
				return window.screen.width > 760 ? true : false;
			}else{
				return window.screen.height > 760 ? true : false;
			}
		}
	},
	any: function(){
		return (isMobile.Android() || isMobile.iOS() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());
	},
	check: function(){
		if(isMobile.tablet()){
			$('html').addClass('tablet');
		}else{
			$('html').addClass('mobile');
		}
		if(isMobile.iOS())$('html').addClass('ios');
		if(isMobile.Android())$('html').addClass('android');
		//if(isMobile.iPhoneVersion() >= 12)$('html').addClass('ios12');
	}
};

//디바이스체크 실행
var deviceCheck = function(){
	isMobile.check();
	if(isMobile.any()){
		var $pixelRatio = window.devicePixelRatio;
		if(!!$pixelRatio) $('html').addClass('pixel_ratio_'+$pixelRatio);
	}

	//아이폰X (스크린:375*812, 윈도우: 375*635)
	//아이폰8+ (스크린:414*736, 윈도우: 414*622)
	//아이폰8 (스크린:375*667, 윈도우: 375*554)
	var $iPhone8PlusH = 736,	//아이폰8+ 높이값 736(보다 크면 아이폰X 시리즈로 처리)
		$screenH = window.screen.height,
		$screenW = window.screen.width;

	var isIPhoneX = function(e){
		$('html').addClass('iPhoneX');
	};
	var notIPhoneX = function(e){
		$('html').removeClass('iPhoneX');
	};

	//아이폰X체크
	if(isMobile.iPhone() && $screenH > $iPhone8PlusH){
		//첫로딩
		if($(window).width() < $(window).height()){
			isIPhoneX();
		}else{
			notIPhoneX();
		}

		//가로, 세로 회전시
		$(window).on('orientationchange',function(){
			if(window.orientation == 0){
				isIPhoneX();
			}else{
				notIPhoneX();
			}
		});
	}
};

var common = {
	layout:function(target){
		if($('.btn_wrap.bottom_fixed').length)$('#container').addClass('add_fixed');
	},
	fixed:function(target){
		//고정(fixed)
		var $target = $(target);
		if($target.length){
			$(window).resize(function(){
				$target.each(function(){
					var $isFixed = false;
					if($(this).hasClass('fixed'))$isFixed = true;
					$(this).removeAttr('style');
					if($isFixed)$(this).removeClass('fixed');
					var $thisH = $(this).outerHeight(),
						$childH = $(this).children().outerHeight();
					if($thisH < $childH){
						$(this).css('height',$childH);
					}
					if($isFixed)$(this).addClass('fixed');
				});
			});
			
			$(window).on('scroll',function(){
				if($('html').hasClass('lock'))return false;
				var $scrollTop = $(this).scrollTop();
				$target.each(function(){
					if($(this).closest('.popup').length) return;
					var $offsetTop = Math.max(0,$(this).offset().top),
						$dataTop = $(this).data('top');
					if($dataTop == undefined)$dataTop = 0;
					if($dataTop != 0)$offsetTop = $offsetTop - $dataTop;
					if($scrollTop > $offsetTop){
						if(!$(this).hasClass('fixed')){
							$(this).addClass('fixed');
						}
					}else{
						if($(this).hasClass('fixed')){
							$(this).removeClass('fixed');
						}
					}
				});
			});
		}
	},
	init:function(){
		if($('.tab_wrap.add_fixed').length)common.fixed('.tab_wrap.add_fixed');
	}
};

//레이어팝업(Layer): 레이어 팝업은 #container 밖에 위치해야함
var Layer = {
	id:'uiLayer',
	alertClass:'ui-alert',
	focusClass:'pop_focused',
	selectId:'uiSelectLayer',
	selectClass:'ui-pop-select',
	wrapClass:'pop_wrap',
	headClass:'pop_head',
	contClass:'pop_cont',
	innerClass:'section',
	etcCont:'#container',
	beforeCont:[],
	content:'',
	overlapChk: function(){
		//focus 이벤트 시 중복열림 방지
		var $focus = $(':focus');
		if(!!event){
			if(event.type === 'focus' && $($focus).hasClass(Layer.focusClass)){
				return false;
			}
		}
		//같은 내용 중복열림 방지
		if(Layer.beforeCont.indexOf(Layer.content) >= 0){
			return false;
		}else{
			Layer.beforeCont.push(Layer.content);
		}
		return true;
	},
	alertHtml: function(type,popId,btnActionId,btnCancelId){
		var $html = '<div id="'+popId+'" class="popup modal alert '+Layer.alertClass+'" role="dialog" aria-hidden="true">';
				$html += '<div class="'+Layer.wrapClass+'">';
					$html += '<div class="'+Layer.contClass+'">';
						$html += '<div class="'+Layer.innerClass+'">';
							if(type === 'prompt'){
							$html += '<div class="form_item">';
								$html += '<label for="inpPrompt" class="fm_lb" role="alert" aria-live="assertive"></label>';
								$html += '<div class="fm_cont">';
									$html += '<div class="input"><input type="text" id="inpPrompt" placeholder="입력해주세요."></div>';
								$html += '</div>';
							$html += '</div>';
							}else{
							$html += '<div class="message">';
								$html += '<div role="alert" aria-live="assertive"></div>';
							$html += '</div>';
							}
						$html += '</div>';
					$html += '</div>';
					$html += '<div class="pop_btn">';
						$html += '<div class="flex">';
							if(type === 'confirm' || type === 'prompt'){
							$html += '<button type="button" id="'+btnCancelId+'" class="button h48 gray">취소</button>';
							}
							$html += '<button type="button" id="'+btnActionId+'" class="button h48 blue">확인</button>';
						$html += '</div>';
					$html += '</div>';
				$html += '</div>';
			$html += '</div>';
		$('body').append($html);
	},
	alertEvt: function(type, option, callback){
		var $length = $('.' +Layer.alertClass).length,
			$popId = Layer.id+'Alert'+$length,
			$actionId = $popId+'ActionBtn',
			$cancelId = $popId+'CancelBtn';

		if(typeof option === 'object'){
			Layer.content = option.content;
		}else if (typeof option == 'string'){
			//약식 설절
			Layer.content = option;
		}
		//중복팝업 체크
		if(Layer.overlapChk() === false)return false;

		//팝업그리기
		Layer.alertHtml(type,$popId,$actionId,$cancelId);
		if(!!option.title){
			var $titleHtml = '<div class="pop_head"><h1>'+option.title+'</h1></div>';
			$('#'+$popId).find('.pop_wrap').prepend($titleHtml);
		}
		if(!!option.actionTxt)$('#'+$actionId).text(option.actionTxt);
		if(!!option.cancelTxt)$('#'+$cancelId).text(option.cancelTxt);
		Layer.open('#'+$popId,function(){
			if(type === 'prompt'){
				$('#'+$popId).find('.fm_lb').html(Layer.content);
			}else{
				$('#'+$popId).find('.message>div').html(Layer.content);
			}
		});

		//click
		var $result = '',
			$actionBtn = $('#'+$actionId),
			$cancelBtn = $('#'+$cancelId),
			$inpVal = '';
		$actionBtn.on('click',function(){
			$result = true;
			$inpVal = $('#'+$popId).find('.input input').val();
			if(type === 'prompt'){
				if(!!option.action)option.action($result,$inpVal);
				if(!!option.callback)option.callback($result,$inpVal);
				if(!!callback)callback($result,$inpVal);
			}else{
				if(!!option.action)option.action($result);
				if(!!option.callback)option.callback($result);
				if(!!callback)callback($result);
			}
			Layer.close('#'+$popId);
		});
		$cancelBtn.on('click',function(){
			$result = false;
			if(!!option.cancel)option.cancel($result);
			if(!!option.callback)option.callback($result);
			if(!!callback)callback($result);
			Layer.close('#'+$popId);
		});
	},
	alert: function(option, callback){
		Layer.alertEvt('alert',option, callback);
	},
	confirm: function(option, callback){
		Layer.alertEvt('confirm',option, callback);
	},
	prompt: function(option, callback){
		Layer.alertEvt('prompt',option, callback);
	},
	keyEvt:function(){
		//컨펌팝업 버튼 좌우 방할기로 포거스 이동
		$(document).on('keydown', '.'+Layer.alertClass+' .pop_btn .button',function(e){
			var $keyCode = (e.keyCode?e.keyCode:e.which),
				$tar = '';
			if($keyCode == 37)$tar = $(this).prev();
			if($keyCode == 39)$tar = $(this).next();
			if (!!$tar)$tar.focus();
		});
	},
	select:function(target,col){
		var $target = $(target),
			$targetVal = $target.val(),
			$title = $target.attr('title'),
			$popLength = $('.' +Layer.selectClass).length,
			$popId = Layer.selectId+$popLength,
			$length = $target.children().length,
			$opTxt = '',
			$opVal = '',
			$popHtml = '',
			$isBank = false,
			$isCard = false,
			$isFullPop = false;

		if($title == undefined)$title = '선택';
		if($title.indexOf('은행선택') >= 0 || $title.indexOf('은행 선택') >= 0){
			$isBank = true;
		}else if($title.indexOf('카드선택') >= 0 || $title.indexOf('카드 선택') >= 0){
			$isCard = true;
		}
		if($isBank)$isFullPop = true;
		$popHtml += '<div id="'+$popId+'" class="popup '+($isFullPop?'full':'bottom')+' '+Layer.selectClass+'" role="dialog" aria-hidden="true">';
			$popHtml += '<div class="'+Layer.wrapClass+'">';
				$popHtml += '<div class="'+Layer.headClass+'">';
					$popHtml += '<h1>'+$title+'</h1>';
					$popHtml += '<a href="#" class="pop_close ui-pop-close" role="button"><span class="blind">팝업창 닫기</span></a>';
				$popHtml += '</div>';
				$popHtml += '<div class="'+Layer.contClass+'">';
					if($isBank){
						$popHtml += '<div class="tabmenu ui-tab">';
							$popHtml += '<ul>';
								$popHtml += '<li role="presentation"><a href="#uiSelPanel1" id="uiSelTab1" role="tab" aria-controls="uiSelPanel1" aria-selected="false">은행</a></li>';
								$popHtml += '<li role="presentation"><a href="#uiSelPanel2" id="uiSelTab2" role="tab" aria-controls="uiSelPanel2" aria-selected="false">증권</a></li>';
							$popHtml += '</ul>';
							$popHtml += '<div class="tab_line" aria-hidden="true"></div>';
						$popHtml += '</div>';
						$popHtml += '<div id="uiSelPanel1" class="tab_panel" role="tabpanel" aria-labelledby="uiSelTab1" aria-expanded="false">';
					}

					$popHtml += '<ul class="select_item_wrap';
					if($isBank){
						$popHtml += ' bank';
					}else if($isCard){
						$popHtml += ' card';
					}else{
						if(!!col)$popHtml += ' col'+col;
					}
					$popHtml += '">';
					for(var i=0;i<$length;i++){
						$opTxt = $target.children().eq(i).text();
						$opVal = $target.children().eq(i).attr('value');
						if($opVal != ''){
							if($isBank){
								$popHtml += '<li class="'+($opVal >= 200 ? 'ty2' : 'ty1')+'">';
							}else{
								$popHtml += '<li>';
							}
							$popHtml += '<div class="select_item'+($targetVal == $opVal ? ' selected' : '')+'">';
								$popHtml += '<a href="#" class="ui-pop-select-btn" role="button" data-value="'+$opVal+'">';
									if($isBank)$popHtml += '<i class="bk_'+$opVal+'" aria-hidden="true"></i>';
									if($isCard){
										if($opTxt.length > 20){
											$popHtml += '<strong class="tit">'+$opTxt.substring(20,$opTxt.lastIndexOf('('))+'</strong>';
											$popHtml += '<div class="sub"><span>'+$opTxt.substring(0,19)+'</span><span>'+$opTxt.substring($opTxt.lastIndexOf('(')+1,$opTxt.lastIndexOf(')'))+'</span></div>';
										}else{
											$popHtml += '<strong class="tit">'+$opTxt+'</strong>';
										}
									}else{
										$popHtml += '<span>'+$opTxt+'</span>';
									}
								$popHtml += '</a>';
							$popHtml += '</div>';
							$popHtml += '</li>';
						}
					}
					$popHtml += '</ul>';
					if($isBank){
						$popHtml += '</div>';
						$popHtml += '<div id="uiSelPanel2" class="tab_panel" role="tabpanel" aria-labelledby="uiSelTab2" aria-expanded="false">';
							$popHtml += '<ul class="select_item_wrap bank"></ul>';
						$popHtml += '</div>';
					}
				$popHtml += '</div>';
			$popHtml += '</div>';
		$popHtml += '</div>';

		$('body').append($popHtml);
		if($isBank){
			var isType2 = false;
			$('#'+$popId+' .select_item_wrap.bank>li').each(function(){
				if($(this).hasClass('ty2')){
					isType2 = true;
					var $wrap = $(this).closest('.tab_panel').next().find('.select_item_wrap');
					//if($wrap.find('.none').length)$wrap.find('.none').remove();
					$(this).appendTo($wrap);
				}
			});

			if(isType2 == false){ //증권사가 없으면
				$('#'+$popId).find('.tabmenu').remove();
				$('#'+$popId).find('#uiSelPanel2').remove();
				$('#'+$popId).find('.select_item_wrap.bank').unwrap();
			}else{
				if($targetVal >= 200){
					$('#uiSelTab2').click();
				}else{
					$('#uiSelTab1').click();
				}
			}
		}

		$target.data('popup','#'+$popId);

		$('#'+$popId).on('click','.ui-pop-select-btn',function(e){
			e.preventDefault();
			var $btnVal = $(this).data('value'),
				$btnTxt = $(this).text();
			$(this).parent().addClass('selected').closest('li').siblings().find('.selected').removeClass('selected');
			$target.val($btnVal).change();
			Layer.close('#'+$popId);
		});
	},
	isSelectOpen: false,
	selectUI:function(){
		//셀렉트 팝업
		$(document).on('click','.ui-select-open',function(e){
			e.preventDefault();
			if(Layer.isSelectOpen == false){
				Layer.isSelectOpen = true;
				var $select = $(this).siblings('select');
				var $txtLengthArry = [];
				if($select.prop('disabled')) return false;
				if($select.find('option').length < 1) return false;
				$select.find('option').each(function(){
					var $optVal = $(this).val(),
						$optTxt = $(this).text();
					if($optVal != ''){
						$txtLengthArry.push($optTxt.length);
					}
				});
				var $maxTxtLength = Math.max.apply(null, $txtLengthArry);
				//글자수 체크
				if($maxTxtLength <= 6){
					Layer.select($select,3);
				}else if($maxTxtLength <= 10){
					Layer.select($select,2);
				}else{
					Layer.select($select);
				}

				var $pop = $select.data('popup'),
					$currentTarget = $(e.currentTarget);
				Layer.open($pop,function(){
					$($pop).data('returnFocus',$currentTarget);
				});
			}
		});
		$(document).on('click','.ui-select-lbl',function(e){
			e.preventDefault();
			var $tar = $(this).is('a') ? $(this).attr('href') : '#'+$(this).attr('for');
			$($tar).next('.ui-select-open').focus().click();
		});
		//건물면적
		var layerSelectClose = function(target,isInp){
			var $closest = $(target).closest('.form_item'),
				$wrap = $closest.find('.layer_select_wrap');
			if(isInp){
				var $span = $(target).find('span');
				$span.each(function(){
					var $inpid= $(this).data('inpid');
					$txt= $(this).text();
					$('#'+$inpid).val($txt).keyup();
				});
			}
			$wrap.attr('aria-hidden',true).find('.layer_select').stop(true,false).slideUp(300);
			$closest.find('.layer_select_open').removeClass('on').focus();
		};

		$(document).on('click','.layer_select_open',function(e){
			e.preventDefault();
			var $closest = $(this).closest('.form_item'),
				$wrap = $closest.find('.layer_select_wrap');
			if($(this).hasClass('on')){
				$(this).removeClass('on');
				$wrap.attr('aria-hidden',true).find('.layer_select').stop(true,false).slideUp(300);
			}else{
				$(this).addClass('on');
				$wrap.attr('aria-hidden',false).find('.layer_select').stop(true,false).slideDown(300,function(){
					$(this).find('.option').first().focus();
				});
				//Layer.focusMove($wrap.find('.layer_select_wrap'));
			}
		});
		$(document).on('click','.layer_select_wrap .option',function(e){
			e.preventDefault();
			layerSelectClose(this,true);
		});
		$(document).on('focusout','.layer_select_wrap li:last-child .option',function(e){
			e.preventDefault();
			layerSelectClose(this);
		});
	},
	open:function(tar,callback){
		if(!$(tar).length || !$(tar).children('.pop_wrap').length) return console.log('해당팝업없음');
		var $idx = $(tar).index('.popup'),
			$show = $('.Layer.show').length,
			$id = $(tar).attr('id'),
			$lastCloseBtn = '<a href="#" class="pop_close last_focus ui-pop-close" role="button"><span class="blind">팝업창 닫기</span></a>';
		if($show > 0)$(tar).css('z-index','+='+$show);
		if($id == undefined){
			$id = Layer.id+$idx;
			$(tar).attr('id',$id);
		}

		//fixed버튼 있을때 빈공간삽입
		if($(tar).find('.pop_cont').next('.btn_wrap.bottom_fixed').length){
			$(tar).find('.pop_cont').addClass('after_btn');
		}

		//포커스
		var $focusEl = '';
		try{
			if(event.currentTarget != document){
				$focusEl = $(event.currentTarget);
			}else{
				$focusEl = $(document.activeElement);
			}
		}catch(error){
			$focusEl = $(document.activeElement);
		}
		$(tar).data('returnFocus',$focusEl);
		$focusEl.addClass(Layer.focusClass);
		if($focusEl.closest('.popup').length){
			var $lastPop = $focusEl.closest('.popup'),
				$lastPopId = $lastPop.attr('id');
			$(tar).data('lastpop',$lastPopId);
			$lastPop.attr('aria-hidden',true);
		}

		var $openDelay = 10;
		if($(tar).data('ishtml') != true && isMobile.iOS())$openDelay = 300;
		setTimeout(function(){
			//리턴 포커스
			if(isMobile.iOS()){
				var $focusEl2 = $(document.activeElement);
				if(!$focusEl2.hasClass(Layer.focusClass)){
					$focusEl.removeClass(Layer.focusClass);
					$(tar).data('returnFocus',$focusEl2);
					$focusEl2.addClass(Layer.focusClass);
				}
			}

			if($(tar).hasClass(Layer.alertClass) && !isMobile.any()){
				$(tar).find('.pop_btn .button').last().focus();
			}else{
				$(tar).attr({'tabindex':0}).focus();
			}

			//웹접근성
			$(Layer.etcCont).attr('aria-hidden','true');
			$(tar).attr('aria-hidden','false');
			var $tit = $(tar).find('.'+Layer.headClass+' h2');
			if($tit.length && $(tar).attr('aria-labelledby') == undefined){
				if($tit.attr('id') == undefined){
					$tit.attr('id',$id+'Label');
					$(tar).attr('aria-labelledby', $id+'Label');
				}else{
					$(tar).attr('aria-labelledby', $tit.attr('id'));
				}
			}

			//열기
			if(!$('html').hasClass('lock'))Body.lock();
			$(tar).addClass('show');
			$(tar).find('.'+Layer.contClass).scrollTop(0);


			Layer.focusMove(tar);
			Layer.position(tar);
			if(!!callback){
				callback();
			}
			$(window).resize();
		}, $openDelay);
		//모바일 접근성보완: 모바일일때 마지막에 닫기 버튼 추가
		if(isMobile.any() && !$(tar).find('.pop_close.last_focus').length && $(tar).find('.pop_close').length)$(tar).children('.pop_wrap').append($lastCloseBtn);
	},
	close:function(tar,callback){
		if(!$(tar).hasClass('show')) return console.log('해당팝업 안열려있음');
		var $closeDelay = 700,
			$visible = $('.popup.show').length,
			$id = $(tar).attr('id'),
			$lastPopId = $(tar).data('lastpop');
		if($visible == 1){
			Body.unlock();
			$(Layer.etcCont).removeAttr('aria-hidden');
		}
		if($lastPopId != undefined){
			$('#'+$lastPopId).attr('aria-hidden',false);
		}

		//포커스
		var $returnFocus = $(tar).data('returnFocus');
		$returnFocus.removeClass(Layer.focusClass).focus();

		//닫기
		$(tar).removeClass('show');
		$(tar).attr('aria-hidden','true').removeAttr('style tabindex');

		$(tar).find('.'+Layer.headClass).removeAttr('style').removeClass('shadow');
		$(tar).find('.'+Layer.contClass).removeAttr('tabindex style');
		if($(tar).find('.pop_close.last_focus').length)$(tar).find('.pop_close.last_focus').remove();

		//알럿창
		if($(tar).hasClass(Layer.alertClass)){
			setTimeout(function(){
				var $content = $(tar).find('.pop_text>div').html();
				$(tar).remove();
				Layer.beforeCont.splice(Layer.beforeCont.indexOf($content),1);
			},$closeDelay);
		}

		//select팝업
		if($(tar).hasClass(Layer.selectClass)){
			Layer.isSelectOpen = false;
			setTimeout(function(){
				$(tar).remove();
			},$closeDelay);
		}

		//callback
		if(!!callback){
			setTimeout(function(){
				callback();
			},$closeDelay);
		}
	},
	position:function(tar){
		var isWinPop = false;
		if($(tar).hasClass('win'))isWinPop = true;	//win클래스로 윈도우팝업인지 체크
		if(!$(tar).hasClass('show') && isWinPop == false)return false;
		if($(tar).data('popPosition') == true)return false;
		$(tar).data('popPosition',true);
		var $head = $(tar).find('.'+Layer.headClass),
			$tit = $head.find('h1'),
			$content = $(tar).find('.'+Layer.contClass);
		
		$(window).resize(function(){
			$head.removeAttr('style').removeClass('shadow');
			$content.removeAttr('tabindex style');

			//타이틀이 두줄 이상이 될때
			var $headH = $head.outerHeight(),
				$titH = $tit.outerHeight();
			if(30 < $titH && $headH < $titH && !$head.hasClass('blind')){
				$head.css('height',$titH);
				var $padTop = parseInt($content.css('padding-top'));
				$content.css('padding-top',$titH+($padTop-$headH));
			}
			
			if(!isWinPop){	//레이어팝업
				//컨텐츠 스크롤이 필요할때
				var $height = $(tar).height(),
					$popHeight = $(tar).find('.pop_wrap').outerHeight();
				if(!$(tar).hasClass('full'))$content.css('max-height',$height);

				//팝업 헤더 shadow
				addShadow($content);
			}else{ //윈도우팝업
				addShadow(window);
			}
		});

		//shadow 넣기
		var addShadow = function(el){
			var $contScrollTop = $(el).scrollTop();
			if($contScrollTop > 50){
				$head.addClass('shadow');
			}else{
				$head.removeClass('shadow');
			}
		};

		//팝업 헤더 shadow
		if(!isWinPop){	//레이어팝업
			$content.scroll(function(){
				addShadow(this);
			});
		}else{ //윈도우팝업
			$(window).scroll(function(){
				addShadow(this);
			});
		}
	},
	focusMove:function(tar){
		if(!$(tar).hasClass('show'))return false;
		if($(tar).data('focusMove') == true)return false;
		$(tar).data('focusMove',true);
		var $tar = $(tar),
			$focusaEl = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"])',
			$focusaEls = $tar.find($focusaEl),
			$isFirstBackTab = false;

		$focusaEls.on('keydown',function(e){
			var $keyCode = (e.keyCode?e.keyCode:e.which),
				$focusable = $tar.find(':focusable').not('.last_focus'),
				$focusLength = $focusable.length,
				$firstFocus = $focusable.first(),
				$lastFocus = $focusable.last(),
				$index = $focusable.index(this);

			$isFirstBackTab = false;
			if($index == ($focusLength-1)){ //last
				if ($keyCode == 9){
					if(!e.shiftKey){
						$firstFocus.focus();
						e.preventDefault();
					}
				}
			}else if($index == 0){	//first
				if($keyCode == 9){
					if(e.shiftKey){
						$isFirstBackTab = true;
						$lastFocus.focus();
						e.preventDefault();
					}
				}
			}
		});

		$tar.on('keydown',function(e){
			var $keyCode = (e.keyCode?e.keyCode:e.which),
				$focusable = $tar.find(':focusable').not('.last_focus'),
				$lastFocus = $focusable.last();

			if(e.target == this && $keyCode == 9){
				if(e.shiftKey){
					$lastFocus.focus();
					e.preventDefault();
				}
			}
		});

		$(document).on('focusin',$tar.selector+' .last_focus',function(e){
			var $focusable = $tar.find(':focusable').not('.last_focus'),
				$firstFocus = $focusable.first(),
				$lastFocus = $focusable.last();
			if($isFirstBackTab){
				$lastFocus.focus();
			}else{
				$firstFocus.focus();
			}
		});
	},
	init:function(){
		$('.popup').attr({
			'aria-hidden':'true',
			'data-ishtml':'true',
		});
		$('#container .popup').each(function(){
			$('#container').after(this);
		});

		//열기
		$(document).on('click','.ui-pop-open',function(e){
			e.preventDefault();
			var $pop = $(this).attr('href'),
				$currentTarget = $(e.currentTarget);
			Layer.open($pop,function(){
				$($pop).data('returnFocus',$currentTarget);
			});
		});

		//닫기
		$(document).on('click', '.ui-pop-close',function(e){
			e.preventDefault();
			if($(this).closest('.pop_wrap').hasClass('win')){
				//윈도우팝업
				if(window.history.length == 1){
					window.close();
				}else{
					history.back();
				}
			}else{
				//레이어팝업
				var $pop = $(this).attr('href');
				if ($pop == '#' || $pop == '#none' || $pop == undefined)$pop = $(this).closest('.popup');
				Layer.close($pop);
			}
		});

		Layer.keyEvt();
		Layer.selectUI();
	}
};

//버튼 관련
var $tabNavis = [];
var buttonUI ={
	winLoad: function(){
		//링크없는 a태그 role=button 추가
		$('a').each(function(e){
			var $href = $(this).attr('href'),
				$role = $(this).attr('role');
			if(!$(this).hasClass('no_button')){
				if($href == undefined){
					$(this).attr({'href':'#'});
					if($role == undefined)$(this).attr('role','button');
				}else{
					if($href == '#' && $role == undefined)$(this).attr('role','button');
				}
			}
		});

		//type없는 button들 type 추가
		$('button').each(function(e){
			var $type = $(this).attr('type');
			if($type == undefined)$(this).attr('type','button');
		});
	},
	effect: function(){
		//버튼 클릭 효과
		var btnInEfList = 'a.button, button.button';
		$(document).on('click', btnInEfList,function(e){
			e.preventDefault();
			var $btnEl = $(this),
				$delay = 650;

			if(!$btnEl.is('.disabled')){
				if(!$btnEl.find('.btn_click_in').length)$btnEl.append('<i class="btn_click_in"></i>');
				var $btnIn = $btnEl.find('.btn_click_in'),
					$btnMax = Math.max($btnEl.outerWidth(), $btnEl.outerHeight()),
					$btnX = e.pageX - $btnEl.offset().left - $btnMax/2,
					$btnY = e.pageY - $btnEl.offset().top - $btnMax/2;
				$btnIn.css({
					'left':$btnX,
					'top':$btnY,
					'width':$btnMax,
					'height':$btnMax
				}).addClass('animate').delay($delay).queue(function(next){
					$btnIn.remove();
					next();
				});
			}
		});
	},
	tab:function(){
		var $tab = $('.ui-tab'),
			$onText = '현재선택';

		if($('html').attr('lang') == 'en')$onText = 'Activation Menu';
		var tabOnLine = function (el,wrap){
			var $el = el,
				$line = wrap.find('.tab_line'),
				$lineWdith = $el.outerWidth(),
				$lineLeft = $el.closest('li').position().left + $el.position().left;
			$line.css({
				'width':$lineWdith,
				'left':$lineLeft
			});
		};

		$(document).on('click','.ui-tab a',function(e){
			e.preventDefault();
			var $this = $(this),
				$idx = $this.closest('li').index(),
				$closest = $this.closest('.ui-tab'),
				$line = $closest.find('.tab_line'),
				$isHash = $closest.hasClass('is_hash') ? true : false,
				$isFirst = $closest.data('isFirst'),
				$href = $this.attr('href'),
				$target = $closest.data('target'),
				$winScrollTop = $(window).scrollTop();

			if($($href).length){
				if($isFirst == true){
					$closest.data('isFirst', false) ;
				}
				if($isHash == true){
					location.hash = $href;
					$(window).scrollTop($winScrollTop);
				}
				if($this.closest('.fixed').length){
					var $scrollTop = $this.closest('.fixed').offset().top;
					scrollUI.move($scrollTop);
				}

				if($target == undefined){
					$($href).addClass('active').attr('aria-expanded',true).siblings('.tab_panel').attr('aria-expanded',false).removeClass('active');
				}else{
					$($target).attr('aria-expanded',false).removeClass('active');
					$($href).addClass('active').attr('aria-expanded',true);
				}
				$this.attr('title',$onText).parent().addClass('active').siblings().removeClass('active').find('a').removeAttr('title');
				$this.attr('aria-selected',true).closest('li').siblings().find('[role=tab]').attr('aria-selected',false);
			}else{
				console.error('대상 지정 오류! href값에 해당 id값을 넣어 주세요~');
			}
			
			var $arr = $closest.children('.arr');
			if($arr.length){
				var $liLength = $closest.find('>ul>li').length,
					$liWidth = 100/$liLength,
					$arrLeft = ($liWidth*$idx)+($liWidth/2);
				$arr.css('left',$arrLeft+'%');
			}

			if($line.length){
				$(window).resize();	
			}
		});

		var $hash = location.hash;
		if($tab.length){
			$tab.each(function(e){
				$(this).find('ul').attr('role','tablist');
				var isHash =false;
				var tarAry = [];
				var isHashClk = '';
				$(this).find('li').each(function(f){
					$(this).attr('role','presentation');
					var _a = $(this).find('a'),
						_aId = _a.attr('id'),
						_href = _a.attr('href');
					if(!_aId) _aId = 'tab_btn_'+e+'_'+f;
					tarAry.push(_href);
					_a.attr({
						'id' :_aId,
						'role' :'tab',
						'aria-controls': _href.substring(1),
						'aria-selected':'false'
					});
					$(_href).attr({
						'role':'tabpanel',
						'aria-labelledby':_aId,
						'aria-expanded':'false'
					});
					if(_href == $hash || $(_href).find($hash).length){
						isHash = true;
						isHashClk = _a;
					}
				});
				$(this).data('target',tarAry.join(','));
				if(isHash == false){
					$(this).data('isFirst',true);
					$(this).find('li').eq(0).find('a').trigger('click');
				}
				if(isHash == true){
					isHashClk.trigger('click');
				}
			});
		}
		$(window).resize(function(){
			var $tabLine = $('.tab_line');
			if($tabLine.length){
				$tabLine.each(function(e){
					var $closest = $(this).parent(),
						$active = $closest.find('.active').find('a');
					tabOnLine($active,$closest);
				});
			}
		});
		if($('.tabmenu').length){
			$('.tabmenu').each(function(){
				if($(this).not('.ui-tab').length && $(this).closest('.tab_wrap').length){
					$(this).find('.active > a').attr('title',$onText);
				}
			});
		}

		//radio tab
		$(document).on('change','.ui-tab-rdo input',function(e){
			var $show = $(this).data('show'),
				$hide = $(this).closest('.ui-tab-rdo').data('hide');

			$($hide).removeClass('active');
			$($show).addClass('active');
		});
		if($('.ui-tab-rdo').length){
			$('.ui-tab-rdo').each(function(){
				var tarAry = [];
				$(this).find('input[type=radio]').each(function(){
					var $tar = $(this).data('show');
					if(tarAry.indexOf($tar) < 0 && !!$tar)tarAry.push($tar);
					if($(this).is(':checked')){
						$($tar).addClass('active');
					}
				});
				$(this).data('hide',tarAry.join(','));
			});
		}
	},
	tabNavi:function(){
		$('.tab_wrap .tabmenu').each(function(i){
			if($(this).hasClass('swiper-container-initialized')){
				return false;
			}else{
				$(this).find('ul').addClass('swiper-wrapper');
				$(this).find('li').addClass('swiper-slide');
			}
			var $navi = $(this),
				$widthSum = 0,
				$class = 'ui-tabnavi-'+i;

			$navi.find('.swiper-slide').each(function(){
				$widthSum = $widthSum + $(this).outerWidth();
			});
			$navi.addClass($class);
			var $tabNavi = new Swiper('.'+$class,{
				slidesPerView: 'auto',
				resizeReInit:true,
				on: {
					touchMove:function(){
						if($isCenter == true){
							$tabNavi.params.centeredSlides = false;
							$tabNavi.update();
						}
					}
				}
			});

			//$navi.data('navis','$tabNavis['+i+']');
			$tabNavis.push($tabNavi);

			var $isCenter = false;
			var activeMove = function(idx,speed){
				var $windowCenter = $(window).width()/2,
					$activeTab = $navi.find('.swiper-slide').eq(idx),
					$tabLeft = $activeTab.position().left,
					$tabWidth = $activeTab.outerWidth(),
					$tabCenter = $tabLeft + ($tabWidth/2);
				if(speed == undefined)speed=300;
				if($windowCenter < $tabCenter && $tabCenter < ($widthSum-$windowCenter)){
					$isCenter = true;
					$tabNavis[i].params.centeredSlides = true;
					$tabNavis[i].update();
				}else{
					$isCenter = false;
					$tabNavis[i].params.centeredSlides = false;
					$tabNavis[i].update();
				}
				if($windowCenter < $tabCenter){
					$tabNavis[i].slideTo(idx,speed);
				}else{
					$tabNavis[i].slideTo(0,speed);
				}
				$activeTab.find('a').attr('title','현재선택');
				$activeTab.siblings().find('a').removeAttr('title');
			};

			var $activeCheckNum = 0;
			var $activeCheck = setInterval(function(e){
				$activeCheckNum++;
				var $active = $navi.find('.swiper-slide.active'),
					$activeIdx = $active.index();
				if($activeIdx >= 0){
					activeMove($activeIdx,0);
					clearInterval($activeCheck);
				}
				if($activeCheckNum >= 20)clearInterval($activeCheck);
			},100);

			$(window).resize(function(){
				var $parenW = $navi.parent().width();
				if($parenW > $widthSum){
					$navi.find('.swiper-wrapper').addClass('center');
					$tabNavis[i].params.followFinger = false;
					$tabNavis[i].update();
				}else{
					$navi.find('.swiper-wrapper').removeClass('center');
					$tabNavis[i].params.followFinger = true;
					$tabNavis[i].update();
				}
			});

			$navi.on('click','a',function(e){
				var $jstab = $(this).closest('.ui-tab');
				if($jstab.length){
					e.preventDefault();
					var $liIdx = Math.max($(this).closest('li').index());
					activeMove($liIdx);
				}
			});
		});
	},
	init: function(){
		buttonUI.effect();
		buttonUI.tab();
	}
};

//툴팁
var tooltip = {
	position:function(tar){
		var $tar = $(tar),
			$btn = $tar.closest('.tooltip_wrap').find('.tooltip_btn');
		if(!$tar.children('.arr').length)$tar.prepend('<i class="arr" aria-hidden="true"></i>');
		if(!$tar.children('.tooltip_close').length)$tar.append('<a href="#" class="tooltip_close" role="button"><span class="blind">툴팁닫기</span></a>');
		$(window).resize(function(){
			var $btnX	= $btn.offset().left,
				$btnW	= $btn.width(),
				$winW	= $(window).width(),
				$scrollEnd	= $(window).height()+$(window).scrollTop();
			if($('.btn_wrap.bottom_fixed:visible').not('.pop_btn').length)$scrollEnd = $scrollEnd-60;
			$tar.children('.arr').css({
				'left': $btnX-20+($btnW/2)
			});
			$tar.css({
				'width': $winW-40,
				'left': -($btnX-20),
			});
			var $tarH = $tar.outerHeight(),
				$tarY = $tar.closest('.tooltip_wrap').offset().top + parseInt($tar.css('margin-top'));
			if($scrollEnd < ($tarH+$tarY)){
				$tar.addClass('bottom');
			}else{
				$tar.removeClass('bottom');
			}
		});
	},
	init:function(){
		//열기
		$(document).on('click','.tooltip_btn',function(e){
			e.preventDefault();
			var $cont = $(this).closest('.tooltip_wrap').find('.tooltip_cont');
			$('.tooltip_cont').fadeOut();
			tooltip.position($cont);
			$(window).resize();
			$cont.stop(true,false).fadeIn();
		});
		//닫기
		$(document).on('click','.tooltip_close',function(e){
			e.preventDefault();
			var $cont = $(this).closest('.tooltip_cont');
			$cont.stop(true,false).fadeOut();
		});
		$(document).on('click touchend',function(e){
			$('.tooltip_cont').stop(true,false).fadeOut();
		}).on('click','.tooltip_wrap',function(e){
			e.stopPropagation();
		});

		$('.tooltip_wrap').each(function(e){
			var $btn = $(this).find('.tooltip_btn'),
				$cont = $(this).find('.tooltip_cont'),
				$contId = $cont.attr('id'),
				$closeBtn = $(this).find('.tooltip_close');
			if(!$contId)$contId = 'tt_cont_'+e;
			$btn.attr({
				'role':'button',
				'aria-describedby':$contId
			});
			$cont.attr({
				'id':$contId,
				'role':'tooltip'
			});
			$closeBtn.attr('role','button');
		});
	}
};

//스크롤 관련
var scrollUI = {
	inCheck:function(target){
		//스크린안에 있는지 확인
		var $window = $(window),
			$wHeight = $window.height(),
			$scrollTop = $window.scrollTop(),
			$winBottom = ($scrollTop + $wHeight),
			$el = $(target),
			$elHeight = $($el).outerHeight(),
			$elTop = $($el).offset().top,
			$elCenter = $elTop + ($elHeight/2),
			$elBottom = $elTop + $elHeight;

		if(($elCenter >= $scrollTop) && ($elCenter <= $winBottom)){
			return true;
		}else{
			return false;
		}
	},
	move: function(val,speed){
		var $top = 0;
		if(speed == undefined)speed = 300;
		if($.isNumeric(val)){
			$top = val;
		}else{
			if($(val).length)$top = $(val).offset().top;
		}
		$('html,body').stop(true,false).animate({'scrollTop':$top},speed);
	},
	center: function(el, speed, direction){
		var $parent = $(el).parent();
		if(speed == undefined)speed = 200;
		if(!!direction && direction == 'vertical'){
			var $prtH = $parent.height(),
				$prtSclH = $parent.get(0).scrollHeight,
				$thisT = $(el).position().top,
				$thisH = $(el).outerHeight(),
				//$sclT = ($prtH-$thisT) + ($thisH/2);
				$sclT = $thisT - ($prtH/2) + ($thisH/2);
			if($prtH < $prtSclH)$parent.animate({'scrollTop':'+='+$sclT},speed);
		}else{
			var $prtW = $parent.outerWidth(),
				$prtSclW = $parent.get(0).scrollWidth,
				$thisL = $(el).position().left,
				$thisW = $(el).outerWidth(),
				$sclL = $thisL - ($prtW/2) + ($thisW/2);

			if($prtW < $prtSclW)$parent.animate({'scrollLeft':'+='+$sclL},speed);
		}
	}
};

//폼요소 관련
var formUI = {
	winLoad:function(){
		//select off효과
		$('select').each(function(){
			var $val = $(this).val();
			if($val == '' || $val == null){
				$(this).addClass('off');
			}
		});
		$(document).on('change','select',function(){
			var $val = $(this).val();
			if($val == ''){
				$(this).addClass('off');
			}else{
				$(this).removeClass('off');
			}
		});

		//페이지 로딩 후 검색박스에 입력값이 있으면 X 버튼 추가
		$('.search_box .input input').each(function(){
			if($(this).val() != '')$(this).after('<a href="#" class="inp_del" role="button">입력내용삭제</a>');
		});

		//이메일 입력영역
		$('.email_form').each(function(){
			var $this = $(this),
				$inp = $this.find('.email_inp .input input'),
				$inpVal = $inp.val(),
				$sel = $this.find('.email_sel .select select'),
				$selVal = $sel.val();
			if($inpVal != '' && ($selVal == '' || $selVal == 'etc')){
				$this.emailForm();
				$inp.after('<a href="#" class="inp_del" role="button">입력내용삭제</a>');
			}
		});

		//입력 텍스트 카운팅(로딩)
		$('[data-text-count]').each(function(e){
			formUI.textCount(this);
		});
	},
	focus:function(){
		var $inpEls= 'input:not(:checkbox):not(:radio):not(:hidden),select, textarea, .btn_select';
		$(document).on('focusin',$inpEls,function(e){
			var $this = $(this);
			$('html').addClass('inpFocus');
			if($this.closest('.form_item').length)$this.closest('.form_item').addClass('focus');
			if($this.is('input') && $this.closest('.input').length)$this.closest('.input').addClass('focus');
			if($this.is('select') && $this.closest('.select').length)$this.closest('.select').addClass('focus');
			if($this.hasClass('btn_select') && $this.closest('.select').length)$this.closest('.select').addClass('focus');
			if($this.is('textarea') && $this.closest('.textarea').length)$this.closest('.textarea').addClass('focus');
		});
		$(document).on('focusout',$inpEls,function(e){
			var $this = $(this);
			$('html').removeClass('inpFocus');
			if($this.closest('.form_item').length)$this.closest('.form_item').removeClass('focus');
			if($this.is('input') && $this.closest('.input').length)$this.closest('.input').removeClass('focus');
			if($this.is('select') && $this.closest('.select').length)$this.closest('.select').removeClass('focus');
			if($this.hasClass('btn_select') && $this.closest('.select').length)$this.closest('.select').removeClass('focus');
			if($this.is('textarea') && $this.closest('.textarea').length)$this.closest('.textarea').removeClass('focus');
		});
	},
	select:function(){
		var $select = $('.select');
		if($select.length){
			$select.each(function(){
				var $this = $(this),
					$sel = $this.find('select'),
					$selId = $sel.attr('id'),
					$title = $sel.attr('title');
				if($title == undefined)$title = '선택';
				var $btnTitle = '팝업으로 '+$title,
					$btnHtml = '<a href="#'+$selId+'" class="btn_select ui-select-open" title="'+$btnTitle+'"><span class="val"></span></a>';

				if(!$this.find('.btn_select').length){
					$sel.hide();
					$this.append($btnHtml);
					var $forLbl = $('label[for="'+$selId+'"]');
					if($forLbl.length){
						$forLbl.addClass('ui-select-lbl').attr('title',$btnTitle);
					}

					$sel.change(function(){
						var $val = $(this).val(),
							$selectTxt = $(this).find(':selected').text();
						if(($title == '카드선택' || $title == '카드 선택') && $selectTxt.length > 20){
							$selectTxt = $selectTxt.substring(20,$selectTxt.lastIndexOf('(')) +'<span class="sub">'+ $selectTxt.substring(0,19) +'</span>';
						}
						$this.find('.btn_select .val').html($selectTxt);
						if($val == ''){
							$this.find('.btn_select').addClass('off');
						}else{
							$this.find('.btn_select').removeClass('off');
						}
					});
					$sel.change();
				}
			});
		}
	},
	input:function(){
		//input[type=number][maxlength] 되게 처리..(하지만 디바이스 탐): number type을 안쓰는게 좋음
		$(document).on('change keyup input','input[type=number][maxlength]',function(e){
			var $this = $(this),
				$val = $this.val(),
				$max = $this.attr('maxlength'),
				$length = $val.length,
				$dataVal = $this.data('val');
			if($dataVal == undefined)$dataVal ='';
			if($length > $max){
				$this.val($dataVal);
			}else{
				$this.data('val',$val);
			}
		});

		//form 안에 input이 1개일때 엔터시 새로고침 현상방지
		$(document).on('keydown','form input',function(e){
			var $keyCode = (e.keyCode?e.keyCode:e.which),
				$form = $(this).closest('form'),
				$length = $form.find('input').not('[type=checkbox],[type=radio]').length;

			if($length == 1 && !$(this).closest('.search_box').length){ //.search_box 검색창은 예외
				if($keyCode==13)return false;
			}
		});

		//input[type=date]
		$(document).on('change','.input input.date+input[type=date]',function(){
			var $val = $(this).val();
			if($val.indexOf('-') < 0){
				$val = new Date($val).toISOString().split('T')[0];
			}
			$val = $val.split('-').join('.');
			$(this).prev('input.date').val($val).change().focus();
		});

		//password
		$(document).on('keyup','.password input',function(){
			var $val = $(this).val(),
				$closest = $(this).closest('.password'),
				$dot = $closest.find('.dot span');
			$dot.slice(0,$val.length).addClass('on');
			$dot.slice($val.length).removeClass('on');
		});
		
	},
	delBtn:function(){
		//input 삭제버튼
		$(document).on('keyup focus','.input input, .textarea textarea',function(){
			var $this = $(this), $val = $this.val();
			if($this.prop('readonly') || $this.prop('disabled') || $this.hasClass('no_del') || $this.hasClass('datepicker') || $this.hasClass('time')){
				return false;
			}
			if($val != ''){
				if(!$this.next('.inp_del').length && !$this.next('.datepicker').length){
					$this.after('<a href="#" class="inp_del" role="button">입력내용삭제</a>');
				}
			}else{{}
				if($this.next('.inp_del').length){
					setTimeout(function(){
						$this.next('.inp_del').remove();
					},10);
				}
			}
		});
		$(document).on('click','.inp_del',function(){
			var $inp = $(this).prev();
			$inp.val('').change().focus();
		});
	},
	search:function(){
		//검색
		var $totalWrap = '.total_search',
			$searchWrap = '.search_wrap',
			$contClass = '.search_cont',
			$inpClass = '.search_box .input input',
			$closeClass = '.btn_search_close';

		var listShow = function(target){
			var $val = $(target).val(),
				$closest = $(target).closest($searchWrap),
				$target = '';
			if($val == ''){
				$target = $closest.find($contClass+'.recent');
			}else{
				$target = $closest.find($contClass+'.auto');
			}

			if($target != ''){
				$($contClass).removeAttr('style');
				$target.show();
			}
		};

		$($searchWrap).find($closeClass).on('click',function(e){
			$($contClass).removeAttr('style');
			$(this).closest($searchWrap).find('.btn_search').focus();
		});
		$($searchWrap).find($inpClass).on('keyup focus click',function(e){
			listShow(this);
		});

		$($totalWrap).on('touchmove',function(e){
			$($totalWrap).find($inpClass).blur();
		}).on('touchmove','.search_box',function(e){
			e.stopPropagation();
		});

		$(document).on('click',function(e){
			$($contClass).removeAttr('style');
		}).on('click',$searchWrap,function(e){
			e.stopPropagation();
		});

		$(document).on('blur',$contClass+' :focusable',function(e){
			var $this = $(this),
				$closest = $this.closest($contClass),
				$focusable = $($contClass).find(':focusable'),
				$focusableIdx = $focusable.index(this),
				$focusLength = $focusable.length;
			if($focusableIdx == ($focusLength-1))$closest.removeAttr('style');
		});
	},
	textCount:function(element,e){
		var $el = $(element),
			$val = $el.val(),
			$max = $el.attr('maxlength'),
			$length = $val.length,
			$target = $el.data('text-count');
		if($target == true){
			$target = $el.siblings('.byte').find('strong');
		}else{
			$target = $('#'+$target);
		}

		if(!!e && e.type == 'keyup'){
			$target.text(Math.min($max,$length));
		}else{
			if($val != '')$target.text(Math.min($max,$length));
		}
	},
	agree:function(){
	//이용약관
		var $agreelist = '.chk_list',
			$agreeChk = '.checkbox>input',
			$agreeTitChk = '.chk_item>.checkbox>input',
			$toggleBtn = '.chk_link.toggle';

		//하위 약관동의
		$(document).on('change',$agreelist+' '+$agreeChk,function(){
			var $closest = $(this).closest('.checkbox'),
				$wrap = $(this).closest('.chk_child'),
				$wrapChk = $wrap.find('>'+$agreeChk).length,
				$wrapChked = $wrap.find('>'+$agreeChk+':checked').length,
				$wrapInp = $wrap.siblings('.checkbox').children('input');

			if($(this).prop('checked')){
				//체크할때
				if($closest.next('.chk_child').length){
					//1뎁스 체크박스일때
					$closest.next('.chk_child').find($agreeChk).prop('checked',true);
				}else if($wrap.length){
					//2뎁스 체크박스일때
					if($wrapChk == $wrapChked){
						$wrapInp.prop('checked',true);
					}
				}
			}else{
				//해제할때
				if($closest.next('.chk_child').length){
					//1뎁스 체크박스일때
					$closest.next('.chk_child').find($agreeChk).prop('checked',false);
				}else if($wrap.length){
					//2뎁스 체크박스일때
					$wrapInp.prop('checked',false);
				}
			}
		});

		//전체동의
		$(document).on('change',$agreelist+' '+$agreeTitChk,function(){
			var $closest = $(this).closest('.chk_item'),
				$list = $closest.next('.chk_child'),
				$toggleBtn = $(this).siblings('.chk_link.toggle');
			if(!$closest.next('.chk_child').length){
				$list = $closest.siblings('.chk_child');
			}
			if($(this).prop('checked')){
				$list.find('>'+$agreeChk).prop('checked',true);
				if($toggleBtn.length && $toggleBtn.hasClass('open'))$toggleBtn.click();
			}else{
				$list.find('>'+$agreeChk).prop('checked',false);
				if($toggleBtn.length && !$toggleBtn.hasClass('open'))$toggleBtn.click();
			}
		});

		//토글버튼
		$(document).on('click',$agreelist+' '+$toggleBtn,function(e){
			e.preventDefault();
			var $this = $(this),
				$closest = $this.closest('.chk_item'),
				$child = $closest.find('.chk_child');
			if($this.hasClass('open')){
				$this.removeClass('open');
				$child.stop(true,false).slideUp(200);
			}else{
				$this.addClass('open');
				$child.stop(true,false).slideDown(200,function(){
					accordion.scroll($this,this);
				});
			}
		});
	},
	etc:function(){
		//계좌,카드 직접입력
		$(document).on('click','.form_item .bank_wrap .btn_inp_change',function(){
			var $closest = $(this).closest('.bank_wrap'),
				$lbl = $closest.closest('.form_item').children('label'),
				$selectId = $closest.siblings('.bank_wrap').find('select').attr('id');

			$closest.hide().siblings('.bank_wrap').show().find(':focusable').first().focus();
			if($lbl.length)$lbl.attr('for',$selectId);
		});
		$(document).on('change','.form_item .bank_wrap .select select',function(){
			var $val = $(this).val(),
				$closest = $(this).closest('.bank_wrap'),
				$lbl = $closest.closest('.form_item').children('label'),
				$selectId = $closest.siblings('.bank_wrap').find('select').attr('id');
			if($val == 'manual'){
				$closest.hide().siblings('.bank_wrap').show().find(':focusable').first().focus();
				$(this).val('').change();
				if($lbl.length)$lbl.attr('for',$selectId);
			}
		});

		//이메일 직접입력
		$(document).on('change', '.email_form .email_sel select', function(){
			var $closest = $(this).closest('.email_form'),
				$inp = $closest.find('.email_inp .input input');
			if($(this).find(':selected').text() == '직접입력'){
				$closest.emailForm();
				$inp.val('').focus();
			}else{
				$closest.emailForm(false);
			}
		});
		$(document).on('click', '.email_form .email_inp .btn_sel', function(){
			var $closest = $(this).closest('.email_form'),
				$emlSel = $closest.find('.email_sel select');
			$closest.emailForm(false);
			$emlSel.find('option').eq(0).prop('selected',true);
			//$emlSel.change().focus();
			$emlSel.next('.ui-select-open').focus().click();
		});
		$(document).on('keyup', '.email_form .email_inp .input input', function(e){
			var $keyCode = (e.keyCode?e.keyCode:e.which),
				$closest = $(this).closest('.email_form'),
				$emlSel = $closest.find('.email_sel select'),
				$val = $(this).val();
			if($keyCode == 38 || ($keyCode == 37 && $val == '')){
				$emlSel.find(':selected').prev().prop('selected',true);
				$closest.emailForm(false);
			}
		});

		//버튼 스위치
		var $swichBtn = $('.btn_switch input');
		$swichBtn.each(function(){
			var $lbl = $(this).next('.lbl'),
				$lblTxt = $lbl.text();
			if($(this).prop('checked')){
				$lblTxt = $lblTxt.replace('해제','등록');
				$lbl.find('.blind').text($lblTxt);
			}
			/*else{
				$lblTxt = $lblTxt.replace('등록','해제');
				$lbl.find('.blind').text($lblTxt);
			}*/
		});
		$swichBtn.on('change',function(){
			var $lbl = $(this).next('.lbl'),
				$lblTxt = $lbl.text();
			if($(this).prop('checked')){
				$lblTxt = $lblTxt.replace('해제','등록');
				$lbl.find('.blind').text($lblTxt);
			}else{
				$lblTxt = $lblTxt.replace('등록','해제');
				$lbl.find('.blind').text($lblTxt);
			}
		});

		//알뜰폰
		$(document).on('change','.btn_toggle .in_sel .select select',function(){
			var $val = $(this).val(),
				$li = $(this).closest('li'),
				$input = $li.find('>input');
			if($val != ''){
				//$li.siblings().find('>input').prop('checked',false);
				$input.prop('checked',true);
			}
		});
		$(document).on('click','.btn_toggle .in_sel>input,.btn_toggle .in_sel>label',function(){
			var $li = $(this).closest('li');
			$li.find('.ui-select-open').click();
		});
	},
	jqRange:function(){
		if($('.range_slider').length){
			$('.range_slider').each(function(){
				var $slider = $(this).find('.slider'),
					$list = $(this).find('.list'),
					$inp = $(this).find('input[type=hidden]'),
					$unit = $list.data('unit'),
					$title= $list.attr('title'),
					//$sel = $(this).find('.i_val'),
					$min = parseInt($slider.data('min')),
					$max = parseInt($slider.data('max')),
					$val = parseInt($slider.data('value')),
					$step = parseInt($slider.data('step'));

				if(!$min)$min = 0;
				if(!$max)$max = 5;
				if(!$step)$step = 1;
				if(!$val)$val = $min;

				if($list.length){
					$list.empty();
					if(!!$title)$list.removeAttr('title').append('<strong class="blind">'+$title+'</strong>');
					$list.append('<ul></ul>');
					for(var i = $min;i <= ($max/$step);i++){
						$list.find('ul').append('<li><a href="#" role="button">'+i*$step+'<span class="blind">'+$unit+'</span></a></li>');
						//$sel.append('<option value="'+i*$step+'">'+i*$step+'</option>');
					}
				}

				if($inp.length)$inp.val($val);
				var range = $slider.slider({
					min:$min,
					max:$max,
					value:$val,
					step:$step,
					range:'min',
					create:function(e){
						$slider.find('.ui-slider-handle').attr({'tabindex':-1}).html('<span class="blind">선택한 값은</span><i>'+$val+'</i><span class="blind">'+$unit+'입니다.</span>');
						//$sel.val($val).change();
						$list.find('li').eq($val/$step).addClass('on').find('a').attr('title','현재선택');
					},
					stop:function(event,ui){
						$(ui.handle).find('i').html(ui.value);
						//$sel.val(ui.value).change();
						if($inp.length)$inp.val(ui.value).change();
						$slider.data('value',ui.value);
						$list.find('li').eq(ui.value/$step).siblings().removeClass('on').removeAttr('title');
						$list.find('li').eq(ui.value/$step).addClass('on').find('a').attr('title','현재선택');
					}
				});

				$list.find('a').click(function(e){
					e.preventDefault();
					var $txt = parseInt($(this).text());
					range.slider('value',$txt);
					$slider.find('.ui-slider-handle i').text($txt);
					if($inp.length)$inp.val($txt).change();
					//$sel.val($txt).change();
					$(this).parent().addClass('on').attr('title','현재선택').siblings().removeClass('on').removeAttr('title');
				});

			});
		}
	},
	jqCalendar:function(element){
	//jquery UI datepicker
		var prevYrBtn = $('<button type="button" class="ui-datepicker-prev-y" title="이전년도"><span>이전년도</span></button>');
		var nextYrBtn = $('<button type="button" class="ui-datepicker-next-y" title="다음년도"><span>다음년도</span></button>');
		var calendarOpen = function(target,ob){
			var $calendar = '#'+ob.dpDiv[0].id,
				$header = $($calendar).find('.ui-datepicker-header'),
				$min = $.datepicker._getMinMaxDate(target.data('datepicker'),'min'),
				$minY = $min.getFullYear(),
				$max = $.datepicker._getMinMaxDate(target.data('datepicker'),'max'),
				$maxY = $max.getFullYear(),
				$selectedYear = ob.selectedYear;
			$header.find('.ui-datepicker-prev').before(prevYrBtn);
			if($selectedYear <= $minY){
				$header.find('.ui-datepicker-prev-y').addClass('ui-state-disabled');
			}else{
				$header.find('.ui-datepicker-prev-y').removeClass('ui-state-disabled');
			}
			$header.find('.ui-datepicker-next').after(nextYrBtn);
			if($selectedYear >= $maxY){
				$header.find('.ui-datepicker-next-y').addClass('ui-state-disabled');
			}else{
				$header.find('.ui-datepicker-next-y').removeClass('ui-state-disabled');
			}
			prevYrBtn.unbind('click').bind('click',function(){
				if(!$(this).hasClass('ui-state-disabled'))$.datepicker._adjustDate(target,-1,'Y');
			});
			nextYrBtn.unbind('click').bind('click',function(){
				if(!$(this).hasClass('ui-state-disabled'))$.datepicker._adjustDate(target,+1,'Y');
			});
			//$header.find('.ui-datepicker-title').append('월');

			$header.find('.ui-datepicker-prev, .ui-datepicker-next').attr('href','#');
			if(!isMobile.any()){
				$($calendar).attr('tabindex',0).focus();
				Layer.focusMove($calendar);
			}
		};
		var calendarClose = function(tar,ob){
			Body.unlock();
			$(ob.input).change();
			var $cal = $('#'+ob.dpDiv[0].id);
			$cal.removeAttr('tabindex');
			$('.datepicker-dimmed').remove();
			$(tar).next('.ui-datepicker-trigger').focus();
			$(tar).prop('readonly',false);
		};

		if($(element).length){
			$(element).each(function(){
				var $this = $(this),
					$minDate = $(this).data('min'),
					$maxDate = $(this).data('max'),
					$range = $(this).data('range');
				if($minDate == undefined)$minDate = '-100y';
				if($maxDate == undefined)$maxDate = '+100y';
				if($range == undefined)$range = '-100:+100';
				$this.datepicker({
					minDate: $minDate,
					maxDate: $maxDate,
					closeText: '닫기',
					prevText: '이전달',
					nextText: '다음달',
					currentText: '오늘',
					buttonText : '기간조회',
					monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
					monthNamesShort:['01','02','03','04','05','06','07','08','09','10','11','12'],
					dayNamesMin: ['일','월','화','수','목','금','토'],
					dateFormat:'yy.mm.dd',
					yearRange:$range,
					yearSuffix: '. ',
					showMonthAfterYear: true,
					showButtonPanel: true,
					showOn:'button',
					changeMonth: true,
					changeYear: true,
					showOtherMonths: true,
					selectOtherMonths: true,
					beforeShow: function(el,ob){
						//열때
						Body.lock();
						$('body').append('<div class="datepicker-dimmed"></div>');
						$(this).prop('readonly',true);
						setTimeout(function(){
							calendarOpen($this,ob);
						},5);
					},
					onChangeMonthYear: function(y,m,ob){
						//달력 바뀔때
						setTimeout(function(){
							calendarOpen($this,ob);
						},5);
					},
					onSelect: function(d,ob){
						//선택할때
						calendarClose(this,ob);

						//기간 선택
						var $closest = $(this).closest('.date_wrap');
						if($closest.length && $closest.find(element).length == 2){
							var $idx = $closest.find(element).index(this),
								$first = $closest.find(element).eq(0),
								$last = $closest.find(element).eq(1);
							if($idx == 1){
								$first.datepicker('option','maxDate',d);
							}else{
								$last.datepicker('option','minDate',d);
							}
						}
					},
					onClose: function(d,ob){
						//닫을때
						calendarClose(this,ob);
					}
				});

				//달력버튼 카드리더기에서 안읽히게
				$(this).siblings('.ui-datepicker-trigger').attr({
					'aria-hidden':true,
					'tabindex':-1
				});

				$(document).on('touchend','.datepicker-dimmed',function(){
					$('.hasDatepicker').datepicker('hide');
				});
			});

			$(element).focusin(function(){
				if($(this).hasClass('ui-date')){
					var $val = $(this).val();
					$(this).val(onlyNumber($val));
				}
			});
			$(element).focusout(function(){
				if($(this).hasClass('ui-date')){
					var $val = $(this).val();
					$(this).val(autoDateFormet($val,'.'));
				}
			});
		}
	},
	init:function(){
		formUI.focus();
		formUI.select();
		formUI.input();
		formUI.delBtn();
		formUI.search();
		formUI.agree();
		formUI.etc();

		formUI.jqRange();
		formUI.jqCalendar('.datepicker');
		sclCalendar.init('.s_datepicker');

		//입력 텍스트 카운팅(입력)
		$(document).on('keyup','[data-text-count]',function(e){
			formUI.textCount(this,e);
		});
	}
};
$.fn.emailForm = function(val){
	var $this = $(this);
	if(val == false){
		$this.find('.email_inp').hide();
		$this.find('.email_sel').show();
	}else{
		$this.find('.email_sel').hide();
		$this.find('.email_inp').show();
	}
};
//스크롤달력
var sclCalendar = {
	dateMark:'.',
	timeMark:':',
	dateHtml:function(type,start,end,val,step){
		if(!step)step=1;
		var $nuit = '',$Html = '';
		if(type == 'Y'){
			$nuit = '년';
		}else if(type == 'M'){
			$nuit = '월';
		}else if(type == 'D'){
			$nuit = '일';
		}else if(type == 'h'){
			$nuit = '시';
		}else if(type == 'm'){
			$nuit = '분';
		}
		for(var i=start; i<=(end/step); i++){
			var _i = i*step;
			$Html += '<button type="button" class="scl_cal_item'+(_i==val?' active" title="현재선택':'')+'"><span class="val">'+(_i<10?'0'+_i:_i)+'</span><span class="blind">'+$nuit+' 선택</span></button>';
		}
		return $Html;
	},
	getMonthlyDay:function(year,month){
		var $day = 31;
		if(month == 4 || month == 6	|| month == 9 || month == 11){
			$day = 30;
		}else if(month == 2){
			if(year%4 == 0 && (year%100 != 0 || year%400 == 0)){
				$day = 29;
			}else{
				$day = 28;
			}
		}
		return $day;
	},
	HTML:function(element){
		if($(element).length){
			$(element).each(function(i){
				var $this = $(this),
					$thisId = $this.attr('id'),
					$type = $this.data('type'),
					$btnTxt = '날짜 선택',
					$html = '';
				if($thisId == undefined || $thisId == ''){
					$thisId = 'sclCal_'+i;
					$this.attr('id',$thisId);
				}
				if($type == undefined)$type = 'date';
				if($type == 'full')$btnTxt = '날짜 및 시간 선택';
				if($type == 'time')$btnTxt = '시간 선택';
				if(!$this.closest('.scl_calrender').length)$this.parent().wrap('<div class="scl_calrender"><div class="scl_cal_btn"></div></div>');
				if(!$this.siblings('.btn_select').length)$this.after('<a href="#'+$thisId+'" class="btn_select ui-date-open" role="button"><span class="blind">'+$btnTxt+'</span></a>');
				var $wrap = $this.closest('.scl_calrender'),
					$calendar = $wrap.find('.scl_cal_wrap');
				if(!$calendar.length){
					$html += '<div class="scl_cal_wrap">';
						$html += '<div class="tbl">';
						if($type == 'full' || $type == 'date'){
							$html += '<dl class="td scl_cal_group scl_year">';
								$html += '<dt>년</dt>';
								$html += '<dd></dd>';
							$html += '</dl>';
							$html += '<dl class="td scl_cal_group scl_month">';
								$html += '<dt>월</dt>';
								$html += '<dd></dd>';
							$html += '</dl>';
							$html += '<dl class="td scl_cal_group scl_day">';
								$html += '<dt>일</dt>';
								$html += '<dd></dd>';
							$html += '</dl>';
						}
						if($type == 'full' || $type == 'time'){
							$html += '<dl class="td scl_cal_group scl_hour">';
								$html += '<dt>시</dt>';
								$html += '<dd></dd>';
							$html += '</dl>';
							$html += '<dl class="td scl_cal_group scl_min">';
								$html += '<dt>분</dt>';
								$html += '<dd></dd>';
							$html += '</dl>';
						}
						$html += '</div>';
					$html += '</div>';
					$html += '<div class="scl_cal_close"><a href="#">달력 닫기</a></div>';
					$wrap.append($html);
					if($type == 'full')$wrap.find('.scl_cal_wrap').addClass('full');
				}
			});
		}
	},
	UI:function(element){
		$(element).each(function(){
			var $el = $(this);
			$el.change(function(){
				var $this = $(this),
					$wrap = $this.closest('.scl_calrender'),
					$group = $wrap.find('.scl_cal_group '),
					$type = $this.data('type'),
					$today = autoDateFormet($nowDateDay.toString(),sclCalendar.dateMark),
					$todayAry = $today.split(sclCalendar.dateMark),
					$min = $this.data('min'),$minDate = $this.data('min-date'),$minHour = $this.data('min-hour'),
					$minAry = '',$minVal = '',$minAry2 = '',$minOj = {},$minY = '',$minM = '',$minD = '',
					$max = $this.data('max'),$maxDate = $this.data('max-date'),$maxHour = $this.data('max-hour'),
					$maxAry = '',$maxVal = '',$maxAry2 = '',$maxOj = {},$maxY = '',$maxM = '',$maxD = '',$maxH = '',
					$thisVal = $this.val(),
					$thisValAry = '',$replaceVal = [],$getDay = '',
					$range = $this.data('range'),
					$rangeS = '',$rangeE = '',
					$yearS = '',$yearE = '',
					$monthS = '',$monthE = '',
					$dayS = '',$dayE = '',
					$hourS = '',$hourE = '',
					$dayStep = $this.data('day-step'),$minStep = $this.data('min-step'),
					$item = '',$val = '',$groupEl = '';
				if(!!$minDate){
					$minDate = autoDateFormet($minDate.toString(),sclCalendar.dateMark);
					$minAry = $minDate.split(sclCalendar.dateMark);
				}else{
					if(!!$min){
						if($min == 'today'){
							$minAry = $todayAry.slice();
						}else if($min.indexOf('Y') >= 1 || $min.indexOf('M') >= 1 || $min.indexOf('D') >= 1){
							$minAry = $min.split(',');
							for(var min_i = 0; min_i<$minAry.length; min_i++){
								$minAry2 = $minAry[min_i].split(sclCalendar.timeMark);
								$minOj[$minAry2[0]] = parseInt($minAry2[1]);
							}
							for(var min_j in $minOj){
								if(min_j == 'Y'){
									$minY = parseInt($todayAry[0])-$minOj[min_j];
									$todayAry[0] = $minY;
								}
								if(min_j == 'M'){
									$minM = parseInt($todayAry[1])-$minOj[min_j];
									if($minM < 1){
										$todayAry[0] = $todayAry[0]-1;
										$minM = $minM+12;
									}
									$todayAry[1] = ($minM<10?'0'+$minM:$minM);
								}
								if(min_j == 'D'){
									$minD = parseInt($todayAry[2])-$minOj[min_j];
									if($minD < 1){
										$todayAry[1] = $todayAry[1]-1;
										if($todayAry[1] < 1){
											$todayAry[0] = $todayAry[0]-1;
											$todayAry[1] = $todayAry[1]+12;
										}
										$getDay = sclCalendar.getMonthlyDay($todayAry[0],$todayAry[1]);
										$minD = $minD+$getDay;
									}
									$todayAry[2] = ($minD<10?'0'+$minD:$minD);
								}
							}
							$minAry = $todayAry.slice();
						}
					}
				}
				if(!!$maxDate){
					$maxDate = autoDateFormet($maxDate.toString(),sclCalendar.dateMark);
					$maxAry = $maxDate.split(sclCalendar.dateMark);
				}else{
					if(!!$max){
						if($max == 'today'){
							$maxAry = $todayAry.slice();
						}else{
							$maxAry = $max.split(',');
							for(var max_i = 0; max_i<$maxAry.length; max_i++){
								$maxAry2 = $maxAry[max_i].split(sclCalendar.timeMark);
								$maxOj[$maxAry2[0]] = parseInt($maxAry2[1]);
							}
							for(var max_j in $maxOj){
								if(max_j == 'Y'){
									$maxY = parseInt($todayAry[0])+$maxOj[max_j];
									$todayAry[0] = $maxY;
								}
								if(max_j == 'M'){
									$maxM = parseInt($todayAry[1])+$maxOj[max_j];
									if($maxM > 12){
										$todayAry[0] = $todayAry[0]+1;
										$maxM = $maxM-12;
									}
									$todayAry[1] = ($maxM<10?'0'+$maxM:$maxM);
								}
								if(max_j == 'D'){
									$maxD = parseInt($todayAry[2])+$maxOj[max_j];
									$getDay = sclCalendar.getMonthlyDay($todayAry[0],$todayAry[1]);
									if($maxD > $getDay){
										$todayAry[1] = $todayAry[1]+1;
										if($todayAry[1] > 12){
											$todayAry[0] = $todayAry[0]+1;
											$todayAry[1] = $todayAry[1]-12;
										}
										$maxD = $maxD-$getDay;
									}
									$todayAry[2] = ($maxD<10?'0'+$maxD:$maxD);
								}
							}
							$maxAry = $todayAry.slice();
						}
					}
				}
				if($thisVal != ''){
					if($type == undefined)$type = 'date';
					if($type == 'date')$thisValAry = $thisVal.split(sclCalendar.dateMark);
					if($type == 'time')$thisValAry = $thisVal.split(sclCalendar.timeMark);
					if($type == 'full'){
						var $thisVal2 = $thisVal.split(' ');
						$thisValAry = $thisVal2[0].split(sclCalendar.dateMark);
						$thisValAry = $thisValAry.concat($thisVal2[1].split(sclCalendar.timeMark));
					}

					//range 설정
					if($range == undefined){
						$rangeS = 10;
						$rangeE = 10;
					}else{
						if($range.toString().indexOf(':') >= 0){
							$range = $range.split(':');
							$rangeS = parseInt($range[0]);
							$rangeE = parseInt($range[1]);
						}else{
							$rangeS = $range;
							$rangeE = $range;
						}
					}

					//달력 및 시간 넣기
					for(var i = 0;i<$thisValAry.length;i++){
						$val = parseInt($thisValAry[i]);
						$groupEl = $group.eq(i);
						if($groupEl.hasClass('scl_year')){
							//년
							$yearS = $nowDateOnlyYear-$rangeS;
							$yearE = $nowDateOnlyYear+$rangeE;
							if($val < $yearS)$yearS= $val;
							if($val > $yearE)$yearE= $val;
							if(!!$min || !!$minDate){
								$minVal = parseInt($minAry[0]);
								if($yearS < $minVal)$yearS = $minVal;
								if($val < $minVal)$val = $minVal;
							}
							if(!!$max || !!$maxDate){
								$maxVal = parseInt($maxAry[0]);
								if($yearE > $maxVal)$yearE = $maxVal;
								if($val > $maxVal)$val = $maxVal;
							}
							if(!!$min || !!$max || !!$minDate || !!$maxDate)$replaceVal.push($val);
							$item = sclCalendar.dateHtml('Y',$yearS,$yearE,$val);
							if($groupEl.find('.scl_cal_item').length != ($yearE-$yearS+1))$groupEl.find('dd').html($item);
						}else if($groupEl.hasClass('scl_month')){
							//월
							$monthS = 1;
							$monthE = 12;
							if((!!$min || !!$minDate) && $yearS == parseInt($wrap.find('.scl_year .active').text())){
								$minVal = parseInt($minAry[1]);
								if($monthS < $minVal)$monthS = $minVal;
								if($val < $minVal)$val = $minVal;
							}
							if((!!$max || !!$maxDate) && $yearE == parseInt($wrap.find('.scl_year .active').text())){
								$maxVal = parseInt($maxAry[1]);
								if($monthE > $maxVal)$monthE = $maxVal;
								if($val > $maxVal)$val = $maxVal;
							}
							if(!!$min || !!$max || !!$minDate || !!$maxDate)$replaceVal.push($val<10?'0'+$val:$val);
							$item = sclCalendar.dateHtml('M',$monthS,$monthE,$val);
							if($groupEl.find('.scl_cal_item').length != ($monthE-$monthS+1))$groupEl.find('dd').html($item);
						}else if($groupEl.hasClass('scl_day')){
							//일
							if($dayStep == undefined)$dayStep = 1;
							$dayS = 1;
							$dayE = sclCalendar.getMonthlyDay($thisValAry[0],$thisValAry[1]);
							if((!!$min || !!$minDate) && $yearS == parseInt($wrap.find('.scl_year .active').text()) && $monthS == parseInt($wrap.find('.scl_month .active').text())){
								$dayE = sclCalendar.getMonthlyDay($minAry[0],$minAry[1]);
								$minVal = parseInt($minAry[2]);
								if($dayS < $minVal)$dayS = $minVal;
								if($val < $minVal)$val = $minVal;
							}
							if((!!$max || !!$maxDate) && $yearE == parseInt($wrap.find('.scl_year .active').text()) && $monthE == parseInt($wrap.find('.scl_month .active').text())){
								$dayE = sclCalendar.getMonthlyDay($maxAry[0],$maxAry[1]);
								$maxVal = parseInt($maxAry[2]);
								if($dayE > $maxVal)$dayE = $maxVal;
								if($val > $maxVal)$val = $maxVal;
							}
							if(!!$min || !!$max || !!$minDate || !!$maxDate)$replaceVal.push($val<10?'0'+$val:$val);
							if($dayE < $val){
								$this.val($thisVal.replace(sclCalendar.dateMark+($val<10?'0'+$val:$val),sclCalendar.dateMark+($dayE<10?'0'+$dayE:$dayE)));
								$val = $dayE;
							}
							if($val%$dayStep != 0){
								var $val2 = $val+($dayStep-$val%$dayStep);
								$this.val($thisVal.replace(sclCalendar.dateMark+($val<10?'0'+$val:$val),sclCalendar.dateMark+($val2<10?'0'+$val2:$val2)));
								$val = $val2;
							}
							$item = sclCalendar.dateHtml('D',$dayS,$dayE,$val,$dayStep);
							if($groupEl.find('.scl_cal_item').length != ($dayE-$dayS+1) || $dayS != 1)$groupEl.find('dd').html($item);
						}else if($groupEl.hasClass('scl_hour')){
							$hourS = 0;
							$hourE = 23;
							if(!!$minHour)$hourS=$minHour;
							if(!!$maxHour)$hourE=$maxHour;
							$item = sclCalendar.dateHtml('h',$hourS,$hourE,$val);
							if($groupEl.find('.scl_cal_item').length != ($hourE-$hourS+1))$groupEl.find('dd').html($item);
						}else if($groupEl.hasClass('scl_min')){
							if($minStep == undefined)$minStep = 1;
							if($val%$minStep != 0){
								$val = $val+($minStep-$val%$minStep);
							}
							$item = sclCalendar.dateHtml('m',0,59,$val,$minStep);
							if($groupEl.find('.scl_cal_item').length != (60/$minStep))$groupEl.find('dd').html($item);
						}
					}
					if($replaceVal.length){
						$replaceVal = $replaceVal.join(sclCalendar.dateMark);
						if($thisVal.substr(0,10) != $replaceVal){
							$this.val($thisVal.replace($thisVal.substr(0,10),$replaceVal));
						}
					}
				}
			});
		});

		$(document).on('click','.scl_calrender .ui-date-open',function(e){
			e.preventDefault();
			var $this = $(this),
				$wrap = $this.closest('.scl_calrender'),
				$group = $wrap.find('.scl_cal_group'),
				$input = $wrap.find('.scl_cal_btn input'),
				$type = $input.data('type'),
				$todayDate = autoDateFormet($nowDateDay.toString(),sclCalendar.dateMark);
			if($type == undefined)$type = 'date';
			if($type == 'full')$todayDate = $todayDate + ' '+autoTimeFormet($nowDateOnlyTime.toString(),sclCalendar.timeMark);
			if($type == 'time')$todayDate = autoTimeFormet($nowDateOnlyTime.toString(),sclCalendar.timeMark);
			if($this.hasClass('on')){
				$wrap.removeClass('expend');
				//Body.unlock();
				$wrap.find('.scl_cal_wrap').stop(true,false).slideUp(200);
				$this.removeClass('on');
			}else{
				$wrap.addClass('expend');
				$wrap.find('.scl_cal_wrap').stop(true,false).slideDown(200,function(){
					accordion.scroll($this,this,function(){
						//Body.lock();
					});
				});
				$this.addClass('on');
				if($input.val() == ''){
					$input.val($todayDate).change().keyup();
				}else{
					$input.change().keyup();
				}
				$group.each(function(){
					var $active = $(this).find('.active');
					if($active.length)scrollUI.center($active,100,'vertical');
				});
			}
		});

		$(document).on('click','.scl_calrender .scl_cal_close a, .scl_calrender .inp_del',function(e){
			e.preventDefault();
			var $wrap = $(this).closest('.scl_calrender'),
				$btn = $wrap.find('.ui-date-open');
			$wrap.removeClass('expend');
			//Body.unlock();
			$wrap.find('.scl_cal_wrap').stop(true,false).slideUp(200);
			$btn.removeClass('on');
			if($(this).closest('.scl_cal_close').length)$btn.focus();
		});

		$(document).on('click','.scl_calrender .scl_cal_item',function(e){
			e.preventDefault();
			var $wrap = $(this).closest('.scl_calrender'),
				$group = $wrap.find('.scl_cal_group'),
				$input = $wrap.find('.scl_cal_btn input'),
				$type = $input.data('type'),
				$valAry = [],
				$val = '',
				$active = '';
			if($type == undefined)$type = 'date';
			$(this).addClass('active').attr('title','현재선택').siblings().removeClass('active').removeAttr('title');
			scrollUI.center(this,100,'vertical');
			$group.each(function(){
				$active = $(this).find('.active .val');
				$valAry.push($active.text());
			});
			if($type == 'date')$val = $valAry.join(sclCalendar.dateMark);
			if($type == 'time')$val = $valAry.join(sclCalendar.timeMark);
			if($type == 'full')$val = $valAry[0]+sclCalendar.dateMark+$valAry[1]+sclCalendar.dateMark+$valAry[2]+' '+$valAry[3]+sclCalendar.timeMark+$valAry[4];
			$input.val($val).change().keyup();
		});

		$(document).on('keydown','.scl_calrender .scl_cal_item',function(e){
			var $keyCode = (e.keyCode?e.keyCode:e.which),
				$this = $(this),
				$group = $this.closest('.scl_cal_group');
			if($keyCode == 38 && $this.prev().length){
				//up
				e.preventDefault();
				$this.prev().focus();
			}else if($keyCode == 40 && $this.next().length){
				//down
				e.preventDefault();
				$this.next().focus();
			}else if($keyCode == 9){
				//tab
				if(e.shiftKey){
					if($group.prev().length){
						e.preventDefault();
						$group.prev().find('.scl_cal_item').first().focus();
					}else{
						if($(this).index() != 0){
							$group.find('.scl_cal_item').first().focus();
						}
					}
				}else{
					if($group.next().length){
						e.preventDefault();
						$group.next().find('.scl_cal_item').first().focus();
					}else{
						if($(this).index()+1 != $group.find('.scl_cal_item').length){
							$group.find('.scl_cal_item').last().focus();
						}
					}
				}
			}
		});
	},
	init:function(element){
		sclCalendar.HTML(element);
		sclCalendar.UI(element);
	}
};


//리스트 관련 UI
var listUI = {
	winLoad:function(){
		//토글실행
		accordion.list('.ui-accordion','.tit a','.panel');
		accordion.btn('.ui-toggle-btn');

		//테이블 스크롤 가이드 실행
		if($('.tbl_scroll').length){
			tblUI.guideScl('.tbl_scroll');
			tblUI.guide('.tbl_scroll');
		}

		//테이블 rowspan
		if($('table th[rowspan]').length){
			$('table th[rowspan]').each(function(){
				var $this = $(this),
					$idx = $this.index(),
					$trIdx = ($this.parent().index()+1),
					$tbody = $this.parent().parent(),
					$rowspan = parseInt($this.attr('rowspan'));
					for(var i = $trIdx;i < ($trIdx+$rowspan-1);i++){
						$tbody.children().eq(i).children().eq($idx).addClass('l_line');
					}
			});
		}
	},
	init:function(){
		
	}
};
//아코디언 함수
var accordion = {
	list:function(list,btn,panel,addClass,speed){
		if(!addClass)addClass = 'open';
		if(!speed)speed = 200;
		$(document).on('click',list+' '+btn,function(e){
			e.preventDefault();
			var $this = $(this),
				$li = $(this).closest('li');
			if($li.hasClass(addClass)){
				$li.find(btn).attr('aria-expanded',false).removeAttr('title');
				$li.removeClass(addClass);
				$li.find(panel).attr('aria-hidden',true).stop(true,false).slideUp(speed);
			}else{
				$li.find(btn).attr('aria-expanded',true).attr('title','현재열림');
				$li.addClass(addClass).siblings().removeClass(addClass).find(btn).attr('aria-expanded',false).removeAttr('title');
				$li.siblings().find(panel).attr('aria-hidden',true).stop(true,false).slideUp();
				$li.find(panel).attr('aria-hidden',false).stop(true,false).slideDown(speed,function(){
					accordion.scroll($this,this);
				});
			}
		});

		if($(list).length){
			$(list).each(function(e){
				$(this).children().each(function(f){
					var $btn = $(this).find(btn),
						$btnId = $btn.attr('id'),
						$panel = $(this).find(panel),
						$pabelId = $panel.attr('id');
					if(!$btnId)$btnId = 'tglist_btn_'+e+'_'+f;
					if(!$pabelId)$pabelId = 'tglist_panel_'+e+'_'+f;
					$btn.attr({
						'id': $btnId,
						'role':'button',
						'aria-expanded':false,
						'href': '#'+$pabelId,
						'aria-controls': $pabelId
					});
					$panel.attr({
						'id': $pabelId,
						'aria-hidden':'true',
						'aria-labelledby':$btnId
					});
				});
			});
			if($(list).find('.'+addClass).length){
				$(list).find('.'+addClass).each(function(){
					$(this).find(btn).attr('aria-expanded',true).attr('title','현재열림');
					$(this).find(panel).attr('aria-hidden',false).show();
				});
			}
		}
	},
	btn:function(btn,className,speed){
		if(!className)className = 'open';
		if(!speed)speed = 200;
		$(document).on('click',btn,function(e){
			e.preventDefault();
			var $this = $(this),
				$panel = $this.attr('href');
			if($panel == '#' && $this.closest('.accordion_list').length)$panel = $this.closest('.accordion_list').find('.panel');
			if($this.hasClass(className)){
				$this.removeClass(className).attr('aria-expanded',false).removeAttr('title');
				$($panel).attr('aria-hidden',true).stop(true,false).slideUp(speed);
			}else{
				$this.addClass(className).attr('aria-expanded',true).attr('title','현재열림');
				$($panel).attr('aria-hidden',false).stop(true,false).slideDown(speed,function(){
					accordion.scroll($this,this);
				});
			}
		});

		if($(btn).length){
			$(btn).each(function(e){
				var $btn = $(this),
					$btnId = $(this).attr('id'),
					$panel = $(this).attr('href');
				if($panel == '#' && $btn.closest('.accordion_list').length)$panel = $btn.closest('.accordion_list').find('.panel');
				if(!$btnId)$btnId = 'tg_btn_'+e;
				$btn.attr({
					'id': $btnId,
					'role':'button',
					'aria-expanded':false,
					'aria-controls': $panel
				});
				$($panel).attr({
					'aria-hidden':'true',
					'aria-labelledby':$btnId
				});
				//panel이 보이면
				if($($panel).is(':visible')){
					$(this).addClass(className).attr('aria-expanded',true).attr('title','현재열림');
				}
				//btn이 활성화면
				if($(this).hasClass(className)){
					$(this).attr('aria-expanded',true).attr('title','현재열림');
					$($panel).attr('aria-hidden',false).show();
				}
			});
		}
	},
	scroll:function(btn,panel,callback){
		//아코디언 열릴때 스크롤 함수
		var $scrollTop = $(window).scrollTop(),
			$winHeight = $(window).height();
		if($('.btn_wrap.bottom_fixed').not('.pop_btn').length)$winHeight = $winHeight - 60;
		var $winEnd = $scrollTop+$winHeight,
			$btnTop = $(btn).offset().top - 50,
			$thisTop = $(panel).offset().top,
			$thisHeight = $(panel).outerHeight(),
			$thisEnd = $thisTop+$thisHeight,
			$scroll = Math.min($btnTop,$thisEnd-$winHeight);
		if($winEnd < $thisEnd){
			$('html,body').animate({'scrollTop':$scroll},200,function(){
				if(!!callback)callback();
			});
		}else{
			if(!!callback)callback();
		}
	}
};
//테이블 스크롤 가이드
var tblUI = {
	guideScl: function(element){
		$(element).each(function(){
			var $this = $(this);
			$this.data('isFirst',true);
			$this.data('direction','좌우');
			$(this).on('scroll',function(){
				$this.data('isFirst',false);
				$this.find('.tbl_guide').remove();
				//$this.removeAttr('title');

				var $sclInfo = $this.next('.tbl_scroll_ifno');
				if($sclInfo.length){
					var $sclVerticalPercent = (Math.abs($this.scrollTop()/($this.get(0).scrollHeight - $this.height())))*100;
					var $sclHorizonPercent = (Math.abs($this.scrollLeft()/($this.get(0).scrollWidth - $this.width())))*100;
					$sclInfo.find('.vertical').children().css('height',$sclVerticalPercent+'%');
					$sclInfo.find('.horizon').children().css('width',$sclHorizonPercent+'%');
				}
			});
		});
	},
	guide: function(element){
		$(window).on('resize',function(){
			$(element).each(function(){
				var $this = $(this),
					$direction = $this.data('direction'),
					$changeDirection = '',
					$guide = '<div class="tbl_guide" title="해당영역은 테이블을 스크롤하면 사라집니다."><div><i class="icon" aria-hidden="true"></i>테이블을 '+$direction+'로 이동하세요.</div></div>',
					$width = $this.outerWidth(),
					$height = $this.outerHeight(),
					$scrollW = $this.get(0).scrollWidth,
					$scrollH = $this.get(0).scrollHeight;
				var $sclInfoHtml = '<div class="table tbl_scroll_ifno" aria-hidden="true"><div class="horizon"><div></div></div><div class="vertical"><div></div></div></div>',
					$sclIfno = $this.next('.tbl_scroll_ifno');
				if($this.data('isFirst')){
					if($width < $scrollW && $height < $scrollH){
						$changeDirection = '상하좌우';
					}else if($width < $scrollW){
						$changeDirection = '좌우';
					}else if($height < $scrollH){
						$changeDirection = '상하';
					}else{
						$changeDirection = '';
					}

					if($changeDirection == ''){
						$this.removeAttr('tabindex').find('.tbl_guide').remove();
						$sclIfno.remove();
						$this.removeAttr('title');
					}else{
						if(!$this.find('.tbl_guide').length){
							if(!isMobile.any()){
								$this.attr('tabindex',0); //pc일땐 tabindex 사용
							}
							$this.prepend($guide);
						}
						if(!$sclIfno.length){
							$this.after($sclInfoHtml);
							$sclIfno = $this.next('.tbl_scroll_ifno');
						}
						if($sclIfno.length){
							$sclIfno.find('.vertical').css('height',$height);
							$sclIfno.find('.vertical').show();
							$sclIfno.find('.horizon').show();
							if($changeDirection == '좌우'){
								$sclIfno.find('.vertical').hide();
							}else if($changeDirection == '상하'){
								$sclIfno.find('.horizon').hide();
							}
						}

						$this.attr('title','터치스크롤하여 숨겨진 테이블영역을 확인하세요');
					}

					if($direction != $changeDirection && $this.find('.tbl_guide').length){
						$this.find('.tbl_guide').changeTxt($direction,$changeDirection);
						$this.data('direction',$changeDirection);
					}
				}
			});
		});
	}
};

//swiper 실행
var $uiSwipers = [];
var swiperUI = {
	array:[],
	focusAria: function(el,first,last){ 
		$(el).find('.swiper-slide').attr('aria-hidden','true').find(':focusable').attr('tabindex',-1);
		$(el).find('.swiper-slide').slice(first,first+last+1).removeAttr('aria-hidden').find(':focusable').removeAttr('tabindex');
	},
	item: function(tar){
		if ($(tar).length > 0){
			$(tar).each(function(){
				var $this = $(this),
					$swipeIdx = swiperUI.array.length+1,
					$itemLength = $this.children().length;
				if($itemLength == 1){
					$this.closest('.ui-swiper-wrap').addClass('only');
				}else if($itemLength > 1){
					$this.closest('.ui-swiper-wrap').removeClass('only');
					//swipe
					if(!$this.hasClass('swiper-container-initialized')){
						$this.children('.item').addClass('swiper-slide');
						$this.wrapInner('<div class="swiper-wrapper"></div>');
						$this.addClass('swipe-container').append('<div class="swiper-pagination"></div>');

						var $option = {
							slidesPerView: 'auto',
							slideClass:'item',
							resizeReInit:true,
							pagination:{
								el: '.swiper-pagination',
								clickable:true,
								renderBullet:function(index, className) {
									return '<button type="button" class="'+className+'">'+(index+1)+'번째 슬라이드</button>';
								}
							},
							on:{
								init:function(){
									setTimeout(function(){
										if($swiper.pagination.bullets.length == 1 && $swiper.slides.length == 2){
											$this.closest('.ui-swiper-wrap').addClass('double');
										}else{
											$this.closest('.ui-swiper-wrap').removeClass('double');
										}
										var $length = $swiper.pagination.bullets.length;
										swiperUI.focusAria($this,$swiper.snapIndex,$itemLength-$length);
									},10);
								},
								resize:function(){
									if($swiper.pagination.bullets.length == 1 && $swiper.slides.length == 2){
										$this.closest('.ui-swiper-wrap').addClass('double');
									}else{
										$this.closest('.ui-swiper-wrap').removeClass('double');
										$swiper.slideTo(0);
									}

									if($(window).width() >= 760){
										$activeClass = '.swiper-slide-active, .swiper-slide-next';
									}else{
										$activeClass = '.swiper-slide-active';
									}
									var $length = $swiper.pagination.bullets.length;
									swiperUI.focusAria($this,$swiper.snapIndex,$itemLength-$length);
								},
								transitionEnd:function(e){
									var $length = $swiper.pagination.bullets.length;
									swiperUI.focusAria($this,$swiper.snapIndex,$itemLength-$length);
								}
							}
						};

						$this.data('idx',$swipeIdx);
						var $swiper = new Swiper($this,$option);
						swiperUI.array.push($swiper);
					}
				}
			});
		}
	},
	arrow:function(tar){
		if ($(tar).length > 0){
			$(tar).each(function(i, element){
				var $this = $(this),
					$prev = $this.find('.swiper-button-prev'),
					$next = $this.find('.swiper-button-next'),
					$pagination = $this.find('.swiper-pagination'),
					$type = $this.data('swiper');						//data-swiper
		
				//setting
				if($this.find('.swiper-container').length > 0){
					$container = $this.find('.swiper-container');
				}else{
					$container = $this;
				}
				$container.addClass('ui-swipe-s'+i);
				if($prev.length > 0)$prev.addClass('ui-swipe-l'+i);
				if($next.length > 0)$next.addClass('ui-swipe-r'+i);
				if($pagination.length > 0)$pagination.addClass('ui-swipe-p'+i);
		
				//option
				var $option,
					$isNaviIn = false;
				switch($type){
					case 'navi':
						$option ={
							slidesPerView: 'auto',
							freeMode: true,
							//centerInsufficientSlides: true,
							navigation:{
								prevEl: '.ui-swipe-l'+i,
								nextEl: '.ui-swipe-r'+i,
							}
						};
						$isNaviIn = true;
						break;
					case 'vertical':
						$option ={
							direction: 'vertical',
							autoHeight: true,
							pagination:{
								el: '.ui-swipe-p'+i
							}
						};
						break;
					default:
						$option ={
							autoHeight: true,
							pagination:{
								el: '.ui-swipe-p'+i
							}
						};
						break;
				}
		
				//Swiper init
				var $swiper = new Swiper('.ui-swipe-s'+i,$option);
				$uiSwipers.push($swiper);
		
				//event
				if($isNaviIn == true){
					var $active = $this.find('.active'),
						$activeIdx = $active.index(),
						$activeLeft = $active.position().left,
						$activeWidth = $active.outerWidth();
		
					if($(window).width() < ($activeLeft+$activeWidth))$uiSwipers[i].slideTo($activeIdx);
				}
			});
		}
	},
	init:function(){
		swiperUI.item('.ui-swiper');
		swiperUI.arrow('.ui-swiper2');
	}
};

/*** 플러그인 ***/
//글자바꾸기: changeTxt(바꿀텍스트,바낄텍스트)
//$('.txt').changeTxt('열기','닫기');
$.fn.changeTxt = function(beforeTxt, afterTxt){
	return this.each(function(){
		var element = $(this);
		element.html(element.html().split(beforeTxt).join(afterTxt));
	});
};


/*** 유틸함수 ***/
//Input date
var autoDateFormet = function(str,mark){
	var $date = str.replace(/[^0-9]/g, ''),
		$dateAry = [];
	if(!mark)mark = '.';
	if($date.length < 5){
		$dateAry.push($date);
	}else if(str.length < 7){
		$dateAry.push($date.substr(0,4));
		$dateAry.push($date.substr(4));
	}else{
		$dateAry.push($date.substr(0,4));
		$dateAry.push($date.substr(4,2));
		$dateAry.push($date.substr(6));
	}
	return $dateAry.join(mark);
};
var autoTimeFormet = function(str,mark){
	var $time = str.replace(/[^0-9]/g, ''),
		$timeAry = [];
	if(!mark)mark = '.';
	if($time.length <= 2 ){
		$timeAry.push($time);
	}else if(str.length == 3 || str.length == 5){
		$timeAry.push($time.substr(0,1));
		$timeAry.push($time.substr(1,2));
		if(str.length == 5)$timeAry.push($time.substr(3));
	}else if(str.length >= 4){
		$timeAry.push($time.substr(0,2));
		$timeAry.push($time.substr(2,2));
		if(str.length > 4)$timeAry.push($time.substr(4));
	}
	return $timeAry.join(mark);
};

//날짜구하기
var todayTimeString=function(addDay){
	var $today=new Date();
	if(!!addDay)$today.setDate($today.getDate()+addDay);
	return timeString($today);
};
var timeString=function(date){
	var $year=date.getFullYear(),
		$month=date.getMonth()+1,
		$day=date.getDate(),
		$hour=date.getHours(),
		$min=date.getMinutes();
	if((''+$month).length==1)$month='0'+$month;
	if((''+$day).length==1)$day="0"+$day;
	if((''+$hour).length==1)$hour='0'+$hour;
	if((''+$min).length==1)$min='0'+$min;
	return(''+$year+$month+$day+$hour+$min);
};
var $dayLabelPrint = function(){
	var $today = new Date(),
		$week=['일','월','화','수','목','금','토'],
		$dayLabel=$week[$today.getDay()];
	return $dayLabel;
};
var $nowDateFull=parseInt(todayTimeString()),					//년+월+일+시+분
	$nowDateHour=parseInt(todayTimeString().substr(0,10)),		//년+월+일+시
	$nowDateDay=parseInt(todayTimeString().substr(0,8)),		//년+월+일
	$nowDateMonth=parseInt(todayTimeString().substr(0,6)),		//년+월
	$nowDateOnlyTime=parseInt(todayTimeString().substr(8,4)),	//시+분
	$nowDateOnlyYear=parseInt(todayTimeString().substr(0,4)),	//년
	$nowDateOnlyMonth=parseInt(todayTimeString().substr(4,2)),	//월
	$nowDateOnlyDay=parseInt(todayTimeString().substr(6,2)),	//일
	$nowDateOnlyHour=parseInt(todayTimeString().substr(8,2)),	//시
	$nowDateOnlyMin=parseInt(todayTimeString().substr(10,2)),	//분
	$nowDateDayLabel=$dayLabelPrint(),							//요일
	$afterDateDay=function(day){
		return parseInt(todayTimeString(day-1).substr(0,8));
	};

//숫자만
var onlyNumber = function(num){
	return num.toString().replace(/[^0-9]/g,'');
};