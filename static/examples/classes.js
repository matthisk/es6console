class C {}
var c1 = C;
{
  class C {}
  var c2 = C;
}


class Name { };
class Mesh {
  constructor(geometry) {
    this.geometry = geometry;
  }

  update( y = 12 ) {
    console.log("update");
  }
};

class SkinnedMesh extends Mesh {
  constructor(geometry, materials) {
    super(geometry, materials);

    this.idMatrix = SkinnedMesh.defaultMatrix();
    this.bones = [];
    this.boneMatrices = [];
    //...
  }
  update(camera) {
    //...
    super.update();
  }
  static defaultMatrix() {
    return new THREE.Matrix4();
  }
}

