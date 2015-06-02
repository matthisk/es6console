import Compilers from './compilers';
import Editors from './editors';
import Console from './console';
import SandBox from './sandbox';
import CompilerSelect from './selector';
import ajax from './util/Ajax';

var $ = document.querySelector.bind(document);

(function() {
  // DOM Elements
  var wrapper = $('.wrapper'),
      inputTextArea = $("#input"),
      outputTextArea = $("#output"),
      compilerSelectBtn = $("#compiler-select"),
      compilerSelect = $('.transformers'),
      compilerLoader = $("#compiler-loader"),
      runBtn = $("#run"),
      saveBtn = $("#save"),
      transformBtn = $("#transform"),
      shareBtn = $(".btn-share"),
      shareView = $(".share-view");

  var cnsl = new Console(),
      sandbox = new SandBox( cnsl ),
      inputEditor, outputEditor,
      compiler = 'Babel',
      selector = new CompilerSelect({ btn: compilerSelectBtn, el: compilerSelect });

  (function init() {
    sizeWindow( wrapper );
    [inputEditor,outputEditor] = Editors.create( inputTextArea, outputTextArea );

    router( /^\/(\w+)\/$/, snippetRoute );

    loadCompiler('Babel');
    bindEventHandlers();
    inputEditor.focus();
  })();

  function sizeWindow( wr ) {
    var height = window.innerHeight - 85;
    
    wr.style.display = 'block';
    wr.style.height = `${height+15}px`;
    wrapper.querySelector('.editor-wrapper').style.height = `${Math.round(0.7 * height)}px`;
    wrapper.querySelector('#console-output').style.height = `${Math.round(0.3 * height)}px`;   

    window.onresize = () => sizeWindow(wr);
  }

  function router( pattern, route ) {
    var match = window.location.pathname.match( pattern );
    
    if( match !== null ) {
      route( ...match );
    }
  }

  function snippetRoute( path, id ) {
    shareBtn.style.display = 'block';
    return fetchCodeFor( id );
  }

  function fetchCodeFor( id ) {
    var p = ajax({
      type: 'GET',
      url: `/snippets/${id}`
    });

    return p.then( res => inputEditor.setValue(res.code) );
  }

  function transform() {
    Editors.clearErrors( inputEditor );

    let { errors = [], code = '' } = Compilers[ compiler ].compile( inputEditor.getValue() );

    outputEditor.setValue( code );
    Editors.setErrorMarkers( inputEditor, errors );
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

  function run( input ) {
    sandbox.runCode( outputEditor.getValue() + input );
    cnsl.clear();
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
    compiler = name;
    let oldClasses = compilerLoader.className;
    compilerLoader.className = 'fa fa-spinner fa-pulse';
    Compilers[name].initCompiler(() => {
      compilerLoader.className = oldClasses;
      transform(); 
    });
  }

  function bindEventHandlers() {
    transformBtn.addEventListener('click',transform)
    runBtn.addEventListener('click',() => run());
    saveBtn.addEventListener('click', save);
    shareBtn.addEventListener('click',showShare);

    selector.on('load',loadCompiler);

    cnsl.on('run',run);
    inputEditor.on('change',transform);

  }
})();
