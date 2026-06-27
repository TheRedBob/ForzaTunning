import { TIRE_CONFIG } from './config.js';

/**
 * @file Moduł matematyczny tuningu.
 */

export const getTiresPreasure = (data) => {
    const compound = data.tiresType || 'race';
    let base = TIRE_CONFIG.basePressures[compound] || TIRE_CONFIG.basePressures.default;

    if (data.weight) {
        base += (data.weight - TIRE_CONFIG.weight.referenceKg) * TIRE_CONFIG.weight.scalingFactor;
    }

    let front = base + (data.rearF - data.frontF) * TIRE_CONFIG.distributionFactor;
    let rear = base + (data.frontF - data.rearF) * TIRE_CONFIG.distributionFactor;

    const adj = TIRE_CONFIG.drivetrainAdjustments[data.drivetrain];
    if (adj) {
        front += adj.front;
        rear += adj.rear;
    }
    
    const round = (val) => Math.round(val * 100) / 100;

    return {
        front: round(front),
        rear: round(rear)
    };
};

export const getGeometryCamber = (data) => {
    let front = -0.5;
    let rear = -0.5;

    if (data.drivetrain === 'rwd') {
        front -= 0.2; 
        rear += 0.1;
    } else if (data.drivetrain === 'fwd') {
        front += 0.1;
        rear -= 0.2;
    } 

    const weightBiasAdjustment = (data.frontF - 0.5) * 2;
    front -= weightBiasAdjustment;

    const round = (val) => Math.round(val * 10) / 10;

    return {
        front: round(Math.max(-5.0, Math.min(0, front))),
        rear: round(Math.max(-5.0, Math.min(0, rear)))
    };
};

export const getGeometryToe = (data) => {
    let front = 0.0;
    let rear = 0.0;

    if (data.drivetrain === 'fwd') {
        front = -0.1; // Toe-out
    }

    if (data.drivetrain === 'rwd') {
        rear = 0.1; // Toe-in
    }

    const round = (val) => Math.round(val * 10) / 10;

    return {
        front: round(front),
        rear: round(rear)
    };
};

/**
 * Oblicza optymalny kąt Caster na podstawie typu auta
 * @param {Object} data - Dane: { buildType, isOffroad }
 * @returns {Object} { front: number, rear: number }
 */
export const getGeometryCaster = (data) => {
    let front = 7.0;

    if (data.buildType == 'offroad') {
        front = 2.0;
    } 
    else if (data.weight < 1000) {
        front = 6.0;
    }

    const roundToHalf = (val) => Math.round(val * 2) / 2;

    return {
        front: roundToHalf(front)
    };
};

/**
 * Oblicza optymalne wartości ARB (Anti-Roll Bars)
 * @param {Object} data - Dane: { buildType, drivetrain, weight }
 * @returns {Object} { arbFront: number, arbRear: number }
 */
export const getArb = (data) => {
    const isOffroad = data.buildType == 'offroad';

    let arbFront = isOffroad ? 10 : 50; 
    let arbRear = isOffroad ? 10 : 50;

    if (!isOffroad) {
        if (data.drivetrain === 'rwd') {
            arbRear -= 5; 
        } else if (data.drivetrain === 'fwd') {
            arbRear += 5;
        }
    }
    if (data.weight < 1000) {
        arbFront -= 5;
        arbRear -= 5;
    }

    const round = (val) => Math.round(val);

    return {
        front: round(Math.max(1, Math.min(65, arbFront))),
        rear: round(Math.max(1, Math.min(65, arbRear)))
    };
};

export const getSprings = (data) => {
    const isRally = data.buildType === 'rally';
    const weight = Number(data.weight);
    
    const rawFront = Number(data.frontF);
    const frontDist = rawFront > 1 ? rawFront / 100 : rawFront;
    const rearDist = 1 - frontDist;

    const frontWeight = weight * frontDist;
    const rearWeight = weight * rearDist;

    const multFront = isRally ? 0.0806 : 0.1578;
    const multRear = isRally ? 0.0887 : 0.1692;

    const frontRate = frontWeight * multFront;
    const rearRate = rearWeight * multRear;

    return {
        front: Math.round(frontRate * 10) / 10,
        rear: Math.round(rearRate * 10) / 10
    };
};

