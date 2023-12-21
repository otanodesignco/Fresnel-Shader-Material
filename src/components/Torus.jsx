
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import MeshFresnelMaterial from './MeshFresnelMaterial.jsx'


export default function Torus( props )
{

    const { FresnelFactor, FresnelBias, FresnelIntensity, rimColor, bodyColor, fresnelAlpha, fresnelOnly } = useControls(
        {
          FresnelFactor:
          {
            value: 0.6,
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
          },
          rimColor:
          {
            value: '#02FEFF'
          },
          bodyColor:
          {
            value: '#0777FD'
          },
          fresnelAlpha:
          {
            value: 1,
            min: 0.001,
            max: 1,
            step: 0.01
          },
          fresnelOnly:
          {
            value: true
          }
        }
      )
    
    const model = useRef()
    
      useFrame( ( ) =>
      {
    
      })

    return(
        <mesh
            ref={ model }
            {...props}
        >
            <torusKnotGeometry
                args={[ 0.5, 0.2, 110, 20, 2, 3 ]}
            />
            <MeshFresnelMaterial
              fresnelColor={ rimColor }
              baseColor={ bodyColor }
              amount={ FresnelFactor }
              offset={ FresnelBias }
              intensity={ FresnelIntensity }
              fresnelAlpha={ fresnelAlpha }
              alpha={ fresnelOnly }
            />

        </mesh>
    )

}