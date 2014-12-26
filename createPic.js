~function () {
    var imgMain, imgHead;
    var jig = $J( imgMain );

    // 第一屏操作

    // 添加头像
    jig.addArcImg( imgHead, {'x' :  218, 'y' : 172}, 38 );

    // 添加用户昵称
    jig.addTxt('@BottleLiu', {x:218,y:320},'bold 18px 微软雅黑', {v:'middle',l:'center'});

    // 这一年
    jig.addTxt('这一年', {x:218,y:360},'bold 18px 微软雅黑', {v:'middle',l:'center'});

    // 我发了xxx条微博
    jig.addTxt('我发了2888万条微博', {x:218,y:386},'bold 18px 微软雅黑', {v:'middle',l:'center'});

    // 共点评了xx部电影
    jig.addTxt('共点评了72部电影', {x:218,y:414},'bold 18px 微软雅黑', {v:'middle',l:'center'});

    // 转评数排名
    jig.addTxt('转评数在好友中排名27位', {x:218,y:446},'bold 18px 微软雅黑', {v:'middle',l:'center'});

    // 第二屏操作

    // 添加头像
    jig.addArcImg( imgHead, {x:218,y:902}, 38 );

    // 周围一圈的头像，从左边开始，顺时针位置列表
    var picPos = [
        {x: 87, y: 891},
        {x: 156, y: 793},
        {x: 280, y: 793},
        {x: 349, y: 891},
        {x: 320, y: 994},
        {x: 220, y: 1042},
        {x: 118, y: 994}
    ];

    for( var i = 0; i < picPos.length; i++ ) {
        jig.addArcImg( imgHead, picPos[i], 38 );
    }

    // 第三屏

    // 多少次阅读
    jig.addTxt('47235', {x:210,y:1238},'bold 18px 微软雅黑', {v:'middle',l:'center'});
    
    // 标签
    jig.addTxt('旅游  橘子', {x:203,y:1447},'bold 28px 微软雅黑', {v:'middle',l:'center'});

    jig.addTxt('阅读 环游世界 薄荷', {x:204,y:1486},'bold 28px 微软雅黑', {v:'middle',l:'center'});

    jig.addTxt('喜欢 音乐 美女', {x:204,y:1527},'bold 28px 微软雅黑', {v:'middle',l:'center'});

    // 第四屏
    jig.addTxt('27', {x:287,y:1680},'bold 18px 微软雅黑', {v:'middle',l:'center'});

    jig.addTxt('小鲜肉', {x:200,y:2216},'bold 18px 微软雅黑', {v:'middle',l:'center'});
}();