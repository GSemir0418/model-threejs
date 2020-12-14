let container, stats;
let camera, scene, renderer, orbitControls;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let THREE = window.THREE;
//模型路径
let mat1 = '../models/miao_models/langde_xinbowuguan/xinbowuguan.mtl';
let obj1 = '../models/miao_models/langde_xinbowuguan/xinbowuguan.obj';
let model1;
let haha = [];
// 模型是否自传
let rotation = true;


let info_obj = {
    134: {name: '屋顶', id: 49},
    130: {name: '椽子', id: 49},
    129: {name: '檩条', id: 47},
    39: {name: '木制梁', id: 47},
    133: {name: '顶层木板1', id: 47},
    132: {name: '顶层木板2', id: 47},
    131: {name: '顶层楼板', id: 47},
    84: {name: '二层楼板', id: 47},
    79: {name: '一层正面门板', id: 32},
    96: {name: '二层正面门板', id: 32},
    88: {name: '二层扶手', id: 32},
    87: {name: '二层正面美人靠', id: 32},
    85: {name: '二层侧面美人靠', id: 32},
    86: {name: '一层美人靠', id: 32},
    89: {name: '一层正门', id: 32},
    94: {name: '二层正门', id: 32},
    121: {name: '二层门1', id: 32},
    119: {name: '二层门2', id: 32},
    117: {name: '二层门3', id: 32},
    120: {name: '二层门4', id: 32},
    92: {name: '一层正面窗1', id: 32},
    90: {name: '一层正面窗2', id: 32},
    101: {name: '一层正面窗3', id: 32},
    97: {name: '一层正面窗4', id: 32},
    102: {name: '一层正面窗5', id: 32},
    93: {name: '二层正面窗1', id: 32},
    26: {name: '二层右侧窗1', id: 32},
    38: {name: '二层右侧窗2', id: 32},
    118: {name: '二层正面窗2', id: 32},
    95: {name: '二层正面窗3', id: 32},
    100: {name: '二层正面窗4', id: 32},
    98: {name: '二层正面窗5', id: 32},
    99: {name: '二层正面窗6', id: 32},
    107: {name: '二层背面窗1', id: 32},
    108: {name: '二层背面窗2', id: 32},
    106: {name: '二层背面窗3', id: 32},
    105: {name: '二层背面窗4', id: 32},
    110: {name: '一层背面窗1', id: 32},
    111: {name: '一层背面窗2', id: 32},
    112: {name: '一层背面窗3', id: 32},
    114: {name: '地面', id: 30},
    76: {name: '木制框架', id: 31},
    136: {name: '左侧门板', id: 35},
    109: {name: '一层后侧门板', id: 33},
    128: {name: '二层后侧门板', id: 33},
    127: {name: '后部挑手', id: 37},
    126: {name: '前部挑手', id: 38},
    135: {name: '右侧门板', id: 38},
    113: {name: '楼梯', id: 38},
    78: {name: '右内侧门板', id: 38},
    124: {name: '内门1', id: 38},
    125: {name: '内门2', id: 38},
    123: {name: '内门3', id: 38},
    80: {name: '内部门板1', id: 38},
    81: {name: '内部门板2', id: 38},
    82: {name: '内部门板3', id: 38},
    115: {name: '内部门板4', id: 38},
    122: {name: '内部门板5', id: 38},
    83: {name: '内部门板6', id: 38},
    77: {name: '础石', id: 38},

};

init();
animate();


function init() {

    container = document.getElementById('container');


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 10000000);
    camera.position.z = 1000;
    camera.position.y = 250;

    scene = new THREE.Scene();

    group = new THREE.Group();

    let meshBox3 = new THREE.Box3();

    scene.add(new THREE.AmbientLight(0xFFFFFF, 1.5));

    //加载模型
    new THREE.MTLLoader()
        .load(mat1, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj1, function (loadedMesh) {
                    model1 = loadedMesh;
                    //model1.scale.set(0.4, 0.4, 0.4);
                    console.log(loadedMesh);

                    model1.traverse(function (value) {
                        if (value.isMesh) {
                            meshBox3.setFromObject(value);
                            haha.push(value);
                        }
                    });
                    scene.add(model1);
                });
        });

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true, autoClear: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = false;


    drag();
    event();

}

//窗口自适应
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function drag() {

    let transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.setSize(0.5);
    scene.add(transformControls);

    // 初始化拖拽控件
    let dragControls = new THREE.DragControls(haha, camera, renderer.domElement);

    // 鼠标略过事件
    dragControls.addEventListener('hoveron', function (event) {
        // 让变换控件对象和选中的对象绑定
        transformControls.attach(event.object);
        console.log(event.object.id);
        let target = event.object;
        let obj = info_obj[target.id] || {};
        d3.select('#info_content').html(`<div>${obj.name}</div>`);
        d3.select('#info').style('display', 'block');

    });
    // 开始拖拽
    dragControls.addEventListener('dragstart', function (event) {
        orbitControls.enabled = false;


    });
    // 拖拽结束
    dragControls.addEventListener('dragend', function (event) {
        orbitControls.enabled = true;

    });
}


function animate() {
    orbitControls.update();

    requestAnimationFrame(animate);

    render();

}

function render() {
    //模型自转
    /*if (rotation) {
         model1.rotation.y += 0.01;
     }*/
    renderer.render(scene, camera);

}


function event() {
    d3.select('#blast').on('click', function () {
        location.href = "./miao_blast_index.html"
    });
    d3.select('#clip').on('click', function () {
        location.href = "./miao_clip_index.html"
    });
    d3.select('#home').on('click', function () {
        location.href = "../index.html"
    });
}
