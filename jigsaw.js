/**
 * canvas生成拼图方法
 * @return {[type]} [description]
 */
~function () {
    var _reg = {
        'cssF' : /\-([a-z]{1})/g
    };

    var _tool = {
        'C' : function ( nd ) {
            return document.createElement( nd );
        },

        'buildCanvas' : function () {
            var canvas = _tool.C('canvas');

        },

        'isType' : function ( v, type ) {
            var typeV = ( typeof v );
            if ( typeV == 'undefined' ) {
                return /^undefined$/i.test( type );
            }
            else{
                var reg = new RegExp( type, 'gi' );
                try {
                    var transStr = v.constructor.toString();
                    return reg.test( transStr );
                }
                catch(NULL){
                    return ( /^object$/i.test( typeV ) && /^null$/i.test( type ) );
                }
            }
        },

        // 获取对象长度
        'objLength' : function ( obj ) {
            var l = 0;
            for( var i in obj ) {
                if( obj.hasOwnProperty( i ) ) {
                    l++;
                }
            }
            return l;
        }
    };

    var _dom = function ( nd ) {
        var l = 0,
            self = this;
        if( _tool.isType( nd, 'NodeList' ) ) {
            nd = Array.prototype.slice.call( nd, 0);
        }

        if( _tool.isType( nd, 'Array' ) ) {
            l = nd.length;
            for( var i = 0; i < l; i++ ) {
                self[i] = nd[i];
            }
        }
        else if( nd.nodeType ) {
            l = 1;
            self[0] = nd;
        }

        self.length = l;
    };

    _dom.prototype.css = function ( cssObj ) {
        var self = this;
        if( !self.length ) {
            return self;
        }

        if( self[0].style.cssText ) {
            for( var j = 0; j < self.length; j++ ) {
                var me = self[j];
                var myCssText = me.style.cssText;

                for( var i in cssObj ) {
                    if( cssObj.hasOwnProperty( i ) ) {
                        var reg = new RegExp( i + '\\s*\\:?[^\\;]+\\;?' );
                        myCssText.replace( reg, '' );
                        myCssText += ( i + ':' + cssObj[i] + ';' );
                    }
                }
                me.style.cssText = myCssText;
            }
        }

        else {
            for( var j = 0; j < self.length; j++ ) {
                var me = self[j];

                for( var i in cssObj ) {
                    if( cssObj.hasOwnProperty( i ) ) {
                        var itmp = i;
                        var itmp = i.replace( _reg.cssF, function () {
                            return arguments[1].toUpperCase();
                        });
                        me.style[ itmp ] = cssObj[i];
                    }
                }
            }
        }
    };

    _dom.prototype.getSize = function () {
        var self = this;
        if( !self.length ) {
            return {};
        }

        var size = {
            'height'    : self[0].offsetHeight,
            'width'     : self[0].offsetWidth
        };

        return size;
    };

    var _canvas = function ( canvas ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    };

    // 对ctx进行样式设置
    _canvas.prototype.doStyle = function ( styleObj ) {
        var sObj = styleObj || {};

        // 赋值相关样式设置
        for( var i in sObj ) {
            if( sObj.hasOwnProperty( i ) && ( i in self.ctx ) ) {
                self.ctx[ i ] = sObj[ i ];
            }
        }
    };

    // 画线
    _canvas.prototype.line = function ( pointArr, styleObj ) {
        if( pointArr.length < 2 ) {
            return;
        }
        var self = this;

        self.doStyle( styleObj );

        self.ctx.moveTo( pointArr[0][0], pointArr[0][1] );

        for( var i = 1, pL = pointArr.length; i < pL; i++ ) {
            var item = pointArr[i];
            self.ctx.lineTo( item[0], item[1] );
        }
        self.ctx.stroke();
        return self.ctx;
    };

    _canvas.prototype.fillStyle = function ( style ) {
        this.ctx.fillStyle = style;
        return this;
    };

    _canvas.prototype.fillText = function ( text, pos, spec ) {
        spec = spec || {};
        this.ctx.font = spec.font || '';
        if( spec.align ) {
            // 垂直定位
            spec.align.v && (this.ctx.textBaseline = spec.align.v);
            spec.align.l && (this.ctx.textAlign = spec.align.l);
        }

        if( spec.maxW ) {
            this.ctx.fillText( text, pos.x, pos.y, spec.maxW );
        }
        else {
            this.ctx.fillText( text, pos.x, pos.y );   
        }
        return this;
    };

    // 同fillRect
    _canvas.prototype.fillRect = function ( pointArr, w, h, styleObj ) {
        if( pointArr.length < 2 ) {
            return;
        }
        var self = this;

        self.doStyle( styleObj );

        self.ctx.fillRect( pointArr[0], pointArr[1], w, h );
        return self.ctx;
    };

    // 绘圆
    _canvas.prototype.arc = function ( ogPoint, r, startAg, endAg ) {
        var self = this;
        var sAg = startAg || 0,
            eAg = endAg || Math.PI * 2;

        self.ctx.beginPath();
        self.ctx.arc( ogPoint[0], ogPoint[1], r, sAg, eAg, true );
        return self.ctx;
    };

    _canvas.prototype.clear = function ( sPos, ePos ) {
        var self = this;
        var s = sPos || [0, 0],
            e = ePos || [cSize.width, cSize.height];
        self.ctx.clearRect( s[0], s[1], e[0], e[1] );
        return self.ctx;
    };

    // 拼图基类
    var _jigsaw = function ( img ){
        if( !img ) {
            return;
        }
        this.img = img;

        // 私有
        this._ = {};
    };

    // 行类构造方法功能
    _jigsaw.prototype.init = function () {
        var canvas = _tool.C('canvas');
        this._.$canvas = new _dom( canvas );

        var $img = new _dom( this.img ),
            picSize = $img.getSize();

        // 初始化canvas画布
        canvas.width = picSize.width;
        canvas.height = picSize.height;

        this._.canvas = new _canvas( canvas );

        this._.canvas.ctx.drawImage( this.img, 0, 0 );

        // document.body.appendChild( canvas );
    };

    // rt，font类似css的font属性，这个pos是文字的左下顶点的位置
    _jigsaw.prototype.addTxt = function ( txt, pos, font, align, maxW ) {
        var self = this;
        self._.canvas.fillText( txt, pos, {
            'font' : font,
            'align': align,
            'maxW' : maxW
        } );
        return self;
    };

    // 添加对齐的文本
    // 支持水平，垂直对齐，支持额外自定义距离
    _jigsaw.prototype.addTxtAlign = function ( txt, alignL, alignV, font ) {

    };

    // pos参数说明：
    // {
    //  'x' : xxx,
    //  'y' : xxx,
    //  'sx': xxx, // 可选,截图参数
    //  'sy': xxx  // 可选,截图参数
    // }
    // size参数说明：(可选)
    // {
    //  'w' : xxx, // 缩放参数
    //  'h' : xxx, // 缩放参数
    //  'sw': xxx, // 截图参数
    //  'sh': xxx  // 截图参数
    // }
    _jigsaw.prototype.addImg = function ( img, pos, size ) {
        pos = pos || {};
        size= size || {};

        var ctx = this._.canvas.ctx;
        var mod = _tool.objLength( pos ) + _tool.objLength( size );
        
        // 卧槽！太恶心的参数了
        switch( mod ) {
            case 2:
                ctx.drawImage( img, pos.x, pos.y );
                break;
            case 4:
                ctx.drawImage( img, pos.x, pos.y, size.w, size.h );
                break;
            case 8:
                ctx.drawImage( img, pos.sx, pos.sy, size.sw, size.sh, pos.x, pos.y, size.w, size.h );
                break;
            default:
                ctx.drawImage( img, pos.x, pos.y );
        }

        return this;
    };

    // 自定义处理图片
    _jigsaw.prototype.custImg = function ( img, middleWare ) {
        // 对图片进行大小缩放处理
        var imgCanvas = _tool.C('canvas'),
            imgDom = new _dom( img );

        // 取和最终的“画板”一样的尺寸
        imgCanvas.width = this._.canvas.canvas.width;
        imgCanvas.height = this._.canvas.canvas.height;

        var imgCObj = new _canvas( imgCanvas );
        
        if( middleWare ) {
            middleWare( imgCObj.ctx );
        }

        var imgSrc = imgCanvas.toDataURL();
        var newImg = _tool.C( 'img' );
        newImg.src = imgSrc;

        return newImg;
    };

    // 添加将图片添加到canvas圆形区域，使用纹理实现
    _jigsaw.prototype.addArcImg = function ( img, orgPos, R ){
        var middleWare = function ( imgCtx ) {
            imgCtx.drawImage( img, 0, 0, 2 * R, 2 * R );
            imgCtx.rect( 0, 0, 2 * R, 2 * R );
            imgCtx.clip();
        };

        // 自定义图片
        var newImg = this.custImg( img, middleWare );

        // 运用纹理进行填充

        var canvas = this._.canvas;
        var pat = canvas.ctx.createPattern( newImg, 'no-repeat' );
        canvas.arc( [orgPos.x, orgPos.y], R );
        canvas.ctx.save();
        canvas.ctx.translate( orgPos.x - R, orgPos.y - R );
        canvas.ctx.fillStyle = pat;
        canvas.ctx.fill();
        canvas.ctx.restore();
    };

    // 即canvas节点的getDataUrl
    _jigsaw.prototype.getDataUrl = function () {
        return this._.canvas.canvas.toDataURL();
    };

    var jigsaw = function ( nd ) {
        var jigsawObj = new _jigsaw( nd );

        // 初始化
        jigsawObj.init();
        return jigsawObj;
    };

    window.$J = jigsaw;
} ();