function logMessage(msg, color) {
    if (!color) { color = 'black'; }
    var div = document.createElement('div');
    div.innerHTML = msg;
    div.style.color = color;
    document.getElementById('log').appendChild(div);
}
var gameover = false;
var battle = false;
function Character(name, hp, att) {
    this.name = name;
    this.hp = hp;
    this.att = att;
}
Character.prototype.attacked = function (damage) {
    this.hp -= damage;
    logMessage(this.name + '의 체력이 ' + this.hp + '가 되었습니다');
    if (this.hp <= 0) {
        battle = false;
    }
};
Character.prototype.attack = function (target) {
    logMessage(this.name + '이 ' + target.name + '을 공격합니다, 공격력 : ' +this.att ,'RosyBrown ');
    target.attacked(this.att);
};

function Hero(name, hp, att, lev, xp) {
    Character.apply(this, arguments);
    this.lev = lev || 1;
    this.xp = xp || 0;
    this.itemBox = new itemBox(0,0);
}
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.attacked = function (damage) {
    if(this.hp -damage <0){
            var selectedItem;
            if(this.itemBox.numOfCake > 0 ||this.itemBox.numOfPotion > 0){
                if(this.itemBox.numOfCake >= this.itemBox.numOfPotion)
                    selectedItem = this.itemBox.cake;
                else 
                    selectedItem = this.itemBox.potion;
                this.useItem(selectedItem)
            }
    }
    /*if(this.hp >= 0 && this.hp <30){

    }*/
    this.hp -= damage;
    logMessage(this.name + '님의 체력이 ' + this.hp + '남았습니다');
    if (this.hp <= 0) {
        logMessage('죽었습니다. 레벨' + this.lev + '에서 모험이 끝납니다. F5를 눌러 다시 시작하세요', 'red');
        battle = false;
        gameover = true;
    }
};
Hero.prototype.attack = function (target) {
    logMessage(this.name + '님이 ' + target.name + '을 공격합니다');
    target.attacked(this.att);
    if (target.hp <= 0) {
        this.gainXp(target);
        if(target.hasItem == true){
            logMessage('몬스터가 '+target.item.type+'을 소유하고 있습니다.');
            this.getItem(target.item);
        }
    }
};
Hero.prototype.gainXp = function (target) {
    logMessage('전투에서 승리하여 ' + target.xp + '의 경험치를 얻습니다', 'blue');
    this.xp += target.xp;
    if (this.xp > 100 + 10 * this.lev) {
        this.lev++;
        logMessage('레벨업! ' + this.lev + ' 레벨이 되었습니다', 'blue');
        this.hp = 100 + this.lev * 10;
        this.xp -= 10 * this.lev + 100;
        logMessage('현재 hp : '+this.hp);
    }
};
Hero.prototype.getItem= function (item) {
    logMessage(this.name+'님이 아이템 ' + item.type + '을 획득하였습니다.');
    switch(item.type){
        case 'potion':
            if(this.itemBox.numOfPotion == 0){ this.itemBox.potion = item;}
            this.itemBox.numOfPotion++;
            break;
        case 'cake':
            if(this.itemBox.numOfCake == 0){ this.itemBox.cake = item;}
            this.itemBox.numOfCake++;
            break;
    }
    console.log(this);
};
Hero.prototype.useItem = function (item) {
    
    switch(item.type){
        case 'potion':
            this.itemBox.numOfPotion--;
            this.hp += this.itemBox.potion.hp;
            if(this.itemBox.numOfPotion == 0){ this.itemBox.potion = {};}
            break;
        case 'cake':
            this.itemBox.numOfCake--;
            this.hp += this.itemBox.cake.hp;
            if(this.itemBox.numOfCake == 0){ this.itemBox.cake = {}};
            break;  
    }
    logMessage(this.name+'님이 아이템 '+item.type+'을 사용하여 ' +item.hp+ 'hp를 회복하였습니다.', 'HotPink');
    console.log(this);
};

function Monster(name, hp, att, lev, xp,hasItem) {
    Character.apply(this, arguments);
    this.lev = lev || 1;
    this.xp = xp || 10;
    this.hasItem = hasItem;
    if(this.hasItem==true){
        this.item = new makeItem();
    }

}
Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;
function makeMonster() {
    var monsterArray = [
        ['rabbit', 25, 3, 1, 35],
        ['skeleton', 50, 6, 2, 50],
        ['soldier', 80, 4, 3, 75],
        ['king', 120, 9, 4, 110],
        ['devil', 200, 25, 6, 180]
    ];
    var monster = monsterArray[Math.floor(Math.random() * 5)];
    //아이템 여부는 Monster 객체 생성 할 때 넣어준다.
    var hasItem = Math.floor(Math.random() *2)
    if(hasItem) hasItem = true;
    else hasItem = false;
    return new Monster(monster[0], monster[1], monster[2], monster[3], monster[4],hasItem);
}

function Item(type,hp) {
    this.type = type;
    this.hp = hp;
}
function makeItem(){
    var ItemArray = [
        ['potion',30],
        ['cake',50],
    ];
    var selectedItem = ItemArray[Math.floor(Math.random()*ItemArray.length)]
    return new Item(selectedItem[0],selectedItem[1]);
}
function itemBox(potion,cake) {
    this.numOfPotion = potion;
    this.numOfCake = cake;
    this.potion = {};
    this.cake = {};
}

var hero = new Hero(prompt('이름을 입력'), 100, 10);
logMessage(hero.name + '님이 모험을 시작합니다. 어느 정도까지 성장할 수 있을까요?');
while (!gameover) {
    var monster = makeMonster();
    logMessage('<br>'+monster.name + '을 마주쳤습니다. 전투가 시작됩니다', 'green');
    battle = true; while (battle) {
        hero.attack(monster);
        if (monster.hp > 0) {
            monster.attack(hero);
        }
    }
}