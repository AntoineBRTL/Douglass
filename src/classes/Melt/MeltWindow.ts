import { BrowserWindow, screen } from "electron";
import { Melter } from "./Melter.js";

export class MeltWindow extends BrowserWindow
{
    public constructor()
    {
        super({
            width: screen.getPrimaryDisplay().size.width,
            height: screen.getPrimaryDisplay().size.height,
            // Basic options to hide the window
            skipTaskbar: true,
            // alwaysOnTop: true,
            closable: false,
            frame: false,
            hasShadow: false,
            transparent: true,
            fullscreen: true,
            focusable: false,
            // Enable node js in the window
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true
            }
        });

        // this.setIgnoreMouseEvents(true);
        // this.webContents.openDevTools({mode:"detach"});

        let html = `<body style='overflow: hidden; margin: 0px; cursor: not-allowed;'>
            <audio id="Music" autoplay loop>
                <source src="http://www.angelxp.eu/animation/m/Oui-Oui.mp3" type="audio/mp3">
            </audio>
            <script>
                const { desktopCapturer, dialog, screen } = require('electron');
                const { spawn } = require('child_process');
        
                let vss = \`#version 300 es
                precision mediump float;
                in vec3 vertexPosition;
        
                void main(){
                    gl_Position = vec4(vertexPosition, 1.0);
                }
                \`;
        
                let doomFss = \`#version 300 es
                precision mediump float;
        
                // initial "paint melt" speed
                const float START_SPEED  = 0.0007;
                // texture melting off screen speed
                const float MELT_SPEED   = 0.0007;
        
                uniform float width;
                uniform float height;
                uniform float time;
                uniform sampler2D texture0;
                layout(location = 0) out vec4 out1;
        
                void main()
                {
                    vec2 resolution = vec2(width, height);
                    vec2 uv = gl_FragCoord.xy / resolution;
                    vec2 p = uv;
        
                    float t = time;
                    // flip textures every second melt
                    float rt = time;
                    bool texFlip = rt > .0;
        
                    // first let some "paint" drip before moving entire texture contents
                    float d = START_SPEED * t;
                    if(d > 1.) d = 1.;
        
                    // initial paint melt shift
                    p.y += d * 0.35 * fract(sin(dot(vec2(p.x, .0), vec2(12.9898, 78.233)))* 43758.5453);
                    
                    // now move entire melted texture offscreen
                    if(d == 1.)
                        p.y += MELT_SPEED * (t - d/START_SPEED);
        
                    vec4 back = vec4(vec3(0.0), 1.0);
                        
                    if(texFlip)
                        out1 = vec4(texture(texture0, p));
                    else
                        out1 = back;
        
                    // draw second image behind the melting texture
                    if(p.y > 1.)
                    {
                        if(texFlip)
                            out1 = back;
                        else
                            out1 = vec4(texture(texture0, uv));
                    }

                    out1 += vec4(0.005, 0.0, 0.0, 0.0);
                }\`;
        
                class MeltRenderer
                {
                    _canvas;
                    _gl;
                    _program;
                    _screenTexture;
                    _time;
        
                    constructor()
                    {
                        this._canvas = document.createElement('canvas');
                        document.body.appendChild(this._canvas);
        
                        this._gl = this._canvas.getContext('webgl2');
        
                        if(!this._gl)
                            throw new Error('No webgl ctx found');
        
                        this._resize();
        
                        this._compileShaders();
        
                        let vertices = new Array();
                        vertices.push(-1.0,  1.0, 0.0);
                        vertices.push(-1.0, -1.0, 0.0);
                        vertices.push( 1.0, -1.0, 0.0);
                        vertices.push( 1.0,  1.0, 0.0);
        
                        vertices = new Float32Array(vertices);
        
                        {
                            let buffer = this._gl.createBuffer();
                            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
                            this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
        
                            let location = this._gl.getAttribLocation(this._program, 'vertexPosition');
                            this._gl.vertexAttribPointer(location, 3, this._gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
                            this._gl.enableVertexAttribArray(location);
                        }
        
                        {
                            this._screenTexture = this._gl.createTexture();
                            this._gl.bindTexture(this._gl.TEXTURE_2D, this._screenTexture);
                            this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, 1, 1, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
                            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
                        }
        
                        this._time = 0;
                    }
        
                    _compileShaders()
                    {
                        let vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
                        this._gl.shaderSource(vertexShader, vss);
                        this._gl.compileShader(vertexShader);
        
                        let fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
                        this._gl.shaderSource(fragmentShader, doomFss);
                        this._gl.compileShader(fragmentShader);
        
                        // logs
                        if(!this._gl.getShaderParameter(vertexShader, this._gl.COMPILE_STATUS))
                        {
                            throw new Error(this._gl.getShaderInfoLog(vertexShader));
                        }
        
                        if(!this._gl.getShaderParameter(fragmentShader, this._gl.COMPILE_STATUS))
                        {
                            throw new Error(this._gl.getShaderInfoLog(fragmentShader));
                        }
        
                        let program = this._gl.createProgram();
                        this._gl.attachShader(program, vertexShader);
                        this._gl.attachShader(program, fragmentShader);
                        this._gl.linkProgram(program);
                        this._gl.useProgram(program);
        
                        this._program = program;
                    }
        
                    _resize()
                    {
                        this._canvas.width = window.innerWidth;
                        this._canvas.height = window.innerHeight;
                        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
                    }
        
                    _clear()
                    {
                        this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
                        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                    }
        
                    _render()
                    {
                        this._clear();
        
                        {
                            this._fillMemory("width", window.innerWidth);
                            this._fillMemory("height", window.innerHeight);
                            this._fillMemory("time", this._time);
                        }
        
                        this._gl.drawArrays(this._gl.TRIANGLE_FAN, 0, 4);
        
                        this._time ++;

                        if(process.platform === "win32")
                            spawn(\`powershell\`, [\`Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Douglass t as bien eu','Error','ok','Error')\`]);
                    }
        
                    melt(captureSrc)
                    {
                        let image = new Image();
                        image.src = captureSrc;
                        image.width = window.innerWidth;
                        image.height = window.innerHeight;
        
                        image.onload = function()
                        {
                            this._gl.bindTexture(this._gl.TEXTURE_2D, this._screenTexture);
                            this._gl.texImage2D(
                                this._gl.TEXTURE_2D,
                                0,
                                this._gl.RGBA,
                                this._gl.RGBA,
                                this._gl.UNSIGNED_BYTE,
                                image
                            );
                            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
        
                            let location = this._gl.getUniformLocation(this._program, "texture0");
                            this._gl.uniform1i(location, 0);
                            this._gl.activeTexture(this._gl.TEXTURE0);

                            this._render();
                        }.bind(this);
                    }
        
                    _fillMemory(uniformName, value, float = true)
                    {
                        let location = this._gl.getUniformLocation(this._program, uniformName);
        
                        if(!float)
                        {
                            this._gl.uniform1i(location, value);
                            return;
                        }
        
                        this._gl.uniform1f(location, value);
                    }
                }
        
                const MELT_RENDERER = new MeltRenderer();
                document.getElementById("Music").volume = 0.1;
            </script>
        </body>`;
        
        this.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
    }
}