CAPS.Simulation = function () {

	this.scene        = undefined;
	this.capsScene    = undefined;
	this.backStencil  = undefined;
	this.frontStencil = undefined;

	this.camera   = undefined;
	this.renderer = undefined;
	this.controls = undefined;

	this.showCaps = true;

	this.init();

};

CAPS.Simulation.prototype = {

	constructor: CAPS.Simulation,

	init: function () {

		var self = this;

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( '../models/miao_models/xinbowuguan.DAE', function ( collada ) {
			self.initScene( collada.scene );
		} );

		var container = document.createElement( 'div' );
		document.body.appendChild( container );

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.set( 20, 20, 20 );
		this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

		this.scene        = new THREE.Scene();
		this.capsScene    = new THREE.Scene();
		this.backStencil  = new THREE.Scene();
		this.frontStencil = new THREE.Scene();

		this.selection = new CAPS.Selection(
			new THREE.Vector3( -14, -7, -7 ),
			new THREE.Vector3( 14, 7, 9 )
		);
		this.capsScene.add( this.selection.boxMesh );
		this.scene.add( this.selection.touchMeshes );
		this.scene.add( this.selection.displayMeshes );

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor( 0xffffff );
		this.renderer.autoClear = false;
		container.appendChild( this.renderer.domElement );

		var throttledRender = CAPS.SCHEDULE.deferringThrottle( this._render, this, 40 );
		this.throttledRender = throttledRender;

		CAPS.picking( this ); // must come before OrbitControls, so it can cancel them

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.addEventListener( 'change', throttledRender );

		var onWindowResize = function () {
			self.camera.aspect = window.innerWidth / window.innerHeight;
			self.camera.updateProjectionMatrix();
			self.renderer.setSize( window.innerWidth, window.innerHeight );
			throttledRender();
		};
		window.addEventListener( 'resize', onWindowResize, false );

		var showCapsInput = document.getElementById( 'showCaps' );
		this.showCaps = showCapsInput.checked;
		var onShowCaps = function () {
			self.showCaps = showCapsInput.checked;
			throttledRender();
		};
		showCapsInput.addEventListener( 'change', onShowCaps, false );

		throttledRender();

	},

	initScene: function ( collada ) {

		var setMaterial = function ( node, material ) {

			node.material = material;
			if ( node.children ) {
				for ( var i = 0; i < node.children.length; i++ ) {
					setMaterial( node.children[i], material );
				}
			}
		};

		var back = collada.clone();
		setMaterial( back, CAPS.MATERIAL.backStencil );
		back.scale.set( 0.03, 0.03, 0.03 );
		back.updateMatrix();
		this.backStencil.add( back );

		var front = collada.clone();
		setMaterial( front, CAPS.MATERIAL.frontStencil );
		front.scale.set( 0.03, 0.03, 0.03 );
		front.updateMatrix();
		this.frontStencil.add( front );

		setMaterial( collada, CAPS.MATERIAL.sheet );
		collada.scale.set( 0.03, 0.03, 0.03 );
		collada.updateMatrix();
		this.scene.add( collada );

		this.throttledRender();

	},

	_render: function () {

		this.renderer.clear();

		var gl = this.renderer.context;

		if ( this.showCaps ) {

			this.renderer.state.setStencilTest( true );

			this.renderer.state.setStencilFunc( gl.ALWAYS, 1, 0xff );
			this.renderer.state.setStencilOp( gl.KEEP, gl.KEEP, gl.INCR );
			this.renderer.render( this.backStencil, this.camera );

			this.renderer.state.setStencilFunc( gl.ALWAYS, 1, 0xff );
			this.renderer.state.setStencilOp( gl.KEEP, gl.KEEP, gl.DECR );
			this.renderer.render( this.frontStencil, this.camera );

			this.renderer.state.setStencilFunc( gl.EQUAL, 1, 0xff );
			this.renderer.state.setStencilOp( gl.KEEP, gl.KEEP, gl.KEEP );
			this.renderer.render( this.capsScene, this.camera );

			this.renderer.state.setStencilTest( false );

		}

		this.renderer.render( this.scene, this.camera );

	}

};

/*var vertexShaderSource =
	"attribute vec3 vertexPos;\n" +
	"uniform mat4 modelViewMatrix;\n" +
	"uniform mat4 projectionMatrix;\n" +
	"void main(void) {\n" +
	"	//返回变换并投影后的顶点数据\n" +
	"	gl_Position = projectionMatrix * modelViewMatrix * \n" +
	"		vec4(vertexPos, 1.0);\n" +
	"}\n";
var fragmentShaderSource =
	"void main(void) {\n" +
	"//返回像素颜色：永远输出白色\n" +
	"	gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n" +
	"}\n";*/

