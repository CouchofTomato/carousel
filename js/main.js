"use strict";

const dir = '../images';
const req = new Request(dir, {method: 'GET', cache: 'reload'});
const container = document.querySelector('#container');
const previousImage = document.getElementById('prev');
const nextImage = document.getElementById('next');
const circDiv = document.getElementById('circs');
var timer;


Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
};

const next = function next() {
  let el = document.querySelector('.current');
  let sibling = el.nextSibling;
  if(sibling) {
    el.classList.remove('current');
    sibling.classList.add('current');
  } else {
    let img = document.querySelector('img');
    el.classList.remove('current');
    img.classList.add('current');
  }
  updateCircDiv();
  resetSlides();
};

const prev = function prev() {
  let el = document.querySelector('.current');
  let sibling = el.previousSibling;
  if(sibling) {
    el.classList.remove('current');
    sibling.classList.add('current');
  } else {
    let img = document.querySelectorAll('img');
    el.classList.remove('current');
    img[(img.length)-1].classList.add('current');
  }
  updateCircDiv();
  resetSlides();
};

const createCircs = function createCircs(num) {
  for (let i = 0; i < num; i++) {
    let el = document.createElement('div');
    el.classList.add('photo-select');
    if(i === 0) {
      el.classList.add('photo-select-active');
    }
    circDiv.append(el);
  }
};

const circListener = function circListener() {
  let el = document.getElementsByClassName('photo-select');
  for (let i = 0; i < el.length; i++) {
    el[i].addEventListener('click', function(ev) {
      let elClicked = ev.srcElement;
      let circDivs = document.getElementsByClassName('photo-select')
      for (let j = 0; j < circDivs.length; j++) {
        if(circDivs[j] === elClicked) {
          let elRemove = document.querySelector('.photo-select-active');
          elRemove.classList.remove('photo-select-active');
          circDivs[j].classList.add('photo-select-active');
          let imgs = container.getElementsByTagName('img');
          let currentImg = document.querySelector('.current');
          currentImg.classList.remove('current');
          imgs[j].classList.add('current');
          resetSlides();
        }
      }
    });
  }
};

const updateCircDiv = function updateCircDiv() {
  let imgs = container.getElementsByTagName('img');
  let circDivs = circDiv.getElementsByTagName('div');
  let current = document.querySelector('.current');
  for (let i = 0; i < imgs.length; i++) {
    if(imgs[i] === current) {
      let elRemove = document.querySelector('.photo-select-active');
      elRemove.classList.remove('photo-select-active');
      circDivs[i].classList.add('photo-select-active');
    }
  }
};

const startSlides = function startSlides() {
  timer = setInterval(next, 5000);
};

const resetSlides = function resetSlides() {
  clearInterval(timer);
  timer = setInterval(function() {
    next();
  }, 5000);
};

fetch(req)
  .then(function(data) {
    return data.text();
  })
  .then(function(html) {
    let matches = html.match(/\w+.jpg/g);
    matches = matches.unique();
    return matches;
  })
  .then(function(matched) {
    let imageArr = [];
    for (let i = 0; i < matched.length; i++) {
      let string = "images/" + matched[i];
      let image = document.createElement("img");
      image.src = string;
      image.classList.add('img-size');
      imageArr.push(image);
      container.append(image);
    }
    return imageArr;
  })
  .then(function(images) {
    let image = images[0];
    image.classList.add('current');
    createCircs(images.length);
    circListener();
    startSlides();
  })
  .catch(function(error) {
    console.log(error);
});

document.addEventListener('DOMContentLoaded', function() {
  previousImage.addEventListener('click', function() {
    prev();
  });
  nextImage.addEventListener('click', function() {
    next();
  });
});