export class Vec3 {

    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
   
    add(v: Vec3): void {
        this.x += v.x
        this.y += v.y
        this.z += v.z
    }
    
    subtract(v: Vec3): void {
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
    }

    
    multiply(num: number): void {
        this.x *= num
        this.y *= num
        this.z *= num
    }

    
    divide(num: number): void {   
        this.x /= num
        this.y /= num
        this.z /= num
    }

    negate(): void { 
        this.x = -this.x
        this.y = -this.y
        this.z = -this.z
    }

    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

   
    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

}