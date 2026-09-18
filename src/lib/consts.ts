export interface Point {
    x: number;
    y: number;
}

export interface Triangle {
    p1: Point;
    p2: Point;
    p3: Point;
    stroke: string;
    fill: string;
}
export const trianglePoints = (triangle: Triangle) => {
    return triangle.p1.x + "," + triangle.p1.y + " " + 
           triangle.p2.x + "," + triangle.p2.y + " " + 
           triangle.p3.x + "," + triangle.p3.y;
}

export interface Circle {
    cx: number;
    cy: number;
    r: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    stroke_width: number;
}

export interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    stroke: string;
    stroke_width: number;
}