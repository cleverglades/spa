riot.tag2('app-help', '<h2>Help</h2> <p>{helptext}</p>', 'app-help,[riot-tag="app-help"] { position: fixed; top: auto; right: 0; bottom: 0; left: 0; width: 100%; height: 130px; box-sizing: border-box; font-family: sans-serif; margin: 0; padding: 1em; text-align: center; color: #666; background: #f7f7f7; } @media (min-width: 480px) { app-help,[riot-tag="app-help"] { top: 0; right: 0; bottom: auto; left: auto; width: 200px; height: 100%; } }', '', function(opts) {
    var self = this
    self.data = {
      first: "This is the help for the first page.",
      second: "This is the help for the second page."
    }

    var r = riot.route.create()
    r('*', function(id) {
      self.helptext = self.data[id] || 'Help not found.'
      self.update()
    })
    r(function() {
      self.helptext = "Click the navigation on the left edge."
      self.update()
    })
}, '{ }');

riot.tag2('app-main', '<div> <h1>{title}</h1> {body} <ul if="{isArch}"> <li each="{data}"><a href="/arch/{id}">{title}</a></li> </ul> </div>', 'app-main,[riot-tag="app-main"] { display: block; font-family: sans-serif; margin-right: 0; margin-bottom: 130px; margin-left: 50px; padding: 1em; text-align: center; color: #666; } app-main ul,[riot-tag="app-main"] ul { padding: 0px; list-style: none; } app-main li,[riot-tag="app-main"] li { display: list-item; margin: 5px; } app-main a,[riot-tag="app-main"] a { display: block; background: #f7f7f7; text-decoration: none; width: 150px; color: inherit; } app-main a:hover,[riot-tag="app-main"] a:hover { background: #eee; color: #000; } @media (min-width: 480px) { app-main,[riot-tag="app-main"] { margin-right: 200px; margin-bottom: 0; } }', '', function(opts) {
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
    r(           home       )

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
}, '{ }');

riot.tag2('app-navi', '<a each="{links}" href="/{url}" class="{selected: parent.selectedId === url}"> {name} </a>', 'app-navi,[riot-tag="app-navi"] { position: fixed; top: 0; left: 0; height: 100%; box-sizing: border-box; font-family: sans-serif; text-align: center; color: #666; background: #333; width: 50px; transition: width .2s; } app-navi:hover,[riot-tag="app-navi"]:hover { width: 60px; } app-navi a,[riot-tag="app-navi"] a { display: block; box-sizing: border-box; width: 100%; height: 50px; line-height: 50px; padding: 0 .8em; color: white; text-decoration: none; background: #444; } app-navi a:hover,[riot-tag="app-navi"] a:hover { background: #666; } app-navi a.selected,[riot-tag="app-navi"] a.selected { background: teal; }', '', function(opts) {
    var self = this

    this.links = [
      { name: "H", url: "" },
      { name: "Arch", url: "arch" },
      { name: "S", url: "second" }
    ]

    var r = riot.route.create()
    r(highlightCurrent)

    function highlightCurrent(id) {
      self.selectedId = id
      self.update()
    }
}, '{ }');
