import { BoxGeometry, BufferGeometry, Camera, DoubleSide, Float32BufferAttribute, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";

export class NorthArrowControl {


    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;
    private scene: Scene;


    constructor(private modelCamera: Camera, container: HTMLElement, rotation: number) {

        this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor(0, 0);
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);

        this.camera = new PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
        this.camera.up = modelCamera.up;

        this.scene = new Scene();
        //this.scene.buildDefaultLights();

        // an arrow object
        const geometry = new BufferGeometry();

        const pts = [
            new Vector3(-5, -10, 0),
            new Vector3(0, 10, 0),
            new Vector3(0, -7, 3),
            new Vector3(5, -10, 0)
        ];

        geometry.setFromPoints([
            pts[0],
            pts[1],
            pts[2],
            pts[2],
            pts[1],
            pts[3]
        ]);

        geometry.computeVertexNormals();

        // const material = new MeshLambertMaterial({ color: 0x8b4513, side: DoubleSide });
        const material = new MeshBasicMaterial({ color: 0x8b4513, side: DoubleSide });
        const mesh = new Mesh(geometry, material);
        if (rotation) {
            mesh.rotation.z = -rotation * Math.PI / 180;
        }
        this.scene.add(mesh);
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    private wordDirection = new Vector3();

    public update() {
        this.modelCamera.getWorldDirection(this.wordDirection);

        this.camera.position.copy(this.wordDirection.negate().setLength(30 /*cameraDistance*/));
        this.camera.quaternion.copy(this.modelCamera.quaternion);
    }



}