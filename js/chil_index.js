let container, stats;
let camera, scene, renderer;
let group;
let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let THREE = window.THREE;

// 模型组的外接盒
let envelopeBox = new THREE.Box3();

let mat1 = '../models/tu_models/ysts/ysts.mtl';
let obj1 = '../models/tu_models/ysts/ysts.obj';

let mat2 = '../models/tu_models/tongziwu_wuding/wuding.mtl';
let obj2 = '../models/tu_models/tongziwu_wuding/wuding.obj';

let mat3 = '../models/tu_models/tongziwu_menban/menban.mtl';
let obj3 = '../models/tu_models/tongziwu_menban/menban.obj';

let mat4 = '../models/tu_models/tongziwu_chushi/chushi.mtl';
let obj4 = '../models/tu_models/tongziwu_chushi/chushi.obj';

let mat5 = '../models/tu_models/tongziwu_chuangling/chuangling.mtl';
let obj5 = '../models/tu_models/tongziwu_chuangling/chuangling.obj';

let model1 = null, model2 = null, model3 = null, model4 = null, model5 = null, currentModel = model1;

// 模型是否自传
let rotation = true;


/*let info_obj = {
    15:{name:'abc', id:15},
    11:{name:'bdc', id:11}
};*/
init();
animate();

function init() {

    container = document.getElementById('myContainer');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 10000000);
    camera.position.z = 500;
    camera.position.y = 200;

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xFFFFFF, 1));

    d3.select('#info_content').html(`<div>云舍挑手</div><div>挑手的相关介绍</div>`);
    d3.select('#info').style('display', 'block');

    new THREE.MTLLoader()
        .load(mat1, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj1, function (loadedMesh) {
                    currentModel = model1 = loadedMesh;
                    console.log(loadedMesh);
                    group.add(model1);
                    envelopeBox.expandByObject(group);
                });
        });
    new THREE.MTLLoader()
        .load(mat2, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj2, function (loadedMesh) {
                    model2 = loadedMesh;
                    model2.scale.set(0.5, 0.5, 0.5);
                    console.log(loadedMesh);
                });

        });
    new THREE.MTLLoader()
        .load(mat3, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj3, function (loadedMesh) {
                    model3 = loadedMesh;
                    model3.scale.set(3, 3, 3);
                    console.log(loadedMesh);
                });

        });
    new THREE.MTLLoader()
        .load(mat4, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj4, function (loadedMesh) {
                    model4 = loadedMesh;
                    model4.scale.set(6, 6, 6);
                    console.log(loadedMesh);
                });

        });
    new THREE.MTLLoader()
        .load(mat5, function (mat) {
            mat.preload();
            self.materials = mat;
            new THREE.OBJLoader()
                .setMaterials(mat)
                .load(obj5, function (loadedMesh) {
                    model5 = loadedMesh;
                    model5.scale.set(3, 3, 3);
                    console.log(loadedMesh);
                });

        });

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true, autoClear: true});
    // renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize(475, 600, 10000);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    let orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = false;

    onClick();

    event();


}


function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

}


function onClick() {
    //renderer.domElement.style.cursor = 'crosshair';
    renderer.domElement.addEventListener('click', clickFn);
}

function clickFn(e) {
    rotation = false;
}

function animate() {

    requestAnimationFrame(animate);

    render();

}


function render() {
    if (rotation) {
        group.rotation.y += 0.01;
    }
    renderer.render(scene, camera);

}


/**
 * 递归循环模型，并执行相应的操作
 * @param mesh 贷循环的模型
 * @param fn function(mesh)
 */
function recursionFn(mesh, fn) {
    if (mesh.children.length !== 0) {
        fn(mesh);
        mesh.children.forEach(m => {
            recursionFn(m, fn);
        })
    } else {
        fn(mesh);
    }
}

/**
 * 根据鼠标事件对象：e.clientX,e.clientY获取Mesh数组
 * @param clientX
 * @param clientY
 * @returns {*}
 */
function getMeshByClientXY(clientX, clientY) {
    return fetchObjects(clientX, clientY);
}

function fetchObjects(clientX, clientY) {
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    //从相机发射一条射线，经过鼠标点击位置
    raycaster.setFromCamera(mouse, camera);
    //计算射线相机到的对象，可能有多个对象，因此返回的是一个数组，按离相机远近排列
    let intersectObjs = raycaster.intersectObjects(currentModel.children);

    return intersectObjs;
}


function modelChange(modelId) {
    switch (modelId) {
        case 'obj1':
            currentModel = model1;
            d3.select('#info_content').html(`<div>挑手</div><div>挑手的相关介绍</div>`);
            d3.select('#info').style('display', 'block');
            break;
        case 'obj2':
            currentModel = model2;
            d3.select('#info_content').html(`<div>屋顶</div><div>屋顶的相关介绍</div>`);
            d3.select('#info').style('display', 'block');
            break;
        case 'obj3':
            currentModel = model3;
            d3.select('#info_content').html(`<div>门板</div><div>门板的相关介绍</div>`);
            d3.select('#info').style('display', 'block');
            break;
        case 'obj4':
            currentModel = model4;
            d3.select('#info_content').html(`<div>础石</div><div>础石的相关介绍</div>`);
            d3.select('#info').style('display', 'block');
            break;
        case 'obj5':
            currentModel = model5;
            d3.select('#info_content').html(`<div>窗棂</div><div>窗棂的相关介绍</div>`);
            d3.select('#info').style('display', 'block');
            break;
        default:
            currentModel = model5;
            break;
    }
}


function event() {
    d3.select('#opt').on('change', function () {
        let modelId = d3.select(this).property('value');
        scene.remove(group);
        group = new THREE.Group();
        modelChange(modelId);
        group.add(currentModel);
        scene.add(group);
        envelopeBox.expandByObject(group);
    });
    d3.select('#info_close').on('click', function () {
        d3.select('#info').style('display', 'none');
    });
    d3.select('#back').on('click', function () {
        location.href = "../pages/model1_index.html";
    })
}
