var global_dots = 0;
var global_level = 0;

var initial_level = 6;
var difficulty = 4;
var delay = 1000

// audios
var action = new Audio('audio/action.mp3');
var correct = new Audio('audio/correct.mp3');
var wrong = new Audio('audio/wrong.mp3');
var level_up = new Audio('audio/level_up.mp3');


// device paramters
var device_height = $(document).height() > $(window).height() ? $(document).height() : $(window).height();
var device_width = $(document).width() > $(window).width() ? $(document).width() : $(window).width();

device_width *= 2;

var level_form_width = $("#level-form").width();
// setting canvas dimensions
var canvas_width = level_form_width*3/4;

canvas_width = (canvas_width + $("#level-form").height()) > device_height ? device_height/2 : canvas_width;

$("#main-canvas").attr("width",canvas_width+"px");
$("#main-canvas").attr("height",canvas_width+"px");
$("#main-canvas").css("margin-left",level_form_width/2 - canvas_width/2+"px");

$("#choose-form").css("width",canvas_width+"px");
$("#choose-form").css("height",canvas_width+"px");
$("#choose-form").css("margin-left",level_form_width/2 - canvas_width/2+"px");

var width = parseInt($('canvas').width());

// initialize level and corresponding label
$('#level-input').val(initial_level);
$('#level-label').html($('#level-input').val());


// level control functions
$('#increase').click(function(){
    let lev = parseInt($('#level-input').val());
    $('#level-input').val(lev+1);

    // update level label
    $('#level-label').html($('#level-input').val());    
});
$('#decrease').click(function(){
    let lev = parseInt($('#level-input').val())
    if(lev > 3){
        $('#level-input').val(lev-1);
    }else{
        alert("can't execute for less than 3");
    }

    // update level label
    $('#level-label').html($('#level-input').val());
});


// drawing function
$('#action').click(function(){
	action.play();
    // hide choose buttons
    $('#choose-form').hide();

    // disabling action button
    $('#action').hide()

    // get level
    var level = parseInt($('#level-input').val());
    global_level = level;

    // charging the choose buttons
    $('#choose-0').val(level);
    $('#choose-1').val(level+1);
    $('#choose-2').val(level+2);


    // calculate matrix
    var matrix = level*2;

    // calculate radius
    var radius = parseInt((width/matrix)/2);

    // clearing the canvas    
    $('canvas').drawRect({
        fillStyle: '#e3f0e3',
        x: 0, y: 0,
        width: 2000,
        height: 2000	
    });

    // choosing number of dots
    var dots = level + Math.floor(Math.random()*3);
    global_dots = dots;
    

    // choosing where to draw each dot
    var arr = [];
    while(arr.length < dots){
        var r = Math.floor(Math.random() * matrix*matrix) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    
    // functions for calculating coordinates of each dot
    function getX(n){
        n = n-1;
        var order = n-matrix*Math.floor(parseInt(n)/matrix);
        var x = radius + order*radius*2;
        return x;
    }
    function getY(n){
        n = n-1;
        var order = Math.floor(parseInt(n)/matrix);
        var y = radius + order*radius*2;
        return y;
    }
   
    // drawing the dots
    
    for(var i = 0; i <  arr.length; i++){                
        
        $('canvas').drawArc({
            fillStyle: 'black',
            x: getX(arr[i]), y: getY(arr[i]),
            radius: radius
        })
    ;}
    
    setTimeout(
        function(){
            // re-clearing the canvas    
            $('canvas').drawRect({
                fillStyle: '#e3f0e3',
                x: 0, y: 0,
                width: 2000,
                height: 2000
            });
            
            // showing choose form
            $('#choose-form').show();

            
        }
    ,delay);	
})
    
    


// choosing function
$('.choose').click(function(){
    // hide choose form
    $('#choose-form').hide(); 
    
    // verifying answer :
    var answer_color;
    if(parseInt($(this).data('answer')) + global_level == global_dots){
    //success    
        // updating progress
        var progress = parseInt($('#progress').val());
        if(progress == (difficulty - 1)){
			level_up.play();
            // update level
            var current_level = parseInt($('#level-input').val());
            $('#level-input').val(current_level+1);
            $('#progress').val(0);

            //alert('Congratulations ! You have reached level '+(current_level+1));
            // update level label
            $('#level-label').html($('#level-input').val());  
           
        }else{            
            $('#progress').val(progress+1);
			correct.play();
        }

        // formatting greeting message
        answer_color = '#3f3';
        answer_text = 'correct its ' + global_dots;
    

    }
	else{
		wrong.play();
        // upadting progress
        $('#progress').val(0);
		
		// returning to initial level
		$('#level-input').val(initial_level);
		$('#level-label').html($('#level-input').val());

        //formatting sorry message
        answer_color = '#f33';
        answer_text = 'sorry answer is ' + global_dots; 

        
    }
    
    // update progress bar
    var progress_bar_width = (100/difficulty)*parseInt($('#progress').val()) + '%';
    $('#myBar').animate({
        width : progress_bar_width
    },800);
	
	
	// if fail
	if(answer_color == "#f33"){
    // show correct number               
    $('canvas').drawText({
        fillStyle: answer_color,
        strokeStyle: answer_color,
        strokeWidth: 1,
        x: canvas_width/2, y: canvas_width/2,
        fontSize: 20,
        fontFamily: 'Verdana, sans-serif',
        text: answer_text
    });
    
    setTimeout(
        function(){
            // re-clearing the canvas    
            $('canvas').drawRect({
                fillStyle: '#e3f0e3',
                x: 0, y: 0,
                width: 1000,
                height: 1000
            });
            // enabling action button
            $('#action').show();
        }
    ,1500); 
	}
	// if success
	else{
	
		$('canvas').drawRect({
			fillStyle: '#e3f0e3',
			x: 0, y: 0,
			width: 1000,
			height: 1000
		});
		// enabling action button
		$('#action').show();
	}
});