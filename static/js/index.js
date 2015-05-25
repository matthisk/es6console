import Compilers from './compilers';
import Editors from './editors';
import Console from './console';
import SandBox from './sandbox';
import ajax from './util/Ajax';

var $ = document.querySelector.bind(document);

function resize( wr ) {
  wr.style.height = `${window.innerHeight - 70}px`;
  wr.style.display = 'block';

  window.onresize = () => resize(wr);
}

(function() {
  // DOM Elements
  var wrapper = $('.wrapper'),
      inputTextArea = $("#input"),
      outputTextArea = $("#output"),
      compilerSelect = $("#compiler"),
      compilerLoader = $("#compiler-loader"),
      runBtn = $("#run"),
      saveBtn = $("#save"),
      transformBtn = $("#transform"),
      shareBtn = $(".btn-share"),
      shareView = $(".share-view");

  var cnsl = new Console(),
      sandbox = new SandBox( cnsl ),
      inputEditor, outputEditor;

  (function init() {
    resize( wrapper );
    [inputEditor,outputEditor] = Editors.create( inputTextArea, outputTextArea );

    router( /^\/(\w+)\/$/, snippetRoute );

    loadCompiler('Babel');
    bindEventHandlers();
    inputEditor.focus();
  })();

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

    let { errors = [], code = '' } = Compilers[ compilerSelect.value ].compile( inputEditor.getValue() );

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
    let embed = shareView.querySelector('.share-view-embed');
    let twitter = shareView.querySelector('.tweet');
    let shareLink = window.location.toString();
    let embedLink = 'TODO';
    let tweet = `Check out my ES6 code: ${ shareLink }`;

    twitter.href = `//twitter.com/home?status=${encodeURIComponent( tweet )}`;
    link.value = shareLink;
    embed.value = embedLink;

    let d = shareView.style.display;
    shareView.style.display = d === 'none' ? '' : 'none';
  }

  function loadCompiler(name) {
    let oldClasses = compilerLoader.className;
    compilerLoader.className = 'fa fa-spinner fa-pulse';
    Compilers[name].initCompiler(() => compilerLoader.className = oldClasses);
  }

  function bindEventHandlers() {
    transformBtn.addEventListener('click',transform)
    runBtn.addEventListener('click',() => run());
    saveBtn.addEventListener('click', save);
    shareBtn.addEventListener('click',showShare);
    compilerSelect.addEventListener('change',(e) => loadCompiler( e.target.value ));

    cnsl.on('run',run);
    inputEditor.on('change',transform);
  }
})();
