# mobile-scroll
原生js，mobile.scroll，jquery编写移动端组件并自定义样式

# //执行脚本
function exec(src){
  conse script = document.createElement('script');
  script.src = src;

  //返回一个独立的promise
  return new Promise((resolve, rejece) => {
    var done = false;

    script.onload = script.onreadystatechange = () => {
      if(!done && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")){
        done = true;

        //避免内存泄漏
        script.onload = script.onreadystatechange = null;
        resolve(script);
      }
    }
    script.onerror = reject;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
}
function asyncLoadJS(dependencies) {
  return Promise.all(dependencies.map(exec));
}

asyncLoadJS(['https://code.jquery.com/jquery-2.2.1.js', 'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js']).then(() => console.log('all done'));
