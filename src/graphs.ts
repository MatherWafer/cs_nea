interface gNode{
    x:number
    y:number
    label: string
}

interface Edge{
    n1: gNode,
    n2: gNode,
    label: string,
    weight:number,
    grad:number | false
}


class gNode{
    constructor(x:number,y:number,label:string){
                     this.x = x
                     this.y = y,
                     this.label = label;}
    getCoords(){return [this.x, this.y]}

    distance(node2:gNode){
        return Math.sqrt((this.x - node2.x)**2 + (this.y - node2.y)**2)
    }
}

class Edge{
    constructor(node1:gNode,node2:gNode){
        this.n1 = node1 
        this.n2 = node2
        this.weight = this.n1.distance(this.n2)
        if (this.n1.x != this.n2.x){
            if(this.n2.x < this.n1.x){     //Ensure n1,n2 are sorted on x axis
                let temp = this.n1
                this.n1 = this.n2
                this.n2 = temp
                //console.log(`Swapped ${this.n1.label} and ${this.n2.label}`)
                //console.log`n1 = ${this.n1} n2 = ${this.n2}`
            }
            this.grad = (this.n1.y - this.n2.y) / (this.n1.x - this.n2.x)
        }
        else{
            this.grad = false
        }
        this.label = this.n1.label + this.n2.label
    }
    getNodeCoords(){return [this.n1.getCoords(),this.n2.getCoords()]}        
    
}

function findInt(e1:Edge, e2:Edge):number|false {
   let [x1,x2] = [e1.n1.x,e1.n2.x];
   let y1  = e1.n1.y;
   let m1 = e1.grad;
   
   let [u1,u2] = [e2.n1.x,e2.n2.x];
   let v1 = e2.n1.y;
   let m2 = e2.grad;
   if(typeof m1 === "number" && typeof m2 === "number"){
        const solnX:number = (((m1 * x1 ) - (m2 * u1 ) + v1 - y1) / (m1 - m2));
        if((x1 <= solnX && solnX  <= x2) && (u1 <= solnX && solnX <= u2)){
            console.log(`${e1.label} and ${e2.label} intersect at x = ${solnX}`);
            return solnX;
        }
        else{
            console.log(`No intersect for ${e1.label} and ${e2.label}`)
            return false
        }
   }
   else{

    let [y_bottom,y_top] = [e1.n1.y,e1.n2.y].sort()
    let [v_bottom,v_top] = [e2.n1.y, e2.n2.y].sort()
    if(m1 === false && typeof m2 === "number"){
        
        let vAtX1 = (v1 + m2 *(x1 - u1))
        if((u1 <= x1 && x1 <= u2) && (y_bottom <= vAtX1 && vAtX1 <= y_top)){
            console.log(`${e1.label} and ${e2.label} intersect at x = ${x1}`)
            return x1
        }
        else{
            console.log("Epic fail")
            return false
        }
    }
    else if(m2 === false && typeof m1 === "number"){
        let yAtU1 = (y1 + m1 *(u1 - x1))
        if((x1 <= u1 && u1 <= x2) && (v_bottom <= yAtU1 && yAtU1 <= v_top)){
            console.log(`${e1.label} and ${e2.label} intersect at x = ${x1}`)
            return x1
        }
        else{
            console.log("Epic fail")
            return false
        }
    }
    else{
        console.log("Here")
        if ((x1 === u1) && ((v_bottom <= y1 && y1 <= v_top)||(y_bottom <= v1 && v1 <= y_top))){   //AIDS!!!!!
            console.log(`${e1.label} and ${e2.label} intersect at x = ${x1}`)
            return x1 
        }
    }
    return false
   }
}

let K = new gNode(2,15,"K")
let L = new gNode(1,3,"L")

let O = new gNode(3,4,"O")
let P = new gNode(0,3,"P")

let KL = new Edge(K,L)
let OP = new Edge(O,P)
console.log(`|KL| = ${KL.weight}`)

console.log(KL.getNodeCoords())

findInt(KL,OP)
