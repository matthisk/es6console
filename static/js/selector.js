import EventEmitter from './event';

function createSelector(items, checkbox=false) {
  var node = document.createElement('div'),
      ul = document.createElement('ul');
 
  node.classList.add('dropdown'); 
  node.appendChild(ul);

  for( let {item,value,extra,checked=false} of items ) {
    let li = document.createElement('li');
    li.dataset["value"] = value;

    if (checkbox) {
        var c = document.createElement('input');
        c.type = 'checkbox';
        c.value = value;
        c.name = item;
        c.checked = checked;
        var s = document.createElement('span');
        s.innerHTML = item;
        li.appendChild(c);
        li.appendChild(s);
    } else {
        li.innerHTML = item; 
    }

    if(extra) li.appendChild(extra);

    ul.appendChild(li);
  }

  document.body.appendChild(node);
  return node;
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
} 

export default class Selector extends EventEmitter {
  constructor({ btn, items = [], checkbox = false }) {
    super();
    this.button = btn;
    this.checkbox = checkbox;
    this._inside = false;
    this.selector = createSelector(items, checkbox);

    this.selector.style.left =getOffset( this.button ).left + 'px';
    this.selector.style.top = this.button.innerHeight + 'px';

    this.bindEventHandlers();
  }

  bindEventHandlers() {
    this.selector.addEventListener('mousedown', this.isInside.bind(this, true));
    this.selector.addEventListener('mouseup', this.isInside.bind(this, false));
    this.button.addEventListener('mousedown', this.isInside.bind(this, true));
    this.button.addEventListener('mouseup', this.isInside.bind(this, false));

    window.addEventListener('mousedown', this.pageClick.bind(this));
    this.button.addEventListener('click',this.toggle.bind(this));
    let buttons = this.selector.querySelectorAll('li');
    for( let button of buttons ) {
      button.addEventListener('click',this.select.bind(this));
    } 
  }

  isInside(b) {
    this._inside = b;
  }

  pageClick(event) {
    if (!this._inside) {
        this.selector.classList.remove('visible');
    } 
  }

  toggle() {
    this.selector.classList.toggle('visible');
  }

  hide() {
    this.selector.classList.remove('visible');
  }

  select(e) {
    if (this.checkbox) {

    } else {
    }
    var text = this.button.childNodes[0];
    if (this.checkbox) {
        let v = '';
        let a = [];
        for( let n of this.selector.querySelectorAll('input:checked') ) {
            a.push(n.name);
        }
        text.nodeValue = 'Presets: ' + a.join(', ');
    } else {
        text.nodeValue = e.target.textContent + ' ';
    }

    if (this.checkbox) {
        let a = [];
        for( let n of this.selector.querySelectorAll('input:checked') ) {
            a.push(n.value);
        }
        this.trigger("select", a);
    } else {
        this.trigger("select",e.target.dataset.value);
        this.toggle();
    }
  }
}
