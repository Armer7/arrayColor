"use strict";

// Задание Цвета

let divColor = [
  {
    id: 1,
    name: 'red',
    type: 'rgb',
    value: '255, 0, 0'
  },
  {
    id: 2,
    name: 'green',
    type: 'hex',
    value: '00ff00'
  },
  {
    id: 3,
    name: 'blue',
    type: 'rgba',
    value: '0, 0, 255, 0.8'
  }
];

// Инициализация списка
//===================================
function initial() {
  let currentDiv = document.getElementById('viewBox');
  currentDiv.innerHTML = '';
  let cookies = getCookie('colors');
  if (cookies) {
    divColor = JSON.parse(cookies);
  } else {
    setCookie('colors', JSON.stringify(divColor), {'max-age': 3600});
  }
  divColor.forEach(colors => SetDivColor(colors));
}

// Рендеринг окошка с цветом
//==================================
function SetDivColor(currentColor) {
  let currentDiv = document.getElementById('viewBox');
  let currentId = currentColor.id;
  let colorToRgba = '';
  let color = '';
  switch (currentColor.type) {
    case 'hex': {
      color = addPound(currentColor.value);
      colorToRgba = `rgba(${hexToRgb(currentColor.value)}, 0.6)`;
      break;
    }
    case 'rgb': {
      color = `rgb(${currentColor.value})`;
      colorToRgba = `rgba(${currentColor.value}, 0.6)`;
      break;
    }
    case 'rgba': {
      color = `rgba(${currentColor.value})`;
      let tempColor = currentColor.value.split(',');
      colorToRgba = `rgba(${tempColor[0]}, ${tempColor[1]}, ${tempColor[2]}, 0.6)`;
      break;
    }
  }

  let div = document.createElement('div');
  let newDiv = div.cloneNode(true);
  div.id = `box${currentId}`;
  div.classList.add('viewColor');
  div.style.cssText = `border-color: ${color};`;
  newDiv.style.cssText = `background-color: ${colorToRgba};`;
  let p = document.createElement('p');
  let newP;
  newP = p.cloneNode(true);
  newP.innerHTML = `${currentColor.name.toUpperCase()}`;
  newDiv.appendChild(newP);
  newP = p.cloneNode(true);
  newP.innerHTML = `${currentColor.type.toUpperCase()}`;
  newDiv.appendChild(newP);
  newP = p.cloneNode(true);
  newP.innerHTML = `${currentColor.value}`;
  newDiv.appendChild(newP);
  div.appendChild(newDiv);
  currentDiv.appendChild(div);
}


//Получаем куки по имени
//==============================
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


//записываем куки
//===============================
function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

// проверяем правильность формата
//===================================
function checkHex(hex) {
  const hexRegex = /^[#]*([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
  if (hexRegex.test(hex)) return true;
}

function checkRgb(rgb) {
  const rgbRegex = /(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*)/i;
  if (rgbRegex.test(rgb)) return true;
}

function checkRgba(rgba) {
  const rgbRegex = /(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1))))/i;
  if (rgbRegex.test(rgba)) return true;
}


//=========================================


// преобразуем 3-х значное значение НЕХ в шестизначное
//==========================================================
function modifyHex(hex) {
  if (hex.length === 4) {
    hex = hex.replace('#', '');
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return hex;
}

// Конвертация НЕХ в RGB
//==========================================
function hexToRgb(hex) {
  let x = [];
  if (hex.length !== 6) {
    hex = modifyHex(hex)
  }
  x.push(parseInt(hex.slice(0, 2), 16));
  x.push(parseInt(hex.slice(2, 4), 16));
  x.push(parseInt(hex.slice(4, 6), 16));
  return x.toString();
}

// Добавляем хештег для стиля
//===========================================
function addPound(x) {
  return '#' + x;
}


// Принимает данные формы и обрабатываем
//=============================================
function colorSave(e) {
  e.preventDefault();
  let form = document.forms[0];

  // Поля для ошибок
  let nameColorError = document.getElementById('nameColorError');
  let codeError = document.getElementById('codeError');

  // Введенные значения
  let nameColor = document.getElementById('nameColor')
    .value.toLowerCase().trim();
  let codeColor = document.getElementById('codeColor').value.trim();
  let typeColor = document.getElementById('typeColor').value;
  if (!nameColor) {
    nameColorError.innerHTML = 'Введите имя!';
    return false;
  }

  if (divColor.filter(word => word.name === nameColor).length > 0) {
    nameColorError.innerHTML = 'Такое имя уже есть';
    return false;
  }
  switch (typeColor) {
    case 'hex': {
      if (checkHex(codeColor)) {
        codeColor = codeColor.replace('#', '');
        codeColor = modifyHex(codeColor);
      } else {
        codeError.innerHTML = 'Введите цвет в формате #FFF или #FFFFFF';
        return false;
      }
      break;
    }
    case 'rgb': {
      if (!checkRgb(codeColor)) {
        codeError.innerHTML = 'Введите цвет в формате 255,255,255';
        return false;
      }
      break;
    }
    case 'rgba': {
      if (!checkRgba(codeColor)) {
        codeError.innerHTML = 'Введите цвет в формате 255,255,255,0.9';
        return false;
      }
      break;
    }
  }
  let newId = divColor[divColor.length - 1].id + 1;
  let objColor = {
    id: newId,
    name: nameColor,
    type: typeColor,
    value: codeColor
  };
  divColor.push(objColor);
  setCookie('colors', JSON.stringify(divColor), {'max-age': 3600});
  SetDivColor(objColor);
}

function checkNameColor() {
  let input = document.getElementById('nameColor');
  input.value = input.value.replace(/[0-9\.]/g, '');
  nameColorError.innerHTML = '';
}

function checkCodeColor() {
  codeError.innerHTML = '';
}

initial();