export const getDamping = (weight, frontDist, buildType, frontAreo) => {
    const w = Number(weight) || 1200;
    const f = Number(frontDist) || 0.5;
    const a = Number(frontAreo) || 100;
    
    if (buildType === 'rally') return { reb: { front: 5.6, rear: 5.6 }, bump: { front: 1.0, rear: 1.0 } };

    const springBase = 100 + (w * 0.15); 
    const rebBase = 10.8 + ((w - 1000) * 0.0007);
    const bumpBase = rebBase * 0.42; // Bump to zawsze stały ułamek Reboundu
    
    const aeroMod = (a / 1000);
    const balanceOffset = (f - 0.5) * 0.4; 
    const round = (val) => Math.round(val * 10) / 10;

    return {
        reb: {
            front: round(rebBase - balanceOffset + aeroMod),
            rear: round(rebBase + balanceOffset + aeroMod)
        },
        bump: {
            front: round(bumpBase + (aeroMod * 0.2)),
            rear: round(bumpBase + (aeroMod * 0.4))
        }
    };
};


export const getAreo = (frontAeroKg, weightDist, driveType) => {
    let ratio = 1.25; 

    if (driveType === 'rwd') ratio += 0.15;
    if (driveType === 'fwd') ratio -= 0.10;

    const weightCorrection = (weightDist - 0.5) * 0.5;
    ratio -= weightCorrection;

    const recommendedRearKg = frontAeroKg * ratio;
    return{
        front: Math.round(frontAeroKg),
        rear: Math.round(recommendedRearKg)
    };
};

export const getBrakes = (buildType, frontRatio) => {
    let bias = 52;
    let pressure = 125;

    if (buildType === 'race') {
        bias = 56;
        pressure = 145;
    } else if (buildType === 'rally') {
        bias = 48;
        pressure = 125;
    } else if (buildType === 'offroad') {
        bias = 48;
        pressure = 115;
    }
    if (frontRatio < 45) {
        bias += 2; 
    }
    return {
        bias: bias,
        pressure: pressure
    };
};

export const getDifferential = (drivetrain, buildType) => {
    // Przygotowujemy bazowy obiekt
    const diff = {
        frontAccel: 0, frontDecel: 0,
        rearAccel: 0, rearDecel: 0,
        center: 0,
        type: drivetrain
    };

    if (drivetrain === 'rwd') {
        diff.rearAccel = 55;
        diff.rearDecel = 15;
    } 
    else if (drivetrain === 'fwd') {
        diff.frontAccel = 85;
        diff.frontDecel = 5; 
    } 
    else if (drivetrain === 'awd') {
        if (buildType === 'rally' || buildType === 'offroad') {
            diff.frontAccel = 85;
            diff.frontDecel = 5;
            diff.rearAccel = 90;
            diff.rearDecel = 15;
            diff.center = 60;
        } else {
            diff.frontAccel = 85;
            diff.frontDecel = 5;
            diff.rearAccel = 55;
            diff.rearDecel = 15;
            diff.center = 75; 
        }
    }
    return diff;
};

export function calculateFullSetup(totalWeight, frontRatio, buildType, drivetrain, tiresType, frontAreo) {
    const data = {
        weight: totalWeight,
        frontF: frontRatio / 100,
        rearF: 1 - (frontRatio / 100),
        buildType,
        drivetrain,
        tiresType,
        frontAreo: frontAreo
    };
    return {
        tiresPreasure: getTiresPreasure(data),
        geometryCamber: getGeometryCamber(data),
        geometryToe: getGeometryToe(data),
        geometryCaster: getGeometryCaster(data),
        arb: getArb(data),
        springs: getSprings(data),
        dampingReb: getDamping(data.weight, data.frontF, data.buildType, data.frontAreo).reb,
        dampingBump: getDamping(data.weight, data.frontF, data.buildType, data.frontAreo).bump,
        aero: getAreo(data.frontAreo, data.frontF, data.drivetrain),
        brakes: getBrakes(data.buildType, data.frontF * 100),
        diff: getDifferential(data.drivetrain, data.buildType)
    };
}

