import { useCallback, useRef } from "react"

/*Utilizado para não efetuar a pesquisa sempre que digitar uma letra, tem um delay para efetuar a consulta */
export const useDebounce = (delay = 300, notDelayFisrtTime = true) =>{
    const debouncing = useRef<NodeJS.Timeout>();
    const isFirstTime = useRef(notDelayFisrtTime);

    const debounce = useCallback((func: ()=> void) =>{
        if (isFirstTime.current){
            isFirstTime.current = false;
            func();
        }
        else{
            if (debouncing.current){
                clearTimeout(debouncing.current);
            }
    
            debouncing.current = setTimeout(()=> func(), delay);
        }

    }, [delay]) ;
    return { debounce };
}