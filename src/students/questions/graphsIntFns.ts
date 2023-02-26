function perms(nums: number[], r:number):number[][]{
    let found: number[][] = [];
    if(r === 0){
        return []
    }
    else{
        for(const num of nums){
            let newArr = JSON.parse(JSON.stringify(nums))
            newArr.splice(newArr.indexOf(num),1)
            let newPerms = perms(newArr,r-1)
            if(newPerms.length === 0){
                found.push([num])
            }
            else{
                found = found.concat((newPerms.map(x => ([num].concat(x)).sort() )))
            }
        }
    }
    return found
}

function rootProduct(roots:number[],perm:number[]){
    let prod = 1
    for(const rootIndex of perm){
        prod *= roots[rootIndex]
    }
    return prod
}

function getCoeffs(roots: number[]){
    let rangeArr = Array.from(Array(roots.length).keys())
    let coeffs: number[] = []
    coeffs.push(1)
    for(let i = 1; i < roots.length; ++i){
        let rootPerms = perms(rangeArr,i).map(x => (JSON.stringify(x))).filter((e,i,a) => i === a.indexOf(e)).map(x => (JSON.parse(x)))
        let coeff = 0
        for(const rootPerm of rootPerms){
            coeff += rootProduct(roots,rootPerm)
        }
        coeffs.push((-1) ** i * coeff)
    }
    let prod = roots.reduce((accum,current) => accum * current, 1)
    coeffs.push((-1) ** roots.length * prod)
    return coeffs
}

function getPoly(coeffs:number[]){
    let terms = coeffs.reverse().map((coeff,index) => '$' + coeff.toString() + "x^" + index.toString() + '$')
    return terms.reverse()
}



console.log(getPoly(getCoeffs([1,2,3])).join(" "))
