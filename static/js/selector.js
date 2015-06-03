import EventEmitter from './event';

function createSelector(items) {
  var node = document.createElement('div'),
      ul = document.createElement('ul');
 
  node.classList.add('dropdown'); 
  node.appendChild(ul);

  for( let {item,value,extra} of items ) {
    let li = document.createElement('li');
    li.dataset["value"] = value;
    li.innerHTML = item; 

    if(extra) li.appendChild(extra);

    ul.appendChild(li);
  }

  document.body.appendChild(node);
  return node;
}

export default class Selector extends EventEmitter {
  constructor({ btn, items = [] }) {
    super();
    this.button = btn;
    this.selector = createSelector(items);

    this.selector.style.left = this.button.getBoundingClientRect().left + 'px';
    this.selector.style.top = this.button.innerHeight + 'px';

    this.bindEventHandlers();
  }

  bindEventHandlers() {

    this.button.addEventListener('click',this.toggle.bind(this));
    let buttons = this.selector.querySelectorAll('li');
    for( let button of buttons ) {
      button.addEventListener('click',this.select.bind(this));
    } 
  }

  toggle() {
    this.selector.classList.toggle('visible');
  }

  hide() {
    this.selector.classList.remove('visible');
  }

  select(e) {
    this.trigger("select",e.target.dataset.value);
    this.toggle();
  }
}
