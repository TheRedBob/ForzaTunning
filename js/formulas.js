/**
 * @file Moduł matematyczny tuningu.
 */

const round = (num) => Math.round(num * 10) / 10;

export const getSprings = (d) => {
    const base = d.totalWeight * d.cfg.springs;
    const driveBias = d.drivetrain === 'rwd' ? 0.95 : (d.drivetrain === 'fwd' ? 1.05 : 1.0);
    return {
        front: round(base * d.frontF * driveBias),
        rear: round(base * d.rearF / driveBias)
    };
};

export const getARBs = (d) => ({
    front: Math.round(d.cfg.arb * (d.frontF / 0.5)),
    rear: Math.round(d.cfg.arb * (d.rearF / 0.5))
});

export const getDamping = (d) => {
    const s = getSprings(d);
    return {
        reboundFront: round(s.front * 0.7),
        reboundRear: round(s.rear * 0.7),
        bumpFront: round(s.front * 0.7 * 0.5),
        bumpRear: round(s.rear * 0.7 * 0.5)
    };
};

export const getTires = (d) => {
    const base = 1.6;
    return {
        front: round(base + (d.rearF - d.frontF) * 0.2 + (d.drivetrain === 'fwd' ? 0.1 : 0)),
        rear: round(base + (d.frontF - d.rearF) * 0.2 + (d.drivetrain === 'rwd' ? 0.1 : 0))
    };
};

// Dodano funkcje dla brakujących pól w HTML
export const getGeometry = (d) => ({
    camberFront: -1.5, // Standardowe wartości bazowe
    camberRear: -1.0,
    toeFront: 0.0,
    toeRear: 0.0
});

export const getAero = (d) => {

    const rawFront = (d.totalWeight / 50) * d.cfg.springs * 10;
    const rawRear = (d.totalWeight / 30) * d.cfg.springs * 10;

    const totalAero = rawFront + rawRear;
    const balance = Math.round((rawFront / totalAero) * 100);

    return {
        front: Math.round(rawFront),
        rear: Math.round(rawRear),
        balance: `${balance}%  / ${100 - balance}% `
    };
};

export const getDiff = (d) => {
    if (d.drivetrain === 'awd') {
        return {
            frontAccel: 30,
            frontDecel: 15,
            rearAccel: 60,
            rearDecel: 25,
            centerBias: 65
        };
    }

    return {
        accel: d.drivetrain === 'rwd' ? 65 : 40,
        decel: d.drivetrain === 'rwd' ? 20 : 15
    };
};

export const getRideHeight = (d) => {
    const configs = {
        road: { front: "N", rear: "N" },
        rally: { front: "Ś", rear: "Ś" },
        drift: { front: "Ś", rear: "N" }
    };
    return configs[d.buildType] || configs.road;
};

export const getBrakes = (d) => {
    // Balans hamulców: przód bardziej dociążony = więcej na przód
    // Ciśnienie: wyższe dla aut lżejszych (lepsza modulacja), niższe dla ciężkich
    return {
        bias: Math.round(50 + (d.frontF * 10)),
        pressure: d.totalWeight < 1000 ? 120 : 100 
    };
};

// Upewnij się, że to jest dokładnie ta funkcja w Twoim formulas.js
export function calculateFullSetup(totalWeight, frontRatio, buildType, drivetrain) {
    const data = {
        totalWeight,
        frontF: frontRatio / 100,
        rearF: 1 - (frontRatio / 100),
        buildType,
        drivetrain,
        cfg: {
            road:  { springs: 0.22, arb: 25, damping: 12 },
            rally: { springs: 0.14, arb: 15, damping: 8 },
            drift: { springs: 0.20, arb: 20, damping: 10 }
        }[buildType] || { springs: 0.22, arb: 25, damping: 12 }
    };

    return {
        springs: getSprings(data),
        arb: getARBs(data),
        damping: getDamping(data),
        tires: getTires(data),
        rideHeight: getRideHeight(data),
        aero: getAero(data),
        brakes: getBrakes(data),
        diff: getDiff(data),
        drivetrain: drivetrain
    };
}

