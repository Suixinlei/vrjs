var World = require('./world');
var container = document.getElementById('gl');
var world = new World(container, {
  stats: true
});
world.addMesh();
world.render(function () {
//        console.log('Excuse me');
});
