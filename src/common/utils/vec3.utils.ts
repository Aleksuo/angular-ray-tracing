import { Vec3 } from "../classes/vec3";

export class Vec3Utils {

    static add(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
    }

    static subtract(v1: Vec3, v2: Vec3): Vec3 { 
        return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
    }

    static multiply(num: number, v:Vec3): Vec3 {    
        return new Vec3(num * v.x, num * v.y, num * v.z)
    }

    static divide(v: Vec3, num: number): Vec3 {    
        return new Vec3(v.x / num, v.y / num, v.z / num)
    }

    static dot(v1: Vec3, v2: Vec3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
    }

    static cross(v1: Vec3, v2: Vec3): Vec3 {    
        return new Vec3(
            v1.y * v2.z - v1.z * v2.y, 
            v1.z * v2.x - v1.x * v2.z, 
            v1.x * v2.y - v1.y * v2.x
        )
    }

    static unitVector(v: Vec3): Vec3 {    
        return Vec3Utils.divide(v, v.length())
    }
}