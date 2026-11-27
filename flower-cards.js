(() => {
  'use strict';

  const images = {"身有彩翼":"001.webp","霜降·丹柿映輝":"002.webp","星璿寰宇":"003.webp","花溪燈語":"004.webp","秋分·楓華玉律":"005.webp","小雪·綺窗花韻":"006.webp","星垂綺夜":"007.webp","緋夜薔歌":"008.webp","瑤光芙華":"009.webp","花映長思":"010.webp","陽月·芙香盈袖":"011.webp","花階聆音":"012.webp","星河映蕊":"013.webp","金鱗飛渡":"014.webp","天上宮闕":"015.webp","荷月·池光夏夢":"016.webp","碧羽青鸞":"017.webp","巧月·星眸應水":"018.webp","桂月·秋千稚語":"019.webp","緣定鵲橋":"020.webp","有龍則靈":"021.webp","菊月·花間飛鳶":"022.webp","星夜奇遇":"023.webp","葭月·棲舟泛漪":"024.webp","花宴流芳":"025.webp","芳華尋蝶":"026.webp","繁花滿築":"027.webp","歡雪頌冬":"028.webp","梅月·疏影聽弦":"029.webp","歡雲妙舞":"030.webp","紫霄雲庭":"031.webp","仙魅靈狐":"032.webp","夜夢花庭":"033.webp","柳月·溪亭燕語":"034.webp","焰火迎春":"035.webp","福運招財":"036.webp","杏月·花影雅憩":"037.webp","夢幻之心":"038.webp","花漾春山":"039.webp","桃月·雲汐灼華":"040.webp","九色靈鹿":"041.webp","飛花似夢":"042.webp","槐月·蝶夢輕語":"043.webp","花嶼閑趣":"044.webp","花澗聽泉":"045.webp","榴月·絳花照影":"046.webp","天下一墨":"047.webp","扶搖雲鯤":"048.webp","大暑·夏漪清歡":"049.webp","處暑·花苑拾香":"050.webp","芳翎昭錦":"051.webp","蝶影梅書":"052.webp","芍華茗宴":"053.webp","比翼雙飛":"054.webp","花信未遲":"055.webp","芳蕊瓊蓮":"056.webp","鶴寄星河":"057.webp","青花瓷牡丹菊":"058.webp","玉晶藍花楹":"059.webp","金桂銜燈":"060.webp","花筵鼓韻":"061.webp","粉櫻蝶舞玫瑰":"062.webp","桃影浮瀾":"063.webp","紫靈福祿":"064.webp","歡鬧南瓜":"065.webp","輝似朝陽":"066.webp","燦若繁星":"067.webp","緋雲韶光":"068.webp","竹韻華燈":"069.webp","桃華駐顏":"070.webp","蜜糖絨爪":"071.webp","雪鴞夜曲":"072.webp","花約歸時":"073.webp","星槎仙舟":"074.webp","芳蕊瓊漿":"075.webp","毓秀蘭結":"076.webp","箜篌棲羽":"077.webp","琵琶弦韻":"078.webp","寶珠玉蘭":"079.webp","瑤枝桂影":"080.webp","靈松照夜":"081.webp","冰藍蝶舞玫瑰":"082.webp","紅香妃臘梅":"083.webp","玉玲瓏臘梅":"084.webp","紫曜牡丹":"085.webp","幽藍逐影":"086.webp","白靈逐浪":"087.webp","杏色春衫":"088.webp","瑤光牡丹":"089.webp","霽瀾牡丹":"090.webp","仙女散花":"091.webp","珠匣粉芙蓉":"092.webp","珠匣橘芙蓉":"093.webp","珠匣紫芙蓉":"094.webp","姑蘇雨蒙":"095.webp","竹映金輝":"096.webp","映粉雲光月季":"097.webp","沐光映黃月季":"098.webp","橙光拂曉月季":"099.webp","花扇鵲嬉":"100.webp","鵲影芳扇":"101.webp","玉兔攬輝":"102.webp","花籠星語":"103.webp","花籠流芳":"104.webp","花籠瓊光":"105.webp","搗蛋幽幽":"106.webp","馥香花餅":"107.webp","火耀金丹":"108.webp","瓊臺玉露":"109.webp","霓光映樹":"110.webp","恬夢聖鈴":"111.webp","元氣破蛋":"112.webp","夢蝶花章":"113.webp","鳶花芳集":"114.webp","金纏腰":"115.webp","曜緋帝王花":"116.webp","琉藍帝王花":"117.webp","霞暉帝王花":"118.webp","漱玉雪蓮":"119.webp","星澤幽曇":"120.webp","虹霞仙芝":"121.webp","花露甜粥":"122.webp","夜藍香息":"123.webp","玫瑰小熊":"124.webp","馬上有財":"125.webp","馬上有福":"126.webp","馬上柿橙":"127.webp","靈瑞仙桃":"128.webp","柿柿如意":"129.webp","魚燈映歲":"130.webp","甜絨羊羊":"131.webp","葡萄紫牡丹菊":"132.webp","落霞橙牡丹菊":"133.webp","尋蜜之心":"134.webp","珠寶之心":"135.webp","花引贈春":"136.webp","玉蘭棲香":"137.webp","紙鳶探春":"138.webp","赤霞火焰花":"139.webp","青璃火焰花":"140.webp","落英浮香":"141.webp","瓊臺碧色":"142.webp","星鈴螢夜":"143.webp","晴蘭蝶影":"144.webp","夕蜻萱序":"145.webp","花汀月舫":"146.webp","花影泛舟":"147.webp","花溪泊夢":"148.webp","花椅輕搖":"149.webp","悠遊雲間":"150.webp","涼酥山雪":"151.webp","幽香綺囊":"152.webp","龍舟競渡":"153.webp","雲松墨箋":"154.webp","珠爛銀杏":"155.webp","玉蕊金棠":"156.webp","霓羽翠雲":"157.webp","皎如明月":"158.webp","螢棲碧綃":"159.webp","洛神凝香":"160.webp","清梔玉露":"161.webp","連理雙枝":"162.webp","桃李承輝":"163.webp","杏壇啟學":"164.webp","照水玉壺春":"165.webp","映泉藍六出":"166.webp","臨溪秋水仙":"167.webp","輪生冬青":"168.webp","粉紅木槿花":"169.webp","暖橙球根海棠":"170.webp","瑩白露薇花":"171.webp","淺黃綠絨蒿":"172.webp","棉花小熊":"173.webp","冰藍矮牽牛":"174.webp","曼珠沙華":"175.webp","伯利恆之星":"176.webp","鴛鴦茉莉":"177.webp","奶桃大麗花":"178.webp","明黃跳舞蘭":"179.webp","曼陀羅華":"180.webp","朱砂丹桂":"181.webp","青山銀桂":"182.webp","胭脂芍藥":"183.webp","粉黛太陽花":"184.webp","青碧華珊":"185.webp","紺紫飛燕草":"186.webp","鵝黃鐵筷花":"187.webp","焰緋海葵":"188.webp","毛蕊紫銀蓮":"189.webp","甜橙美女櫻":"190.webp","雲藍音符花":"191.webp","赤霞太陽花":"192.webp","棲香含笑花":"193.webp","皇冠貝母":"194.webp","玫紅古代稀":"195.webp","月影搖光":"196.webp","金白德鳶":"197.webp","黛紫虞美人":"198.webp","橙黃虞美人":"199.webp","落霞燈籠花":"200.webp","粉黛德鳶":"201.webp","秋楓跳舞蘭":"202.webp","銀白雪柳":"203.webp","星耀靈蕊":"204.webp","蜜黃大岩桐":"205.webp","星藍山月桂":"206.webp","橘紅舞花薑":"207.webp","薰紫球根海棠":"208.webp","霜粉藍花楹":"209.webp","淺杏片栗花":"210.webp","水生香殊蘭":"211.webp","大花梅花草":"212.webp","粉妝娑羅蜜兒":"213.webp","紫苑番紅花":"214.webp","櫻粉古代稀":"215.webp","雙輝忍冬":"216.webp","銀葉愛沙木":"217.webp","霧藍常山花":"218.webp","粉櫻月見草":"219.webp","碧落月見草":"220.webp","緋色臘梅":"221.webp","香檳玫瑰":"222.webp","淺紺紫藤花":"223.webp","黑蕊白銀蓮":"224.webp","輕紫大花蔥":"225.webp","藍葉蘇鐵":"226.webp","赤焰火焰蘭":"227.webp","蜜合月見草":"228.webp","褐紅鐵筷花":"229.webp","朱柿長壽花":"230.webp","半見長壽花":"231.webp","霧粉麥冬花":"232.webp","藤黃露薇花":"233.webp","黑曜大麗花":"234.webp","白粉蕙蘭":"235.webp","幽藍綠絨蒿":"236.webp","粉鶴芋":"237.webp","金橙海葵":"238.webp","波葉金桂":"239.webp","粉紫華珊":"240.webp","橘霞華珊":"241.webp","玫瑰粉銀蓮":"242.webp","暮粉紫藤花":"243.webp","霽藍紫藤花":"244.webp","薄紅虞美人":"245.webp","幻紫鐵線蓮":"246.webp","淺韻美女櫻":"247.webp","柔藍飛燕草":"248.webp","桃夭飛燕草":"249.webp","紫晶燈籠花":"250.webp","杏緋德鳶":"251.webp","黛紫玉蘭":"252.webp","飛黃玉蘭":"253.webp","粉菲鐵筷花":"254.webp","藕粉長壽花":"255.webp","霜色麥冬花":"256.webp","粉米露薇花":"257.webp","輕紫格桑花":"258.webp","煙粉格桑花":"259.webp","櫻紅跳舞蘭":"260.webp","淡粉雪柳":"261.webp","春綠蕙蘭":"262.webp","黛紫綠絨蒿":"263.webp","霜白海葵":"264.webp","碧落夾竹桃":"265.webp","粉胭海棠花":"266.webp","火蕊朱頂紅":"267.webp","粉羽朱頂紅":"268.webp","橘光朱頂紅":"269.webp","雲錦芍藥":"270.webp","桃雲木香花":"271.webp","春曉木香花":"272.webp","盈粉芍藥":"273.webp","純白木香花":"274.webp","夕嵐薔薇花":"275.webp","晴山薔薇花":"276.webp","黃鶯薔薇花":"277.webp","橙心劍蘭":"278.webp","白茜劍蘭":"279.webp","芋紫劍蘭":"280.webp","青絲楊柳":"281.webp","紫苑鳳眼蓮":"282.webp","凝夜紫薇":"283.webp","桃夭美人蕉":"284.webp","暮山耬斗菜":"285.webp","晴藍耬斗菜":"286.webp","丹紅耬斗菜":"287.webp","橘焰冠華":"288.webp","嵐岫紫雲英":"289.webp","彤雲六初花":"290.webp","緗桃六初花":"291.webp","碧玉六初花":"292.webp","粉花綺夢":"293.webp","瑪瑙石榴花":"294.webp","冰藍黑種草":"295.webp","粉韻石竹花":"296.webp","赤暉石竹花":"297.webp","紫暈石竹花":"298.webp","玉紫雪割草":"299.webp","瑤暉緬梔子":"300.webp","蜜桃花毛茛":"301.webp","奶黃花毛茛":"302.webp","橙霞花毛茛":"303.webp","桃緋薑荷花":"304.webp","白玉薑荷花":"305.webp","朝暉薑荷花":"306.webp","明黃凌霄花":"307.webp","朱紅凌霄花":"308.webp","白紫凌霄花":"309.webp","粉米茶梅花":"310.webp","雅梨黃棣棠":"311.webp","明黃松蟲草":"312.webp","薰紫松蟲草":"313.webp","柔粉松蟲草":"314.webp","絳橙嘉蘭":"315.webp","紗粉嘉蘭":"316.webp","焰紅嘉蘭":"317.webp","黛紫洋紫荊":"318.webp","宮燈百合":"319.webp","夢紫鬱金香":"320.webp","緗黃瑞香花":"321.webp","素雪瑞香花":"322.webp","煙紫瑞香花":"323.webp","松綠立金花":"324.webp","杏黃立金花":"325.webp","珊粉立金花":"326.webp","天荷繁星":"327.webp","雅致西風蓮":"328.webp","丹紅龍面花":"329.webp","澄藍龍面花":"330.webp","蜜粉龍面花":"331.webp","紫霽大岩桐":"332.webp","絳粉大岩桐":"333.webp","盈粉大花萱草":"334.webp","藤紫大花萱草":"335.webp","嫩翠大花萱草":"336.webp","銀白耀星花":"337.webp","重瓣紫燈花":"338.webp","黃焰":"339.webp","潑墨":"340.webp","金玉良緣":"341.webp","雲白垂絲茉莉":"342.webp","霓粉垂絲茉莉":"343.webp","星郎垂絲茉莉":"344.webp","柔白茨菇":"345.webp","淺緋茨菇":"346.webp","雲紫茨菇":"347.webp","蜜粉白玉草":"348.webp","橙霞洋金鳳":"349.webp","霧紫堇蘭":"350.webp","柔粉堇蘭":"351.webp","霽藍堇蘭":"352.webp","晴粉大花芙蓉":"353.webp","朱綃大花芙蓉":"354.webp","雪纓大花芙蓉":"355.webp","柔緋金魚草":"356.webp","嫣紫金魚草":"357.webp","晴黃金魚草":"358.webp","紺紫肖鳶尾":"359.webp","皓白肖鳶尾":"360.webp","夕照肖鳶尾":"361.webp","橙星花福祿考":"362.webp","粉星花福祿考":"363.webp","紫星花福祿考":"364.webp","粉雲溲疏花":"365.webp","暖陽金絲桃":"366.webp","三花水楊梅":"367.webp","藍花亞麻":"368.webp","霽粉山月桂":"369.webp","酒紅山月桂":"370.webp","月白舞花薑":"371.webp","桃粉舞花薑":"372.webp","暖橙旱金蓮":"373.webp","淺汐藍蝴蝶":"374.webp","白玉音符花":"375.webp","胭粉音符花":"376.webp","水藍球根海棠":"377.webp","幻紫藍花楹":"378.webp","蜜金太陽花":"379.webp","月白酒杯花":"380.webp","嵐紫酒杯花":"381.webp","桃汐酒杯花":"382.webp","丹影蛾蝶花":"383.webp","紫瑤蛾蝶花":"384.webp","黃澄蛾蝶花":"385.webp","湛藍片栗花":"386.webp","暮紫片栗花":"387.webp","橙紅古代稀":"388.webp","橘紅娑羅蜜兒":"389.webp","凝翠娑羅蜜兒":"390.webp","赤紅朱槿花":"391.webp","淡粉矮牽牛":"392.webp","明黃矮牽牛":"393.webp","淺粉乒乓菊":"394.webp","淺橘乒乓菊":"395.webp","淺白乒乓菊":"396.webp","紅鶴芋":"397.webp","白鶴芋":"398.webp","薄藤鐵線蓮":"399.webp","水紅落新婦":"400.webp","淺紫落新婦":"401.webp","忽地笑":"402.webp","香水百合":"403.webp","鳳梨花":"404.webp","迎春花":"405.webp","薄粉蕙蘭":"406.webp","淡茜蜀葵花":"407.webp","淺藍落新婦":"408.webp","紫矢車菊":"409.webp","粉矢車菊":"410.webp","藍矢車菊":"411.webp","紅霞彩葉草":"412.webp","素白蔦蘿":"413.webp","桃鱗亂子草":"414.webp","鬱粉兜蘭":"415.webp","淡紫鳳仙花":"416.webp","湖藍鳥尾花":"417.webp","桃夭賈桂琳":"418.webp","銀白翠珠":"419.webp","絳紅報春花":"420.webp","橘粉忘憂草":"421.webp","輕紫忘憂草":"422.webp","粉白酢漿草":"423.webp","朱橙魔杖花":"424.webp","星藍婆婆納":"425.webp","淺粉婆婆納":"426.webp","霜白谷鳶尾":"427.webp","橘紅垂筒花":"428.webp","淺藍仙客來":"429.webp","柔紫石斛蘭":"430.webp","淡緋花煙草":"431.webp","輕藍貝母":"432.webp","凝紫四照花":"433.webp","桃粉四照花":"434.webp","青綠四照花":"435.webp","海藍藍鈴花":"436.webp","暖橙兜蘭":"437.webp","鵝黃兜蘭":"438.webp","錦橙花菱草":"439.webp","雲蜜花菱草":"440.webp","霓粉花菱草":"441.webp","輕粉藍鈴花":"442.webp","絳紅木百合":"443.webp","金冠木百合":"444.webp","粉黛木百合":"445.webp","雲霓紫露草":"446.webp","粉絨兔尾草":"447.webp","柔白太平花":"448.webp","淺藍太平花":"449.webp","一串紅":"450.webp","純白月光花":"451.webp","鶯黃虎刺梅":"452.webp","蜜橙鳥尾花":"453.webp","霧粉千鳥花":"454.webp","藍星眼琉璃草":"455.webp","黃星眼琉璃草":"456.webp","正紅大麗花":"457.webp","金鐘連翹":"458.webp","丹紅蜀葵花":"459.webp","金盞蜀葵花":"460.webp","殷紅燈籠花":"461.webp","紫麥冬花":"462.webp","月白格桑花":"463.webp","淺粉夾竹桃":"464.webp","丹紫夾竹桃":"465.webp","橘紅海棠花":"466.webp","黃色海棠花":"467.webp","緋雪賈桂琳":"468.webp","碧落賈桂琳":"469.webp","綠葉蘇鐵":"470.webp","杏黃杜鵑":"471.webp","紫紅杜鵑":"472.webp","淡粉非洲堇":"473.webp","輕紫非洲堇":"474.webp","嫣紅杜鵑":"475.webp","玫紅非洲堇":"476.webp","白色滿天星":"477.webp","粉色滿天星":"478.webp","藍色滿天星":"479.webp","輕紫翠珠":"480.webp","盈粉翠珠":"481.webp","紫晶玉簪花":"482.webp","素雪玉簪花":"483.webp","霜藍玉簪花":"484.webp","鵝黃報春花":"485.webp","桃粉報春花":"486.webp","杏白忘憂草":"487.webp","黃白酢漿草":"488.webp","橙黃酢漿草":"489.webp","嫩黃馬齒莧":"490.webp","白花馬齒莧":"491.webp","淡粉馬齒莧":"492.webp","霞粉鐵線蓮":"493.webp","聖誕一品紅":"494.webp","霧白香豌豆":"495.webp","夢藍香豌豆":"496.webp","薰紫香豌豆":"497.webp","霜白婆婆納":"498.webp","火焰針墊花":"499.webp","蜜黃針墊花":"500.webp","杏粉針墊花":"501.webp","冰藍谷鳶尾":"502.webp","桃粉谷鳶尾":"503.webp","霜白垂筒花":"504.webp","明黃垂筒花":"505.webp","粉月季":"506.webp","安眠薰衣草":"507.webp","橙黃君子蘭":"508.webp","粉白君子蘭":"509.webp","嫩黃君子蘭":"510.webp","富貴竹":"511.webp","淺粉仙客來":"512.webp","淡紫仙客來":"513.webp","汀藍兔狸藻":"514.webp","月白兔狸藻":"515.webp","香紫兔狸藻":"516.webp","碧白石斛蘭":"517.webp","嫣粉石斛蘭":"518.webp","嫩綠花煙草":"519.webp","煙紫花煙草":"520.webp","粉荷包牡丹":"521.webp","紫荷包牡丹":"522.webp","玉白貝母":"523.webp","白紫貝母":"524.webp","玉白梨花":"525.webp","淺黃沙漠玫":"526.webp","嫩粉沙漠玫":"527.webp","桃粉蕨葉芍藥":"528.webp","胭紅蕨葉芍藥":"529.webp","杏黃蕨葉芍藥":"530.webp","柔藍小手球":"531.webp","月光白彩葉草":"532.webp","冰藍彩葉草":"533.webp","明黃蔦蘿":"534.webp","朱紅蔦蘿":"535.webp","苔綠貝殼花":"536.webp","染杏貝殼花":"537.webp","白玉貝殼花":"538.webp","白雲亂子草":"539.webp","月藍亂子草":"540.webp","奶油向日葵":"541.webp","琉白車軸草":"542.webp","玫紫車軸草":"543.webp","彤黃車軸草":"544.webp","晴藍鴨跖草":"545.webp","粉石菖蒲":"546.webp","淺粉鳳仙花":"547.webp","粉藍換錦花":"548.webp","暮靄紫露草":"549.webp","桃綃紫露草":"550.webp","殷紅馬利筋":"551.webp","柔粉馬利筋":"552.webp","雲紫馬利筋":"553.webp","白絨兔尾草":"554.webp","紫絨兔尾草":"555.webp","紫褐墨蘭":"556.webp","粉桃虎刺梅":"557.webp","霧白虎刺梅":"558.webp","紫高山圓幣草":"559.webp","藍星花":"560.webp","水仙花":"561.webp","黃色丁香花":"562.webp","紫紅三角梅":"563.webp","聖心百合":"564.webp","白百合":"565.webp","康乃馨":"566.webp","鈴蘭":"567.webp","黃百合":"568.webp","紫桔梗":"569.webp","黃鬱金香":"570.webp","紫羅蘭":"571.webp","粉鬱金香":"572.webp","蝴蝶蘭":"573.webp","粉百合":"574.webp","紅玫瑰":"575.webp","雛菊":"576.webp","粉玫瑰":"577.webp","黃玫瑰":"578.webp","紫繡球":"579.webp","山茶花":"580.webp","粉繡球":"581.webp","小蒼蘭":"582.webp","藍繡球":"583.webp","向日葵":"584.webp","鶴望蘭":"585.webp","金盞菊":"586.webp","非洲菊":"587.webp","紅馬蹄蓮":"588.webp","風鈴花":"589.webp","黃馬蹄蓮":"590.webp","蒲公英":"591.webp","紫馬蹄蓮":"592.webp","紫色風信子":"593.webp","合歡花":"594.webp","粉色風信子":"595.webp","茉莉花":"596.webp","嫩黃風信子":"597.webp","明黃如意菊":"598.webp","梔子花":"599.webp","淡粉如意菊":"600.webp","粉桃花":"601.webp","淺橘如意菊":"602.webp","嫩綠洋桔梗":"603.webp","紫色丁香花":"604.webp","淺粉洋桔梗":"605.webp","香檳洋桔梗":"606.webp","勿忘我":"607.webp","淡黃三角梅":"608.webp","素白九里香":"609.webp","粉白三角梅":"610.webp","嫣紅荼蘼花":"611.webp","盈粉荼蘼花":"612.webp","紫百子蓮":"613.webp","雪白荼蘼花":"614.webp","純白晚香玉":"615.webp","淡紫菊苣":"616.webp","淺紫晚香玉":"617.webp","巧克力秋英":"618.webp","嫩黃晚香玉":"619.webp","雪白玉葉金花":"620.webp","緋紅玉葉金花":"621.webp","雲峰龍吐珠":"622.webp","宮粉玉葉金花":"623.webp","赤丹鳳凰花":"624.webp"};
  const table = document.getElementById('inventory');
  const gallery = document.getElementById('gallery');
  const collection = document.getElementById('catalog-cards');
  const grid = document.getElementById('gallery-grid');
  const search = document.getElementById('gallery-search');
  const grade = document.getElementById('gallery-grade');
  const prev = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');
  const pageSize = 36;
  let page = 1;
  let cards = new Map();

  const dialog = document.createElement('dialog');
  dialog.className = 'flower-card-dialog';
  dialog.setAttribute('aria-labelledby', 'flower-card-title');
  const title = document.createElement('h2');
  title.id = 'flower-card-title';
  const fullImage = document.createElement('img');
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '關閉';
  close.addEventListener('click', () => dialog.close());
  dialog.append(title, fullImage, close);
  document.body.append(dialog);

  const form = document.getElementById('card-edit-template').content.firstElementChild.cloneNode(true);
  const edit = id => form.querySelector('#card-' + id);
  const file = edit('edit-file');
  const canvas = edit('crop-preview');
  const controls = edit('crop-controls');
  const position = edit('crop-position');
  const horizontal = edit('crop-x');
  const vertical = edit('crop-y');
  const zoom = edit('crop-zoom');
  const removeBg = edit('remove-bg');
  const removeStars = edit('remove-stars');
  const starTrim = edit('star-trim');
  const starValue = edit('star-value');
  const starField = edit('star-trim-field');
  const status = edit('edit-status');
  const submit = edit('edit-save');
  const cancel = edit('edit-cancel');
  const change = document.createElement('button');
  change.type = 'button';
  change.textContent = '更換圖卡';
  const ownerDetails = document.createElement('p');
  ownerDetails.className = 'flower-owner-details';
  dialog.insertBefore(ownerDetails, close);
  dialog.append(change, form);

  const customFolder = 'flower-card-images';
  const repositoryApi = 'https://api.github.com/repos/chllan/flower/contents/' + customFolder;
  const customCards = new Map();
  let selectedName = '';
  let source = null;
  let decodeVersion = 0;
  let publishing = false;
  let previewVersion = 0;
  let previewTimer;
  let previewQueue = Promise.resolve();
  const preview = canvas.getContext('2d');

  function toBase64(bytes) {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  function cardFilename(name) {
    const encoded = toBase64(new TextEncoder().encode(name))
      .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
    if (encoded.length > 240) throw new Error('花名太長，請縮短後再試。');
    return encoded + '.png';
  }

  async function loadCustomCards() {
    try {
      const response = await fetch(repositoryApi + '?ref=main', {
        cache:'no-store', signal:AbortSignal.timeout(10000),
      });
      if (!response.ok) return;
      const files = await response.json();
      if (!Array.isArray(files)) return;
      for (const item of files) {
        if (item.type !== 'file' || !/^[A-Za-z0-9_-]+\.(?:jpg|png)$/.test(item.name) ||
            !/^[a-f0-9]{40}$/.test(item.sha)) continue;
        const png = item.name.endsWith('.png');
        const binary = atob(item.name.slice(0,-4).replaceAll('-', '+').replaceAll('_', '/'));
        const name = new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
        const previous = customCards.get(name);
        if (!previous || (previous.legacy && png)) customCards.set(name, {
          legacy:!png,
          src:'https://raw.githubusercontent.com/chllan/flower/main/' + customFolder + '/' + item.name + '?v=' + item.sha,
        });
      }
      refreshCards();
    } catch {
      // The bundled gallery remains available.
    }
  }

  function openEditor(name) {
    if (!adminToken) return;
    form.reset();
    ownerDetails.hidden = true;
    cancel.textContent = '取消';
    decodeVersion++;
    previewVersion++;
    clearTimeout(previewTimer);
    source = null;
    submit.disabled = true;
    controls.hidden = true;
    status.textContent = '';
    edit('edit-name').value = name;
    title.textContent = '新增／更換圖卡';
    fullImage.hidden = true;
    change.hidden = close.hidden = true;
    form.hidden = false;
    if (!dialog.open) dialog.showModal();
  }

  function drawCrop() {
    if (!source) return;
    const version = ++previewVersion;
    clearTimeout(previewTimer);
    submit.disabled = true;
    status.textContent = '正在處理預覽…';
    starField.hidden = !removeStars.checked;
    starValue.textContent = starTrim.value + '%';
    const width = source.naturalWidth;
    const height = source.naturalHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let side = Math.min(width,height);
    if (position.value !== 'single') {
      const slot = Number(position.value);
      centerX = width * [.192,.5,.808][slot % 3];
      centerY = height * ([.425,.602,.779][Math.floor(slot / 3)] - (width === 591 ? .0185 : 0));
      side = width * .26;
    } else if (height / width > 1.8) {
      centerY = height * .408;
      side = width * .84;
    }
    const cropSize = Math.min(side * 100 / Number(zoom.value), width, height);
    const left = Math.max(0, Math.min(width - cropSize,
      centerX - cropSize / 2 + width * Number(horizontal.value) / 200));
    const top = Math.max(0, Math.min(height - cropSize,
      centerY - cropSize / 2 + height * Number(vertical.value) / 200));
    const target = document.createElement('canvas');
    target.width = target.height = canvas.width;
    const context = target.getContext('2d');
    context.drawImage(source,left,top,cropSize,cropSize,0,0,target.width,target.height);
    const trim = removeStars.checked ? Math.round(target.height * Number(starTrim.value) / 100) : 0;
    const clean = removeBg.checked;
    const stars = removeStars.checked;
    if (trim) context.clearRect(0,0,target.width,trim);
    previewTimer = setTimeout(() => {
      previewQueue = previewQueue.then(async () => {
        if (version !== previewVersion) return;
        try {
          if (clean) {
            const {removeBackground} = await import('./card-tools/cleanup.mjs');
            await removeBackground(target, stars, trim);
          }
          if (version !== previewVersion) return;
          preview.clearRect(0,0,canvas.width,canvas.height);
          preview.drawImage(target,0,0);
          status.textContent = '請確認預覽，再按「儲存並發布」。';
          cancel.textContent = '取消';
          submit.disabled = false;
        } catch {
          if (version === previewVersion) status.textContent = '自動去背暫時無法使用。可重試，或取消勾選自動去背後調整裁切。';
        }
      });
    },120);
  }

  file.onchange = async () => {
    const imageFile = file.files[0];
    const version = ++decodeVersion;
    previewVersion++;
    clearTimeout(previewTimer);
    source = null;
    submit.disabled = true;
    controls.hidden = true;
    status.textContent = '';
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (version !== decodeVersion) return;
      source = image;
      drawCrop();
      controls.hidden = false;
    } catch {
      if (version === decodeVersion) status.textContent = '無法讀取這張圖片，請試試 PNG 或 JPG。';
    } finally {
      URL.revokeObjectURL(url);
    }
  };
  position.onchange = () => {
    horizontal.value = vertical.value = '0';
    zoom.value = '100';
    drawCrop();
  };
  for (const slider of [horizontal,vertical,zoom,starTrim]) slider.oninput = drawCrop;
  removeBg.onchange = removeStars.onchange = drawCrop;
  change.onclick = () => openEditor(selectedName);
  document.getElementById('gallery-upload').onclick = () => openEditor('');
  cancel.onclick = () => dialog.close();
  dialog.addEventListener('cancel', event => {
    if (publishing) event.preventDefault();
  });
  dialog.addEventListener('close', () => {
    decodeVersion++;
    previewVersion++;
    clearTimeout(previewTimer);
    source = null;
    form.reset();
    form.hidden = true;
  });

  async function publishCard(name, data, token) {
    const endpoint = repositoryApi + '/' + cardFilename(name);
    const headers = {Authorization:'Bearer ' + token, Accept:'application/vnd.github+json'};
    for (let attempt = 0; attempt < 2; attempt++) {
      const current = await fetch(endpoint + '?ref=main', {
        headers, cache:'no-store', signal:AbortSignal.timeout(15000),
      });
      if (!current.ok && current.status !== 404) {
        throw new Error('無法讀取 GitHub 圖卡，請確認權杖和權限。');
      }
      const sha = current.ok ? (await current.json()).sha : undefined;
      const result = await fetch(endpoint, {
        method:'PUT', headers:{...headers,'Content-Type':'application/json'},
        body:JSON.stringify({message:'Update flower card: ' + name, content:data, sha, branch:'main'}),
        signal:AbortSignal.timeout(20000),
      });
      if (result.ok) return;
      if (attempt === 0 && [409,422].includes(result.status)) continue;
      throw new Error('GitHub 儲存失敗（' + result.status + '），請確認權杖有 Contents 寫入權限。');
    }
  }

  form.onsubmit = async event => {
    event.preventDefault();
    if (!source || publishing || submit.disabled) return;
    const name = canonical(edit('edit-name').value);
    const token = adminToken;
    if (!name || !token) {
      status.textContent = '請填花名和 GitHub 更新權杖。';
      return;
    }
    publishing = submit.disabled = cancel.disabled = true;
    controls.inert = true;
    file.disabled = true;
    status.textContent = '正在發布圖卡…';
    try {
      const src = canvas.toDataURL('image/png');
      if (!src.startsWith('data:image/png;base64,')) throw new Error('這個瀏覽器無法輸出 PNG，請更新瀏覽器再試。');
      await publishCard(name,src.split(',')[1],token);
      customCards.set(name,{src});
      refreshCards();
      submit.disabled = true;
      cancel.textContent = '關閉';
      status.textContent = '已發布「' + name + '」的圖卡。';
    } catch (error) {
      status.textContent = error.message || '發布失敗，請再試一次。';
      submit.disabled = false;
    } finally {
      publishing = cancel.disabled = false;
      controls.inert = file.disabled = false;
    }
  };

  function imageButton(name, image, inGallery = false) {
    const {src, fallback} = image;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', '查看「' + name + '」花圖');
    if (!inGallery) button.className = 'flower-card-button';
    const thumbnail = document.createElement('img');
    thumbnail.loading = 'lazy';
    thumbnail.alt = '';
    if (src) thumbnail.src = src;
    if (fallback) thumbnail.onerror = () => {
      thumbnail.onerror = null;
      thumbnail.src = fallback;
    };
    if (src) button.append(thumbnail);
    else {
      const missing = document.createElement('span');
      missing.className = 'flower-no-image';
      missing.textContent = '暫無圖片';
      button.append(missing);
    }
    if (inGallery) {
      const caption = document.createElement('span');
      caption.textContent = name;
      caption.className = 'gallery-name';
      const badge = document.createElement('span');
      badge.className = 'gallery-grade';
      badge.textContent = flowers.get(name)?.grade || '未分類';
      button.append(caption,badge);
    }
    button.onclick = () => {
      selectedName = name;
      title.textContent = name;
      form.hidden = true;
      fullImage.hidden = !src;
      close.hidden = false;
      const owners = [...(flowers.get(name)?.owners || [])];
      ownerDetails.textContent = owners.length ? '擁有者：' + owners.join('、') : '目前無人收藏';
      ownerDetails.hidden = false;
      change.hidden = !adminToken;
      if (src) fullImage.src = thumbnail.src;
      fullImage.alt = name + '的遊戲花圖';
      dialog.showModal();
    };
    return button;
  }

  function addCards() {
    for (const heading of table.querySelectorAll('tbody th[scope="row"]')) {
      const previous = heading.querySelector('.flower-card-button');
      const name = heading.textContent.trim();
      const card = cards.get(name);
      if (!card || previous?.dataset.cardSrc === card.src) continue;
      const button = imageButton(name,card);
      button.dataset.cardSrc = card.src;
      if (previous) previous.replaceWith(button);
      else heading.prepend(button);
    }
  }

  function renderCollection() {
    if (collection.hidden) return;
    if (!catalogPage.length) {
      const empty = document.createElement('p');
      empty.textContent = '沒有符合的花種。';
      collection.replaceChildren(empty);
      return;
    }
    collection.replaceChildren(...catalogPage.map(([name, flower]) => {
      const item = document.createElement('article');
      item.className = 'collection-card';
      const picture = imageButton(name, cards.get(name) || {});
      picture.className = 'collection-image';
      const heading = document.createElement('h3');
      heading.textContent = name;
      const grade = document.createElement('span');
      grade.className = 'gallery-grade';
      grade.textContent = flower.grade || '未分類';
      const owners = document.createElement('p');
      owners.className = 'collection-owners';
      owners.textContent = flower.owners.size ? '擁有者：' + [...flower.owners].join('、') : '目前無人收藏';
      item.append(picture,heading,grade,owners);
      return item;
    }));
  }

  function renderGallery() {
    if (gallery.hidden) return;
    const term = key(search.value);
    const matches = [...cards.keys()].filter(name => flowerMatches(name, term) &&
      (!grade.value || (flowers.get(name)?.grade || 'ungraded') === grade.value)).sort(byName);
    const lastPage = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, lastPage);
    const visible = matches.slice((page - 1) * pageSize, page * pageSize);
    grid.replaceChildren(...visible.map(name => imageButton(name, cards.get(name), true)));
    document.getElementById('gallery-count').textContent = matches.length ? matches.length + ' 張圖卡' : '沒有符合的圖卡。';
    document.getElementById('gallery-page').textContent = page + ' / ' + lastPage;
    prev.disabled = page === 1;
    next.disabled = page === lastPage;
  }

  function refreshCards() {
    const updated = new Map();
    for (const [name, image] of Object.entries(images)) {
      const corrected = canonical(name);
      if (!updated.has(corrected) || name === corrected) {
        updated.set(corrected,{src:'./flower-art/' + image});
      }
    }
    const overrides = new Map();
    for (const [name, card] of customCards) {
      const corrected = canonical(name);
      if (!overrides.has(corrected) || name === corrected) overrides.set(corrected,card);
    }
    for (const [name, card] of overrides) {
      if (card.legacy && updated.has(name)) continue;
      updated.set(name,{...card, fallback:updated.get(name)?.src});
    }
    cards = updated;
    addCards();
    renderGallery();
    renderCollection();
  }

  search.oninput = grade.onchange = () => { page = 1; renderGallery(); };
  document.addEventListener('flower-admin-updated', () => {
    change.hidden = !adminToken;
    if (!adminToken && dialog.open && !form.hidden && !publishing) dialog.close();
  });
  prev.onclick = () => { page--; renderGallery(); };
  next.onclick = () => { page++; renderGallery(); };
  document.addEventListener('flower-catalog-updated', refreshCards);
  document.addEventListener('flower-collection-updated', renderCollection);
  new MutationObserver(addCards).observe(table, {childList:true});
  refreshCards();
  loadCustomCards();
})();
