// 将原生方法抽象一下
function $(selector) { 
    return document.querySelector(selector);
}

// 将原生方法抽象一下
function $$(selector) { 
    return document.getElementById(selector);
}

// 主函数
function main() { 
    initMap(gameData[0]); // 初始化第一关数据

    var select = $('select');
    var html = '';
    for (var i = 0; i < 15; i++) {
        html += '<option>第' + (i + 1 )+ '关</option>';
    }

    select.innerHTML = html;

    // 选择关卡
    select.onchange = function(event) { 
        initMap(gameData[parseInt(this.value.substring(1, 3)) - 1])
        $('.level').innerHTML = 'level <span>' + (parseInt(this.value.substring(1, 3))) + '</span>';
        this.blur();
    }

    $('button').onclick = function(event) { // 重试
        initMap(gameData[parseInt(select.value.substring(1, 3)) - 1])
    }

    keyEvent();
}

// 画图
function initMap(data) { 
    var html = '';
    for (var i = 0; i < data.size.height; i++) {
        html += '<tr>';
        for (var j = 0; j < data.size.width; j++) {
            html += '<td id=' +  i + '_' + j + '></td>';
        }
        html += '</tr>';
    }
    $('table').innerHTML = html;
    setMapClass(data.map);
}

// 给每一个格子赋上一个类名
function setMapClass(data) { 
    keys = {
         5: "wall", // 墙
        10: "ground", // 地板
        20: "target", // 目标点
        60: 'man', // 人
        80: "real", // 箱子
    };

    data.forEach(function(e, i) {
        e.forEach(function(e, j) {           
            $$(i + '_' + j).className = keys[e];
            $$(i + '_' + j).dataset.class = keys[e];
        });
    });
}

// 监控键盘事件
function keyEvent() { 
    document.onkeydown = function(event) {
        var cur = $('.man').id.split('_');
        var row = cur[0];
        var col = cur[1];
        var rows = $('table').rows.length
        var cols = $('table').rows[0].cells.length
        var direction;
        switch (event.keyCode) {
            case 37: // 左
                 
                direction = 'l';
                col--;
                if (col < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col--;
                    if (col < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return;
                    }
                     
                    col++;
                }
                 
                break;
            case 38: // 上
                direction = 'u';
                row--;
                if (row < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row--;
                    if (row < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return;
                    }
                    row++;
                }
                break;
            case 39: // 右
                direction = 'r';
                col++;
                if (col >= cols || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col++;
                    if (col >= cols || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return;
                    }
                    col--;
                }
                break;
            case 40: // 下
                direction = 'd';
                row++;
                if (row >= rows || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row++;
                    if (row >= rows || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return;
                    }
                    row--;
                }
                break;
        }
         
        move(cur, [row, col], direction);
    }
}

// cur当前点 next下一点 direction代表移动方向
function move(cur, next, direction) { 
    var row = next[0];
    var col = next[1];
    if ($$(cur[0] + '_' + cur[1]).dataset.class == 'target') {
        $$(cur[0] + '_' + cur[1]).className = 'target';
    } else {
        $$(cur[0] + '_' + cur[1]).className = 'ground';
    }

    if ($$(next[0] + '_' + next[1]).className == 'ground' || $$(next[0] + '_' + next[1]).className == 'target') {
        $$(next[0] + '_' + next[1]).className = 'man';
    } else {
        switch (direction) {
            case 'u':
                row--;
                break;
            case 'r':
                col++;
                break;
            case 'd':
                row++;
                break;
            case 'l':
                col--;
                break;
        }

        if ($$(row + '_' + col).className == 'ground') {
            $$(row + '_' + col).className = 'real';
            $$(next[0] + '_' + next[1]).className = 'man';
        } else {
            $$(row + '_' + col).className = 'arrive';
            $$(next[0] + '_' + next[1]).className = 'man';
        }
    }
    setTimeout(function() {
        isWin();
    }, 1000)
}

function isWin() { // 是否过关
    if (!$('.real')) {
        if ($('.level span').innerHTML == '15') {
            alert('恭喜你通关全部关卡，这个游戏已经难不倒你了！');
            isWin = function(){};
        } else {
            alert('恭喜你通关了, 再接再励，攻克下一关');
            var level = parseInt($('.level span').innerHTML);
            initMap(gameData[level])
            $('.level').innerHTML = 'level <span>' + (level + 1) + '</span>';
            $('select').value = '第' + (level + 1) + '关';
        }
    }
}
main();