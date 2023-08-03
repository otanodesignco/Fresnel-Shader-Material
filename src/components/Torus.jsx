
import React, { useRef } from 'react'
import { Vector2, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

const uniforms =
{

  uResolution: { value: new Vector2( window.innerWidth, window.innerHeight ) },
  uColor: { value: new Color( 0x0777FD ) },
  uRimColor: { value: new Color( 0x02FEFF ) },
  uFresnelFactor: { value: 1.5 },
  uFresnelBias: { value: 0.05 },
  uIntensity: { value: 1.5 },

}

export default function Torus( props )
{

    const alpha = props.alpha ? props.alpha : false

    const { FresnelFactor, FresnelBias, FresnelIntensity } = useControls(
        {
          FresnelFactor:
          {
            value: 1.5,
            min: 0,
            max: 30,
            step: 0.001
          },
          FresnelBias:
          {
            value: 0.05,
            min: 0,
            max: 1,
            step: 0.001
          },
          FresnelIntensity:
          {
            value: 1.5,
            min: 0,
            max: 50,
            step: 0.001
          }
        }
      )
    
    
    const vertex = /*glsl*/`
    
    out vec3 vObjectPosition;
    out vec2 vUv;
    out vec3 vView;
    out vec3 vNormal;
    
    
    void main()
    {
    
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vec4 worldNormal = modelMatrix * vec4( normal, 0.0 );
    
      vObjectPosition = worldPosition.xyz;
    
      vUv = uv;
      vView = normalize( cameraPosition - worldPosition.xyz );
      vNormal = normalize( worldNormal.xyz );
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
    }
    
    `
    
    const fragment = /*glsl*/`
    
    uniform vec3 uColor;
    uniform float uFresnelFactor;
    uniform float uFresnelBias;
    uniform vec3 uRimColor;
    uniform float uIntensity;
    
    in vec3 vObjectPosition;
    in vec2 vUv;
    in vec3 vNormal;
    in vec3 vView;
    
    /*
    //
    //  Fresnel function
    //
    */
    
    float fresnelFunc( float factor, float fresnelBias, vec3 normal, vec3 view )
    {
    
      return fresnelBias + ( 1.0 - fresnelBias ) * pow( 1.0 - dot( normal , view ), factor );
    
    }
    
    
    void main()
    {
    

      vec3 color = vec3(0.);

      float fresnel = fresnelFunc( uFresnelFactor, uFresnelBias, vNormal, vView );

      float diffuse = dot(vNormal, vView );

      vec3 diffuseColor = uColor * diffuse;
    
      float alpha = ${ alpha ? 'fresnel' : ( 1.0.toFixed( 1 ) ) };

      vec3 fresnelColor = uRimColor * fresnel * uIntensity;

      color = diffuseColor + fresnelColor; // color lines
    
      gl_FragColor = vec4( color, alpha ); // output color
    
    }
    
    
    `
    
    const model = useRef()
    
      useFrame( ( ) =>
      {
        model.current.material.uniforms.uFresnelFactor.value = FresnelFactor
        model.current.material.uniforms.uFresnelBias.value = FresnelBias
        model.current.material.uniforms.uIntensity.value = FresnelIntensity
    
      })

    return(
        <mesh
            ref={ model }
            {...props}
        >
            <torusKnotGeometry
                args={[ 0.5, 0.2, 110, 20, 2, 3 ]}
            />
            <shaderMaterial
                vertexShader={ vertex }
                fragmentShader={ fragment }
                uniforms={ uniforms }
                transparent={ alpha }
            />

        </mesh>
    )

}