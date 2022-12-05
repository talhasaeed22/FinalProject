import React, { useState } from "react";
import ModeContext from "./ModeContext";

const ModeState = (props)=>{
    const [mode, setMode] = useState('light');
    
    const switchMode = ()=>{
      if(mode === 'light'){
        setMode('dark');
        
      }else{
        setMode('light');
        
      }
    }

    return (
        <ModeContext.Provider value={{switchMode, mode }} >
            {props.children}
        </ModeContext.Provider>
    )
}

export default ModeState;