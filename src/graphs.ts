interface gNode{
    x:number
    y:number
    label: string
}
class gNode{
    constructor(x,y,label){
                     this.x = x
                     this.y = y,
                     this.label = label;}
    getLabel(){return this.x}
}

let k = new gNode(3,3,2)

console.log(k.getLabel())
