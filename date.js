'use strict';
;(function(window, $){
    var dateMain = function(config){
        config = config || {} 
        var defaults = dateMain.defaults;
        for(var key in defaults){
            if(!config[key]) config[key] = defaults[key]
        }
        dateMain.fn._init(config);
    }
    dateMain.fn = dateMain.prototype = {
        version: '0.0.1',
        _init: function(config){
            this.config = config
            if(!document.getElementsByClassName('date-main-container').length){
                this._loadCssCode(dateMain.cssCode);
                this.DOM=this._createDateTpl(dateMain.template);
            }else{
                this.DOM = this._getDom();
            }
            this._open();
        },
        _open: function(){
            var DOM = this.DOM;
            (DOM.masker) && (DOM.masker.style.display='block');
        },
        _close: function(DOM){
            DOM.masker.style.display='none';
        },
        _createDateTpl: function(){
            var that = this,
                body = document.body,
                masker = document.createElement('section');
            masker.className='date-main-container';
            body.appendChild(masker);
            masker.innerHTML=dateMain.template; 
            var DOM = this._getDom();     
            //添加点击元素
            var domFgr = document.createDocumentFragment()
            var elText = ['全部', '最近一天', '最近一周', '最近一个月', '自定义起始日期'];
            for(var i=0; i<elText.length; i++){
                var item = document.createElement('div');
                item.innerHTML=elText[i];
                item.className='date-main-item';
                item.setAttribute('type', i);
                //自定义日期绑定mobilescroll
                if(i==elText.length - 1){
                    $(item).mobiscroll().range({ 
                        theme: 'mobiscroll',
                        lang: 'zh',
                        display: 'center',
                        mode: 'rangeBasic',
                        maxRange: 31 * 24 * 60 * 60 * 1000,
                        onBeforeShow: function(){
                            that._close(DOM);
                        },
                        onSet: function(event, inst){
                            var start_at = that._dateFormat(inst._startDate),
                                end_at = that._dateFormat(inst._endDate);
                            that.config.customize({start_at: start_at, end_at: end_at});
                        }
                    });
                };
                item.addEventListener('click', function(e){
                    that.dateCheckHandle(e);
                }, false);
                domFgr.appendChild(item);
            }
            DOM.body.appendChild(domFgr);
            masker.addEventListener('click', function(e){
                that._close(DOM);
            }, false);
            return DOM;
        },
        _getDom: function(){
            var name,
                masker=document.querySelector('.date-main-container'),
                DOM={masker: masker},
                els=masker.getElementsByTagName('*'),
                elsLen=els.length;
            for(var i=0; i<elsLen; i++){
                name=els[i].className.split('date-main-')[1];
                if(name) DOM[name]=els[i];
            }
            return DOM;
        },
        _loadCssCode: function(code){
            var style = document.createElement('style'),
                head = document.getElementsByTagName('head')[0];
            style.type = 'text/css';
            style.rel = 'stylesheet';
            try{
                style .appendChild(document.createTextNode(code));
            }catch(ex){
                style.styleSheet.cssText = code;
            }
            head.appendChild(style);
        },
        _getDateStr: function(count){
            var date = new Date(),
                end_at = this._dateFormat(date);
            date.setDate(date.getDate()+count)
            var start_at = this._dateFormat(date);
            return {start_at: start_at, end_at: end_at}
        },
        _dateFormat(date){
            var year = date.getFullYear(),
                month = date.getMonth()+1,
                day = date.getDate();
            month = month<10?'0'+month:month;
            day = day<10?'0'+day:day
            return year + '-' + month + '-' + day
        },
        getDateArea(count){
            var date = new Date(), start_at, end_at;
            if(count < 0){
                end_at = this._dateFormat(date);
                date.setDate(date.getDate()+count)
                start_at = this._dateFormat(date);
            }else{
                start_at = this._dateFormat(date);
                date.setDate(date.getDate()+count)
                end_at = this._dateFormat(date);
            }
            this.config.getDateArea({start_at: start_at, end_at: end_at})
        },
        //前一天
        getBeforeDay: function(){
            var date = this._getDateStr(-1);
            this.config.getBeforeDay(date);
        },
        //前一周
        getBeforeWeek: function(){
            var date = this._getDateStr(-7);
            this.config.getBeforeWeek(date);
        },
        //前一个月
        getBeforeMonth: function(){
            var date = this._getDateStr(-30);
            this.config.getBeforeWeek(date);
        },
        dateCheckHandle: function(e){
            var type = e.target.getAttribute('type')
            if(type == 0){
                this.config.getAll({start_at: '', end_at: ''});
            }else if(type==1){
                this.getBeforeDay(type);
            }else if(type == 2){
                this.getBeforeWeek();
            }else if(type == 3){
                this.getBeforeMonth();
            }
        }
    };
    dateMain.defaults={
        title:'时间筛选',
        getAll: function(){},
        getBeforeDay: function(date){},
        getBeforeWeek: function(date){},
        getBeforeMonth: function(date){},
        getDateArea: function(date){},
        customize: function(date){}
    };
    dateMain.template = 
        '<article class="date-main-content">'
        +   '<dl class="date-main-body">'
        +       '<dd class="date-main-header">时间筛选</dd>'
        +   '</dl>'
        +'</article>';
    dateMain.cssCode = '.date-main-container{position: fixed;left: 0;right: 0;top:0;bottom: 0;background: rgba(0, 0, 0, .3);z-index: 100;color: #333;display:none;}'
        +'.date-main-content{width: 100%; height: 100%; position: relative;}'
        +'.date-main-body{position: absolute; left: 0; bottom: 0; right: 0; background: #fff; padding: 0 15px;-webkit-animation-name: fadeInUp;animation-name: fadeInUp;-webkit-animation-duration: .5s;animation-duration: .5s;-webkit-animation-fill-mode: both;animation-fill-mode: both;}'
        +'.date-main-header{padding: 15px 0; font-size: 16px;font-weight: bold;}'
        +'.date-main-item{padding: 10px 0; border-bottom: #eee solid 1px;position: relative;transition: all .1s linear;-webkit-transition: all .1s linear;}'
        +'.date-main-item:active{color: #FF8E44;}'
        +'.date-main-item::after{content:"";position: absolute;width: 6px;height: 6px;background: #eee;top:50%;right: 0;margin-top: -3px;border-radius: 3px;}'
        +'.date-main-item:last-child{border:none;color: #FF8E44;}'
        +'@-webkit-keyframes fadeInUp{from {opacity: 0;-webkit-transform: translate3d(0, 100%, 0);transform: translate3d(0, 100%, 0);}to {opacity: 1;-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);}}'
        +'@keyframes fadeInUp {from {opacity: 0;-webkit-transform: translate3d(0, 100%, 0);transform: translate3d(0, 100%, 0);}to {opacity: 1;-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);}}'
        +'.date-main-item:last-child::after{background: #FF8E44;}';

    window.dateMain = function(config){
        return new dateMain(config);
    }
})(window, $)