import { useState } from "react";
function Cpt(){
    const [n1 , setN1] = useState(0)
    const [n2 , setN2] = useState(0)
    const [operation , setOperation] = useState('+')
    
    var result
        switch (operation) {
            case '+':
                 result = n1 + n2
                break;
            case '-':
                 result = n1 - n2
                break;
            case 'x':
                 result = n1 * n2
                break;
            case '/':
                 result = n1 / n2
                break;
            default:
                break;
        }

    return(
        <form>
            <input type='text' onChange={(e)=>setN1(Number(e.target.value))}/>
            <select onChange={(e)=>{setOperation(e.target.value)}}>
                <option selected>+</option>
                <option>-</option>
                <option>x</option>
                <option>/</option>
            </select>
            <input type='text' onChange={(e)=>setN2(Number(e.target.value))}/>
            <p>{result}</p>
        </form>
    );
}
export default Cpt;