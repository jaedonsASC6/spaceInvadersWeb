var screenWidth = 400
var screenHeight = 900
var bulletSize = 10
var unitSize = 30
var fireRate = 100
var lastShot = 0
var level = 1
var enemiesPerLevel = 2
var enemiesLeft = enemiesPerLevel
var bullets = []
var enemies = []
let score = 0
let textSizeScore = 28
let textSizeWave = 28

function createBullet(x,y,xvel,yvel,team,type){
    var bullet = {
        x:x,
        y:y,
        xvel:xvel,
        yvel:yvel,
        team:team,
        size:bulletSize,
        type:type
    }
    return bullet
}
function createEnemy(x,y,xvel,yvel,team,type){
    var enemy = {
        x:x,
        y:y,
        xvel:xvel,
        yvel:yvel,
        team:team,
        type:type,
        health:3,
        size:unitSize,
        fireRate:1000,
        lastShot:0
    }
    return enemy
}

function checkCollision(obj1,obj2){
    var d = dist(obj1.x,obj1.y,obj2.x,obj2.y)
    return d < (obj1.size/2 + obj2.size/2)
}
var player = {
    health:3,
    x:screenWidth/2,    
    y:screenHeight - 60,
    size:unitSize
}

function setup(){
    createCanvas(screenWidth,screenHeight)
    for(let i = 0;i<enemiesLeft;i++){
        enemies.push(createEnemy(
            random(unitSize,screenWidth - unitSize),
            unitSize,
            random(-5,5),
            random(1,7),
            1
        ))
    }
}

function draw(){
    background(0)
    if(score > 9999){
        textSizeScore = 20
    }
    textSize(textSizeWave)
    text("Wave",50,20)
    text(level,100,50)
    textSize(textSizeScore)
    textSize(28)
    text(player.health,0,850)
    text("Score",screenWidth - 100,20)
    text(score,screenWidth - 100,50)
    textSize(32)
    text(enemiesLeft,screenWidth/2,80)
    fill("#a020f0")
    ellipse(player.x,player.y,unitSize)
    if(player.x > screenWidth){
        player.x = 30
    }
    if(player.x < 0){
        player.x = screenWidth - 30
    }
    if(player.health <= 0){
        alert("Game Over \nYou Made It to Wave " + level + "\nWith " + score + " Points")
        player = {
            health:3,
            x:screenWidth/2,    
            y:screenHeight - 60,
            size:unitSize
        }
        bullets = []
        enemies = []
        level = 1
        score = 0
        enemiesLeft = enemiesPerLevel
        for(let i = 0;i<enemiesLeft;i++){
            enemies.push(createEnemy(
                random(unitSize,screenWidth - unitSize), 
                unitSize, 
                random(-5,5),
                random(1,7),
                1 
            ))
        }
    }
    runEntities();
    keyInput();
    if(enemiesLeft == 0){
        level++
        enemiesLeft = level * enemiesPerLevel
        for(let i = 0;i<enemiesLeft;i++){
            enemies.push(createEnemy(
                random(unitSize,screenWidth - unitSize), 
                unitSize, 
                random(-2,2), 
                random(1,4), 
                1 
            ))
        }
    }
}

function runEntities(){
    for(bullet of bullets) {
        if(bullet.team == 0){
            fill("#008000")
        } else if(bullet.team == 1){
            fill("#FF0000")
        } 
        ellipse(bullet.x,bullet.y,bulletSize)
        bullet.x += bullet.xvel
        bullet.y += bullet.yvel
        if(bullet.team == 0){
            for(enemy of enemies) {
                if(checkCollision(bullet,enemy)){
                    bullets.splice(bullets.indexOf(bullet),1)
                    enemy.health -= 1
                }
            }
        } else if(bullet.team == 1){
            if(checkCollision(bullet,player)){
                bullets.splice(bullets.indexOf(bullet),1)   
                player.health -= 1
            }
        }
        
    } 
    for(enemy of enemies) {
        fill("#FFFF00")
        ellipse(enemy.x,enemy.y,unitSize)
        enemy.x += enemy.xvel
        enemy.y += enemy.yvel
        if(Math.random() < 0.1){
            if(enemy.lastShot < millis()){
                enemy.lastShot = millis() + enemy.fireRate
                bullets.push(createBullet(enemy.x,enemy.y,0,8,1))
            }
        }
        if(enemy.x > screenWidth){
            enemy.x = 30
        }
        if(enemy.x < 0){
            enemy.x = screenWidth - 30
        }
        if(enemy.y > screenHeight){
            enemy.y = 30
        }
        if(enemy.health <= 0){
            score += level * 10
            enemiesLeft--
            enemies.splice(enemies.indexOf(enemy),1)
        }
    } 
}   

function keyInput(){
    if(keyIsDown(37)){
        player.x -= 5
    }
    if(keyIsDown(39)){
        player.x += 5
    }
    if(keyIsDown(32)){
        if(lastShot < millis()){
            lastShot = millis() + fireRate
            bullets.push(createBullet(player.x,player.y,0,-10,0))
        }
    }
}