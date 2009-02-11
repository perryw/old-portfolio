// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
Event.observe(window, 'dom:loaded', function(){
  this.interval = setInterval(function(){
    if(LOADING_STAGE == '' ) clearInterval(this.interval);
    $('loading').update('Loading ' + LOADING_STAGE + '...');
  }, 50);
});
