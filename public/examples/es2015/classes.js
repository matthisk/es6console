// The classes syntax is syntactic sugar for prototypal inheritance
// it now gives JavaScript a unified way to define inheritance
// including a super object to represent a classes parent

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

// Classes can be either defined in a Statement or an Expression
var c = class C {};

// The class to be extended can also be an Expression
var d = class D extends (class E {}) {};

