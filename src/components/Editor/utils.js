import CodeMirror from 'codemirror';

export function rm(el) {
    if(el.parentNode) el.parentNode.removeChild(el);
}

export function showTooltip(e, msg) {
    var tt = document.createElement("div");
    tt.className = "compiler-error-tooltip";
    tt.appendChild(document.createTextNode(msg));
    document.body.appendChild(tt);

    function position(e) {
        if(!tt.parentNode) return CodeMirror.off(document, "mousemove", position);
        tt.style.top = Math.max (0, e.clientY - tt.offsetHeight - 5) + "px";
        tt.style.left = (e.clientX + 5) + "px";
    }

    CodeMirror.on(document, "mousemove", position);
    
    position(e);
    
    if(tt.style.opacity != null) tt.style.opacity = 1;
    
    return tt;
}

export function hideTooltip(tt) {
    if(!tt.parentNode) return;
    if(tt.style.opacity == null) rm(tt);
    tt.style.opacity = 0;
    setTimeout(()=>rm(tt),600);
}

export function showTooltipFor( e, msg, marker ) {
    var tooltip = showTooltip(e, msg);

    function hide() {
        CodeMirror.off(marker, "mouseout", hide);
        
        if(tooltip) { 
            hideTooltip(tooltip); 
            tooltip = null; 
        }
    }

    CodeMirror.on(marker, "mouseout", hide);
}

export function makeMarker( msg ) {
    msg = msg.split('\n')[0];

    var marker = document.createElement("i");

    marker.classList.add("compiler-error-marker",
                         "icon",
                         "remove");

    CodeMirror.on(marker, "mouseover", function(e) {
        showTooltipFor(e, msg, marker);
    });

    return marker;
}