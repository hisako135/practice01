//paintworkletの読込み
window.paintWorklet.import('paintworklet.js');

//寿司データ
const sushi = [
  { price: 100, name: 'まぐろ', cal:52 },
  { price: 150, name: 'かんぱち', cal:41 },
  { price: 100, name: 'サーモン', cal:32 },
  { price: 80, name: 'たまご', cal:45 },
  { price: 200, name: 'つぶがい', cal:30 },
  { price: 400, name: 'うに', cal:50 },
  { price: 300, name: 'いくら', cal:65 },
  { price: 300, name: 'えび', cal:50 },
  { price: 1000, name: 'あわび', cal:50 },
];

//コースデータ
const course = [
  { name: 'ume', circleWidth: 200, circleHeight: 200, msg: '梅コース<br>おすすめはカンパチ！', },
  { name: 'take', circleWidth: 300, circleHeight: 300, msg: '竹コース<br>えび美味い！', },
  { name: 'matsu', circleWidth: 400, circleHeight: 400, msg: '松コース<br>よっ！太っ腹！', },
];

//sushiリスト表示エリア
const divObj = document.getElementById("viewArea");
//セレクタ
const selector = document.getElementById('filterSelector');
//さざ波
const ripple = document.getElementById('ripple');

//とりあえず初期化
init();

//valueでフィルタかけてごにょごにょ
selector.addEventListener('change', function() {

    let index = this.selectedIndex;
    let value = this.options[index].value;

    if(value == 'none') {
        init();
    } else {
      //sushi配列にoptionのvalueでフィルタかけた新しい配列を生成
      let sushiFiltered = sushi.filter(function(item, index){
        if (value == 'ume') {
          return ( 150 >= item.price && item.price >= 80)
        }else if (value == 'take') {
          return ( 300 >= item.price && item.price  >= 150)
        }else if (value == 'matsu') {
          return ( item.price && item.price  >= 300)
        }
      });

      //フィルタかけた新しい配列をliでつくる
      let listHtml = sushiFiltered.reduce(function(prev,current,index){
        return prev + listTemplate(current.name, current.price, index+1);
      },'');

      //つくったliをulで囲ってdivObj内にレンダリング
      render(divObj, ul_template(listHtml))

      //合計金額を計算
      let totalPrice = sushiFiltered.reduce(function(prev,current,index){
        return prev + current.price;
      },0);

      //総カロリー量を計算
      let totalCal = sushiFiltered.reduce(function(prev,current,index){
        return prev + current.cal;
      },0);

      //URLにハッシュつける
      setHash(value);

      //さざ波起こす
      let start = performance.now();
      let x, y;
      ripple.classList.remove('hidden');
      ripple.classList.add('animating');
      [x, y] = [ripple.offsetLeft, ripple.offsetTop];
      start = performance.now();

      //アニメーション
      requestAnimationFrame(function raf(now) {

        const count = Math.floor(now - start);

        paintRipple(course,value, count); //丸の大きさ
        rippleMsg(course,value); //メッセージ表示

        //さざ波終わらせる
        if(count > 1000) {
          ripple.classList.remove('animating');
          paintRipple(course,value, 0);
          ripple.innerHTML = `合計金額：${totalPrice}円<br>総カロリー：${totalCal}kcal`;
          return;
        }
        requestAnimationFrame(raf);
      })
  }

},'');

//初期化
function init(){
  //sushiデータ全部出し
  const sushiAll = allListTemplate(sushi);
  render(divObj, ul_template(sushiAll));
  //丸消す
  ripple.classList.add('hidden');
  //ハッシュ消す
  let hashString = location.hash.substr(1); // '#'消す
  history.replaceState('', document.title, window.location.pathname);
}

//forEach使いたかったのでforEachして得た値をまるっとまとめて渡す関数つくった
function allListTemplate(array) {
      let hoge = '';
      array.forEach(function(item,index){
        hoge += `<li class="list-group-item">${index+1} : ${item.name}：${item.price}円</li>`;
      });
     return hoge;
};

//liつくる関数
function listTemplate(name,price,index){
    return  `<li class="list-group-item">${index} : ${name} : ${price}円</li>`;
};

//ulつくる関数
function ul_template(html){
    return  `<ul>${html}</ul>`;
};

//htmlにrenderする関数
function render(dom,html){
  dom.innerHTML = html;
};

//コースごとの丸の大きさを返す
function paintRipple (dataArray, name, count) {
  const item = dataArray.filter(function(item,index){
      return (item.name == name);
  });
  return ripple.style.cssText = `width:${item[0].circleWidth}px;height:${item[0].circleHeight}px; --animation-tick: ${count};`;
};

//コースごとのメッセージを返す
function rippleMsg (dataArray, name) {
  const item = dataArray.filter(function(item,index){
      return (item.name == name);
  });
  return  ripple.innerHTML = `${item[0].msg}`;
};

//URLにハッシュつける
function setHash(course){
  return location.hash = `${course}`;
};