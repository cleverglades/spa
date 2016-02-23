<app-main>

  <div>
    <h1>{ title }</h1>
    { body }
    <ul if={ isArch }>
      <li each={ data }><a href="/arch/{ id }">{ title }</a></li>
    </ul>
  </div>

  <script>
    var self = this
    var xmlhttp = new XMLHttpRequest();
    var url = "https://api.github.com/repos/mistifyio/mistify/git/trees/newarch?recursive=1"
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        self.data=[];
        myArr.tree.forEach(function(i) {
          if(/^architecture\/.*\/README.md$/.test(i.path)) {
            var a = i.path.split('/');
            var xmlgetter = new XMLHttpRequest();
            var myUrl = "https://raw.githubusercontent.com/mistifyio/mistify/newarch/" + i.path;
            xmlgetter.onreadystatechange = function() {
              if (xmlgetter.readyState == 4 && xmlgetter.status == 200) {
                self.data.push({
                  id: a[1],
                  title: a[1].replace(/-/g,' '),
                  body: marked(xmlgetter.responseText)
                });
                self.update();
                console.log(marked(xmlgetter.responseText))
              }
            }
            xmlgetter.open("GET", myUrl, true);
            xmlgetter.send();
          }
        });
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    self.title = 'Now loading...'
    self.body = ''
    self.dataa = [
      { id: 'apple', title: 'Apple', body: "The world biggest fruit company." },
      { id: 'orange', title: 'Orange', body: "I don't have the word for it..." }
    ]

    var r = riot.route.create()
    r('/',       home       )
    r('arch',   arch      )
    r('arch/*', archDetail)
    r('second',  second     )
    r(           home       ) // `notfound` would be nicer!

    function home() {
      self.update({
        title:  "Home of the great app",
        body:  "Timeline or dashboard as you like!",
        isArch: false
      })
    }
    function arch() {
      self.update({
        title: "Architecture",
        body: "Explore!",
        isArch: true
      })
    }
    function archDetail(id) {
      var selected = self.data.filter(function(d) { return d.id == id })[0] || {}
      self.update({
        title: selected.title,
        body: selected.body,
        isArch: false
      })
    }
    function second() {
      self.update({
        title: "Second feature of your app",
        body: "It could be a config page for example.",
        isArch: false
      })
    }
  </script>

  <style scoped>
    :scope {
      display: block;
      font-family: sans-serif;
      margin-right: 0;
      margin-bottom: 130px;
      margin-left: 50px;
      padding: 1em;
      text-align: center;
      color: #666;
    }
    ul {
      padding: 0px;
      list-style: none;
    }
    li {
      display: list-item;
      margin: 5px;
    }
    a {
      display: block;
      background: #f7f7f7;
      text-decoration: none;
      width: 150px;
      color: inherit;
    }
    a:hover {
      background: #eee;
      color: #000;
    }
    @media (min-width: 480px) {
      :scope {
        margin-right: 200px;
        margin-bottom: 0;
      }
    }
  </style>

</app-main>
