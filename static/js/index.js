import Compilers from './compilers';
import Editors from './editors';
import Console from './console';
import SandBox from './sandbox';
import Selector from './selector';
import ajax from './util/Ajax';

function compilerItemExtra(url) {
  var node = document.createElement('a');
  node.setAttribute('href',url);
  node.setAttribute('target','_blank');

  var i = document.createElement('i');
  i.setAttribute('class','fa fa-external-link');

  node.appendChild(i);
  return node;
}

var $ = document.querySelector.bind(document),
    compilerItems = [
          {item:'Babel JS (6)',value:'Babel',extra:compilerItemExtra('https://babeljs.io')},
          {item:'Babel JS (5)',value:'Babel5',extra:compilerItemExtra('https://github.com/babel/babel/tree/5.x')},
          {item:'Traceur',value:'Traceur',extra:compilerItemExtra('https://github.com/google/traceur-compiler')},
          {item:'TypeScript',value:'TypeScript',extra:compilerItemExtra('http://www.typescriptlang.org/')},
          {item:'Regenerator',value:'Regenerator',extra:compilerItemExtra('https://github.com/facebook/regenerator')}],
    presetItems = [
        {item: 'es2015', value:'es2015', checked: true },
        {item: 'es2016', value:'es2016', checked: false },
        {item: 'es2017', value:'es2017', checked: false },
        {item: 'react', value:'react', checked: false },
        {item: 'stage-0', value:'stage-0', checked: false },
        {item: 'stage-1', value:'stage-1', checked: false },
        {item: 'stage-2', value:'stage-2', checked: false },
        {item: 'stage-3', value:'stage-3', checked: false },
    ];
(function() {
  // DOM Elements
  var wrapper = $('.wrapper'),
      inputTextArea = $("#input"),
      outputTextArea = $("#output"),
      compilerSelectBtn = $("#compiler-select"),
      compilerSelect = $('.transformers'),
      compilerLoader = $("#compiler-loader"),
      presetsSelectBtn = $('#babel-6-presets'),
      runBtn = $("#run"),
      saveBtn = $("#save"),
      transformBtn = $("#transform"),
      shareBtn = $(".btn-share"),
      shareView = $(".share-view");

  var cnsl,
      sandbox,
      inputEditor, outputEditor,
      compiler = 'Babel',
      selector,
      presets;

  (function init() {
    sizeWindow( wrapper );
    cnsl = new Console();
    sandbox = new SandBox( cnsl );
    selector = new Selector({ btn: compilerSelectBtn, el: compilerSelect, items:compilerItems  });
    presets = new Selector({ btn: presetsSelectBtn, items:presetItems, checkbox: true  });

    [inputEditor,outputEditor] = Editors.create( inputTextArea, outputTextArea );

    if (!inputTextArea.textContent) {
        inputEditor.setValue(loadLocalStorage());
    }

    loadCompiler('Babel');
    loadExamples();
    bindEventHandlers();
    inputEditor.focus();
  })();

  function sizeWindow( wr ) {
    var height = window.innerHeight - 55;
    
    wr.style.display = 'block';
    wr.style.height = `${height+15}px`;
    wrapper.querySelector('.editor-wrapper').style.height = `${Math.round(0.7 * height)}px`;
    wrapper.querySelector('#console-output').style.height = `${Math.round(0.3 * height)}px`;   

    window.onresize = () => sizeWindow(wr);
  }

  function transform() {
    Editors.clearErrors( inputEditor );

    let { errors = [], code = '' } = Compilers[ compiler ].compile( inputEditor.getValue() );

    outputEditor.setValue( code );
    Editors.setErrorMarkers( inputEditor, errors );
  }

  function loadLocalStorage() {
    if( window.localStorage ) {
      var code = localStorage.getItem('code');
      if( code ) return code;
      else return '';
    }
  }

  function saveLocalStorage(editor) {
    if( window.localStorage ) {
      localStorage.setItem('code',editor.getValue());
    }
  }

  function save() {
    var p = ajax({
      type : 'POST',
      url : '/save',
      data : { code : inputEditor.getValue() }
    });

    return p.then(( data ) => {
      if( data.saved ) {
        window.history.pushState({code:data.code},"",`/${data.id}/`);
        shareBtn.style.display = 'block';
      }
    });
  }

  function run(input, onlyUpdate = false) {
    sandbox.updateUserCode(outputEditor.getValue(), onlyUpdate);
    if( input ) return sandbox.runCode(input);
  }

  function showShare() {
    let link = shareView.querySelector('.share-view-url');
    let twitter = shareView.querySelector('.tweet');
    let shareLink = window.location.toString();
    let tweet = `Check out my ES6 code: ${ shareLink }`;

    twitter.href = `//twitter.com/home?status=${encodeURIComponent( tweet )}`;
    link.value = shareLink;

    shareView.classList.toggle('visible');
  }

  function loadCompiler(name) {
    let done = spinner(compilerLoader);
    compiler = name;
    
    Compilers[name].initCompiler(() => {
      done();
      transform(); 
    });
  }

  function hidePresets(name) {
    if (name !== 'Babel') {
        presetsSelectBtn.style.display = 'none';
    } else {
        presetsSelectBtn.style.display = 'block';
    }
  }

  function spinner(el) {
    let oldClasses = el.className;
    el.className = 'fa fa-spinner fa-pulse';
   
    return function() {
      el.className = oldClasses;
    }; 
  }

  function loadExample(name) {
    let done = spinner($('#example-loader'));
    var p = ajax({
      type: 'GET',
      json: false,
      url: '/examples/' + name
    });

    return p.then(data => {
      done();
      inputEditor.setValue(data);
    });
  }

  function loadExamples() {
    var p = ajax({
      type: 'GET',
      url: '/examples/'
    });

    return p.then(data => {
      var examples = [],
          btn = $('#examples');

      for( let ex of data.examples ) {
        examples.push({item:ex.slice(0,-3),value:ex});
      }

      var selector = new Selector({ btn, items : examples });

      selector.on('select',loadExample);
    });
  }

  function setPresets(presets) {
    window.Babel6Presets = presets;
  }

  function bindEventHandlers() {
    transformBtn.addEventListener('click',transform)
    runBtn.addEventListener('click',() => run());
    saveBtn.addEventListener('click', save);
    shareBtn.addEventListener('click',showShare);
    cnsl.evaluate = code => run(code, true);

    selector.on('select',loadCompiler);
    selector.on('select',hidePresets);
    presets.on('select', setPresets);

    inputEditor.on('change',transform);
    inputEditor.on('change',saveLocalStorage);

    var cmdEnter = (editor,event) => {
      if(event.metaKey && event.keyCode == 13) run();
    };
    outputEditor.on('keydown', cmdEnter);
    inputEditor.on('keydown', cmdEnter);
    cnsl.input.on('keydown', cmdEnter);
  }
})();
