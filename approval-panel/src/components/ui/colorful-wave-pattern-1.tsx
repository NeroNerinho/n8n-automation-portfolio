import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X } from 'lucide-react';

interface ElectricWavesShaderProps {
    showControls?: boolean;
    onCloseControls?: () => void;
}

const ElectricWavesShader = ({ showControls = false, onCloseControls }: ElectricWavesShaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Shader parameter state
    const [waveCount, setWaveCount] = useState(5.0);
    const [amplitude, setAmplitude] = useState(0.1);
    const [frequency, setFrequency] = useState(2.0);
    const [brightness, setBrightness] = useState(0.005);
    const [colorSeparation, setColorSeparation] = useState(0.1);

    // Sync React state → shader uniforms
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_waveCount.value = waveCount;
            materialRef.current.uniforms.u_amplitude.value = amplitude;
            materialRef.current.uniforms.u_frequency.value = frequency;
            materialRef.current.uniforms.u_brightness.value = brightness;
            materialRef.current.uniforms.u_colorSeparation.value = colorSeparation;
        }
    }, [waveCount, amplitude, frequency, brightness, colorSeparation]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 1) Renderer / Scene / Camera / Clock
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);
        } catch (err) {
            console.error('WebGL not supported', err);
            container.innerHTML = '<p style="color:white;text-align:center;">Sorry, WebGL isn’t available.</p>';
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const clock = new THREE.Clock();

        // 2) GLSL 100 shaders
        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision mediump float;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_waveCount;
      uniform float u_amplitude;
      uniform float u_frequency;
      uniform float u_brightness;
      uniform float u_colorSeparation;

      float pattern(vec2 uv) {
        float intensity = 0.0;
        for (float i = 0.0; i < u_waveCount; i++) {
          uv.x += sin(u_time * (1.0 + i) + uv.y * u_frequency) * u_amplitude;
          intensity += u_brightness / abs(uv.x);
        }
        return intensity;
      }

      vec3 scene(vec2 uv) {
        vec3 color = vec3(0.0);
        vec2 ruv = vec2(uv.y, uv.x);
        for (float i = 0.0; i < u_waveCount; i++) {
          int channel = int(mod(i, 3.0));
          vec2 cuv = ruv + vec2(0.0, i * u_colorSeparation);
          color[channel] += pattern(cuv);
        }
        return color;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution)
                  / min(u_resolution.x, u_resolution.y);
        vec3 col = scene(uv);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

        // 3) Material / Mesh
        const uniforms = {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2() },
            u_waveCount: { value: waveCount },
            u_amplitude: { value: amplitude },
            u_frequency: { value: frequency },
            u_brightness: { value: brightness },
            u_colorSeparation: { value: colorSeparation }
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader
        });
        // @ts-ignore
        materialRef.current = material;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 4) Handle resize
        const onResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            uniforms.u_resolution.value.set(width, height);
        };
        window.addEventListener('resize', onResize);
        onResize();

        // 5) Animation loop
        renderer.setAnimationLoop(() => {
            uniforms.u_time.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        });

        // 6) Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            renderer.setAnimationLoop(null);
            container.removeChild(renderer.domElement);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    // Control panel styles
    const controlPanelStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center on screen for settings mode
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '24px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: 'white',
        fontFamily: 'sans-serif',
        width: '320px',
        zIndex: 9999,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)'
    };
    const sliderStyle: React.CSSProperties = {
        width: '100%',
        accentColor: 'white',
        cursor: 'pointer'
    };
    const labelStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '0.875rem'
    };

    return (
        <>
            <div
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -1,
                    backgroundColor: '#000'
                }}
                aria-label="Interactive electric waves background"
            />

            {/* Interactive Controls Modal */}
            {showControls && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
                        onClick={onCloseControls}
                    />
                    <div style={controlPanelStyle}>
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <h3 className="font-semibold text-lg">Configurar Tema</h3>
                            <button onClick={onCloseControls} className="text-zinc-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div>
                            <div style={labelStyle}>
                                <span>Contagem de Ondas</span>
                                <span className="font-mono text-xs">{waveCount.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="1"
                                value={waveCount}
                                onChange={e => setWaveCount(parseFloat(e.target.value))}
                                style={sliderStyle}
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>
                                <span>Amplitude</span>
                                <span className="font-mono text-xs">{amplitude.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.01"
                                max="0.5"
                                step="0.01"
                                value={amplitude}
                                onChange={e => setAmplitude(parseFloat(e.target.value))}
                                style={sliderStyle}
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>
                                <span>Frequência</span>
                                <span className="font-mono text-xs">{frequency.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="10"
                                step="0.1"
                                value={frequency}
                                onChange={e => setFrequency(parseFloat(e.target.value))}
                                style={sliderStyle}
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>
                                <span>Brilho</span>
                                <span className="font-mono text-xs">{brightness.toFixed(5)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.00001"
                                max="0.01"
                                step="0.00001"
                                value={brightness}
                                onChange={e => setBrightness(parseFloat(e.target.value))}
                                style={sliderStyle}
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>
                                <span>Separação de Cor</span>
                                <span className="font-mono text-xs">{colorSeparation.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="0.5"
                                step="0.01"
                                value={colorSeparation}
                                onChange={e => setColorSeparation(parseFloat(e.target.value))}
                                style={sliderStyle}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ElectricWavesShader;
