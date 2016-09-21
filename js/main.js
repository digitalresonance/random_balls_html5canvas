        // Request an animation frame every Mili second
        window.requestAnimFrame = (function (callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();


        //Function to resize canvas OnLoad and OnResize
        function resizeCanvas() {
            canvas = document.getElementById("myCanvas");

            canvas.width = window.innerWidth - 5;
            canvas.height = window.innerHeight - 5;
        }

        //Global variables
        var canvas = document.getElementById('myCanvas');
        var balls = [];
        var date = new Date();
        var time = date.getTime();

        var mousePos = {
            x: 9999,
            y: 9999
        };

        //Get mouse position
        function getMousePos(canvas, evt) {
            // get canvas position
            var obj = canvas;
            var top = 0;
            var left = 0;
            while (obj.tagName != 'BODY') {
                top += obj.offsetTop;
                left += obj.offsetLeft;
                obj = obj.offsetParent;
            }

            // return relative mouse position
            var mouseX = evt.clientX - left + window.pageXOffset;
            var mouseY = evt.clientY - top + window.pageYOffset;
            return {
                x: mouseX,
                y: mouseY
            };
        }

        //Listener for mouse click event
        //Generate a new ball each time the mouse is clicked
        canvas.addEventListener('mouseup', function (evt) {            
            var pos = getMousePos(canvas, evt);
            mousePos.x = pos.x;
            mousePos.y = pos.y;
            balls.push(initBalls());
        });

        //Ball Object
        function Ball(x, y, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.radius = 15;            
        }

        // Randomly Generate a ball in Rainbow colors and add it to the collection of existing balls.
        // Randomly generate the direction and force imarted on the ball
       
        function initBalls() {
            var colors = ['#ff0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
            var force = [-8,-7,-6,-5,-4,-3,-2,2, 3, 4, 5,6,7,8]; 
            var randomcolor = colors[Math.floor(Math.random() * colors.length)];
            var randomvx = force[Math.floor(Math.random() * force.length)];
            var randomvy = force[Math.floor(Math.random() * force.length)];

            return (new Ball(mousePos.x, mousePos.y, randomvx, randomvy, randomcolor));
        }



        //Function to update the ball position
        function updateBalls(canvas, balls, timeDiff) {
            var context = canvas.getContext('2d');
            var collisionDamper = 0.3;
            var gravity = 0.1;
            var friction = 0.0005 * timeDiff;

            for (var n = 0; n < balls.length; n++) {
                var ball = balls[n];
                // set ball position based on velocity
                
                ball.y += ball.vy;
                ball.x += ball.vx;

                //Gravity                
                if (ball.y < canvas.height - (ball.radius + 5)) { // only apply gravity if the ball is above the canvas height - (radius of the ball + buffer)
                    ball.vy += gravity;
                }
                
                //Friction (to bring ball to a stop)                
                if (ball.vx < 0) {
                    ball.vx += friction;
                }
                else if (ball.vx > 0) {
                    ball.vx -= friction;
                }

                // Only apply height friction if the ball is above the canvas height - (radius of the ball + buffer)
                // This is to prevent the ball from stopping in midair.
                if (ball.y < canvas.height - (ball.radius + 5)) { 
                    if (ball.vy < 0) {
                        ball.vy += friction;
                    }
                    else if (ball.vy > 0){
                        ball.vy -= friction;
                    }
                }


                // floor condition
                if (ball.y > (canvas.height - ball.radius)) {
                    ball.y = canvas.height - ball.radius - 2;
                    //Only evaluate when ball velocity is higher than the given range.
                    //Without this condition stopping the ball becomes far too slow to be perceptable.
                    if((ball.vy > 0.5) ||(balls.vy < -0.5)) { 
                        ball.vy *= -1;
                        ball.vy *= (1 - collisionDamper);
                    }
                    else {
                        ball.vy = 0;
                    }
                }

                // ceiling condition
                if (ball.y < (ball.radius)) {
                    ball.y = ball.radius + 2;
                    ball.vy *= -1;
                    ball.vy *= (1 - collisionDamper);
                }

                // right wall condition
                if (ball.x > (canvas.width - ball.radius)) {
                    ball.x = canvas.width - ball.radius - 2;
                    ball.vx *= -1;
                    ball.vy *= (1 - collisionDamper);
                }

                // left wall condition
                if (ball.x < (ball.radius)) {
                    ball.x = ball.radius + 2;
                    ball.vx *= -1;
                    ball.vy *= (1 - collisionDamper);
                }
            }
        }

        function animate(canvas, balls, lastTime, mousePos) {
            var context = canvas.getContext('2d');

            // update
            var date = new Date();
            var time = date.getTime();
            var timeDiff = time - lastTime;
            updateBalls(canvas, balls, timeDiff, mousePos);
            lastTime = time;

            // clear
            context.clearRect(0, 0, canvas.width, canvas.height);

            // render
            for (var n = 0; n < balls.length; n++) {
                var ball = balls[n];
                context.beginPath();
                context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
                context.fillStyle = ball.color;
                context.fill();
            }

            // request new frame
            requestAnimFrame(function () {
                animate(canvas, balls, lastTime, mousePos);
            });
        }

        animate(canvas, balls, time, mousePos);